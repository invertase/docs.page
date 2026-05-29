import { type CSSProperties, useCallback, useRef, useState } from "react";
import { RiGithubLine, RiStarLine } from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import styles from "./homepage.module.css";

export function Explore() {
  return (
    <div className="border-x grid grid-cols-[minmax(0,10fr)_minmax(0,6fr)_minmax(0,6fr)_minmax(0,6fr)_minmax(0,6fr)] border-t border divide-x divide-border">
      <div className="py-8 px-10 bg-neutral-950/50">
        <p className="text-xl">
          Explore <b>open-source</b> projects powered by docs.page
        </p>
      </div>
      <Project
        href="https://github.com/invertase/react-native-firebase"
        title="React Native Firebase"
        color="#f97316"
        stars="12k+"
      />
      <Project
        href="https://github.com/schultek/jaspr"
        title="Jaspr"
        color="#14b8a6"
        stars="2k+"
      />
      <Project
        href="https://github.com/invertase/melos"
        title="Melos"
        color="#ef4444"
        stars="1k+"
      />
      <Project
        href="https://github.com/widgetbook/widgetbook"
        title="Widgetbook"
        color="#a855f7"
        stars="900+"
      />
    </div>
  );
}

function Project(props: {
  href: string;
  title: string;
  color: string;
  stars: string;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: "50%", y: "50%" });

  const onMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPos({
      x: `${e.clientX - rect.left}px`,
      y: `${e.clientY - rect.top}px`,
    });
  }, []);

  const onLeave = useCallback(() => {
    setPos({ x: "50%", y: "50%" });
  }, []);

  return (
    <Link
      ref={ref}
      href={props.href}
      target="_blank"
      className="group relative isolate flex overflow-hidden bg-neutral-950"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className={cn(
          styles["homepage-spot-grid-card"],
          "absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
        )}
        aria-hidden
      >
        <div
          className={cn(
            styles["homepage-spot-glow-card"],
            "motion-reduce:hidden",
          )}
          style={
            {
              "--homepage-glow-color": props.color,
              "--homepage-glow-x": pos.x,
              "--homepage-glow-y": pos.y,
            } as CSSProperties
          }
        />
      </div>
      <div className="relative z-10 p-6 flex flex-col gap-2 h-full">
        <h3 className="flex-1 text-sm truncate" style={{ color: props.color }}>
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
