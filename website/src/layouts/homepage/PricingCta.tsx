import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import logoIcon from "../../../public/_docs.page/assets/v4/logo-icon.svg";
import hexagonBg from "../../../public/_docs.page/assets/v4/hexagon-bg.svg";
import { LINKS } from "~/constants/links";
import { platformCardVariants } from "~/layouts/homepage/platformCardSurface";
import { cn } from "~/lib/utils";

export function PricingCta() {
  return (
    <section
      className="mx-auto w-full min-w-0 max-w-8xl px-4"
      aria-labelledby="pricing-cta-heading"
    >
      <div
        className={cn(
          platformCardVariants({ clip: "visible" }),
          "relative",
          "border-t-0 !overflow-visible px-6 pt-16 pb-16 sm:px-8 md:px-10 md:pt-20 md:pb-20",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          aria-hidden
        >
          <Image
            src={hexagonBg}
            alt=""
            width={1373}
            height={1514}
            className="absolute right-0 top-[18%] h-[min(29.6rem,63.5vw)] w-auto max-w-none translate-x-[8%] opacity-[0.78] sm:top-[16%] sm:h-[min(31.7rem,68.7vw)] sm:translate-x-[9%] md:top-[13%] lg:top-[11%] lg:h-[33.8rem] lg:translate-x-[10%]"
          />
        </div>
        <div className="relative z-[1] mx-auto flex w-full min-w-0 max-w-6xl flex-col items-stretch gap-8 sm:flex-row sm:items-center sm:gap-10 lg:gap-14">
          <div className="flex min-w-0 shrink-0 flex-col items-start gap-6 text-left sm:max-w-[min(100%,28rem)]">
            <h3
              id="pricing-cta-heading"
              className="heading-h2 w-full font-light text-balance break-words"
            >
              Built for the <br />
              open source community
            </h3>
            <p className="max-w-none text-sm font-light leading-snug whitespace-nowrap text-gray-500 dark:text-gray-400 sm:text-base">
              Bring your docs into the agentic age, for free.
            </p>
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
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-visible sm:justify-center">
            <Image
              src={logoIcon}
              alt=""
              aria-hidden
              width={453}
              height={500}
              className="h-[17.75rem] w-auto shrink-0 origin-center translate-x-4 sm:translate-x-5 sm:scale-[1.02] md:scale-[1.04] lg:scale-[1.06]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
