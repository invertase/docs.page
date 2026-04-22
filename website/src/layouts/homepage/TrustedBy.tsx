import { ChevronRightIcon, StarIcon } from "lucide-react";
import Link from "next/link";

import { Icon } from "~/components/Icon";
import { Link as MarketingLink } from "~/components/Link";
import { buttonVariants } from "~/components/ui/button";
import { LINKS } from "~/constants/links";
import { cn } from "~/lib/utils";

const trustedByCardFill =
  "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-black)_80%,#3B3B47_20%),var(--color-black))]";

const projects = [
  {
    name: "React Native Firebase",
    href: "https://github.com/invertase/react-native-firebase",
    stars: "12k",
  },
  {
    name: "Jaspr",
    href: "https://github.com/schultek/jaspr",
    stars: "2k",
  },
  {
    name: "Melos",
    href: "https://github.com/invertase/melos",
    stars: "1k",
  },
  {
    name: "Patrol",
    href: "https://github.com/leancodepl/patrol",
    stars: "1k",
  },
  {
    name: "Widgetbook",
    href: "https://github.com/widgetbook/widgetbook",
    stars: "900",
  },
] as const;

export function TrustedBy() {
  return (
    <section
      className="mx-auto max-w-6xl px-4"
      aria-label="Trusted by and pricing"
    >
      <div className={cn("relative pt-8 pb-6 md:pb-8")}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-0 hidden w-px -translate-x-1/2 bg-border md:block"
        />
        <div
          className={cn(
            "relative z-[1] grid min-w-0 grid-cols-1 divide-y divide-border",
            "md:grid-cols-2 md:grid-rows-1 md:items-stretch md:divide-y-0",
          )}
        >
          <section
            aria-labelledby="trusted-by-heading"
            className="min-w-0 pb-8 pl-6 sm:pl-8 md:pb-0 md:pl-10 md:pr-8 lg:pr-10"
          >
            <h2
              id="trusted-by-heading"
              className="font-heading text-lg font-medium leading-snug text-balance text-foreground sm:text-xl"
            >
              Trusted by the teams behind
            </h2>
            <ul className="mt-4 flex list-none flex-col gap-2">
              {projects.map((p) => (
                <li key={p.href}>
                  <MarketingLink
                    href={p.href}
                    aria-label={`${p.name} on GitHub, ${p.stars}+ stars`}
                    className={cn(
                      "flex min-w-0 items-center justify-between gap-3 rounded-lg border border-white/10 shadow-sm",
                      "px-3 py-2.5 transition-colors hover:border-white/20 sm:px-4 sm:py-3",
                      trustedByCardFill,
                    )}
                  >
                    <span className="min-w-0 truncate font-mono text-sm font-light text-primary">
                      {p.name}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-zinc-400">
                      <Icon
                        name="github"
                        size={15}
                        className="opacity-90"
                        aria-hidden
                      />
                      <StarIcon
                        className="size-3.5 shrink-0 opacity-80"
                        aria-hidden
                      />
                      <span className="font-mono text-xs font-light tabular-nums tracking-tight">
                        {p.stars}+
                      </span>
                    </span>
                  </MarketingLink>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="pricing-heading"
            className="flex min-w-0 flex-col pt-8 md:h-full md:min-h-0 md:pt-0 md:pl-8 lg:pl-10"
          >
            <p
              id="pricing-heading"
              className="shrink-0 font-heading text-lg font-medium leading-snug text-balance text-foreground sm:text-xl"
            >
              Free to use. No credit card. No paywalls.
            </p>

            <section
              aria-labelledby="pricing-cta-heading"
              className={cn(
                "mt-8 flex min-h-0 min-w-0 flex-1 flex-col border-t border-border pt-8 md:mt-10 md:pt-10",
                /* Full column width so the rule meets the center vertical divider (parent has pl-8 / pl-10). */
                "md:-ml-8 md:w-[calc(100%+2rem)] md:pl-8",
                "lg:-ml-10 lg:w-[calc(100%+2.5rem)] lg:pl-10",
              )}
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
              <div className="mt-auto flex w-full min-w-0 justify-start pt-0">
                <Link
                  href={LINKS.getStarted}
                  className={buttonVariants({
                    variant: "primary",
                    size: "lg",
                  })}
                >
                  Start publishing for free
                  <ChevronRightIcon aria-hidden />
                </Link>
              </div>
            </section>
          </section>
        </div>
      </div>
    </section>
  );
}
