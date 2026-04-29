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
    <section className="mx-auto min-w-0 w-full max-w-8xl overflow-x-clip px-4 lg:overflow-x-visible">
      <Card
        className={cn(
          platformCardVariants(),
          "relative",
          "border-b-0 border-t-0",
          "py-0 px-6 sm:px-8 md:px-10",
          "text-foreground",
        )}
      >
        <div className="relative z-[2] mx-auto w-full min-w-0 max-w-3xl text-center pt-12 sm:pt-14 md:pt-16">
          <div className="flex flex-col gap-6 sm:gap-7">
            <HeroHeadingDots>
              <h1 className="heading-h1">
                <span className="block text-primary lg:whitespace-nowrap">
                  Agent-ready
                </span>
                <span className="block lg:whitespace-nowrap">documentation</span>
                <span className="block lg:whitespace-nowrap">for developers</span>
              </h1>
            </HeroHeadingDots>
            <p
              className={cn(
                "mx-auto text-base font-light leading-relaxed text-zinc-600 dark:text-zinc-300/80",
              )}
            >
              Turn your repo into docs for developers and agents,
              <br />
              with built-in machine-readable endpoints.
            </p>
          </div>
          <div className="mt-8 flex flex-col items-center justify-center gap-5 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-6">
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
        <div className="mt-10 md:mt-14">
          <HeroPreview />
        </div>
      </Card>
    </section>
  );
}
