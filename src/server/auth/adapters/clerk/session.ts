import { auth, currentUser } from "@clerk/nextjs/server";

import type { SessionUser } from "@/server/auth/types";

function displayName(
  user: NonNullable<Awaited<ReturnType<typeof currentUser>>>,
): string | null {
  if (user.fullName?.trim()) return user.fullName.trim();
  const parts = [user.firstName, user.lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : null;
}

function claimsToUser(
  userId: string,
  claims: Record<string, unknown> | null | undefined,
): SessionUser {
  const email =
    (typeof claims?.email === "string" && claims.email) ||
    (typeof claims?.primary_email_address === "string" &&
      claims.primary_email_address) ||
    "";
  const name =
    (typeof claims?.name === "string" && claims.name) ||
    (typeof claims?.full_name === "string" && claims.full_name) ||
    null;

  return { id: userId, email, name };
}

/** Session id only. Avoids loading the full profile. */
export async function readUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

/** Map the provider session onto a SessionUser, or null when signed out. */
export async function readSession(): Promise<SessionUser | null> {
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

  return claimsToUser(
    userId,
    sessionClaims as Record<string, unknown> | undefined,
  );
}

/** Send an anonymous request to the sign-in screen. Does not return. */
export async function redirectToSignIn(returnBackUrl: string): Promise<never> {
  const { redirectToSignIn } = await auth();
  redirectToSignIn({ returnBackUrl });
  throw new Error("Unreachable");
}
