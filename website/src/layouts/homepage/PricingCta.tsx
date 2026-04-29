import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { LINKS } from "~/constants/links";

export function PricingCta() {
  return (
    <section
      className="mx-auto w-full min-w-0 max-w-8xl px-4"
      aria-labelledby="pricing-cta-heading"
    >
      <div className="px-6 pt-24 pb-24 sm:px-8 md:px-10 md:pt-28 md:pb-28">
        <div className="flex min-w-0 flex-col items-center gap-6 text-center">
          <h3
            id="pricing-cta-heading"
            className="heading-h2 w-full text-balance break-words"
          >
            Built for the <br />
            open source community
          </h3>
          <p className="max-w-2xl text-sm font-light leading-snug text-zinc-600 break-words dark:text-zinc-300/80 sm:text-base">
            Begin publishing your great documentation now.
          </p>
        </div>
        <div className="mt-6 flex w-full min-w-0 justify-center sm:mt-8">
          <Link
            href={LINKS.getStarted}
            className={buttonVariants({
              variant: "primary",
            })}
          >
            Get started
            <ChevronRightIcon aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
