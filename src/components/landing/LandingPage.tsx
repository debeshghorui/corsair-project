import { LandingMotionConfig } from "@/components/landing/LandingMotionConfig";
import { LiquidBackground } from "@/components/landing/LiquidBackground";
import { MainframeFooter } from "@/components/landing/MainframeFooter";
import { MainframeHero } from "@/components/landing/MainframeHero";
import { MainframeLabs } from "@/components/landing/MainframeLabs";
import { MainframeMarquee } from "@/components/landing/MainframeMarquee";
import { MainframeNav } from "@/components/landing/MainframeNav";
import { MainframeOpenings } from "@/components/landing/MainframeOpenings";
import { MainframeStudio } from "@/components/landing/MainframeStudio";
import { MainframeWork } from "@/components/landing/MainframeWork";

export function LandingPage() {
  return (
    <LandingMotionConfig>
      <div className="relative min-h-dvh overflow-hidden">
        {/* Fixed aurora mesh read through every glass surface */}
        <LiquidBackground />

        <MainframeNav />

        <main className="relative z-[1]">
          <MainframeHero />
          <MainframeMarquee />
          <MainframeStudio />
          <MainframeWork />
          <MainframeLabs />
          <MainframeOpenings />
          <MainframeFooter />
        </main>
      </div>
    </LandingMotionConfig>
  );
}
