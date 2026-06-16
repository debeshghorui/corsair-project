"use client";

import { useActionState, useEffect, useState } from "react";
import { PenSquare, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  sendEmailAction,
  type ComposeState,
} from "@/server/actions/mailActions";

type Props = {
  /** Controlled open state (used by command palette / shortcuts). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Render a default trigger button. */
  withTrigger?: boolean;
  defaults?: { to?: string; subject?: string; body?: string };
};

export function ComposeDialog({
  open,
  onOpenChange,
  withTrigger = true,
  defaults,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const [state, action, pending] = useActionState<ComposeState, FormData>(
    sendEmailAction,
    { ok: false, error: null },
  );

  useEffect(() => {
    if (state.ok) setOpen(false);
  }, [state.ok, setOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {withTrigger && (
        <Button size="sm" onClick={() => setOpen(true)} className="gap-2">
          <PenSquare className="size-4" /> Compose
        </Button>
      )}
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-3">
          <Input
            name="to"
            placeholder="To"
            type="email"
            defaultValue={defaults?.to}
            required
            autoFocus
          />
          <Input name="cc" placeholder="Cc (optional)" type="text" />
          <Input
            name="subject"
            placeholder="Subject"
            defaultValue={defaults?.subject}
          />
          <Textarea
            name="body"
            placeholder="Write your message…"
            defaultValue={defaults?.body}
            className="min-h-48"
          />
          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending} className="gap-2">
              <Send className="size-4" />
              {pending ? "Sending…" : "Send"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
