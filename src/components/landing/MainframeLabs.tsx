import { MainframeMark } from "@/components/brand/MainframeMark";
import { GlassCard } from "@/components/landing/GlassCard";
import { Reveal } from "@/components/landing/MainframeReveal";

const EXPERIMENTS = [
  {
    tag: "01",
    title: "Semantic Search",
    body: "Every message is embedded with text-embedding-3-small (1 536 dims) and stored in pgvector. Cosine-distance queries return Smart Results alongside keyword hits — under a second, fully local.",
  },
  {
    tag: "02",
    title: "Realtime Push",
    body: "Gmail Pub/Sub and Google Calendar watch channels deliver changes the moment they happen. No polling: the cache updates, routes revalidate, and new mail is indexed automatically.",
  },
  {
    tag: "03",
    title: "BYOK Encryption",
    body: "Each tenant brings their own OpenAI key, encrypted at rest with AES-256-GCM and decrypted server-side on demand — your key never touches shared infra.",
  },
] as const;

export function MainframeLabs() {
  return (
    <section
      id="labs"
      className="relative px-5 py-24 text-black sm:px-8 md:px-10 md:py-32 dark:text-white"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.2em] text-black/45 dark:text-white/45">
            <MainframeMark className="size-3.5" />
            Under the Hood
          </span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2
            className="mt-6 max-w-3xl text-[32px] leading-[1.08] tracking-[-0.02em] sm:text-[46px] md:text-[54px]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The technical choices that make it feel instant.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3">
          {EXPERIMENTS.map((item, index) => (
            <Reveal key={item.tag} delay={index * 0.08}>
              <GlassCard className="h-full p-8">
                <span className="text-[13px] font-medium tracking-widest text-black/45 dark:text-white/45">
                  {item.tag}
                </span>
                <h3
                  className="mt-4 text-[23px] tracking-tight sm:text-[26px]"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-black/60 dark:text-white/60">
                  {item.body}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
