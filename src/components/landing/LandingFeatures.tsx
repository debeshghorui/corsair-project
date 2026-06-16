import { Bot, Keyboard, Mail, Search, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant cached inbox",
    description:
      "Messages render from your local Corsair cache — no Gmail round-trip per view. Seed, backfill, and refresh automatically.",
    soft: false,
  },
  {
    icon: Search,
    title: "AI priority triage + semantic search",
    description:
      "BYOK OpenAI classifies mail into urgent, important, normal, and low. pgvector embeddings power sub-second semantic search.",
    soft: true,
  },
  {
    icon: Keyboard,
    title: "Keyboard-first UX + Corsair agent",
    description:
      "Fly through mail with j/k, ⌘K, and ⌘J. The Corsair Assistant reads and acts on Gmail and Calendar via MCP tools.",
    soft: false,
  },
];

export function LandingFeatures() {
  return (
    <section
      id="features"
      className="bg-[var(--landing-canvas)] px-6 py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-semibold leading-[0.96] tracking-[-0.02em] text-[var(--landing-ink)] sm:text-[48px]">
            Built for speed, not clicks.
          </h2>
          <p className="mt-4 text-lg text-[var(--landing-ink-mute)]">
            Stock Gmail is powerful but slow to drive. Corsair Mail mirrors
            your mailbox locally and layers AI triage on top.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {FEATURES.map(({ icon: Icon, title, description, soft }) => (
            <article
              key={title}
              className={`rounded-lg border border-[var(--landing-hairline)] p-6 lg:p-8 ${
                soft
                  ? "bg-[var(--landing-canvas-soft)]"
                  : "bg-[var(--landing-canvas)]"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--landing-primary)] text-[var(--landing-on-primary)]">
                  <Icon className="size-5" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.01em] text-[var(--landing-ink)]">
                    {title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-[var(--landing-ink-mute)]">
                    {description}
                  </p>
                </div>
              </div>
            </article>
          ))}

          <article className="rounded-lg border border-[var(--landing-hairline)] bg-[var(--landing-canvas-soft)] p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--landing-primary)] text-[var(--landing-on-primary)]">
                <Mail className="size-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-[var(--landing-ink)]">
                  Mail + Calendar in one flow
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--landing-ink-mute)]">
                  Split-pane reading, compose and reply, label views, upcoming
                  events, quick invites, and realtime push — all keyboard-driven.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-[var(--landing-hairline)] bg-[var(--landing-canvas)] p-6 lg:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-[var(--landing-primary)] text-[var(--landing-on-primary)]">
                <Bot className="size-5" />
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.01em] text-[var(--landing-ink)]">
                  Realtime updates
                </h3>
                <p className="mt-2 text-base leading-relaxed text-[var(--landing-ink-mute)]">
                  Gmail Pub/Sub push and Calendar watch channels keep your cache
                  fresh, with a 30-second polling fallback when push is not
                  configured.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
