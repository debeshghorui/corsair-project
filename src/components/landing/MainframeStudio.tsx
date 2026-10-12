import { MainframeMark } from "@/components/brand/MainframeMark";
import { GlassCard } from "@/components/landing/GlassCard";
import { MainframeInboxPreview } from "@/components/landing/MainframeInboxPreview";
import { Reveal } from "@/components/landing/MainframeReveal";

const STATS = [
  { value: "<1s", label: "Inbox render — no Gmail round-trip" },
  { value: "4", label: "AI priority buckets, urgent to low" },
  { value: "⌘K", label: "Command palette for everything" },
] as const;

export function MainframeStudio() {
  return (
    <section
      id="studio"
      className="relative px-5 py-24 text-black sm:px-8 md:px-10 md:py-32 dark:text-white"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_420px] lg:gap-10 xl:grid-cols-[1fr_440px]">
          {/* Copy — left */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
                <MainframeMark className="size-3.5" />
                The Product
              </span>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                className="mt-6 max-w-2xl text-[32px] leading-[1.08] tracking-[-0.02em] sm:text-[46px] md:text-[52px]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                A Superhuman-style client on top of your real Gmail and Calendar
                — no migration required.
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-8 max-w-xl text-[17px] leading-relaxed text-black/65 sm:text-[19px] dark:text-white/65">
                Mainframe mirrors your mailbox into a local cache so every
                message renders instantly. AI classifies what&apos;s urgent,
                semantic search finds anything in under a second, and A.R.I.A —
                our MCP-powered agent — sends mail and books invites on your
                behalf.
              </p>
            </Reveal>
          </div>

          {/* Inbox preview — right */}
          <Reveal delay={0.12} className="w-full lg:sticky lg:top-28">
            <MainframeInboxPreview />
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {STATS.map((stat, index) => (
            <Reveal key={stat.label} delay={0.1 + index * 0.08}>
              <GlassCard className="h-full p-8">
                <div
                  className="text-[44px] leading-none tracking-tight sm:text-[54px]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {stat.value}
                </div>
                <div className="mt-4 text-[15px] text-black/55 dark:text-white/55">
                  {stat.label}
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
