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
/** Time to glide one lattice cell — interpolated, not a discrete hop. */
const STEP_MS = 280;
/**
 * How many lattice cells from the stage rim the trail may occupy.
 * 2 × 22px ≈ the lg:p-12 media inset, so the snake stays in the wash.
 */
const EDGE = 2;
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

function onRim(
  x: number,
  y: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
  edge: number,
) {
  return (
    x <= minX + edge - 1 ||
    x >= maxX - edge + 1 ||
    y <= minY + edge - 1 ||
    y >= maxY - edge + 1
  );
}

function pickDir(
  dir: Pt,
  x: number,
  y: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number,
): Pt {
  const fits = ([dx, dy]: Pt) => {
    const nx = x + dx;
    const ny = y + dy;
    return (
      nx >= minX &&
      ny >= minY &&
      nx <= maxX &&
      ny <= maxY &&
      onRim(nx, ny, minX, minY, maxX, maxY, EDGE)
    );
  };
  const opposite: Pt = [-dir[0], -dir[1]];
  const turns = DIRS.filter(
    (d) => !same(d, dir) && !same(d, opposite) && fits(d),
  );
  if (fits(dir) && (turns.length === 0 || Math.random() > 0.28)) return dir;
  if (turns.length) return turns[(Math.random() * turns.length) | 0]!;
  return fits(opposite) ? opposite : dir;
}

function honey(alpha: number) {
  return `rgba(${HONEY_RGB}, ${alpha})`;
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  gx: number,
  gy: number,
  r: number,
  alpha: number,
) {
  ctx.beginPath();
  ctx.fillStyle = honey(alpha);
  ctx.arc(
    gx * CELL + CELL / 2 - left,
    gy * CELL + CELL / 2 - top,
    r,
    0,
    Math.PI * 2,
  );
  ctx.fill();
}

function bounds(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const minX = Math.floor(rect.left / CELL);
  const minY = Math.floor(rect.top / CELL);
  const maxX = Math.ceil(rect.right / CELL) - 1;
  const maxY = Math.ceil(rect.bottom / CELL) - 1;
  return { rect, minX, minY, maxX, maxY };
}

export type FeatureDotFieldProps = {
  /** Extra classes on the absolute-fill wrapper. */
  className?: string;
};

/**
 * Shared feature-stage backdrop: the homepage spot-grid (same cell / mix /
 * fixed rhythm as `.homepage-spot-grid`) plus a short honey trail that
 * glides the outer two lattice cells (the media inset / frame).
 * Frozen when the user prefers reduced motion.
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
    let x = 0;
    let y = 0;
    let dir: Pt = DIRS[0]!;
    let trail: Pt[] = [];
    let last = 0;
    let raf = 0;
    let visible = true;

    const paint = (progress: number) => {
      const { rect } = bounds(root);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const p = Math.min(1, Math.max(0, progress));
      trail.forEach((to, i) => {
        const from = trail[i + 1] ?? to;
        const gx = from[0] + (to[0] - from[0]) * p;
        const gy = from[1] + (to[1] - from[1]) * p;
        const t = 1 - i / TRAIL;
        drawDot(
          ctx,
          rect.left,
          rect.top,
          gx,
          gy,
          1.15 + t * 0.45,
          0.22 + t * 0.78,
        );
      });
    };

    const seed = () => {
      const { minX, minY, maxX, maxY } = bounds(root);
      const depth = (Math.random() * EDGE) | 0;
      const side = (Math.random() * 4) | 0;
      if (side === 0) {
        x = minX + ((Math.random() * (maxX - minX + 1)) | 0);
        y = minY + depth;
      } else if (side === 1) {
        x = maxX - depth;
        y = minY + ((Math.random() * (maxY - minY + 1)) | 0);
      } else if (side === 2) {
        x = minX + ((Math.random() * (maxX - minX + 1)) | 0);
        y = maxY - depth;
      } else {
        x = minX + depth;
        y = minY + ((Math.random() * (maxY - minY + 1)) | 0);
      }
      dir = DIRS[(Math.random() * DIRS.length) | 0]!;
      trail = [[x, y]];
      for (let i = 1; i < TRAIL; i++) {
        dir = pickDir(dir, x, y, minX, minY, maxX, maxY);
        x += dir[0];
        y += dir[1];
        trail.unshift([x, y]);
      }
    };

    const layout = () => {
      const dpr = window.devicePixelRatio || 1;
      const { width, height } = root.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      paint(1);
    };

    const step = () => {
      const { minX, minY, maxX, maxY } = bounds(root);
      if (!onRim(x, y, minX, minY, maxX, maxY, EDGE)) {
        const toLeft = x - minX;
        const toRight = maxX - x;
        const toTop = y - minY;
        const toBottom = maxY - y;
        const nearest = Math.min(toLeft, toRight, toTop, toBottom);
        if (nearest === toLeft) x = minX + EDGE - 1;
        else if (nearest === toRight) x = maxX - EDGE + 1;
        else if (nearest === toTop) y = minY + EDGE - 1;
        else y = maxY - EDGE + 1;
      }
      dir = pickDir(dir, x, y, minX, minY, maxX, maxY);
      x += dir[0];
      y += dir[1];
      trail.unshift([x, y]);
      trail.length = TRAIL;
    };

    const tick = (now: number) => {
      if (visible && !reduced.matches) {
        if (last === 0) last = now;
        const progress = Math.min(1, (now - last) / STEP_MS);
        paint(progress);
        if (progress >= 1) {
          last = now;
          step();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const syncMotion = () => {
      cancelAnimationFrame(raf);
      if (reduced.matches) {
        paint(1);
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
            "--homepage-dot-color": "white",
            "--homepage-dot-mix": "8%",
            "--homepage-dot-attachment": "fixed",
            "--homepage-dot-position": "0 0",
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
