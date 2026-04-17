import { Footer } from "~/layouts/Footer";
import { Header } from "~/layouts/Header";
import { Site } from "~/layouts/Site";

import { CallToAction } from "./CallToAction";
import { Features } from "./Features";
import { Hero } from "./Hero";
import { Platform } from "./Platform";

export function Homepage() {
  return (
    <Site>
      <div className="homepage-spot-grid min-h-screen">
        <div className="relative">
          {/* Solid centre column (above the dot grid, below page content + rails). */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 bottom-0 z-[1] w-full max-w-6xl -translate-x-1/2 bg-zinc-50 dark:bg-zinc-950"
          />
          {/* Header above the gutter rails so nav/chrome stays unobstructed. */}
          <div className="relative z-30">
            <Header />
          </div>
          <div className="relative z-10">
            <Hero />
            <Platform />
            <Features />
            <CallToAction />
            <Footer />
          </div>
          {/* Rails paint above main content (cards/sections) but below the header shell. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20"
          >
            <div className="relative mx-auto h-full min-h-full w-full max-w-6xl">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700" />
              <div className="absolute right-4 top-0 bottom-0 w-px bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>
        </div>
      </div>
    </Site>
  );
}
