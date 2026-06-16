"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Archive, MailOpen, Reply, Send, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { parseAddress } from "@/lib/format";
import {
  archiveAction,
  markReadAction,
  replyAction,
  toggleStarAction,
  trashAction,
  type ComposeState,
} from "@/server/actions/mailActions";
import type { MailMessageDetail } from "@/types/mail";

export function ReadingPaneActions({ message }: { message: MailMessageDetail }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [replying, setReplying] = useState(false);

  const run = (fn: () => Promise<unknown>, navigateAway = false) =>
    startTransition(async () => {
      await fn();
      if (navigateAway) router.push("/mail");
      else router.refresh();
    });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => setReplying((v) => !v)}
        >
          <Reply className="size-4" /> Reply
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={pending}
          onClick={() => run(() => archiveAction(message.id), true)}
        >
          <Archive className="size-4" /> Archive
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={pending}
          onClick={() => run(() => toggleStarAction(message.id, !message.starred))}
        >
          <Star
            className={cn(
              "size-4",
              message.starred && "fill-amber-400 text-amber-400",
            )}
          />
          {message.starred ? "Unstar" : "Star"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={pending}
          onClick={() => run(() => markReadAction(message.id, false))}
        >
          <MailOpen className="size-4" /> Unread
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          disabled={pending}
          onClick={() => run(() => trashAction(message.id), true)}
        >
          <Trash2 className="size-4" /> Trash
        </Button>
      </div>

      {replying && (
        <ReplyForm message={message} onDone={() => setReplying(false)} />
      )}
    </div>
  );
}

function ReplyForm({
  message,
  onDone,
}: {
  message: MailMessageDetail;
  onDone: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const replyTo = parseAddress(message.from).email;

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const result: ComposeState = await replyAction(
        { ok: false, error: null },
        formData,
      );
      if (result.ok) {
        onDone();
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form
      action={onSubmit}
      className="flex flex-col gap-2 rounded-lg border bg-card p-3"
    >
      <input type="hidden" name="threadId" value={message.threadId ?? ""} />
      <input type="hidden" name="to" value={replyTo} />
      <input type="hidden" name="subject" value={message.subject} />
      <input type="hidden" name="inReplyTo" value={message.messageIdHeader} />
      <input
        type="hidden"
        name="references"
        value={`${message.referencesHeader} ${message.messageIdHeader}`.trim()}
      />
      <p className="text-xs text-muted-foreground">
        Replying to <span className="font-medium text-foreground">{replyTo}</span>
      </p>
      <Textarea
        name="body"
        placeholder="Write your reply…"
        className="min-h-28"
        autoFocus
        required
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="gap-2" disabled={pending}>
          <Send className="size-4" /> {pending ? "Sending…" : "Send reply"}
        </Button>
      </div>
    </form>
  );
}
