import { StarIcon } from "lucide-react";

import { Icon } from "~/components/Icon";
import { Link as MarketingLink } from "~/components/Link";
import { cn } from "~/lib/utils";

const trustedByCardFill =
  "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--color-black)_80%,#3B3B47_20%),var(--color-black))]";

const projects = [
  {
    name: "Melos",
    href: "https://github.com/invertase/melos",
    stars: "1k",
  },
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
    name: "Widgetbook",
    href: "https://github.com/widgetbook/widgetbook",
    stars: "900",
  },
] as const;

export function TrustedBy() {
  return (
    <section
      className="mx-auto w-full min-w-0 max-w-8xl px-4"
      aria-labelledby="trusted-by-heading"
    >
      <div className="pt-12 pb-10 md:pt-16 md:pb-12">
        <h2
          id="trusted-by-heading"
          className="text-center font-heading text-lg font-medium leading-snug text-balance text-foreground sm:text-xl"
        >
          Trusted by the teams behind
        </h2>
        <ul
          className={cn(
            "mt-8 grid w-full list-none sm:mt-10",
            "px-20",
            "grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4",
          )}
        >
          {projects.map((p) => (
            <li key={p.href} className="min-w-0">
              <MarketingLink
                href={p.href}
                aria-label={`${p.name} on GitHub, ${p.stars}+ stars`}
                className={cn(
                  "flex h-full min-h-0 min-w-0 items-center justify-between gap-2 rounded-lg border border-white/10 shadow-sm",
                  "px-3 py-2.5 transition-colors hover:border-white/20 sm:gap-3 sm:px-4 sm:py-3",
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
      </div>
    </section>
  );
}
