import { LandingClosingCta } from "@/components/landing/LandingClosingCta";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingShortcuts } from "@/components/landing/LandingShortcuts";

export function LandingPage() {
  return (
    <div className="min-h-dvh bg-[var(--landing-canvas)] text-[var(--landing-ink)]">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingShortcuts />
        <LandingHowItWorks />
        <LandingClosingCta />
      </main>
      <LandingFooter />
    </div>
  );
}
