import { redirectAfterAuth } from "@/server/auth/postAuth";

/** Clerk lands here after sign-in/up; we route to onboarding or mail. */
export async function GET() {
  return redirectAfterAuth();
}
