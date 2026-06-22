import { GlassCard } from "@/components/landing/GlassCard";
import { Reveal } from "@/components/landing/MainframeReveal";

const COLUMNS = [
  {
    heading: "Product",
    links: ["Features", "Under the Hood", "Get Started", "Sign up"],
  },
  {
    heading: "Account",
    links: ["Sign in", "Sign up", "Onboarding", "Connect Gmail"],
  },
  {
    heading: "Connect",
    links: ["GitHub", "X / Twitter", "LinkedIn", "hello@mainframe.co"],
  },
] as const;

const EMAIL = "hello@mainframe.co";

export function MainframeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="relative px-5 pb-10 text-black sm:px-8 md:px-10 dark:text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <GlassCard spotlight={false} className="overflow-hidden px-6 pt-14 sm:px-10">
            <span className="text-[13px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
              ✳︎ Get in touch
            </span>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-6 block text-[30px] leading-[1.05] tracking-[-0.02em] underline decoration-1 underline-offset-[6px] transition-opacity hover:opacity-60 sm:text-[48px] md:text-[64px]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {EMAIL}
            </a>

            <div className="mt-16 grid grid-cols-2 gap-10 md:grid-cols-4">
              <div className="col-span-2 md:col-span-1">
                <p className="max-w-xs text-[15px] leading-relaxed text-black/60 dark:text-white/60">
                  Mainframe is a keyboard-first Gmail + Calendar client with AI
                  triage, instant search, and an agent that acts on your behalf.
                </p>
              </div>
              {COLUMNS.map((column) => (
                <nav key={column.heading} className="flex flex-col gap-3">
                  <span className="text-[12px] uppercase tracking-[0.14em] text-black/40 dark:text-white/40">
                    {column.heading}
                  </span>
                  {column.links.map((link) => (
                    <a
                      key={link}
                      href="#"
                      className="text-[15px] text-black/70 transition-opacity hover:opacity-60 dark:text-white/70"
                    >
                      {link}
                    </a>
                  ))}
                </nav>
              ))}
            </div>

            {/* Giant wordmark bleeding off the glass edge */}
            <div
              aria-hidden
              className="mt-16 -mb-[3vw] select-none leading-none"
            >
              <span
                className="block bg-gradient-to-b from-black/80 to-black/10 bg-clip-text text-[19vw] tracking-tighter text-transparent md:text-[17vw] dark:from-white/80 dark:to-white/5"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                Mainframe
              </span>
            </div>
          </GlassCard>
        </Reveal>

        <div className="mt-8 flex flex-col gap-3 text-[13px] text-black/50 sm:flex-row sm:items-center sm:justify-between dark:text-white/50">
          <span>© {year} Mainframe Studio. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="transition-opacity hover:opacity-60">
              Privacy
            </a>
            <a href="#" className="transition-opacity hover:opacity-60">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
