import { GlassCard } from "@/components/landing/GlassCard";
import { Reveal } from "@/components/landing/MainframeReveal";

type Feature = {
  title: string;
  category: string;
  description: string;
  shortcut?: string;
  glow: string;
};

const FEATURES: Feature[] = [
  {
    title: "Priority Inbox",
    category: "AI · Triage",
    description:
      "Every message is classified Urgent, Important, Normal, or Low — by a fast, cheap model so nothing blocks render.",
    glow: "from-rose-400/40 to-amber-300/30",
  },
  {
    title: "A.R.I.A Agent",
    category: "AI · MCP",
    description:
      "Ask A.R.I.A to send a reply, create a calendar invite, or find a thread — it drives Gmail and Calendar through Corsair MCP tools.",
    shortcut: "⌘J",
    glow: "from-violet-400/40 to-sky-400/30",
  },
  {
    title: "Instant Search",
    category: "Search · pgvector",
    description:
      "Keyword matches and semantic Smart Results from text-embedding-3-small — all queried locally in under a second.",
    shortcut: "/",
    glow: "from-teal-300/40 to-emerald-400/30",
  },
  {
    title: "Command Palette",
    category: "Keyboard · UX",
    description:
      "Compose, navigate, search, or summon the agent without the mouse. Vim-style j / k / e / x list navigation included.",
    shortcut: "⌘K",
    glow: "from-sky-400/40 to-indigo-400/30",
  },
];

function FeatureCard({ feature }: { feature: Feature }) {
  return (
    <GlassCard className="group h-full p-2.5">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[20px]">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${feature.glow} transition-transform duration-500 ease-out group-hover:scale-110`}
        />
        {feature.shortcut ? (
          <span className="lg-keycap absolute right-4 top-4 rounded-lg px-2.5 py-1 text-[14px] font-medium text-black dark:text-white">
            {feature.shortcut}
          </span>
        ) : (
          <span
            aria-hidden
            className="absolute right-4 top-4 select-none text-[26px] text-black/25 dark:text-white/25"
          >
            ✳︎
          </span>
        )}
      </div>
      <div className="px-3 pb-3 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <h3
            className="text-[21px] tracking-tight sm:text-[24px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {feature.title}
          </h3>
          <span className="shrink-0 text-[12px] uppercase tracking-wider text-black/40 dark:text-white/40">
            {feature.category}
          </span>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-black/60 dark:text-white/60">
          {feature.description}
        </p>
      </div>
    </GlassCard>
  );
}

export function MainframeWork() {
  return (
    <section
      id="work"
      className="relative px-5 pb-24 text-black sm:px-8 md:px-10 md:pb-32 dark:text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <div className="flex items-end justify-between border-b border-[var(--lg-hairline)] pb-6">
            <span className="text-[13px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
              ✳︎ Features
            </span>
            <a
              href="/sign-up"
              className="hidden text-[14px] underline underline-offset-4 transition-opacity hover:opacity-60 sm:inline"
            >
              Get started free →
            </a>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <Reveal key={feature.title} delay={index % 2 === 0 ? 0 : 0.08}>
              <FeatureCard feature={feature} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
