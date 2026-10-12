import { redirect } from "next/navigation";

import { onboardingService } from "@/server/services/onboardingService";
import { getTenantId } from "@/server/auth/session";

export { POST_AUTH_PATH } from "@/server/auth/paths";

/** Resolve the final in-app destination once the user is authenticated. */
export async function postAuthDestination(): Promise<"/mail" | "/onboarding"> {
  const tenantId = await getTenantId();
  if (!tenantId) return "/onboarding";

  const status = await onboardingService.getStatus(tenantId);
  return status.complete ? "/mail" : "/onboarding";
}

/** Redirect a signed-in session to mail or onboarding. */
export async function redirectAfterAuth(): Promise<never> {
  redirect(await postAuthDestination());
}
