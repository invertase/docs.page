"use client";

import { type ReactNode, useId } from "react";

import { cn } from "@/lib/utils";

import styles from "./homepage.module.css";

export type PaperCornerPlacement = "top-right" | "top-left" | "bottom-left";

type PaperCornerProps = {
  corner: PaperCornerPlacement;
  className?: string;
  /** Lighter border toward the page glow (hero/preview only). */
  borderGradient?: boolean;
};

/** Card surface clip matching the dog-ear cutout. */
export function paperCornerClipPath(
  corner: PaperCornerPlacement,
  foldRem: number = PAPER_FOLD_REM,
): string {
  const f = `${foldRem}rem`;

  switch (corner) {
    case "top-left":
      return `polygon(${f} 0, 100% 0, 100% 100%, 0 100%, 0 ${f})`;
    case "top-right":
      return `polygon(0 0, calc(100% - ${f}) 0, 100% ${f}, 100% 100%, 0 100%)`;
    case "bottom-left":
      return `polygon(0 0, 100% 0, 100% 100%, ${f} 100%, 0 calc(100% - ${f}))`;
  }
}

/** Corner overlay size — must stay in sync with clip-path inset. */
export const PAPER_FOLD_REM = 5;

/** Overlap between adjacent paper sections; must match PAPER_FOLD_REM (size-20 / left-20). */
export const PAPER_SECTION_OVERLAP_CLASS = "-mt-20" as const;

/** Section shell for dog-ear blocks; vertical sides come from homepage gutter rails. */
export const PAPER_SECTION_SHELL_CLASS =
  "relative overflow-visible border-border" as const;

const FOLD_SIZE_CLASS = "size-20";
const FOLD_VIEW = 80;
const FOLD_INNER_RADIUS = 14;
const BEZIER_K = 0.5522847498;

const STROKE_WIDTH_PROPS = {
  strokeWidth: "var(--homepage-border-width)",
  vectorEffect: "non-scaling-stroke" as const,
};

const STROKE_SOLID_PROPS = {
  ...STROKE_WIDTH_PROPS,
  className: "stroke-border",
};

const PLACEMENT_LAYOUT: Record<
  PaperCornerPlacement,
  { anchor: string; border: string; isRight: boolean }
> = {
  "top-right": {
    anchor: "top-0 right-0",
    border: "top-0 left-0 right-20",
    isRight: true,
  },
  "top-left": {
    anchor: "top-0 left-0",
    border: "top-0 left-20 right-0",
    isRight: false,
  },
  "bottom-left": {
    anchor: "top-full left-0",
    border: "bottom-0 left-20 right-0",
    isRight: false,
  },
};

/** Feature cards: black tint + backdrop blur (matches landing-page-new-branding-v2). */
const PAPER_FROSTED_CLASS = "bg-black/70 backdrop-blur-lg";

type PaperClippedPanelProps = {
  corner?: PaperCornerPlacement;
  className?: string;
  /** When true (default), applies black frosted surface on the clipped panel. */
  frosted?: boolean;
  /** Lighter fold strokes toward the page glow (hero/preview only). */
  borderGradient?: boolean;
  children: ReactNode;
};

/** Dog-ear panel; background and blur live on the clipped wrapper. */
export function PaperClippedPanel({
  corner = "top-left",
  className,
  frosted = true,
  borderGradient = false,
  children,
}: PaperClippedPanelProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        frosted && PAPER_FROSTED_CLASS,
        className,
      )}
      style={{ clipPath: paperCornerClipPath(corner) }}
    >
      <PaperCorner corner={corner} borderGradient={borderGradient} />
      <div className="relative">{children}</div>
    </div>
  );
}

/** Decorative dog-ear corner overlay (SVG crease + rounded inner corner). */
export function PaperCorner({
  corner,
  className,
  borderGradient = false,
}: PaperCornerProps) {
  const uid = useId().replace(/:/g, "");
  const { anchor, border, isRight } = PLACEMENT_LAYOUT[corner];
  const v = FOLD_VIEW;
  const r = FOLD_INNER_RADIUS;
  const k = r * BEZIER_K;

  const gradDiag = `${uid}-diag`;
  const gradCurve = `${uid}-curve`;

  const diagStroke = borderGradient ? `url(#${gradDiag})` : undefined;
  const curveStroke = borderGradient ? `url(#${gradCurve})` : undefined;

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-30",
          styles.homepageLineH,
          borderGradient ? styles.homepageLineHGradientFold : "bg-border",
          border,
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-30",
          FOLD_SIZE_CLASS,
          anchor,
          className,
        )}
      >
        <svg
          viewBox={`0 0 ${v} ${v}`}
          className="overflow-visible fill-none"
          role="presentation"
          xmlns="http://www.w3.org/2000/svg"
        >
          {borderGradient ? (
            <defs>
              <linearGradient
                id={gradDiag}
                gradientUnits="userSpaceOnUse"
                x1={isRight ? 0 : v}
                y1={0}
                x2={isRight ? v : 0}
                y2={v}
              >
                <stop
                  offset="0%"
                  stopColor="var(--homepage-border-bright-fold)"
                />
                <stop
                  offset="78%"
                  stopColor="var(--homepage-border-bright-fold)"
                />
                <stop
                  offset="100%"
                  stopColor="var(--homepage-border-bright-soft)"
                />
              </linearGradient>
              <linearGradient
                id={gradCurve}
                gradientUnits="userSpaceOnUse"
                x1={isRight ? 0 : v}
                y1={0}
                x2={isRight ? v : 0}
                y2={v}
              >
                <stop
                  offset="0%"
                  stopColor="var(--homepage-border-bright-fold)"
                />
                <stop
                  offset="22%"
                  stopColor="var(--homepage-border-bright-soft)"
                />
                <stop
                  offset="48%"
                  stopColor="var(--homepage-border-fold-mid)"
                />
                <stop offset="72%" stopColor="var(--homepage-border-muted)" />
                <stop offset="100%" stopColor="var(--homepage-border-muted)" />
              </linearGradient>
            </defs>
          ) : null}
          {isRight ? (
            <>
              <path
                d={`M 0 0 L ${v} ${v}`}
                {...(borderGradient
                  ? { stroke: diagStroke, ...STROKE_WIDTH_PROPS }
                  : STROKE_SOLID_PROPS)}
              />
              <path
                d={`M 0 0 V ${v - r} C 0 ${v - r + k} ${r - k} ${v} ${r} ${v} H ${v}`}
                {...(borderGradient
                  ? { stroke: curveStroke, ...STROKE_WIDTH_PROPS }
                  : STROKE_SOLID_PROPS)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              <path
                d={`M ${v} 0 L 0 ${v}`}
                {...(borderGradient
                  ? { stroke: diagStroke, ...STROKE_WIDTH_PROPS }
                  : STROKE_SOLID_PROPS)}
              />
              <path
                d={`M ${v} 0 V ${v - r} C ${v} ${v - r + k} ${v - r + k} ${v} ${v - r} ${v} H 0`}
                {...(borderGradient
                  ? { stroke: curveStroke, ...STROKE_WIDTH_PROPS }
                  : STROKE_SOLID_PROPS)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}
        </svg>
      </div>
    </>
  );
}
