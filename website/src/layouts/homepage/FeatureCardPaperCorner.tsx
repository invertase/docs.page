import { cn } from "~/lib/utils";

export type PaperCornerPlacement = "top-right" | "top-left" | "bottom-left";

type FeatureCardPaperCornerProps = {
  corner: PaperCornerPlacement;
  className?: string;
};

/** Card surface clip matching the dog-ear cutout so stacked layers do not mask folds below. */
export function featureCardSurfaceClipPath(
  corner: PaperCornerPlacement,
  foldRem: number = FEATURE_PAPER_FOLD_REM,
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

/** Corner overlay + top-border inset (must stay in sync). */
export const FEATURE_PAPER_FOLD_REM = 5;

const FOLD_SIZE_CLASS = "size-20";

/** SVG coordinate space — matches 5rem (80px) overlay. */
const FOLD_VIEW = 80;

/** Radius on the inner fold’s right angle (Corner B). */
const FOLD_INNER_RADIUS = 14;

/** Circle approximation constant for cubic Bézier quarter-arcs. */
const BEZIER_K = 0.5522847498;

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

/**
 * Decorative dog-ear corner overlay. Sized to match each sticky stack tab in
 * FeaturesSection so the full fold stays visible when cards overlap on scroll.
 */
export function FeatureCardPaperCorner({
  corner,
  className,
}: FeatureCardPaperCornerProps) {
  const { anchor, border, isRight } = PLACEMENT_LAYOUT[corner];
  const v = FOLD_VIEW;
  const r = FOLD_INNER_RADIUS;
  const k = r * BEZIER_K;

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "marketing-feature-paper-corner-border pointer-events-none absolute z-20 h-px bg-border",
          border,
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "marketing-feature-paper-corner pointer-events-none absolute z-20",
          FOLD_SIZE_CLASS,
          anchor,
          className,
        )}
      >
        <svg
          viewBox={`0 0 ${v} ${v}`}
          className="fill-none"
          role="presentation"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isRight ? (
            <>
              <path
                d={`M 0 0 L ${v} ${v}`}
                className="stroke-[hsl(var(--border))]"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={`M 0 0 V ${v - r} C 0 ${v - r + k} ${r - k} ${v} ${r} ${v} H ${v}`}
                className="stroke-[hsl(var(--border))]"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </>
          ) : (
            <>
              <path
                d={`M ${v} 0 L 0 ${v}`}
                className="stroke-[hsl(var(--border))]"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <path
                d={`M ${v} 0 V ${v - r} C ${v} ${v - r + k} ${v - r + k} ${v} ${v - r} ${v} H 0`}
                className="stroke-[hsl(var(--border))]"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
        </svg>
      </div>
    </>
  );
}
