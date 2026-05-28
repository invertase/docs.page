import { cn } from "@/lib/utils";

export type PaperCornerPlacement = "top-right" | "top-left" | "bottom-left";

type PaperCornerProps = {
  corner: PaperCornerPlacement;
  className?: string;
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

/** Overlap between stacked paper sections; must match PAPER_FOLD_REM (size-20 / left-20). */
export const PAPER_SECTION_OVERLAP_CLASS = "-mt-20" as const;

const FOLD_SIZE_CLASS = "size-20";
const FOLD_VIEW = 80;
const FOLD_INNER_RADIUS = 14;
const BEZIER_K = 0.5522847498;

const STROKE = "stroke-border";
const STROKE_PROPS = {
  className: STROKE,
  strokeWidth: 1,
  vectorEffect: "non-scaling-stroke" as const,
};

function edgeConnectorPaths(v: number, isRight: boolean): string[] {
  if (isRight) {
    return [`M 0 0 H ${v}`, `M ${v} 0 V ${v}`];
  }
  return [`M 0 0 H ${v}`, `M 0 ${v} V 0`];
}

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

/** Decorative dog-ear corner overlay (SVG crease + rounded inner corner). */
export function PaperCorner({ corner, className }: PaperCornerProps) {
  const { anchor, border, isRight } = PLACEMENT_LAYOUT[corner];
  const v = FOLD_VIEW;
  const r = FOLD_INNER_RADIUS;
  const k = r * BEZIER_K;

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-20 h-px bg-border",
          border,
          className,
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute z-20",
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
          {edgeConnectorPaths(v, isRight).map((d) => (
            <path key={d} d={d} {...STROKE_PROPS} />
          ))}
          {isRight ? (
            <>
              <path d={`M 0 0 L ${v} ${v}`} {...STROKE_PROPS} />
              <path
                d={`M 0 0 V ${v - r} C 0 ${v - r + k} ${r - k} ${v} ${r} ${v} H ${v}`}
                {...STROKE_PROPS}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              <path d={`M ${v} 0 L 0 ${v}`} {...STROKE_PROPS} />
              <path
                d={`M ${v} 0 V ${v - r} C ${v} ${v - r + k} ${v - r + k} ${v} ${v - r} ${v} H 0`}
                {...STROKE_PROPS}
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
