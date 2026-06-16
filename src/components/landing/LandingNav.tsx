import Link from "next/link";

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--landing-hairline-dark)] bg-[var(--landing-primary)] px-6 py-4 lg:px-8">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold tracking-tight text-[var(--landing-on-primary)]"
        >
          <span className="grid size-8 place-items-center rounded-md bg-[var(--landing-on-primary)] text-[var(--landing-primary)]">
            C
          </span>
          <span className="hidden sm:inline">Corsair Mail</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm text-[var(--landing-on-dark-mute)] transition-colors hover:text-[var(--landing-on-primary)]"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm text-[var(--landing-on-dark-mute)] transition-colors hover:text-[var(--landing-on-primary)]"
          >
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/sign-in"
            className="hidden text-sm text-[var(--landing-on-dark-mute)] transition-colors hover:text-[var(--landing-on-primary)] sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-[var(--landing-violet-soft)] px-5 py-3 text-sm font-bold text-[var(--landing-primary)] transition-colors hover:bg-[var(--landing-violet-soft)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--landing-violet-soft)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--landing-primary)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
