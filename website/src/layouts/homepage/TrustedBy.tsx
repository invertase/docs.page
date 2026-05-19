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
          platformCardVariants(),
          "grid w-full min-h-0 min-w-0 grid-cols-1 overflow-hidden",
          "min-h-24 border-t-0 sm:min-h-28",
          "sm:grid-cols-[minmax(0,1fr)_auto] sm:items-stretch",
        )}
      >
          <div
            className={cn(
              "flex h-full min-h-0 w-full min-w-0 self-stretch items-center justify-center",
              "border-b border-border sm:border-b-0 sm:border-r sm:border-border",
              "px-3 py-4 sm:px-3 sm:py-0 sm:pr-5 md:px-4 md:pr-7 lg:px-5 lg:pr-10 xl:pr-12",
            )}
          >
            <div className="flex w-full justify-center">
              <h2
                id="trusted-by-heading"
                className="w-max max-w-full text-balance text-center font-marketing-heading text-xl font-light leading-snug text-foreground sm:text-2xl"
              >
                Used in established open-source projects
              </h2>
            </div>
          </div>
          <div
            className={cn(
              "h-auto w-full min-h-0 min-w-0 overflow-hidden p-0 sm:w-auto sm:min-w-0 sm:min-h-0 sm:h-full",
            )}
          >
            <ul
              className={cn(
                "h-auto min-h-0 w-fit max-w-full list-none",
                "grid grid-cols-2 [grid-template-rows:minmax(0,1fr)] gap-0 divide-x divide-border sm:grid-cols-[repeat(4,minmax(0,12.5rem))] sm:min-h-0 sm:h-full md:grid-cols-[repeat(4,minmax(0,13rem))]",
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
                      "trusted-by-project-link box-border flex h-full min-h-0 w-full min-w-0 flex-col justify-between gap-2",
                      "min-h-[4.25rem] px-2.5 py-3 transition-colors sm:min-h-0 sm:px-3 sm:py-2.5 md:px-3.5 md:py-3",
                      "text-foreground hover:bg-foreground/[0.02]",
                      "[&>*]:relative [&>*]:z-[1]",
                    )}
                  >
                    <span
                      className={cn(
                        "line-clamp-2 min-w-0 text-left font-mono text-xs font-medium leading-snug md:text-sm",
                        trustedByNameColorClass[p.nameColor],
                      )}
                    >
                      {p.name}
                    </span>
                    <span
                      className="flex min-w-0 items-center gap-1.5 text-gray-500 dark:text-gray-400"
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
