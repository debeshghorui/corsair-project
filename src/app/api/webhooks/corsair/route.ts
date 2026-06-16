import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

import { webhookService } from "@/server/services/webhookService";

export async function POST(request: NextRequest) {
  const headers = Object.fromEntries(request.headers.entries());
  const body = await request.text();
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());

  try {
    const outcome = await webhookService.handle(headers, body, query);

    if (outcome.plugin === "gmail") revalidatePath("/mail");
    if (outcome.plugin === "googlecalendar") revalidatePath("/calendar");

    // Always 200 so providers (Pub/Sub / Google) don't retry indefinitely.
    return NextResponse.json({ ok: true, ...outcome });
  } catch (err) {
    console.error("[webhooks/corsair]", err);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

// Google Calendar sends a sync GET/POST when a channel is created; ack it.
export async function GET() {
  return NextResponse.json({ ok: true });
}
