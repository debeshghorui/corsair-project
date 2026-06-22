import { GlassCard } from "@/components/landing/GlassCard";
import { Reveal } from "@/components/landing/MainframeReveal";

const STEPS = [
  {
    index: "01",
    title: "Connect Gmail",
    detail: "One OAuth click — no data leaves your account without you asking.",
  },
  {
    index: "02",
    title: "Connect Calendar",
    detail:
      "Upcoming events sync instantly. Invite, update, or delete without leaving the app.",
  },
  {
    index: "03",
    title: "Add your OpenAI key",
    detail: "BYOK: your key, encrypted with AES-256-GCM, used only on your requests.",
  },
  {
    index: "04",
    title: "Drive with the keyboard",
    detail: "j / k to navigate, e to archive, ⌘K for everything else. Mouse optional.",
  },
] as const;

function Arrow() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="shrink-0 text-black/40 transition-transform duration-200 group-hover:translate-x-1.5 group-hover:text-black dark:text-white/40 dark:group-hover:text-white"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MainframeOpenings() {
  return (
    <section
      id="openings"
      className="relative px-5 py-24 text-black sm:px-8 md:px-10 md:py-32 dark:text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="text-[13px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
            ✳︎ Get Started
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            className="mt-6 max-w-3xl text-[32px] leading-[1.08] tracking-[-0.02em] sm:text-[46px] md:text-[54px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Up and running in four steps.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <GlassCard spotlight={false} className="mt-12 p-2 sm:p-3">
            {STEPS.map((step) => (
              <a
                key={step.title}
                href="/sign-up"
                className="group flex items-center justify-between gap-6 rounded-3xl px-5 py-6 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              >
                <div className="flex items-baseline gap-5">
                  <span className="text-[14px] font-medium tabular-nums text-sky-500 dark:text-sky-400">
                    {step.index}
                  </span>
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-5">
                    <h3
                      className="text-[21px] tracking-tight sm:text-[26px]"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {step.title}
                    </h3>
                    <span className="text-[14px] text-black/55 dark:text-white/55">
                      {step.detail}
                    </span>
                  </div>
                </div>
                <Arrow />
              </a>
            ))}
          </GlassCard>
        </Reveal>

        <Reveal delay={0.2}>
          <GlassCard
            strong
            className="mt-8 flex flex-col items-start gap-6 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
          >
            <div>
              <h3
                className="text-[26px] tracking-tight sm:text-[32px]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Ready when you are.
              </h3>
              <p className="mt-2 text-[15px] text-black/60 dark:text-white/60">
                Free to start. Bring your own keys. Keep your Gmail.
              </p>
            </div>
            <a
              href="/sign-up"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-black px-7 py-3.5 text-[15px] text-white transition-transform hover:scale-[1.03] dark:bg-white dark:text-black"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Create free account
              <span aria-hidden>→</span>
            </a>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}
