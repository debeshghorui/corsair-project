import { auth, currentUser } from "@clerk/nextjs/server";

import { POST_AUTH_PATH } from "@/server/auth/postAuth";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
};

function displayName(user: NonNullable<Awaited<ReturnType<typeof currentUser>>>): string | null {
  if (user.fullName?.trim()) return user.fullName.trim();
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

function claimsToUser(userId: string, claims: Record<string, unknown> | null | undefined): SessionUser {
  const email =
    (typeof claims?.email === "string" && claims.email) ||
    (typeof claims?.primary_email_address === "string" && claims.primary_email_address) ||
    "";
  const name =
    (typeof claims?.name === "string" && claims.name) ||
    (typeof claims?.full_name === "string" && claims.full_name) ||
    null;

  return { id: userId, email, name };
}

/** Read the current Clerk session as an app user, or null if signed out. */
export async function getCurrentUser(): Promise<SessionUser | null> {
  const { userId, sessionClaims } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (user) {
    return {
      id: userId,
      email: user.emailAddresses[0]?.emailAddress ?? "",
      name: displayName(user),
    };
  }

  // Trust auth() when currentUser() is unavailable (common right after sign-in).
  return claimsToUser(userId, sessionClaims as Record<string, unknown> | undefined);
}

/** The current tenant id (= Clerk user id), or null. */
export async function getTenantId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

/** Require an authenticated user or redirect to sign-in. */
export async function requireUser(): Promise<SessionUser> {
  const { userId, sessionClaims, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn({ returnBackUrl: POST_AUTH_PATH });
    throw new Error("Unreachable");
  }

  const user = await getCurrentUser();
  return user ?? claimsToUser(userId, sessionClaims as Record<string, unknown> | undefined);
}
