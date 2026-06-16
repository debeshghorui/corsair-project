const PRIORITY_COLORS = {
  urgent: "bg-red-500",
  important: "bg-amber-400",
  normal: "bg-[var(--landing-on-dark-faint)]",
} as const;

const MOCK_MESSAGES = [
  {
    sender: "Sarah Chen",
    subject: "Q2 roadmap review — action needed",
    preview: "Can you confirm the launch timeline before Friday?",
    priority: "urgent" as const,
    unread: true,
  },
  {
    sender: "Design Team",
    subject: "Inbox mockup feedback",
    preview: "Looks great — ship the split-pane layout.",
    priority: "important" as const,
    unread: true,
  },
  {
    sender: "Calendar",
    subject: "Team sync moved to 3pm",
    preview: "Updated invite sent to all attendees.",
    priority: "normal" as const,
    unread: false,
  },
  {
    sender: "Newsletter",
    subject: "Weekly digest",
    preview: "Your top stories this week.",
    priority: "normal" as const,
    unread: false,
  },
];

export function InboxMockup() {
  const selected = MOCK_MESSAGES[0];

  return (
    <div
      aria-hidden
      className="relative w-full max-w-lg overflow-hidden rounded-xl border border-[var(--landing-hairline-dark)] bg-[var(--landing-primary-deep)] shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="flex border-b border-[var(--landing-hairline-dark)]">
        <div className="hidden w-[42%] border-r border-[var(--landing-hairline-dark)] sm:block">
          <div className="border-b border-[var(--landing-hairline-dark)] px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--landing-on-dark-faint)]">
            Inbox
          </div>
          <ul className="divide-y divide-[var(--landing-hairline-dark)]">
            {MOCK_MESSAGES.map((msg, i) => (
              <li
                key={msg.subject}
                className={`px-3 py-2.5 ${i === 0 ? "bg-[var(--landing-primary)]" : ""}`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${PRIORITY_COLORS[msg.priority]}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={`truncate text-[11px] ${msg.unread ? "font-semibold text-[var(--landing-on-primary)]" : "text-[var(--landing-on-dark-mute)]"}`}
                      >
                        {msg.sender}
                      </span>
                    </div>
                    <p
                      className={`truncate text-[10px] ${msg.unread ? "text-[var(--landing-on-primary)]" : "text-[var(--landing-on-dark-mute)]"}`}
                    >
                      {msg.subject}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 flex-1">
          <div className="border-b border-[var(--landing-hairline-dark)] px-4 py-2.5">
            <p className="truncate text-xs font-semibold text-[var(--landing-on-primary)]">
              {selected.subject}
            </p>
            <p className="truncate text-[10px] text-[var(--landing-on-dark-mute)]">
              {selected.sender}
            </p>
          </div>
          <div className="space-y-2 px-4 py-3">
            <p className="text-[11px] leading-relaxed text-[var(--landing-on-dark-mute)]">
              {selected.preview}
            </p>
            <p className="text-[11px] leading-relaxed text-[var(--landing-on-dark-faint)]">
              The split-pane loads instantly from your local Corsair cache — no
              Gmail round-trip per view.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[var(--landing-hairline-dark)] px-3 py-2">
        <kbd className="rounded border border-[var(--landing-hairline-dark)] bg-[var(--landing-primary)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--landing-on-dark-mute)]">
          j
        </kbd>
        <kbd className="rounded border border-[var(--landing-hairline-dark)] bg-[var(--landing-primary)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--landing-on-dark-mute)]">
          k
        </kbd>
        <span className="text-[9px] text-[var(--landing-on-dark-faint)]">
          navigate
        </span>
        <span className="ml-auto text-[9px] text-[var(--landing-violet-soft)]">
          ⌘K command palette
        </span>
      </div>
    </div>
  );
}
