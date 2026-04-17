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
        <div className="relative z-[2] grid min-w-0 w-full items-start gap-x-8 gap-y-6 lg:grid-cols-2 lg:gap-y-0">
          <div className="w-full space-y-6 text-left">
            <h1 className="heading-h1">
              Ship documentation,
              <br className="hidden sm:inline" /> like you ship{" "}
              <span className="font-mono text-marketing-accent">code</span>.
            </h1>
            <p className="text-base font-light text-muted-foreground/70">
              Publish beautiful documentation instantly from your editor.
              Markdown, GitHub, and a workflow that feels as natural as
              committing code.
            </p>
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
              "max-lg:border-y max-lg:border-solid max-lg:border-zinc-300 max-lg:dark:border-zinc-700",
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

          <div
            className={cn(
              "flex w-full items-center justify-start max-lg:pr-0",
              /* Stacked: grid gap-y-6 already separates video → CTA; extra py-top doubled the space above the button */
              "max-lg:pt-0 max-lg:pb-6",
              /* Two columns: gap-y-0 — use symmetric padding inside the CTA row */
              "lg:col-start-2 lg:justify-end lg:pr-6 lg:py-6",
            )}
          >
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
