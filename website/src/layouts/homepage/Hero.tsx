import { ChevronRightIcon } from "lucide-react";

import { Link } from "~/components/Link";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

export function Hero() {
  return (
    <section className="mx-auto min-w-0 w-full max-w-6xl overflow-x-clip px-4">
      <Card
        className={cn(
          platformCardVariants(),
          /* Clip horizontal bleed; keep vertical visible for focus rings / video controls. */
          "relative gap-0 overflow-x-clip overflow-y-visible",
          /* Stack under header Card: drop top border so only the header’s bottom rule shows (no 2px seam). */
          "border-t-0",
          /* Top/left; copy column adds its own bottom padding (CTA moved under headline). */
          "pt-6 pl-6 pr-6 pb-0 sm:pt-8 sm:pl-8 sm:pr-8 md:pt-10 md:pl-10 md:pr-10 lg:pr-0",
          "text-foreground",
        )}
      >
        {/*
          Full-height rule between copy and media — absolute so it matches the grid column edge
          (video + optional taller copy column). Position = left edge of col 2.
        */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-[1] hidden w-px bg-border lg:block"
          style={{
            left: "calc(2.5rem + (100% - 2.5rem + 2rem) / 2)",
          }}
        />
        {/*
          minmax(0,1fr) + min-w-0 on copy: grid items default to min-width:auto, so large display
          type can refuse to shrink and spill past the page rails / inner guide.
        */}
        <div className="relative z-[2] grid min-w-0 w-full grid-cols-1 items-start gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-y-0">
          <div className="min-w-0 w-full space-y-6 pb-6 text-left lg:min-h-0">
            <h1 className="heading-h1 break-words">
              Ship documentation,
              <br className="hidden sm:inline" /> like you ship{" "}
              <span className="font-mono text-marketing-accent">code</span>.
            </h1>
            <p className="max-w-md text-base font-light text-zinc-600 dark:text-zinc-300/80">
              Publish beautiful documentation instantly from your editor.
              Markdown, GitHub, and a workflow that feels as natural as
              committing code.
            </p>
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

          <div
            className={cn(
              "relative min-w-0 max-w-none justify-self-stretch",
              /*
               * Full-bleed within the Card: `w-full` + negative margin does NOT widen the border box,
               * so rules stop short. Use explicit width = 100% + horizontal padding (matches Card pl/pr).
               */
              "max-lg:w-[calc(100%+3rem)] max-lg:-mx-6",
              "sm:max-lg:w-[calc(100%+4rem)] sm:max-lg:-mx-8",
              "md:max-lg:w-[calc(100%+5rem)] md:max-lg:-mx-10",
              "lg:w-full lg:mx-0 lg:-mt-10",
              /* Two-column layout: keep the video vertically centred when copy is taller than the frame */
              "lg:self-center",
              /* Stacked: 1px rails; inner uses mx-auto so video centres in the full-bleed band */
              "max-lg:flex max-lg:flex-col max-lg:gap-0 max-lg:leading-none",
              "max-lg:border-y max-lg:border-solid max-lg:border-border",
            )}
          >
            <div
              className={cn(
                "w-full max-lg:mx-auto max-lg:max-w-2xl max-lg:shrink-0 max-lg:pt-0",
                "lg:max-w-none",
              )}
            >
              <div className="relative flex w-full items-start justify-center overflow-hidden rounded-none leading-none">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                  preload="metadata"
                  className="relative z-0 m-0 block h-auto w-full max-w-full object-contain max-lg:object-top lg:object-center"
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
          </div>
        </div>
      </Card>
    </section>
  );
}
