import { NextResponse, type NextRequest } from "next/server";

import { getCurrentUser } from "@/server/auth/session";
import { integrationService } from "@/server/services/integrationService";

export async function GET(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const plugin = request.nextUrl.searchParams.get("plugin") ?? "";
  if (!integrationService.isSupported(plugin)) {
    return NextResponse.json({ error: "Unsupported plugin" }, { status: 400 });
  }

  try {
    const url = await integrationService.getConnectUrl(plugin, user.id);
    return NextResponse.redirect(url);
  } catch (err) {
    console.error("[integrations/connect]", err);
    const back = new URL("/onboarding", request.url);
    back.searchParams.set("error", "connect_failed");
    return NextResponse.redirect(back);
  }
}
