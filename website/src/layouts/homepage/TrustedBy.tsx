import { StarIcon } from "lucide-react";

import { Icon } from "~/components/Icon";
import { Link as MarketingLink } from "~/components/Link";
import { cn } from "~/lib/utils";

import { platformCardVariants } from "./platformCardSurface";

type TrustedByNameColor =
  | "coral"
  | "warmOrange"
  | "teal"
  | "lavender"
  | "primary";

const trustedByNameColorClass: Record<TrustedByNameColor, string> = {
  coral: "text-[hsl(var(--color-brand-coral-red))]",
  warmOrange: "text-[hsl(var(--color-brand-warm-orange))]",
  teal: "text-[hsl(var(--color-brand-teal))]",
  lavender: "text-[hsl(var(--color-brand-lavender))]",
  primary: "text-primary",
};

const projects: {
  name: string;
  href: string;
  stars: string;
  nameColor: TrustedByNameColor;
}[] = [
  {
    name: "Widgetbook",
    href: "https://github.com/widgetbook/widgetbook",
    stars: "900",
    nameColor: "lavender",
  },
  {
    name: "React Native Firebase",
    href: "https://github.com/invertase/react-native-firebase",
    stars: "12k",
    nameColor: "warmOrange",
  },
  {
    name: "Jaspr",
    href: "https://github.com/schultek/jaspr",
    stars: "2k",
    nameColor: "teal",
  },
  {
    name: "Melos",
    href: "https://github.com/invertase/melos",
    stars: "1k",
    nameColor: "coral",
  },
];

export function TrustedBy() {
  return (
    <section
      className="mx-auto w-full min-w-0 max-w-8xl px-4"
      aria-labelledby="trusted-by-heading"
    >
      <div
        className={cn(
          "grid w-full min-h-0 min-w-0 grid-cols-1",
          "min-h-32 sm:min-h-36",
          "sm:grid-cols-[minmax(0,11.25rem)_1fr] sm:items-stretch md:grid-cols-[minmax(0,12.5rem)_1fr] lg:grid-cols-[minmax(0,15rem)_1fr] xl:grid-cols-[minmax(0,17.5rem)_1fr]",
        )}
      >
          <div
            className={cn(
              platformCardVariants(),
              "flex h-full min-h-0 w-full min-w-0 self-stretch items-center justify-center",
              "border-b-0 sm:border-b",
              "px-3 py-4 sm:px-3 sm:py-0 sm:pr-5 md:px-4 md:pr-7 lg:px-5 lg:pr-10 xl:pr-12",
            )}
          >
            <div className="flex w-full justify-center sm:justify-end">
              <h2
                id="trusted-by-heading"
                className="w-max max-w-full text-balance text-center font-heading text-lg font-light leading-snug text-foreground sm:text-left sm:text-lg md:text-xl"
              >
                Trusted by the teams behind
              </h2>
            </div>
          </div>
          <div
            className={cn(
              platformCardVariants(),
              "h-auto w-full min-h-0 min-w-0 overflow-hidden p-0 sm:min-w-0 sm:min-h-0 sm:h-full",
              "sm:border-l-0",
            )}
          >
            <ul
              className={cn(
                "h-auto w-full min-w-0 min-h-0 list-none",
                "grid grid-cols-4 [grid-template-rows:minmax(0,1fr)] gap-0 divide-x divide-border",
                "sm:min-h-0 sm:h-full",
              )}
            >
              {projects.map((p) => (
                <li
                  key={p.href}
                  className="flex h-full min-h-0 min-w-0"
                >
                  <MarketingLink
                    href={p.href}
                    aria-label={`${p.name} on GitHub, ${p.stars}+ stars`}
                    className={cn(
                      "trusted-by-project-link box-border flex h-full min-h-0 w-full min-w-0 flex-col justify-between gap-4 sm:gap-3",
                      "min-h-[5.75rem] px-2.5 py-4 transition-colors sm:min-h-0 sm:px-2.5 sm:py-3 md:px-3.5 lg:px-4 xl:px-5",
                      "text-foreground hover:bg-foreground/[0.02]",
                      "[&>*]:relative [&>*]:z-[1]",
                    )}
                  >
                    <span
                      className={cn(
                        "line-clamp-2 min-w-0 text-left font-mono text-sm font-medium leading-snug md:text-base lg:text-lg",
                        trustedByNameColorClass[p.nameColor],
                      )}
                    >
                      {p.name}
                    </span>
                    <span
                      className="flex min-w-0 items-center gap-1.5 text-zinc-500 dark:text-zinc-400"
                    >
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
          </div>
        </div>
    </section>
  );
}
