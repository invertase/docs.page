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
        <div className="relative z-[2] w-full min-w-0">
          <div
            className={cn(
              "relative z-20 w-full min-w-0 space-y-6 text-left",
              "max-w-3xl",
            )}
          >
            <h1 className="heading-h1">
              <span className="block lg:whitespace-nowrap">
                Build and publish AI-ready
              </span>
              <span className="block lg:whitespace-nowrap">
                documentation from your
              </span>
              <span className="block lg:whitespace-nowrap">
                GitHub repository.
              </span>
            </h1>
            <p
              className={cn(
                "text-base font-light leading-relaxed text-zinc-600 dark:text-zinc-300/80",
                "max-w-none",
              )}
            >
              <strong className="font-bold text-zinc-700 dark:text-zinc-200/90">
                docs.page
              </strong>{" "}
              transforms your GitHub repository into a refined documentation
              interface. Serve developers in the browser and AI agents via native
              machine-readable endpoints - all with zero platform overhead.
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
