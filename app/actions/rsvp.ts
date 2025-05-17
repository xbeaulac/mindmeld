"use server";
import { getSession } from "../lib/session";
import { rsvpSession, RSVPStatus } from "./functions";
import { revalidatePath } from "next/cache";
export async function rsvpAction(formData: FormData) {
  const { userId } = await getSession();
  const status = formData.get("status");
  const sessionId = formData.get("sessionId");
  await rsvpSession(Number(sessionId), Number(userId), status as RSVPStatus);
  revalidatePath("/dashboard");
}
