import { MainframeMark } from "@/components/brand/MainframeMark";

const ITEMS = [
  "Gmail",
  "Calendar",
  "AI Triage",
  "Instant Search",
  "A.R.I.A Agent",
  "Keyboard-first",
  "Realtime Push",
  "BYOK",
] as const;

function MarqueeRow() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span
            className="px-6 text-[36px] leading-none tracking-tight text-black/80 sm:text-[56px] dark:text-white/80"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {item}
          </span>
          <span aria-hidden className="text-black/30 dark:text-white/30">
            <MainframeMark className="size-[22px] sm:size-[34px]" />
          </span>
        </span>
      ))}
    </div>
  );
}

export function MainframeMarquee() {
  return (
    <section className="relative overflow-hidden py-8">
      {/* Edge fades so the ticker dissolves into the aurora */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-24 bg-gradient-to-r from-[var(--lg-bg-base)] to-transparent sm:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-24 bg-gradient-to-l from-[var(--lg-bg-base)] to-transparent sm:w-40" />
      <div className="mf-marquee-track flex w-max flex-nowrap">
        <MarqueeRow />
        <MarqueeRow />
      </div>
    </section>
  );
}
