import { MainframeMark } from "@/components/brand/MainframeMark";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "#work" },
      { label: "Under the hood", href: "#labs" },
      { label: "Studio", href: "#studio" },
      { label: "Get started", href: "#openings" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign in", href: "/sign-in" },
      { label: "Sign up", href: "/sign-up" },
      { label: "Onboarding", href: "/onboarding" },
      { label: "Connect Gmail", href: "/onboarding" },
    ],
  },
  {
    heading: "Connect",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/debeshghorui/corsair-project",
      },
      { label: "X / Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Email", href: "mailto:hello@mainframe.co" },
    ],
  },
  {
    heading: "Get started",
    links: [
      { label: "Create an account", href: "/sign-up" },
      { label: "Sign in", href: "/sign-in" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
] as const;

const EMAIL = "hello@mainframe.co";

export function MainframeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative scroll-mt-28 overflow-hidden border-t border-black/10 px-6 pt-16 pb-8 text-sm leading-normal text-black/55 sm:px-8 md:px-10 dark:border-white/10 dark:text-white/55"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-start gap-10 md:grid-cols-[minmax(15rem,1fr)_minmax(0,1.75fr)] md:gap-16">
          <div className="flex flex-col items-start">
            <a
              href="#"
              className="inline-flex min-h-10 items-center gap-2 text-xl tracking-[-0.04em] text-black dark:text-white"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <MainframeMark className="size-5 shrink-0" />
              Mainframe
            </a>
            <p className="mt-4 max-w-xs text-pretty">
              © {year} Mainframe. Keyboard-first Gmail and Calendar.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-2 inline-flex min-h-8 items-center rounded-sm transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:hover:text-white"
            >
              {EMAIL}
            </a>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4"
          >
            {COLUMNS.map((column) => (
              <div key={column.heading} className="min-w-0">
                <h2
                  className="mb-4 text-sm font-medium text-black dark:text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {column.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => {
                    const external = link.href.startsWith("http");
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          {...(external
                            ? { target: "_blank", rel: "noreferrer" }
                            : {})}
                          className="inline-flex min-h-8 items-center rounded-sm break-words transition-colors hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 dark:hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p
          aria-hidden
          className="pointer-events-none mt-16 text-center text-[clamp(3.5rem,14vw,11rem)] leading-[1.15] font-normal tracking-[-0.075em] text-black blur-[1px] select-none sm:blur-[2px] dark:text-white"
          style={{
            fontFamily: "var(--font-heading)",
            opacity: 0.1,
            maskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 8%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.7) 70%, #000 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, transparent 8%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.7) 70%, #000 100%)",
          }}
        >
          Mainframe
        </p>
      </div>
    </footer>
  );
}
