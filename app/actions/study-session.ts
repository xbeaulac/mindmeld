"use server";

import { z } from "zod";
import { createSession } from "./functions";
import { redirect } from "next/navigation";

const createSessionSchema = z.object({
  course_id: z.coerce.number().gt(0, {
    message: "Course is required",
  }),
  creator_id: z.coerce.number().gt(0, {
    message: "Creator is required",
  }),
  start_time: z.string().min(1, {
    message: "Start time is required",
  }),
  end_time: z.string().min(1, {
    message: "End time is required",
  }),
  url: z.string().optional(),
  notes: z.string().optional(),
});
export async function createStudySession(
  initialState:
    | {
        data?: z.infer<typeof createSessionSchema>;
        errors?: Partial<
          Record<keyof z.infer<typeof createSessionSchema>, string[]>
        >;
      }
    | undefined,
  formData: FormData
) {
  const data = Object.fromEntries(formData.entries());
  const validatedFields = createSessionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      data: validatedFields.data,
    };
  }

  if (validatedFields.data.start_time > validatedFields.data.end_time) {
    return {
      errors: {
        start_time: ["Start time must be before end time"],
        end_time: ["Start time must be before end time"],
      },
      data: validatedFields.data,
    };
  }

  if (validatedFields.data.start_time < new Date().toISOString()) {
    return {
      errors: {
        start_time: ["Start time must be in the future"],
      },
      data: validatedFields.data,
    };
  }

  const { course_id, creator_id, start_time, end_time, url, notes } =
    validatedFields.data;

  await createSession(course_id, creator_id, start_time, end_time, url, notes);

  redirect("/dashboard");
}
