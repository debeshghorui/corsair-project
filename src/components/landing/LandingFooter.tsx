import Link from "next/link";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Sign in", href: "/sign-in" },
    ],
  },
  {
    title: "Resources",
    links: [
      {
        label: "Corsair",
        href: "https://corsair.dev",
        external: true,
      },
    ],
  },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[var(--landing-hairline)] bg-[var(--landing-canvas)] px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-base font-semibold text-[var(--landing-ink)]"
            >
              <span className="grid size-7 place-items-center rounded-md bg-[var(--landing-primary)] text-[var(--landing-on-primary)]">
                C
              </span>
              Corsair Mail
            </Link>
            <p className="mt-3 max-w-xs text-sm text-[var(--landing-ink-mute)]">
              A faster Gmail + Google Calendar workflow, powered by Corsair.
            </p>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-[var(--landing-ink)]">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--landing-ink-mute)] transition-colors hover:text-[var(--landing-ink)]"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-[var(--landing-ink-mute)] transition-colors hover:text-[var(--landing-ink)]"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 text-sm text-[var(--landing-ink-faint)]">
          © {new Date().getFullYear()} Corsair Mail. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
