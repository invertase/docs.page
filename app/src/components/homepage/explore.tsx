import { RiGithubLine, RiStarLine } from "@remixicon/react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

import styles from "./homepage.module.css";

type ExploreProjectColor = "warmOrange" | "teal" | "coral" | "lavender";

const exploreTitleClass: Record<ExploreProjectColor, string> = {
  warmOrange: "text-warm-orange",
  teal: "text-brand-teal",
  coral: "text-coral",
  lavender: "text-lavender",
};

const exploreDotColorVar: Record<ExploreProjectColor, string> = {
  warmOrange: "var(--color-warm-orange)",
  teal: "var(--color-brand-teal)",
  coral: "var(--color-coral)",
  lavender: "var(--color-lavender)",
};

const EXPLORE_PROJECTS = [
  {
    href: "https://github.com/invertase/react-native-firebase",
    title: "React Native Firebase",
    noTitleClamp: true,
    color: "warmOrange",
    stars: "12k+",
  },
  {
    href: "https://github.com/schultek/jaspr",
    title: "Jaspr",
    color: "teal",
    stars: "2k+",
  },
  {
    href: "https://github.com/invertase/melos",
    title: "Melos",
    color: "coral",
    stars: "1k+",
  },
  {
    href: "https://github.com/widgetbook/widgetbook",
    title: "Widgetbook",
    color: "lavender",
    stars: "900+",
  },
] as const satisfies ReadonlyArray<{
  href: string;
  title: string;
  noTitleClamp?: boolean;
  color: ExploreProjectColor;
  stars: string;
}>;

export function Explore() {
  return (
    <section
      className={cn(
        "grid w-full min-w-0 grid-cols-1 overflow-hidden border-t border-border",
        "min-h-28 lg:min-h-52 lg:grid-cols-[auto_1fr] lg:items-stretch",
        styles.homepageBorderT,
      )}
      aria-labelledby="explore-heading"
    >
      <div
        className={cn(
          "flex h-full min-h-0 w-full min-w-0 self-stretch items-center justify-center border-b border-border bg-black/50 px-6 py-6 backdrop-blur-lg",
          "lg:min-h-full lg:max-w-md lg:justify-start lg:border-r lg:border-b-0 lg:px-10 lg:py-8",
        )}
      >
        <p
          id="explore-heading"
          className="max-w-full text-balance text-center text-2xl font-light font-heading text-neutral-300 lg:text-left lg:text-3xl"
        >
          Explore <b>open-source</b> projects powered by docs.page
        </p>
      </div>
      <div className="h-auto min-h-0 min-w-0 overflow-hidden bg-black/70 backdrop-blur-lg lg:h-full lg:min-h-full">
        <ul
          className={cn(
            "grid h-auto min-h-0 w-full max-w-full list-none grid-cols-2",
            "[grid-template-rows:minmax(0,1fr)] divide-x divide-y divide-border",
            "lg:h-full lg:grid-cols-4 lg:divide-y-0",
          )}
        >
          {EXPLORE_PROJECTS.map((project) => (
            <li key={project.href} className="flex h-full min-h-0 min-w-0">
              <Project {...project} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Project(props: {
  href: string;
  title: string;
  noTitleClamp?: boolean;
  color: ExploreProjectColor;
  stars: string;
}) {
  return (
    <Link
      href={props.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${props.title} on GitHub, ${props.stars} stars`}
      className="group relative box-border flex h-full min-h-30 w-full min-w-0 flex-col justify-between gap-3 overflow-hidden bg-black px-4 py-5 text-foreground opacity-75 transition-[colors,opacity] duration-300 hover:bg-black hover:opacity-100 focus-visible:bg-black focus-visible:opacity-100 motion-reduce:transition-none lg:min-h-full lg:gap-2 lg:px-6 lg:py-6"
    >
      <div
        aria-hidden
        className={cn(
          styles["homepage-explore-dot-hover"],
          "absolute inset-0 z-0 opacity-0 transition-opacity duration-300 motion-reduce:transition-none group-hover:opacity-100 group-focus-visible:opacity-100",
        )}
        style={
          {
            "--homepage-dot-color": exploreDotColorVar[props.color],
          } as CSSProperties
        }
      />
      <h3
        className={cn(
          "relative z-10 min-w-0 text-left font-mono text-sm font-medium leading-snug",
          !props.noTitleClamp && "lg:line-clamp-2",
          exploreTitleClass[props.color],
        )}
      >
        {props.title}
      </h3>
      <div className="relative z-10 flex min-w-0 items-center gap-2 text-sm text-neutral-400">
        <RiGithubLine className="size-4 shrink-0 opacity-90" />
        <RiStarLine className="size-4 shrink-0 opacity-80" />
        <span className="font-mono text-sm font-light tabular-nums tracking-tight">
          {props.stars}
        </span>
      </div>
    </Link>
  );
}
