"use client";

import { useMemo, type ReactNode } from "react";
import { ClerkProvider, useClerk } from "@clerk/nextjs";

import {
  AuthActionsProvider,
  type AuthActions,
} from "@/components/auth/actions";
import { POST_AUTH_PATH } from "@/server/auth/paths";

function ClerkAuthActions({ children }: { children: ReactNode }) {
  const { signOut } = useClerk();
  const actions = useMemo<AuthActions>(
    () => ({
      signOut: (redirectTo = "/") => {
        void signOut({ redirectUrl: redirectTo });
      },
    }),
    [signOut],
  );

  return (
    <AuthActionsProvider actions={actions}>{children}</AuthActionsProvider>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl={POST_AUTH_PATH}
      signUpFallbackRedirectUrl={POST_AUTH_PATH}
      signInForceRedirectUrl={POST_AUTH_PATH}
      signUpForceRedirectUrl={POST_AUTH_PATH}
    >
      <ClerkAuthActions>{children}</ClerkAuthActions>
    </ClerkProvider>
  );
}
