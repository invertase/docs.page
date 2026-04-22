import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { LINKS } from "~/constants/links";

export function PricingCta() {
  return (
    <section
      className="mx-auto w-full min-w-0 max-w-8xl px-4"
      aria-labelledby="pricing-heading"
    >
      <div className="border-t border-border pt-8 pb-6 md:pb-8">
        <p
          id="pricing-heading"
          className="text-center font-heading text-lg font-medium leading-snug text-balance text-foreground sm:text-xl"
        >
          Free to use. No credit card. No paywalls.
        </p>

        <section
          aria-labelledby="pricing-cta-heading"
          className="mt-8 border-t border-border pt-8 pl-6 sm:pl-8 md:pl-10 md:mt-10 md:pt-10"
        >
          <div className="flex min-w-0 flex-col gap-6">
            <h3
              id="pricing-cta-heading"
              className="heading-h2 break-words text-left text-balance"
            >
              Start publishing{" "}
              <span className="font-mono text-marketing-accent">today</span>
            </h3>
            <p className="break-words text-left text-sm font-light leading-snug text-zinc-600 dark:text-zinc-300/80 sm:text-base">
              Begin publishing your great documentation now.
            </p>
          </div>
          <div className="mt-6 flex w-full min-w-0 justify-start sm:mt-8">
            <Link
              href={LINKS.getStarted}
              className={buttonVariants({
                variant: "primary",
              })}
            >
              Start publishing for free
              <ChevronRightIcon aria-hidden />
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
