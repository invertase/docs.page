import { ChevronRightIcon } from "lucide-react";

import { Link } from "~/components/Link";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4">
      <Card
        className={cn(
          platformCardVariants(),
          "relative gap-0 overflow-visible",
          /* Stack under header Card: drop top border so only the header’s bottom rule shows (no 2px seam). */
          "border-t-0",
          /* Top/left; no card bottom padding — CTA row supplies vertical padding. */
          "pt-6 pl-6 pr-6 pb-0 sm:pt-8 sm:pl-8 sm:pr-8 md:pt-10 md:pl-10 md:pr-10 lg:pr-0",
          "text-foreground",
        )}
      >
        {/* Left edge of video column → full card height (matches homepage rail tone) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-[1] hidden w-px bg-zinc-300 dark:bg-zinc-700 lg:block"
          style={{
            left: "calc(2.5rem + (100% - 2.5rem + 2rem) / 2)",
          }}
        />
        <div className="relative z-[2] grid items-start gap-x-8 gap-y-6 lg:grid-cols-2 lg:gap-y-0">
          <div className="mx-auto w-full max-w-[calc(100%-1.25rem-40px)] space-y-6 text-center lg:mx-0 lg:text-left">
            <h1 className="heading-h1">
              Ship documentation,
              <br className="hidden sm:inline" /> like you ship{" "}
              <span className="font-mono text-marketing-accent">code</span>.
            </h1>
            <p className="text-base font-light text-muted-foreground/70">
              Publish beautiful documentation instantly from your editor. Markdown,
              GitHub, and a workflow that feels as natural as committing code.
            </p>
          </div>

          <div
            className={cn(
              "relative w-full min-w-0",
              /* Bleed to Card padding — matches `p-6 sm:p-8 md:p-10` on parent Card */
              "-mx-6 sm:-mx-8 md:-mx-10",
              /* Desktop: align with card top; right edge via `lg:pr-0` on Card */
              "lg:mx-0 lg:-mt-10",
            )}
          >
            <div className="relative w-full overflow-hidden rounded-none">
              <video
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="metadata"
                className="relative z-0 block h-auto w-full max-w-full object-contain object-center"
                poster="/_docs.page/social-preview.png"
              >
                <source
                  src="/_docs.page/docs-page-hero-video.webm#t=1"
                  type="video/webm"
                />
              </video>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-10 bg-marketing-hero-video-tint/8 dark:bg-marketing-hero-video-tint-dark/10"
              />
            </div>
          </div>

          <div className="flex w-full items-center justify-end py-4 sm:py-5 md:py-6 pr-4 sm:pr-5 md:pr-6 lg:col-start-2">
            <Link
              href={LINKS.getStarted}
              className={buttonVariants({
                variant: "primary",
                size: "lg",
              })}
            >
              Start for free
              <ChevronRightIcon aria-hidden />
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
