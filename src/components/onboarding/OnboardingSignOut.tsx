"use client";

import { SignOutButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function OnboardingSignOut() {
  return (
    <SignOutButton redirectUrl="/">
      <Button variant="ghost" size="sm" type="button">
        Sign out
      </Button>
    </SignOutButton>
  );
}
