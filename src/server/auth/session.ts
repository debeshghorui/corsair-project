import {
  readSession,
  readUserId,
  redirectToSignIn,
} from "@/server/auth/adapters/clerk/session";
import { POST_AUTH_PATH } from "@/server/auth/paths";
import type { SessionUser } from "@/server/auth/types";

export type { SessionUser };

/** The current session, or null when nobody is signed in. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  return readSession();
}

/** The current tenant id, or null. A tenant id is the session id. */
export async function getTenantId(): Promise<string | null> {
  return readUserId();
}

/** The current session, or a redirect to sign-in. */
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) return redirectToSignIn(POST_AUTH_PATH);
  return user;
}
