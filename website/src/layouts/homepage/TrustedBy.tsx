import { StarIcon } from "lucide-react";
import type { CSSProperties } from "react";

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
  coral: "text-coral",
  warmOrange: "text-warm-orange",
  teal: "text-teal-500",
  lavender: "text-lavender-500",
  primary: "text-primary",
};

const trustedByDotColorVar: Record<TrustedByNameColor, string> = {
  coral: "--color-brand-coral-red",
  warmOrange: "--color-brand-warm-orange",
  teal: "--color-emerald-500",
  lavender: "--color-lavender-500",
  primary: "--primary",
};

const projects: {
  name: string;
  href: string;
  stars: string;
  nameColor: TrustedByNameColor;
}[] = [
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
  {
    name: "Widgetbook",
    href: "https://github.com/widgetbook/widgetbook",
    stars: "900",
    nameColor: "lavender",
  },
];

export function TrustedBy({ embedded = false }: { embedded?: boolean }) {
  return (
    <section
      className={cn(
        "w-full min-w-0",
        embedded ? "px-0" : "mx-auto max-w-8xl px-4",
      )}
      aria-labelledby="trusted-by-heading"
    >
      <div
        className={cn(
          platformCardVariants(),
          "relative border-x border-border bg-transparent shadow-none dark:shadow-none",
          "grid w-full min-h-0 min-w-0 grid-cols-1 overflow-hidden",
          "min-h-28 border-t border-border marketingNav:min-h-36",
          "marketingNav:grid-cols-[auto_1fr] marketingNav:items-stretch",
        )}
      >
        <div
          className={cn(
            "flex h-full min-h-0 w-full min-w-0 self-stretch items-center justify-center px-6",
            "border-b border-border bg-black/40 backdrop-blur-lg marketingNav:justify-start marketingNav:w-max marketingNav:max-w-sm marketingNav:border-b-0 marketingNav:border-r marketingNav:border-border dark:bg-black/40",
            "py-6 marketingNav:py-0 marketingNav:pl-8 marketingNav:pr-5 md:max-w-md md:pl-10 md:pr-6",
          )}
        >
          <div className="flex w-full justify-center marketingNav:w-max marketingNav:justify-start">
            <h2
              id="trusted-by-heading"
              className="max-w-full text-balance text-center font-marketing-heading text-xl font-light leading-snug text-foreground marketingNav:w-max marketingNav:max-w-[20rem] marketingNav:text-left marketingNav:text-2xl md:max-w-[22rem]"
            >
              Explore <span className="font-medium">open-source</span> projects
              powered by docs.page
            </h2>
          </div>
        </div>
        <div
          className={cn(
            "h-auto w-full min-h-0 min-w-0 overflow-hidden bg-black/70 p-0 backdrop-blur-lg marketingNav:min-h-0 marketingNav:h-full marketingNav:min-w-0 dark:bg-black/70",
          )}
        >
          <ul
            className={cn(
              "h-auto min-h-0 w-full max-w-full list-none",
              "grid grid-cols-2 [grid-template-rows:minmax(0,1fr)] gap-0 divide-x divide-y divide-border max-marketingNav:divide-y marketingNav:grid-cols-4 marketingNav:min-h-0 marketingNav:h-full marketingNav:divide-y-0",
            )}
          >
            {projects.map((p) => (
              <li key={p.href} className="flex h-full min-h-0 min-w-0">
                <MarketingLink
                  href={p.href}
                  aria-label={`${p.name} on GitHub, ${p.stars}+ stars`}
                  className={cn(
                    "trusted-by-project-link relative box-border flex h-full min-h-0 w-full min-w-0 flex-col justify-between gap-3",
                    "min-h-[7.5rem] px-4 py-5 marketingNav:min-h-0 marketingNav:gap-2 marketingNav:px-3 marketingNav:py-4 md:px-3.5 md:py-5",
                    "text-foreground transition-colors",
                  )}
                  style={
                    {
                      "--trusted-by-dot-color": `var(${trustedByDotColorVar[p.nameColor]})`,
                    } as CSSProperties
                  }
                >
                  <span
                    className={cn(
                      "relative z-[1] line-clamp-2 min-w-0 text-left font-mono text-sm font-medium leading-snug marketingNav:text-xs md:text-sm",
                      trustedByNameColorClass[p.nameColor],
                    )}
                  >
                    {p.name}
                  </span>
                  <span className="relative z-[1] flex min-w-0 items-center gap-1.5 text-neutral-500 dark:text-neutral-400">
                    <Icon
                      name="github"
                      size={17}
                      className="opacity-90 marketingNav:!text-[15px]"
                      aria-hidden
                    />
                    <StarIcon
                      className="size-4 shrink-0 opacity-80 marketingNav:size-3.5"
                      aria-hidden
                    />
                    <span className="font-mono text-sm font-light tabular-nums tracking-tight marketingNav:text-xs">
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
