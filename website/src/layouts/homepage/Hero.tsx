import { ChevronRightIcon } from "lucide-react";

import { Link } from "~/components/Link";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

export function Hero() {
  return (
    <section className="mx-auto min-w-0 w-full max-w-8xl overflow-x-clip px-4 lg:overflow-x-visible">
      <Card
        className={cn(
          platformCardVariants(),
          "relative !overflow-visible",
          "border-t-0",
          "p-6 sm:p-8 md:p-10",
          "text-foreground",
        )}
      >
        {/* Full-height vertical rule along the right edge of the `max-w-3xl` text column. */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 z-[1] w-px bg-border",
            "left-[calc(1.5rem+min(100%_-_3rem,48rem))] sm:left-[calc(2rem+min(100%_-_4rem,48rem))] md:left-[calc(2.5rem+min(100%_-_5rem,48rem))]",
          )}
        />
        <div className="relative z-[2] w-full min-w-0">
          <div
            className={cn(
              "relative z-20 w-full min-w-0 max-w-3xl space-y-6 text-left",
              "pr-6 sm:pr-8 md:pr-10",
            )}
          >
            <h1 className="heading-h1">
              <span className="block lg:whitespace-nowrap">Agent-ready</span>
              <span className="block lg:whitespace-nowrap">documentation</span>
              <span className="block lg:whitespace-nowrap">for developers</span>
            </h1>
            <p
              className={cn(
                "text-base font-light leading-relaxed text-zinc-600 dark:text-zinc-300/80",
                "max-w-none",
              )}
            >
              Turn your repo into docs for developers and agents,
              <br />
              with built-in machine-readable endpoints.
            </p>
            <Link
              href={LINKS.getStarted}
              className={buttonVariants({
                variant: "primary",
              })}
            >
              Start Publishing for Free
              <ChevronRightIcon aria-hidden />
            </Link>
          </div>
        </div>
      </Card>
    </section>
  );
}
