import Link from "next/link";

import { ButtonChevron, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

import { FeatureCardPaperCorner } from "./FeatureCardPaperCorner";
import { HeroHeadingDots } from "./HeroHeadingDots";
import { HeroInitCommand } from "./HeroInitCommand";

export function Hero() {
  return (
    <div className="relative w-full overflow-visible">
      <section className="relative z-[2] mx-auto min-w-0 w-full max-w-8xl overflow-visible px-4">
        <div className="relative">
          <Card
            className={cn(
              "group gap-0 rounded-none py-0 !ring-0",
              "relative !overflow-visible !bg-transparent !shadow-none",
              "border-0 !ring-0",
              "py-0 px-6 sm:px-8 md:px-10",
              "text-foreground",
            )}
          >
            <FeatureCardPaperCorner corner="bottom-left" />
            <div className="relative z-[2] w-full min-w-0 text-center px-0 py-14 sm:py-16 md:py-18">
              <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 overflow-visible sm:gap-6 md:gap-7">
                <div className="hero-tagline-pill mx-auto w-max max-w-[38rem]">
                  <p className="hero-tagline-neutral-fade px-2.5 py-0.5 text-base font-light leading-relaxed sm:px-3.5 sm:py-1">
                    Free and open-source
                  </p>
                </div>
                <HeroHeadingDots className="w-full">
                  <div className="relative z-[2] mx-auto max-w-3xl overflow-visible">
                    <h1 className="heading-h1-hero mx-auto flex w-max max-w-full flex-col items-center gap-0 overflow-visible text-center max-marketingNav:text-5xl sm:max-marketingNav:text-6xl">
                      <span className="inline-block max-w-full font-light leading-none text-neutral-950 dark:text-white lg:whitespace-nowrap">
                        Docs for
                      </span>
                      <span className="block max-w-full overflow-visible font-normal leading-none text-neutral-950 dark:text-white [line-height:1.22] -mt-[0.08em] md:[line-height:1.23] lg:whitespace-nowrap lg:[line-height:1.26]">
                        humans<span className="px-[0.2em]">+</span>agents
                      </span>
                    </h1>
                  </div>
                </HeroHeadingDots>
                <p className="mx-auto max-w-[38rem] text-base font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Instantly{" "}
                  <span className="text-honey-500">serve markdown</span> from
                  any GitHub branch as modern, agent-ready docs, with AI chat,
                  MCP, and llms.txt.
                </p>
                <div className="mx-auto mt-4 flex w-max max-w-full flex-row flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:mt-5 md:mt-6">
                  <Link
                    href={LINKS.getStarted}
                    className={buttonVariants({
                      variant: "primary",
                      size: "lg",
                    })}
                  >
                    Get started
                    <ButtonChevron size="lg" />
                  </Link>
                  <div className="flex h-12 min-h-12 items-center rounded-xl border border-honey-500 bg-black/70 px-3 pr-2.5">
                    <HeroInitCommand />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
