"use client";

import {
  type CSSProperties,
  type PropsWithChildren,
  useEffect,
  useRef,
} from "react";
import { cn } from "@/lib/utils";
import styles from "../homepage.module.css";

const CELL = 22;
const TRAIL = 7;
const STEP_MS = 150;
/** Honey `#E69135` — brand token, not a new colour. */
const HONEY_RGB = "230, 145, 53";

type Pt = readonly [number, number];

const DIRS: Pt[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function same(a: Pt, b: Pt) {
  return a[0] === b[0] && a[1] === b[1];
}

function pickDir(
  dir: Pt,
  x: number,
  y: number,
  cols: number,
  rows: number,
): Pt {
  const fits = ([dx, dy]: Pt) => {
    const nx = x + dx;
    const ny = y + dy;
    return nx >= 0 && ny >= 0 && nx < cols && ny < rows;
  };
  const opposite: Pt = [-dir[0], -dir[1]];
  const turns = DIRS.filter(
    (d) => !same(d, dir) && !same(d, opposite) && fits(d),
  );
  if (fits(dir) && (turns.length === 0 || Math.random() > 0.28)) return dir;
  if (turns.length) return turns[(Math.random() * turns.length) | 0]!;
  return fits(opposite) ? opposite : dir;
}

function staticHighlights(cols: number, rows: number): Pt[] {
  return (
    [
      [3, 2],
      [cols - 4, 4],
      [7, rows - 3],
      [cols - 6, rows - 5],
      [(cols * 0.4) | 0, (rows * 0.55) | 0],
    ] as Pt[]
  ).filter(([x, y]) => x > 0 && y > 0 && x < cols && y < rows);
}

function honey(alpha: number) {
  return `rgba(${HONEY_RGB}, ${alpha})`;
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  alpha: number,
) {
  ctx.beginPath();
  ctx.fillStyle = honey(alpha);
  ctx.arc(x * CELL + CELL / 2, y * CELL + CELL / 2, r, 0, Math.PI * 2);
  ctx.fill();
}

export type FeatureDotFieldProps = {
  /** Extra classes on the absolute-fill wrapper. */
  className?: string;
};

/**
 * Shared feature-stage backdrop: periwinkle lattice (reuses
 * `homepage-spot-grid-card`) plus a short honey trail that walks the grid
 * horizontally and vertically. Frozen when the user prefers reduced motion.
 *
 * Positioned `absolute inset-0` — drop behind any feature visual. Prefer
 * {@link FeatureStage} when you also need the stacking wrapper.
 */
export function FeatureDotField({ className }: FeatureDotFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cols = 0;
    let rows = 0;
    let x = 0;
    let y = 0;
    let dir: Pt = DIRS[0]!;
    let trail: Pt[] = [];
    let highlights: Pt[] = [];
    let last = 0;
    let raf = 0;
    let visible = true;

    const paint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const [hx, hy] of highlights) drawDot(ctx, hx, hy, 1.15, 0.55);
      trail.forEach(([tx, ty], i) => {
        const t = 1 - i / TRAIL;
        drawDot(ctx, tx, ty, 1.15 + t * 0.45, 0.22 + t * 0.78);
      });
    };

    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = root.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.max(2, Math.ceil(width / CELL));
      rows = Math.max(2, Math.ceil(height / CELL));
      x = (cols / 2) | 0;
      y = (rows / 2) | 0;
      dir = DIRS[(Math.random() * DIRS.length) | 0]!;
      trail = [[x, y]];
      for (let i = 1; i < TRAIL; i++) {
        dir = pickDir(dir, x, y, cols, rows);
        x += dir[0];
        y += dir[1];
        trail.unshift([x, y]);
      }
      highlights = staticHighlights(cols, rows);
      paint();
    };

    const step = () => {
      dir = pickDir(dir, x, y, cols, rows);
      x += dir[0];
      y += dir[1];
      trail.unshift([x, y]);
      trail.length = TRAIL;
      paint();
    };

    const tick = (now: number) => {
      if (visible && !reduced.matches && now - last >= STEP_MS) {
        last = now;
        step();
      }
      raf = requestAnimationFrame(tick);
    };

    const syncMotion = () => {
      cancelAnimationFrame(raf);
      if (reduced.matches) {
        paint();
        return;
      }
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(layout);
    ro.observe(root);
    layout();

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(root);

    reduced.addEventListener("change", syncMotion);
    syncMotion();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      reduced.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(styles["homepage-spot-grid-card"], "absolute inset-0")}
        style={
          {
            "--homepage-dot-color": "var(--color-periwinkle-500)",
            "--homepage-dot-mix": "10%",
          } as CSSProperties
        }
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}

export type FeatureStageProps = PropsWithChildren<{
  className?: string;
}>;

/**
 * Right-panel feature stage: lattice + honey trail behind a floating visual.
 * Parent must be `position: relative`. Later feature-visual PRs wrap their
 * media in this — do not fork the trail.
 */
export function FeatureStage({ children, className }: FeatureStageProps) {
  return (
    <>
      <FeatureDotField className={className} />
      <div className="relative z-1 w-full">{children}</div>
    </>
  );
}
