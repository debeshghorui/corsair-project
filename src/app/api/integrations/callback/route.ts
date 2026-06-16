import { NextResponse, type NextRequest } from "next/server";

import { integrationService } from "@/server/services/integrationService";
import { webhookService } from "@/server/services/webhookService";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");

  const onboarding = new URL("/onboarding", request.url);

  if (params.get("error")) {
    onboarding.searchParams.set("error", params.get("error")!);
    return NextResponse.redirect(onboarding);
  }
  if (!code || !state) {
    onboarding.searchParams.set("error", "missing_code");
    return NextResponse.redirect(onboarding);
  }

  try {
    const { plugin, tenantId } = await integrationService.completeOAuth({
      code,
      state,
    });
    // Seed the local cache so the UI has data immediately (best-effort).
    await integrationService.backfill(plugin, tenantId);
    // Register realtime push watches (no-op if env/creds not configured).
    await webhookService.registerWatches(tenantId);
    onboarding.searchParams.set("connected", plugin);
    return NextResponse.redirect(onboarding);
  } catch (err) {
    console.error("[integrations/callback]", err);
    onboarding.searchParams.set("error", "oauth_failed");
    return NextResponse.redirect(onboarding);
  }
}
