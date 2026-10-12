import { redirectAfterAuth } from "@/server/auth/postAuth";

/** Sign-in lands here; we route to onboarding or mail. */
export async function GET() {
  return redirectAfterAuth();
}
