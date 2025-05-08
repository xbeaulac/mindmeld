"use server";

import { createSession, deleteSession } from "@/app/lib/session";
import { db } from "@/db";
import { RowDataPacket } from "mysql2";
import { redirect } from "next/navigation";
import SQL from "sql-template-strings";
import { z } from "zod";

export async function logout() {
  await deleteSession();
  redirect("/login");
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

  // If any form fields are invalid, return early
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

export async function signup(formData: FormData) {
  // Previous steps:
  // 1. Validate form fields
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const major = formData.get("major") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 2. Insert the user into the database or call an Library API
  const [rows] = await db.query<RowDataPacket[]>(SQL`
    INSERT INTO StudySession.Student (name, major, email, password) VALUES ('${firstName} ${lastName}', ${major}, ${email}, ${password})
  `);
}
