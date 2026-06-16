import { Calendar, Mail, Sparkles } from "lucide-react";

const STEPS = [
  {
    step: 1,
    icon: Mail,
    title: "Connect Gmail",
    description:
      "Search, read, draft, and send email through Corsair with your existing Google account.",
  },
  {
    step: 2,
    icon: Calendar,
    title: "Connect Google Calendar",
    description:
      "Manage your schedule, create events with attendees, and send invites.",
  },
  {
    step: 3,
    icon: Sparkles,
    title: "Add your OpenAI key",
    description:
      "Powers priority filtering, semantic search, and agent chat. Encrypted per tenant.",
  },
];

export function LandingHowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--landing-canvas)] px-6 py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-14 max-w-2xl">
          <h2 className="text-3xl font-semibold leading-[0.96] tracking-[-0.02em] text-[var(--landing-ink)] sm:text-[48px]">
            Up and running in minutes.
          </h2>
          <p className="mt-4 text-lg text-[var(--landing-ink-mute)]">
            Sign in with Clerk, complete three setup steps, and enter your inbox.
          </p>
        </div>

        <ol className="grid gap-6 md:grid-cols-3">
          {STEPS.map(({ step, icon: Icon, title, description }) => (
            <li
              key={step}
              className="flex flex-col gap-4 rounded-xl border border-[var(--landing-hairline)] bg-[var(--landing-canvas-soft)] p-8"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-[var(--landing-primary)] text-sm font-bold text-[var(--landing-on-primary)]">
                  {step}
                </span>
                <span className="grid size-10 place-items-center rounded-lg border border-[var(--landing-hairline)] bg-[var(--landing-canvas)] text-[var(--landing-ink)]">
                  <Icon className="size-5" />
                </span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--landing-ink)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--landing-ink-mute)]">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
