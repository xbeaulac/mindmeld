"use server";

import { createSession, deleteSession } from "@/app/lib/session";
import { db } from "@/db";
import { RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";
import SQL from "sql-template-strings";
import { z } from "zod";

export async function logout() {
  await deleteSession();
  redirect("/");
}

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export async function login(
  initialState:
    | {
        data?: z.infer<typeof loginSchema>;
        errors?: Partial<Record<keyof z.infer<typeof loginSchema>, string[]>>;
      }
    | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const validatedFields = loginSchema.safeParse({ email, password });

  if (!validatedFields.success) {
    return {
      data: { email, password },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const [rows] = await db.query<RowDataPacket[]>(SQL`
    SELECT * FROM StudySession.Student WHERE email = ${email}
  `);

  if (rows.length === 0) {
    return {
      data: { email, password },
      errors: { email: ["Email not found"] },
    };
  }

  const student = rows[0];

  if (student.password !== password) {
    return {
      data: { email, password },
      errors: { password: ["Invalid password"] },
    };
  }

  await createSession(student.student_id);
  redirect("/dashboard");
}

const signupSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
  major: z.string().min(1, { message: "Major is required" }),
});

export async function signup(
  initialState:
    | {
        data?: z.infer<typeof signupSchema>;
        errors?: Partial<Record<keyof z.infer<typeof signupSchema>, string[]>>;
      }
    | undefined,
  formData: FormData
) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const major = formData.get("major") as string;

  const validatedFields = signupSchema.safeParse({
    firstName,
    lastName,
    email,
    password,
    major,
  });

  if (!validatedFields.success) {
    return {
      data: { firstName, lastName, email, password, major },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    // Check if email already exists
    const [existingRows] = await db.query<RowDataPacket[]>(SQL`
      SELECT * FROM StudySession.Student WHERE email = ${email}
    `);

    if (existingRows.length > 0) {
      return {
        data: { firstName, lastName, email, password, major },
        errors: { email: ["Email already in use"] },
      };
    }

    // Register the new student
    await db.query(SQL`
      INSERT INTO StudySession.Student (name, email, password, major)
      VALUES (${`${firstName} ${lastName}`}, ${email}, ${password}, ${major})
    `);

    // Get the new student
    const [newStudentRows] = await db.query<RowDataPacket[]>(SQL`
      SELECT * FROM StudySession.Student WHERE email = ${email}
    `);

    if (newStudentRows.length === 0) {
      throw new Error("Failed to retrieve newly created student");
    }

    // Create session
    await createSession(newStudentRows[0].student_id);
  } catch (error) {
    console.error("Signup error:", error);
    return {
      data: { firstName, lastName, email, password, major },
      errors: { email: ["An error occurred during signup"] },
    };
  }

  // Redirect after successful signup
  redirect("/dashboard");
}
