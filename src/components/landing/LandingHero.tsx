import Link from "next/link";

import { InboxMockup } from "@/components/landing/InboxMockup";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[var(--landing-primary)] px-6 py-16 lg:px-8 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(201,180,250,0.35),transparent_50%),radial-gradient(ellipse_60%_50%_at_20%_80%,rgba(100,120,200,0.2),transparent_45%)]"
      />

      <div className="relative mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-semibold leading-[0.96] tracking-tight text-[var(--landing-on-primary)] sm:text-5xl lg:text-[64px]">
            Email at the speed of thought.
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-[var(--landing-on-dark-mute)]">
            A faster Gmail + Google Calendar workflow, powered by Corsair.
          </p>
          <div>
            <Link
              href="/sign-up"
              className="inline-flex rounded-full bg-[var(--landing-violet-soft)] px-5 py-3 text-base font-bold text-[var(--landing-primary)] transition-colors hover:bg-[var(--landing-violet-soft)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-violet-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-primary)]"
            >
              Get started
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <InboxMockup />
        </div>
      </div>
    </section>
  );
}
