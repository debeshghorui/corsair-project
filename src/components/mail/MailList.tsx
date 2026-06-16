"use client";

import Link from "next/link";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { formatDate, initials, parseAddress } from "@/lib/format";
import type { MailMessage, MailPriority } from "@/types/mail";

const PRIORITY_DOT: Record<MailPriority, string> = {
  urgent: "bg-red-500",
  important: "bg-amber-500",
  normal: "bg-transparent",
  low: "bg-transparent",
};

export function MailList({
  messages,
  selectedId,
  label,
  group = false,
}: {
  messages: MailMessage[];
  selectedId?: string;
  label: string;
  group?: boolean;
}) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-sm text-muted-foreground">
        <p>No messages here.</p>
        <p className="text-xs">New mail will appear in real time.</p>
      </div>
    );
  }

  if (group) {
    const urgent = messages.filter((m) => m.priority === "urgent");
    const important = messages.filter((m) => m.priority === "important");
    const other = messages.filter(
      (m) => m.priority !== "urgent" && m.priority !== "important",
    );
    return (
      <div className="flex flex-col">
        <Bucket title="Urgent" messages={urgent} selectedId={selectedId} label={label} />
        <Bucket title="Important" messages={important} selectedId={selectedId} label={label} />
        <Bucket
          title={urgent.length || important.length ? "Everything else" : ""}
          messages={other}
          selectedId={selectedId}
          label={label}
        />
      </div>
    );
  }

  return <Rows messages={messages} selectedId={selectedId} label={label} />;
}

function Bucket({
  title,
  messages,
  selectedId,
  label,
}: {
  title: string;
  messages: MailMessage[];
  selectedId?: string;
  label: string;
}) {
  if (messages.length === 0) return null;
  return (
    <div>
      {title && (
        <div className="sticky top-0 z-10 bg-background/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground backdrop-blur">
          {title}
        </div>
      )}
      <Rows messages={messages} selectedId={selectedId} label={label} />
    </div>
  );
}

function Rows({
  messages,
  selectedId,
  label,
}: {
  messages: MailMessage[];
  selectedId?: string;
  label: string;
}) {
  return (
    <ul className="flex flex-col">
      {messages.map((m) => {
        const { name } = parseAddress(m.from);
        const active = m.id === selectedId;
        return (
          <li key={m.id}>
            <Link
              href={`/mail?label=${encodeURIComponent(label)}&id=${m.id}`}
              data-mail-row
              data-id={m.id}
              className={cn(
                "flex gap-3 border-b border-border/60 px-4 py-3 transition-colors hover:bg-accent/60",
                active && "bg-accent",
                m.unread && "bg-primary/[0.03]",
              )}
            >
              <div className="relative flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {initials(m.from)}
                {m.priority && PRIORITY_DOT[m.priority] !== "bg-transparent" && (
                  <span
                    className={cn(
                      "absolute -left-0.5 -top-0.5 size-2.5 rounded-full ring-2 ring-background",
                      PRIORITY_DOT[m.priority],
                    )}
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "truncate text-sm",
                      m.unread ? "font-semibold" : "font-medium text-foreground/90",
                    )}
                  >
                    {name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(m.date)}
                  </span>
                </div>
                <span
                  className={cn(
                    "truncate text-sm",
                    m.unread ? "font-medium" : "text-foreground/80",
                  )}
                >
                  {m.subject}
                </span>
                <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  {m.starred && (
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                  )}
                  {m.snippet}
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
