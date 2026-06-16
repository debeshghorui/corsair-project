import Link from "next/link";

export function LandingClosingCta() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1100px] rounded-xl bg-[var(--landing-teal-deep)] px-8 py-16 text-center lg:px-16 lg:py-20">
        <h2 className="text-2xl font-semibold tracking-[-0.02em] text-[var(--landing-on-primary)] sm:text-[28px]">
          Ready to fly through your inbox?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-[var(--landing-on-dark-mute)]">
          Join Corsair Mail and turn Gmail into a keyboard-first, AI-augmented
          workflow.
        </p>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className="inline-flex rounded-lg bg-[var(--landing-canvas)] px-5 py-3 text-base font-bold text-[var(--landing-teal-deep)] transition-colors hover:bg-[var(--landing-canvas)]/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-canvas)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-teal-deep)]"
          >
            Get started free
          </Link>
        </div>
      </div>
    </section>
  );
}
