"use client";

import { useActionState, useEffect, useState } from "react";
import { CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  createInviteAction,
  type InviteState,
} from "@/server/actions/calendarActions";

/** Default the form to the next round hour, 30-minute meeting. */
function defaultTimes() {
  const start = new Date();
  start.setMinutes(0, 0, 0);
  start.setHours(start.getHours() + 1);
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  return { start: fmt(start), end: fmt(end) };
}

export function QuickInvite({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [times] = useState(defaultTimes);

  const [state, action, pending] = useActionState<InviteState, FormData>(
    createInviteAction,
    { ok: false, error: null },
  );

  useEffect(() => {
    if (state.ok) onOpenChange(false);
  }, [state.ok, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New event</DialogTitle>
        </DialogHeader>
        <form action={action} className="flex flex-col gap-3">
          <Input name="title" placeholder="Event title" required autoFocus />
          <Input
            name="attendees"
            placeholder="Attendees (comma-separated emails)"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="start" className="text-xs">
                Start
              </Label>
              <Input
                id="start"
                name="start"
                type="datetime-local"
                defaultValue={times.start}
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="end" className="text-xs">
                End
              </Label>
              <Input
                id="end"
                name="end"
                type="datetime-local"
                defaultValue={times.end}
                required
              />
            </div>
          </div>
          <Input name="location" placeholder="Location (optional)" />
          <Textarea name="description" placeholder="Notes (optional)" />
          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          <DialogFooter>
            <Button type="submit" disabled={pending} className="gap-2">
              <CalendarPlus className="size-4" />
              {pending ? "Sending…" : "Send invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** Calendar-page launcher: owns its own open state and renders the trigger. */
export function QuickInviteButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <CalendarPlus className="size-4" /> New invite
      </Button>
      <QuickInvite open={open} onOpenChange={setOpen} />
    </>
  );
}
