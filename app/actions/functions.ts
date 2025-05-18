"use server";

import { db } from "@/db";
import { RowDataPacket } from "mysql2";
import SQL from "sql-template-strings";
import { getSession } from "../lib/session";

// STUDENT FUNCTIONS
export async function registerStudent(
  name: string,
  email: string,
  password: string,
  major: string
) {
  await db.query(SQL`
    INSERT INTO StudySession.Student (name, email, password, major)
    VALUES (${name}, ${email}, ${password}, ${major})
  `);
}

export async function getStudentByEmail(email: string) {
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    SELECT * FROM StudySession.Student WHERE email = ${email}
  `);
  return rows[0];
}

// TEACHER FUNCTIONS
export async function registerTeacher(
  name: string,
  email: string,
  password: string
) {
  await db.query(SQL`
    INSERT INTO StudySession.Teacher (name, email, password)
    VALUES (${name}, ${email}, ${password})
  `);
}

export async function getTeacherByEmail(email: string) {
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    SELECT * FROM StudySession.Teacher WHERE email = ${email}
  `);
  return rows[0];
}

// COURSE FUNCTIONS
export async function addCourse(
  teacher_id: number,
  subject_code: string,
  course_number: number,
  title: string,
  department: string
) {
  await db.query(SQL`
    INSERT INTO StudySession.Course (teacher_id, subject_code, course_number, title, department)
    VALUES (${teacher_id}, ${subject_code}, ${course_number}, ${title}, ${department})
  `);
}

export async function getAllCourses() {
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    SELECT * FROM StudySession.Course
    ORDER BY subject_code ASC, course_number ASC
  `);
  return rows as Course[];
}

export async function getCoursesByStudent(student_id: number) {
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    SELECT c.* FROM StudySession.Course c
    JOIN StudySession.StudentCourses sc ON c.course_id = sc.course_id
    WHERE sc.student_id = ${student_id}
  `);
  return rows;
}

// STUDENTCOURSES FUNCTIONS
export async function joinCourse(
  student_id: number,
  course_id: number,
  semester: string
) {
  await db.query(SQL`
    INSERT INTO StudySession.StudentCourses (student_id, course_id, semester)
    VALUES (${student_id}, ${course_id}, ${semester})
  `);
}

// SESSION FUNCTIONS
export async function createSession(
  course_id: number,
  creator_id: number,
  start_time: string,
  end_time: string,
  url?: string,
  notes?: string
) {
  await db.query(SQL`
    INSERT INTO StudySession.Session (course_id, creator_id, start_time, end_time, url, notes)
    VALUES (${course_id}, ${creator_id}, ${start_time}, ${end_time}, ${
    url ?? null
  }, ${notes ?? null})
  `);
}

export async function getSessionsByCourse(course_id: number) {
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    SELECT * FROM StudySession.Session WHERE course_id = ${course_id}
  `);
  return rows;
}

export type Session = {
  session_id: number;
  course_id: number;
  creator_id: number;
  start_time: Date;
  end_time: Date;
  url: string;
  notes: string;
};

export type Course = {
  course_id: number;
  teacher_id: number;
  subject_code: string;
  course_number: number;
  title: string;
};

export type RSVPStatus = "Yes" | "Maybe" | "No";

export async function getAllUpcomingSessions() {
  const session = await getSession();
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    -- include subquery to get rsvp status
    SELECT session.*, course.*, student.name AS creator_name, (
      SELECT rsvp_status 
      FROM StudySession.SessionAttendance 
      WHERE session_id = session.session_id AND student_id = ${session?.userId}
    ) AS rsvp_status, (
      SELECT COUNT(*)
      FROM StudySession.SessionAttendance
      WHERE session_id = session.session_id AND rsvp_status = 'Yes'
    ) AS current_attendees
    FROM StudySession.Session session
    INNER JOIN StudySession.Course course ON session.course_id = course.course_id
    INNER JOIN StudySession.Student student ON session.creator_id = student.student_id
    WHERE session.start_time > NOW()
    ORDER BY session.start_time ASC
  `);
  return rows as (Session &
    Course & {
      creator_name: string;
      rsvp_status: RSVPStatus;
      current_attendees: number;
    })[];
}

// SESSION ATTENDANCE
export async function rsvpSession(
  session_id: number,
  student_id: number,
  rsvp_status: RSVPStatus
) {
  await db.query(SQL`
    INSERT INTO StudySession.SessionAttendance (session_id, student_id, rsvp_status)
    VALUES (${session_id}, ${student_id}, ${rsvp_status})
    ON DUPLICATE KEY UPDATE rsvp_status = ${rsvp_status}
  `);
}

export async function rateSession(
  session_id: number,
  student_id: number,
  rating: number
) {
  await db.query(SQL`
    UPDATE StudySession.SessionAttendance
    SET rating = ${rating}
    WHERE session_id = ${session_id} AND student_id = ${student_id}
  `);
}

// MESSAGES
export async function postMessage(
  content: string,
  session_id: number,
  student_id: number,
  parent_message_id: number | null
) {
  await db.query(SQL`
    INSERT INTO StudySession.Message (content, session_id, student_id, parent_message_id)
    VALUES (${content}, ${session_id}, ${student_id}, ${parent_message_id})
  `);
}

export async function getMessagesBySession(session_id: number) {
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    SELECT * FROM StudySession.Message WHERE session_id = ${session_id} ORDER BY created_at ASC
  `);
  return rows;
}

export async function likeMessage(message_id: number) {
  await db.query(SQL`
    UPDATE StudySession.Message
    SET likes = likes + 1
    WHERE message_id = ${message_id}
  `);
}

export async function getSessionDetails(session_id: number) {
  const session = await getSession();
  const [[sessionDetails]] = await db.query<RowDataPacket[]>(SQL`
    SELECT 
      session.*,
      course.*,
      creator.name AS creator_name,
      (
        SELECT rsvp_status 
        FROM StudySession.SessionAttendance 
        WHERE session_id = session.session_id AND student_id = ${session?.userId}
      ) AS rsvp_status,
      (
        SELECT COUNT(*)
        FROM StudySession.SessionAttendance
        WHERE session_id = session.session_id AND rsvp_status = 'Yes'
      ) AS current_attendees
    FROM StudySession.Session session
    INNER JOIN StudySession.Course course ON session.course_id = course.course_id
    INNER JOIN StudySession.Student creator ON session.creator_id = creator.student_id
    WHERE session.session_id = ${session_id}
  `);

  const [messages] = await db.query<RowDataPacket[]>(SQL`
    SELECT 
      message.*,
      student.name as author_name,
      student.student_id,
      EXISTS (
        SELECT 1 
        FROM StudySession.MessageLike 
        WHERE message_id = message.message_id 
        AND student_id = ${session?.userId}
      ) as has_liked
    FROM StudySession.Message message
    INNER JOIN StudySession.Student student ON message.student_id = student.student_id
    WHERE message.session_id = ${session_id}
    ORDER BY message.created_at ASC
  `);

  const [attendees] = await db.query<RowDataPacket[]>(SQL`
    SELECT 
      student.name,
      attendance.rsvp_status,
      attendance.rating
    FROM StudySession.SessionAttendance attendance
    INNER JOIN StudySession.Student student ON attendance.student_id = student.student_id
    WHERE attendance.session_id = ${session_id}
  `);

  return {
    ...sessionDetails,
    messages,
    attendees,
  };
}

export async function deleteSession(session_id: number) {
  await db.query(SQL`
    DELETE FROM StudySession.Session WHERE session_id = ${session_id}
  `);
}
