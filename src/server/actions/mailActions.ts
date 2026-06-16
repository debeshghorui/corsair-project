"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/server/auth/session";
import { gmailService } from "@/server/services/gmailService";

export type ComposeState = { ok: boolean; error: string | null };

function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return escaped.replace(/\n/g, "<br />");
}

export async function sendEmailAction(
  _prev: ComposeState,
  formData: FormData,
): Promise<ComposeState> {
  await requireUser();
  const to = String(formData.get("to") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "");
  const cc = String(formData.get("cc") ?? "").trim() || undefined;

  if (!to) return { ok: false, error: "Add at least one recipient" };

  try {
    await gmailService.send({ to, subject, cc, html: textToHtml(body) });
    revalidatePath("/mail");
    return { ok: true, error: null };
  } catch (err) {
    console.error("[mail/send]", err);
    return { ok: false, error: "Failed to send email" };
  }
}

export async function saveDraftAction(
  _prev: ComposeState,
  formData: FormData,
): Promise<ComposeState> {
  await requireUser();
  try {
    await gmailService.createDraft({
      to: String(formData.get("to") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      html: textToHtml(String(formData.get("body") ?? "")),
    });
    revalidatePath("/mail");
    return { ok: true, error: null };
  } catch (err) {
    console.error("[mail/draft]", err);
    return { ok: false, error: "Failed to save draft" };
  }
}

export async function replyAction(
  _prev: ComposeState,
  formData: FormData,
): Promise<ComposeState> {
  await requireUser();
  const threadId = String(formData.get("threadId") ?? "");
  const to = String(formData.get("to") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "");

  if (!to || !threadId) return { ok: false, error: "Missing reply context" };

  try {
    await gmailService.reply({
      threadId,
      to,
      subject,
      html: textToHtml(body),
      inReplyTo: String(formData.get("inReplyTo") ?? "") || undefined,
      references: String(formData.get("references") ?? "") || undefined,
    });
    revalidatePath("/mail");
    return { ok: true, error: null };
  } catch (err) {
    console.error("[mail/reply]", err);
    return { ok: false, error: "Failed to send reply" };
  }
}

// Single-message label mutations (triggered from the reading pane / list).
export async function archiveAction(id: string): Promise<void> {
  await requireUser();
  await gmailService.archive(id);
  revalidatePath("/mail");
}

export async function trashAction(id: string): Promise<void> {
  await requireUser();
  await gmailService.trash(id);
  revalidatePath("/mail");
}

export async function toggleStarAction(id: string, starred: boolean): Promise<void> {
  await requireUser();
  await gmailService.setStarred(id, starred);
  revalidatePath("/mail");
}

export async function markReadAction(id: string, read: boolean): Promise<void> {
  await requireUser();
  if (read) await gmailService.markRead(id);
  else await gmailService.markUnread(id);
  revalidatePath("/mail");
}
