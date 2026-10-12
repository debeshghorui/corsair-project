"use client";

import { createContext, use, type ReactNode } from "react";

import { Button } from "@/components/ui/button";

export type AuthActions = {
  signOut: (redirectTo?: string) => void;
};

const AuthActionsContext = createContext<AuthActions | null>(null);

export function AuthActionsProvider({
  actions,
  children,
}: {
  actions: AuthActions;
  children: ReactNode;
}) {
  return <AuthActionsContext value={actions}>{children}</AuthActionsContext>;
}

export function useAuthActions(): AuthActions {
  const actions = use(AuthActionsContext);
  if (!actions) {
    throw new Error("useAuthActions must be used within AuthProvider");
  }
  return actions;
}

export function SignOutButton({
  redirectTo = "/",
  children = "Sign out",
}: {
  redirectTo?: string;
  children?: ReactNode;
}) {
  const { signOut } = useAuthActions();

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={() => signOut(redirectTo)}
    >
      {children}
    </Button>
  );
}
