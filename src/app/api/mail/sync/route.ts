import { NextResponse } from "next/server";

import { getCurrentUser } from "@/server/auth/session";
import { gmailService } from "@/server/services/gmailService";

/**
 * Pulls the latest inbox messages from Gmail into the local cache. Used by the
 * client poller as a realtime fallback when push webhooks aren't configured.
 */
export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await gmailService.seedCache("INBOX", 25);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/mail/sync]", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
