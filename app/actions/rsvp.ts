"use server";
import { getSession } from "../lib/session";
import { rsvpSession, RSVPStatus } from "./functions";
import { revalidatePath } from "next/cache";
export async function rsvpAction(formData: FormData) {
  const session = await getSession();
  const status = formData.get("status");
  const sessionId = formData.get("sessionId");
  await rsvpSession(
    Number(sessionId),
    Number(session?.userId),
    status as RSVPStatus
  );
  revalidatePath("/dashboard");
}
