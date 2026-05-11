import { ChevronRightIcon } from "lucide-react";

import { Link } from "~/components/Link";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

import { HeroHeadingDots } from "./HeroHeadingDots";
import { HeroInitCommand } from "./HeroInitCommand";
import { HeroPreview } from "./HeroPreview";
import { platformCardVariants } from "./platformCardSurface";

export function Hero() {
  return (
    <section className="mx-auto min-w-0 w-full max-w-8xl overflow-x-clip overflow-y-visible px-4 lg:overflow-x-visible">
      <Card
        className={cn(
          platformCardVariants(),
          "relative",
          "border-b-0 border-t-0",
          "py-0 px-6 sm:px-8 md:px-10",
          "text-foreground",
          "!overflow-visible",
        )}
      >
        <div className="relative z-[2] mx-auto w-full min-w-0 max-w-3xl text-center pt-10 pb-2 sm:pt-12 sm:pb-3 md:pt-14 md:pb-4">
          <div className="flex flex-col gap-4 overflow-visible sm:gap-5">
            <HeroHeadingDots>
              <h1 className="hero-text-opacity-mask heading-h1 font-light mx-auto w-max max-w-full text-center text-4xl md:text-5xl lg:text-6xl">
                <span className="text-primary inline-block max-w-full lg:whitespace-nowrap">
                  Agent-ready
                </span>
                <span className="block lg:whitespace-nowrap">documentation</span>
                <span className="block lg:whitespace-nowrap">for developers</span>
              </h1>
            </HeroHeadingDots>
            <p className="mx-auto text-base font-light leading-relaxed text-zinc-600 dark:text-zinc-300/80">
              Turn your repo into docs for developers and agents,
              <br />
              with built-in machine-readable endpoints.
            </p>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-5">
            <Link
              href={LINKS.getStarted}
              className={buttonVariants({
                variant: "primary",
              })}
            >
              Get started
              <ChevronRightIcon aria-hidden />
            </Link>
            <HeroInitCommand />
          </div>
        </div>
        <div className="mt-8 md:mt-12">
          <HeroPreview />
        </div>
      </Card>
    </section>
  );
}
