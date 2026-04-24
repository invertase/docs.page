import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { Site } from "~/layouts/Site";

import { Features } from "./Features";
import { Hero } from "./Hero";
import { Platform } from "./Platform";
import { PricingCta } from "./PricingCta";
import { TrustedBy } from "./TrustedBy";

export function Homepage() {
  return (
    <Site>
      <div className="homepage-spot-grid min-h-screen">
        <div className="relative">
          {/*
            Solid centre column (above the dot grid, below page content + rails).
            Inset matches the scaffold: rails sit at `left-4` / `right-4` inside `max-w-8xl`,
            while content sections use `px-4` — the fill must use the same inset or the dark
            surface reads as a “black edge” past the vertical lines.
          */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[1] flex justify-center"
          >
            <div className="relative h-full w-full max-w-8xl">
              <div className="absolute inset-x-4 top-0 bottom-0 bg-background" />
            </div>
          </div>
          {/* Header above the gutter rails so nav/chrome stays unobstructed. */}
          <div className="relative z-30">
            <Header />
          </div>
          <div className="relative z-10">
            <Hero />
            <Features />
            <Platform />
            <TrustedBy />
            <PricingCta />
            <Footer />
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
      </div>
    </Site>
  );
}
