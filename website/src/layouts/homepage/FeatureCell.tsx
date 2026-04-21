"use client";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";

import { cn } from "~/utils";

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function FeatureCell({
  icon,
  title,
  description,
  className,
  tabIndex = 0,
  ...rest
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
} & ComponentProps<"div">) {
  const [active, setActive] = useState(false);
  const [titleShown, setTitleShown] = useState("");
  const [descShown, setDescShown] = useState("");
  /** `null` until client reads hover / motion media (avoids clearing touch layout on first paint). */
  const [typewriterOff, setTypewriterOff] = useState<boolean | null>(null);

  useEffect(() => {
    const mqHover = window.matchMedia("(hover: none)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setTypewriterOff(mqHover.matches || mqMotion.matches);
    };
    sync();
    mqHover.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqHover.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (typewriterOff === null) return;

    if (typewriterOff) {
      setTitleShown(title);
      setDescShown(description);
      return;
    }

    if (!active) {
      setTitleShown("");
      setDescShown("");
      return;
    }

    let cancelled = false;

    (async () => {
      setTitleShown("");
      setDescShown("");
      for (let i = 1; i <= title.length; i++) {
        if (cancelled) return;
        await delay(18);
        if (cancelled) return;
        setTitleShown(title.slice(0, i));
      }
      for (let i = 1; i <= description.length; i++) {
        if (cancelled) return;
        await delay(11);
        if (cancelled) return;
        setDescShown(description.slice(0, i));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, typewriterOff, title, description]);

  const typingTitle = titleShown.length < title.length;
  const typingDesc =
    titleShown.length >= title.length && descShown.length < description.length;
  const showCaret =
    active && typewriterOff === false && (typingTitle || typingDesc);

  return (
    // biome-ignore lint/a11y/useSemanticElements: Marketing tile contains headings and overlay content; not representable as a single button or fieldset.
    <div
      {...rest}
      role="group"
      tabIndex={tabIndex}
      aria-label={`${title}. ${description}`}
      className={cn(
        "feature-cell group relative z-10 flex aspect-square w-full min-w-0 flex-col items-center justify-center overflow-visible rounded-md border border-border",
        "bg-background bg-gradient-to-b from-[#F1F2F3]/20 to-[#F8F8F8]/20 dark:from-[#2D2F39]/20 dark:to-[#16171D]/20",
        "text-center",
        "transition-[transform,box-shadow,background-color,background-image,border-color] duration-300 ease-out will-change-transform",
        "hover:z-50 hover:scale-[1.18] hover:border-border hover:shadow-lg focus-within:z-50 focus-within:scale-[1.18] focus-within:border-border focus-within:shadow-lg",
        "dark:hover:bg-[hsl(var(--color-design-black))] dark:focus-within:bg-[hsl(var(--color-design-black))]",
        "motion-reduce:transform-none motion-reduce:hover:shadow-none",
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
    >
      <div className="feature-cell-content flex h-full w-full flex-col items-center justify-center p-4">
        <div className="feature-cell-icon-wrap origin-center shrink-0 opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0">
          {icon}
        </div>
      </div>

      <div
        aria-hidden
        className={cn(
          "feature-cell-copy-overlay pointer-events-none absolute inset-0 z-[1] flex flex-col items-center justify-center rounded-md p-4",
          "bg-background bg-gradient-to-b from-[#F1F2F3]/20 to-[#F8F8F8]/20 dark:from-[#2D2F39]/20 dark:to-[#16171D]/20",
          "dark:group-hover:bg-[hsl(var(--color-design-black))] dark:group-focus-within:bg-[hsl(var(--color-design-black))]",
          "opacity-0 transition-opacity duration-300 ease-out",
          "group-hover:pointer-events-auto group-hover:opacity-100",
          "group-focus-within:pointer-events-auto group-focus-within:opacity-100",
        )}
      >
        <div className="feature-cell-copy-inner flex w-full flex-col items-center justify-center gap-1.5 overflow-visible px-0.5 py-1 text-center">
          <h3 className="relative w-full overflow-visible text-center font-heading text-sm font-medium leading-snug sm:text-base">
            <span className="invisible block w-full select-none" aria-hidden>
              {title}
            </span>
            <span className="absolute left-0 top-0 block w-full text-foreground">
              <span className="inline text-center">
                {titleShown}
                {showCaret && typingTitle ? (
                  <span
                    aria-hidden
                    className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.08em] animate-pulse bg-foreground align-baseline"
                  />
                ) : null}
              </span>
            </span>
          </h3>
          <p className="relative w-full overflow-visible text-center text-xs font-light leading-relaxed sm:text-[0.8125rem]">
            <span className="invisible block w-full select-none" aria-hidden>
              {description}
            </span>
            <span className="absolute left-0 top-0 block w-full text-muted-foreground">
              <span className="inline text-center">
                {descShown}
                {showCaret && typingDesc ? (
                  <span
                    aria-hidden
                    className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.08em] animate-pulse bg-muted-foreground align-baseline"
                  />
                ) : null}
              </span>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
