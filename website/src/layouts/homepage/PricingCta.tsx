import Image from "next/image";
import Link from "next/link";

import { ButtonChevron, buttonVariants } from "~/components/ui/button";
import logoIcon from "../../../public/_docs.page/assets/docs.page-update-2026/logo-icon.svg";
import { LINKS } from "~/constants/links";
import { platformCardVariants } from "~/layouts/homepage/platformCardSurface";
import { cn } from "~/lib/utils";

export function PricingCta({ embedded = false }: { embedded?: boolean }) {
  return (
    <section
      className={cn(
        "w-full min-w-0",
        embedded ? "px-0" : "mx-auto max-w-8xl px-4",
      )}
      aria-labelledby="pricing-cta-heading"
    >
      <div
        className={cn(
          platformCardVariants({ clip: "visible" }),
          "relative !bg-transparent shadow-none dark:!bg-transparent",
          "border-0 border-t-0 border-b border-border ring-0 !overflow-visible px-6 pt-16 pb-16 sm:px-8 md:px-10 md:pt-20 md:pb-20",
        )}
      >
        <div className="relative z-[1] mx-auto flex w-full min-w-0 max-w-6xl flex-col items-stretch gap-10 marketingNav:flex-row marketingNav:items-center marketingNav:gap-10 lg:gap-14">
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-visible max-marketingNav:pb-2 marketingNav:order-2 marketingNav:pb-0">
            <Image
              src={logoIcon}
              alt=""
              aria-hidden
              width={453}
              height={500}
              className="mx-auto h-[10rem] w-auto shrink-0 origin-center max-marketingNav:translate-x-0 max-marketingNav:translate-y-4 sm:h-[11rem] marketingNav:mx-0 marketingNav:h-[17.75rem] marketingNav:translate-x-9 marketingNav:translate-y-0 marketingNav:scale-[1.02] md:scale-[1.04] lg:scale-[1.06]"
            />
          </div>
          <div className="flex min-w-0 shrink-0 flex-col items-center justify-center gap-8 px-2 py-8 text-center marketingNav:order-1 marketingNav:gap-6 marketingNav:px-0 marketingNav:py-0 marketingNav:items-start marketingNav:justify-start marketingNav:text-left marketingNav:max-w-[min(100%,36rem)] md:gap-7">
            <h3
              id="pricing-cta-heading"
              className="font-marketing-heading flex flex-col gap-2 text-3xl font-light leading-snug text-balance text-foreground marketingNav:gap-3 marketingNav:leading-relaxed md:gap-4 md:text-4xl lg:text-5xl"
            >
              <span>Bring your docs</span>
              <span>
                into the{" "}
                <span className="font-medium text-neutral-950 dark:text-white">
                  agentic age
                </span>
              </span>
            </h3>
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
          </div>
        </div>
      </div>
    </section>
  );
}
