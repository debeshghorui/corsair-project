import Link from "next/link";

import { requireUser } from "@/server/auth/session";
import { gmailService } from "@/server/services/gmailService";
import { messageAiRepo } from "@/server/repositories/messageAiRepo";
import { cn } from "@/lib/utils";
import { formatDate, parseAddress } from "@/lib/format";
import { ComposeDialog } from "@/components/mail/ComposeDialog";
import { MailList } from "@/components/mail/MailList";
import { MailBody } from "@/components/mail/MailBody";
import { ReadingPaneActions } from "@/components/mail/ReadingPaneActions";
import { MailSearchBox } from "@/components/mail/MailSearchBox";
import { InboxAiIndexer } from "@/components/mail/InboxAiIndexer";
import { RealtimePoller } from "@/components/mail/RealtimePoller";
import { MailShortcuts } from "@/components/mail/MailShortcuts";

const LABELS = [
  { id: "INBOX", name: "Inbox" },
  { id: "STARRED", name: "Starred" },
  { id: "IMPORTANT", name: "Important" },
  { id: "SENT", name: "Sent" },
] as const;

type SearchParams = Promise<{ label?: string; id?: string }>;

export default async function MailPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requireUser();
  const { label = "INBOX", id } = await searchParams;

  let messages: Awaited<ReturnType<typeof gmailService.listByLabel>> = [];
  let loadError: string | null = null;

  try {
    messages = await gmailService.listByLabel(label, 50);
  } catch (err) {
    console.error("[mail/page] listByLabel failed:", err);
    loadError =
      err instanceof Error ? err.message : "Could not load your inbox. Try reconnecting Gmail.";
  }

  // Attach AI priorities from the vector sidecar (if indexed).
  let priorityMap = new Map<string, import("@/types/mail").MailPriority>();
  try {
    priorityMap = await messageAiRepo.getPriorityMap(
      user.id,
      messages.map((m) => m.id),
    );
  } catch (err) {
    console.error("[mail/page] priority map failed:", err);
  }
  for (const m of messages) m.priority = priorityMap.get(m.id) ?? null;
  const pendingCount = messages.filter((m) => !m.priority).length;

  let selected: Awaited<ReturnType<typeof gmailService.getMessage>> = null;
  if (id) {
    try {
      selected = await gmailService.getMessage(id);
    } catch (err) {
      console.error("[mail/page] getMessage failed:", err);
    }
  }

  // Mark the opened message as read (best-effort, no full revalidate).
  if (selected?.unread) {
    await gmailService.markRead(selected.id).catch(() => undefined);
    selected.unread = false;
  }

  return (
    <div className="flex h-full min-h-0 flex-1">
      {/* Message list column */}
      <section className="flex w-full max-w-md min-w-0 flex-col border-r lg:w-[420px]">
        <header className="flex flex-col gap-3 border-b px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-lg font-semibold tracking-tight">Mail</h1>
            <ComposeDialog />
          </div>
          {loadError && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {loadError}
            </p>
          )}
          <MailSearchBox />
          <nav className="flex items-center gap-1 overflow-x-auto">
            {LABELS.map((l) => (
              <Link
                key={l.id}
                href={`/mail?label=${l.id}`}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                  l.id === label
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                {l.name}
              </Link>
            ))}
          </nav>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <MailList
            messages={messages}
            selectedId={id}
            label={label}
            group={label === "INBOX"}
          />
        </div>
      </section>

      <InboxAiIndexer pendingCount={label === "INBOX" ? pendingCount : 0} />
      <RealtimePoller />
      <MailShortcuts
        orderedIds={messages.map((m) => m.id)}
        selectedId={id}
        label={label}
      />

      {/* Reading pane */}
      <section className="hidden min-w-0 flex-1 flex-col lg:flex">
        {selected ? (
          <article className="flex min-h-0 flex-1 flex-col">
            <header className="flex flex-col gap-3 border-b px-6 py-4">
              <h2 className="text-xl font-semibold tracking-tight">
                {selected.subject}
              </h2>
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col text-sm">
                  <span className="font-medium">
                    {parseAddress(selected.from).name}
                  </span>
                  <span className="text-muted-foreground">
                    to {parseAddress(selected.to).name || "me"}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(selected.date)}
                </span>
              </div>
              <ReadingPaneActions message={selected} />
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
              <MailBody html={selected.bodyHtml} text={selected.bodyText} />
            </div>
          </article>
        ) : (
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Select a message to read
          </div>
        )}
      </section>
    </div>
  );
}
