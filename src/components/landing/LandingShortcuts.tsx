const SHORTCUTS = [
  { keys: ["j", "k"], label: "Move up / down" },
  { keys: ["e"], label: "Archive" },
  { keys: ["x"], label: "Close message" },
  { keys: ["⌘", "K"], label: "Command palette" },
  { keys: ["⌘", "J"], label: "Agent chat" },
  { keys: ["g", "i"], label: "Go to inbox" },
  { keys: ["g", "c"], label: "Go to calendar" },
  { keys: ["/"], label: "Search" },
  { keys: ["c"], label: "Compose" },
];

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-h-[28px] min-w-[28px] items-center justify-center rounded-md border border-[var(--landing-hairline)] bg-[var(--landing-canvas)] px-2 font-mono text-xs font-semibold text-[var(--landing-ink)] shadow-[0_1px_0_var(--landing-hairline)]">
      {children}
    </kbd>
  );
}

export function LandingShortcuts() {
  return (
    <section className="bg-[var(--landing-canvas-soft)] px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--landing-ink)] sm:text-[28px]">
            Your fingers never leave the keyboard.
          </h2>
          <p className="mt-3 text-base text-[var(--landing-ink-mute)]">
            Superhuman-style shortcuts for list navigation, triage, compose, and
            the command palette — built into every view.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {SHORTCUTS.map(({ keys, label }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-lg border border-[var(--landing-hairline)] bg-[var(--landing-canvas)] px-4 py-3"
            >
              <span className="text-sm text-[var(--landing-ink-mute)]">
                {label}
              </span>
              <span className="flex shrink-0 items-center gap-1">
                {keys.map((key, i) => (
                  <Kbd key={`${label}-${key}-${i}`}>{key}</Kbd>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
