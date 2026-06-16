import { RiGithubLine, RiStarLine } from "@remixicon/react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

import styles from "./homepage.module.css";

export function Explore() {
  return (
    <div className="border-x border-t border lg:grid lg:grid-cols-[minmax(0,10fr)_minmax(0,6fr)_minmax(0,6fr)_minmax(0,6fr)_minmax(0,6fr)] lg:divide-x lg:divide-border">
      <div className="border-b border-border py-8 px-6 text-center bg-black/60 lg:border-b-0 lg:px-10 lg:text-left">
        <p className="text-xl">
          Explore <b>open-source</b> projects powered by docs.page
        </p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-border lg:contents">
        <Project
          href="https://github.com/invertase/react-native-firebase"
          title="React Native Firebase"
          color="#E99363"
          stars="12k+"
        />
        <Project
          href="https://github.com/schultek/jaspr"
          title="Jaspr"
          color="#63D0BD"
          stars="2k+"
        />
        <Project
          href="https://github.com/invertase/melos"
          title="Melos"
          color="#E96767"
          stars="1k+"
        />
        <Project
          href="https://github.com/widgetbook/widgetbook"
          title="Widgetbook"
          color="#A68BF3"
          stars="900+"
        />
      </div>
    </div>
  );
}

function Project(props: {
  href: string;
  title: string;
  color: string;
  stars: string;
}) {
  return (
    <Link
      href={props.href}
      target="_blank"
      className="group relative isolate flex overflow-hidden bg-black"
    >
      <div
        className={cn(
          styles["homepage-spot-grid-card"],
          "absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        )}
        style={{ "--homepage-dot-color": props.color } as CSSProperties}
        aria-hidden
      />
      <div className="relative z-10 flex h-full min-h-28 flex-col gap-2 p-6 lg:min-h-0">
        <h3
          className="flex-1 text-base font-medium leading-snug lg:text-sm lg:font-normal lg:truncate"
          style={{ color: props.color }}
        >
          {props.title}
        </h3>
        <div className="flex items-center gap-2 text-sm opacity-80">
          <RiGithubLine className="size-4" />
          <RiStarLine className="size-4" />
          {props.stars}
        </div>
      </div>
    </Link>
  );
}
