"use client";

import { useActionState } from "react";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  saveOpenAiKeyAction,
  type KeyFormState,
} from "@/server/actions/onboardingActions";

export function OpenAiKeyForm({ alreadySet }: { alreadySet: boolean }) {
  const [state, action, pending] = useActionState<KeyFormState, FormData>(
    saveOpenAiKeyAction,
    { ok: alreadySet, error: null },
  );

  return (
    <form action={action} className="flex flex-col gap-3">
      <div className="flex gap-2">
        <Input
          name="apiKey"
          type="password"
          placeholder={alreadySet ? "•••••••••• (saved)" : "sk-…"}
          autoComplete="off"
          aria-label="OpenAI API key"
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && !state.error && (
        <p className="flex items-center gap-1.5 text-sm text-emerald-600 dark:text-emerald-400">
          <Check className="size-4" /> Key saved securely
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Stored encrypted (AES-256-GCM) and only used server-side for your AI features.
      </p>
    </form>
  );
}
