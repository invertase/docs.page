import { type ReactNode, useId } from "react";

import { cn } from "@/lib/utils";

import styles from "./homepage.module.css";

type PaperCornerProps = {
  className?: string;
  /** Lighter border toward the page glow (hero/preview only). */
  borderGradient?: boolean;
};

/** Card surface clip matching the top-left dog-ear cutout. */
export function paperCornerClipPath(foldRem: number = PAPER_FOLD_REM): string {
  const f = `${foldRem}rem`;
  return `polygon(${f} 0, 100% 0, 100% 100%, 0 100%, 0 ${f})`;
}

/** Corner overlay size — must stay in sync with clip-path inset. */
export const PAPER_FOLD_REM = 5;

/** Overlap between adjacent paper sections; must match PAPER_FOLD_REM (size-20 / left-20). */
export const PAPER_SECTION_OVERLAP_CLASS = "-mt-20" as const;

/** Section shell for dog-ear blocks; vertical sides come from homepage gutter rails. */
export const PAPER_SECTION_SHELL_CLASS =
  "relative overflow-visible border-border border-t" as const;

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

/** Feature cards: black tint + backdrop blur (matches landing-page-new-branding-v2). */
const PAPER_FROSTED_CLASS = "bg-black/70 backdrop-blur-lg";

/**
 * Silhouette bloom of the clipped top fold. Zero-offset blur falls into the
 * dog-ear cutout (wash-under-fold); the upward pair lifts the straight edge.
 * Plain rgb() only — color-mix() inside drop-shadow can no-op the filter.
 */
const PAPER_FOLD_SHADOW_FILTER =
  "drop-shadow(0 0 8px rgb(0 0 0 / 0.55)) drop-shadow(0 -6px 12px rgb(0 0 0 / 0.4))" as const;

type PaperClippedPanelProps = {
  className?: string;
  /** When true (default), applies black frosted surface on the clipped panel. */
  frosted?: boolean;
  /** Lighter fold strokes toward the page glow (hero/preview only). */
  borderGradient?: boolean;
  children: ReactNode;
};

/** Dog-ear panel; background and blur live on the clipped wrapper. */
export function PaperClippedPanel({
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
      style={{ clipPath: paperCornerClipPath() }}
    >
      <PaperCorner borderGradient={borderGradient} />
      <div className="relative">{children}</div>
    </div>
  );
}

/**
 * Layer separation along the paper top-fold. Sibling of the clipped shell
 * (clip-path eats box-shadow). The silhouette follows the dog-ear; extra
 * gradients darken the wash in the cutout and the straight edge above.
 */
export function PaperFoldShadow() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-visible"
      style={{ height: `${PAPER_FOLD_REM}rem` }}
    >
      <div
        className="absolute inset-0"
        style={{ filter: PAPER_FOLD_SHADOW_FILTER }}
      >
        <div
          className="size-full bg-black"
          style={{ clipPath: paperCornerClipPath() }}
        />
      </div>
      {/* Straight top edge — band sits above the fold onto the card beneath. */}
      <div
        className="absolute -top-10 right-0 left-20 h-10"
        style={{
          background: "linear-gradient(to top, rgb(0 0 0 / 0.32), transparent)",
        }}
      />
      {/* Dog-ear cutout — darkest at the diagonal, fading into the wash. */}
      <div
        className="absolute top-0 left-0 size-20"
        style={{
          background:
            "linear-gradient(to top left, rgb(0 0 0 / 0.38) 10%, transparent 68%)",
        }}
      />
    </div>
  );
}

/** Decorative top-left dog-ear corner overlay (SVG crease + rounded inner corner). */
export function PaperCorner({
  className,
  borderGradient = false,
}: PaperCornerProps) {
  const uid = useId().replace(/:/g, "");
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
          "pointer-events-none absolute top-0 left-20 right-0 z-30",
          styles.homepageLineH,
          borderGradient ? styles.homepageLineHGradientFold : "bg-border",
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 left-0 z-30",
          FOLD_SIZE_CLASS,
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
                x1={v}
                y1={0}
                x2={0}
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
                x1={v}
                y1={0}
                x2={0}
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
        </svg>
      </div>
    </>
  );
}
