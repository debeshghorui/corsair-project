"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/server/auth/session";
import { calendarService } from "@/server/services/calendarService";

export type InviteState = { ok: boolean; error: string | null };

export async function createInviteAction(
  _prev: InviteState,
  formData: FormData,
): Promise<InviteState> {
  await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const start = String(formData.get("start") ?? "");
  const end = String(formData.get("end") ?? "");
  const attendees = String(formData.get("attendees") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!title) return { ok: false, error: "Add a title" };
  if (!start || !end) return { ok: false, error: "Pick a start and end time" };
  if (new Date(end) <= new Date(start)) {
    return { ok: false, error: "End must be after start" };
  }

  try {
    await calendarService.createInvite({
      title,
      attendees,
      start,
      end,
      description: String(formData.get("description") ?? "").trim() || undefined,
      location: String(formData.get("location") ?? "").trim() || undefined,
    });
    revalidatePath("/calendar");
    return { ok: true, error: null };
  } catch (err) {
    console.error("[calendar/createInvite]", err);
    return { ok: false, error: "Failed to create event" };
  }
}

export async function deleteEventAction(id: string): Promise<void> {
  await requireUser();
  await calendarService.deleteEvent(id);
  revalidatePath("/calendar");
}
