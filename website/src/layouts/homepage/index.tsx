import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { Site } from "~/layouts/Site";

import { AgentChatWidget } from "./AgentChatWidget";
import { EcosystemStatement } from "./EcosystemStatement";
import { FeaturesSection } from "./FeaturesSection";
import { Hero } from "./Hero";
import { HeroPreview } from "./HeroPreview";
import { HomepageSpotGridShell } from "./HomepageSpotGridShell";
import { PricingCta } from "./PricingCta";
import { TrustedBy } from "./TrustedBy";

export function Homepage() {
  return (
    <Site>
      <HomepageSpotGridShell>
        <div className="relative overflow-visible">
          {/* Header above the gutter rails so nav/chrome stays unobstructed. */}
          <div className="relative z-30">
            <Header />
          </div>
          <div className="relative z-10 overflow-visible">
            <div className="relative z-[1]">
              <Hero />
              <div className="relative z-[2] mx-auto mt-8 min-w-0 w-full max-w-8xl overflow-visible px-4 sm:mt-12 sm:px-8 md:px-10">
                <HeroPreview />
              </div>
              <EcosystemStatement />
              <FeaturesSection />
              <div className="homepage-hexagon-lower">
                <div className="homepage-hexagon-lower__graphic" aria-hidden />
                <TrustedBy />
                <PricingCta />
              </div>
              <Footer />
            </div>
          </div>
          {/* Rails paint above main content (cards/sections) but below the header shell. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
          >
            <div className="relative mx-auto h-full min-h-full w-full max-w-8xl">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="absolute right-4 top-0 bottom-0 w-px bg-border" />
            </div>
          </div>
        </div>
      </HomepageSpotGridShell>
      <AgentChatWidget />
    </Site>
  );
}
