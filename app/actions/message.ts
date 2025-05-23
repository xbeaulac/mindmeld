"use server";

import { db } from "@/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import SQL from "sql-template-strings";
import { z } from "zod";
import { getSession } from "../lib/session";

const messageSchema = z.object({
  content: z.string().min(1, { message: "Message cannot be empty" }),
  session_id: z.coerce.number().positive(),
  parent_message_id: z.coerce.number().optional(),
});

export type MessageActionState = {
  errors?: {
    content?: string[];
    session_id?: string[];
    parent_message_id?: string[];
  };
  message?: string;
};

export async function postMessage(
  prevState: MessageActionState,
  formData: FormData
): Promise<MessageActionState> {
  const validatedFields = messageSchema.safeParse(Object.fromEntries(formData));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const session = await getSession();
  const { content, session_id, parent_message_id } = validatedFields.data;

  try {
    await db.query(SQL`
      INSERT INTO Message (content, session_id, student_id, parent_message_id)
      VALUES (${content}, ${session_id}, ${session?.userId}, ${
      parent_message_id ?? null
    })
    `);

    revalidatePath(`/dashboard/session/${session_id}`);
    return { message: "Message posted successfully" };
  } catch (error) {
    return { errors: { content: ["Failed to post message"] } };
  }
}

export type LikeActionResponse = {
  success: boolean;
  liked: boolean;
};

export async function likeMessageAction(
  formData: FormData
): Promise<LikeActionResponse> {
  const messageId = formData.get("message_id");
  const sessionId = formData.get("session_id");

  if (!messageId || typeof messageId !== "string") {
    throw new Error("Message ID is required");
  }
  if (!sessionId || typeof sessionId !== "string") {
    throw new Error("Session ID is required");
  }

  const session = await getSession();
  if (!session?.userId) {
    throw new Error("User not authenticated");
  }

  try {
    // Check if user has already liked this message
    const [[existingLike]] = await db.query<RowDataPacket[]>(SQL`
      SELECT 1 FROM StudySession.MessageLike 
      WHERE message_id = ${messageId} AND student_id = ${session.userId}
    `);

    if (existingLike) {
      // Unlike: Remove the like record and decrement count
      await db.query(SQL`
        DELETE FROM StudySession.MessageLike 
        WHERE message_id = ${messageId} AND student_id = ${session.userId}
      `);
      await db.query(SQL`
        UPDATE StudySession.Message 
        SET likes = likes - 1 
        WHERE message_id = ${messageId}
      `);
    } else {
      // Like: Add the like record and increment count
      await db.query(SQL`
        INSERT INTO StudySession.MessageLike (message_id, student_id) 
        VALUES (${messageId}, ${session.userId})
      `);
      await db.query(SQL`
        UPDATE StudySession.Message 
        SET likes = likes + 1 
        WHERE message_id = ${messageId}
      `);
    }

    revalidatePath(`/dashboard/session/${sessionId}`);
    return { success: true, liked: !existingLike };
  } catch (error) {
    console.error("Error in likeMessageAction:", error);
    return { success: false, liked: false };
  }
}

export async function deleteMessage(
  messageId: number,
  sessionId: number
): Promise<{ success: boolean }> {
  const session = await getSession();

  try {
    // Check if user is the message author
    const [[message]] = await db.query<RowDataPacket[]>(SQL`
      SELECT * FROM StudySession.Message 
      WHERE message_id = ${messageId} AND student_id = ${session?.userId}
    `);

    if (!message) {
      return { success: false };
    }

    // Delete the message
    await db.query(SQL`
      DELETE FROM StudySession.Message 
      WHERE message_id = ${messageId}
    `);

    revalidatePath(`/dashboard/session/${sessionId}`);
    return { success: true };
  } catch (error) {
    console.error("Error in deleteMessage:", error);
    return { success: false };
  }
}
