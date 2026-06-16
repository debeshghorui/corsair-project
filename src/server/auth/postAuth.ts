import { redirect } from "next/navigation";

import { onboardingService } from "@/server/services/onboardingService";
import { getTenantId } from "@/server/auth/session";

/** Where to send a user immediately after Clerk sign-in / sign-up. */
export const POST_AUTH_PATH = "/auth/continue";

/** Resolve the final in-app destination once the user is authenticated. */
export async function postAuthDestination(): Promise<"/mail" | "/onboarding"> {
  const tenantId = await getTenantId();
  if (!tenantId) return "/onboarding";

  const status = await onboardingService.getStatus(tenantId);
  return status.complete ? "/mail" : "/onboarding";
}

/** Redirect an authenticated user to mail or onboarding. */
export async function redirectAfterAuth(): Promise<never> {
  redirect(await postAuthDestination());
}
