-- Table: Student
CREATE TABLE Student
(
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL,
    major      VARCHAR(100)
);


-- Table: Teacher
CREATE TABLE Teacher
(
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)        NOT NULL,
    email      VARCHAR(100) UNIQUE NOT NULL,
    password   VARCHAR(255)        NOT NULL
);


-- Table: Course
CREATE TABLE Course
(
    course_id     INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id    INT,
    subject_code  VARCHAR(10)  NOT NULL,
    course_number INT          NOT NULL,
    title         VARCHAR(100) NOT NULL,
    department    VARCHAR(100)
);


-- Table: StudentCourses
CREATE TABLE StudentCourses
(
    student_id INT,
    course_id  INT,
    semester   VARCHAR(20) NOT NULL
);


-- Table: Session
CREATE TABLE Session
(
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id  INT NOT NULL,
    creator_id INT NOT NULL,
    start_time DATETIME,
    end_time   DATETIME,
    url        TEXT,
    notes      TEXT
);


-- Table: SessionAttendance
CREATE TABLE SessionAttendance
(
    session_id  INT,
    student_id  INT,
    rsvp_status VARCHAR(50),
    rating      INT CHECK (rating BETWEEN 1 AND 5)
);


-- Table: Message
CREATE TABLE Message
(
    message_id        INT AUTO_INCREMENT PRIMARY KEY,
    content           TEXT NOT NULL,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id        INT,
    student_id        INT,
    parent_message_id INT,
    likes             INT      DEFAULT 0
);


INSERT INTO Student (name, email, password, major)
VALUES ('Alice Johnson', 'alice@example.com', 'password123', 'Computer Science'),
       ('Bob Smith', 'bob@example.com', 'securepass', 'Biology'),
       ('Charlie Lee', 'charlie@example.com', 'mypassword', 'Physics');


INSERT INTO Teacher (name, email, password)
VALUES ('Dr. Emily Carter', 'ecarter@example.com', 'teachpass1'),
       ('Prof. John Miller', 'jmiller@example.com', 'teachpass2'),
       ('Dr. Sarah Nguyen', 'snguyen@example.com', 'teachpass3');


INSERT INTO Course (subject_code, course_number, title, department, teacher_id)
VALUES ('CS', 101, 'Intro to Programming', 'Computer Science', 1),
       ('BIO', 201, 'Cell Biology', 'Biology', 2),
       ('PHY', 301, 'Quantum Mechanics', 'Physics', 3);


INSERT INTO StudentCourses (student_id, course_id, semester)
VALUES (1, 1, 'Fall 2024'),
       (2, 2, 'Fall 2024'),
       (3, 3, 'Fall 2024');


INSERT INTO Session (course_id, creator_id, start_time, end_time, url, notes)
VALUES (1, 1, '2025-06-22 09:00:00', '2025-06-22 10:00:00', 'http://session1.com', 'First session overview'),
       (2, 2, '2025-06-23 14:00:00', '2025-06-23 15:30:00', 'http://session2.com', 'Chapter 3 review'),
       (3, 3, '2025-06-24 11:00:00', '2025-06-24 12:00:00', 'http://session3.com', 'Exam prep');


INSERT INTO SessionAttendance (session_id, student_id, rsvp_status, rating)
VALUES (1, 1, 'Yes', 5),
       (2, 2, 'Maybe', 4),
       (3, 3, 'No', NULL);


INSERT INTO Message (content, session_id, student_id, parent_message_id, likes)
VALUES ('Looking forward to the session!', 1, 1, NULL, 2),
       ('Great insights on chapter 3.', 2, 2, NULL, 3),
       ('Can we get the slides uploaded?', 3, 3, NULL, 1);