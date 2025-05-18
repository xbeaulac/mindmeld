"use server";

import { getSession } from "@/app/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, deleteSession } from "./functions";

const createSessionSchema = z
  .object({
    course_id: z.coerce.number().gt(0, { message: "Course is required" }),
    creator_id: z.coerce.number().gt(0, { message: "Creator is required" }),
    start_time: z.string().min(1, { message: "Start time is required" }),
    end_time: z.string().min(1, { message: "End time is required" }),
    url: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.start_time <= data.end_time, {
    message: "Start time must be before end time",
    path: ["start_time"],
  })
  .refine((data) => data.start_time <= data.end_time, {
    message: "Start time must be before end time",
    path: ["end_time"],
  })
  .refine((data) => new Date(data.start_time) > new Date(), {
    message: "Start time must be in the future",
    path: ["start_time"],
  });

export type ActionState = {
  errors?: {
    course_id?: string[];
    creator_id?: string[];
    start_time?: string[];
    end_time?: string[];
    url?: string[];
    notes?: string[];
  };
  data?: z.infer<typeof createSessionSchema>;
};

export async function createStudySession(
  initialState: ActionState | undefined,
  formData: FormData
): Promise<ActionState> {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = createSessionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: data as any,
    };
  }

  const { course_id, creator_id, start_time, end_time, url, notes } =
    validatedFields.data;

  await createSession(course_id, creator_id, start_time, end_time, url, notes);

  redirect("/dashboard");
}

export async function deleteStudySession(
  session_id: number,
  creator_id: number
) {
  const session = await getSession();

  if (Number(session.userId) !== creator_id) {
    throw new Error("Unauthorized: Only the creator can delete this session");
  }

  await deleteSession(session_id);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
