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
/**
 * How many lattice cells from the stage rim a pulse may occupy.
 * 2 × 22px ≈ the lg:p-12 media inset, so highlights stay in the wash.
 */
const EDGE = 2;
/** Travelling bloom width, in cells. */
const PULSE_SIGMA = 1.55;
const CELLS_PER_SEC = 5.2;
/** Honey `#E69135` — brand token, not a new colour. */
const HONEY_RGB = "230, 145, 53";

type Run = {
  horizontal: boolean;
  axis: number;
  from: number;
  to: number;
  dir: 1 | -1;
  start: number;
};

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

function pickRun(el: HTMLElement, horizontal: boolean): Run {
  const { minX, minY, maxX, maxY } = bounds(el);
  const depth = (Math.random() * EDGE) | 0;
  const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
  if (horizontal) {
    const axis = Math.random() < 0.5 ? minY + depth : maxY - depth;
    const from = minX;
    const to = maxX;
    return { horizontal, axis, from, to, dir, start: dir === 1 ? from : to };
  }
  const axis = Math.random() < 0.5 ? minX + depth : maxX - depth;
  const from = minY;
  const to = maxY;
  return { horizontal, axis, from, to, dir, start: dir === 1 ? from : to };
}

function bloom(dist: number) {
  return Math.exp(-(dist * dist) / (2 * PULSE_SIGMA * PULSE_SIGMA));
}

export type FeatureDotFieldProps = {
  /** Extra classes on the absolute-fill wrapper. */
  className?: string;
};

/**
 * Shared feature-stage backdrop: the homepage spot-grid plus honey dots that
 * pulse along one horizontal or vertical rim run (outer two lattice cells).
 * `prefers-reduced-motion` keeps a gentle in-place pulse.
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
    let run = pickRun(root, Math.random() < 0.5);
    let runStarted = 0;
    let raf = 0;
    let visible = true;

    const paintTravel = (now: number) => {
      const { rect } = bounds(root);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (runStarted === 0) runStarted = now;
      let head =
        run.start + run.dir * ((now - runStarted) / 1000) * CELLS_PER_SEC;
      const past =
        run.dir === 1
          ? head > run.to + PULSE_SIGMA * 2
          : head < run.from - PULSE_SIGMA * 2;
      if (past) {
        run = pickRun(root, !run.horizontal);
        runStarted = now;
        head = run.start;
      }
      for (let i = run.from; i <= run.to; i++) {
        const b = bloom(i - head);
        if (b < 0.05) continue;
        const gx = run.horizontal ? i : run.axis;
        const gy = run.horizontal ? run.axis : i;
        drawDot(ctx, rect.left, rect.top, gx, gy, 1.1 + b * 0.7, 0.1 + b * 0.9);
      }
    };

    const paintRest = (now: number) => {
      const { rect } = bounds(root);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pulse = 0.28 + 0.32 * (0.5 + 0.5 * Math.sin(now / 900));
      const mid = ((run.from + run.to) / 2) | 0;
      for (const i of [mid - 2, mid, mid + 2]) {
        if (i < run.from || i > run.to) continue;
        const gx = run.horizontal ? i : run.axis;
        const gy = run.horizontal ? run.axis : i;
        drawDot(ctx, rect.left, rect.top, gx, gy, 1.25, pulse);
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
      run = pickRun(root, run.horizontal);
      runStarted = 0;
    };

    const tick = (now: number) => {
      if (visible) {
        if (reduced.matches) paintRest(now);
        else paintTravel(now);
      }
      raf = requestAnimationFrame(tick);
    };

    const ro = new ResizeObserver(layout);
    ro.observe(root);
    layout();
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(root);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
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
 * Right-panel feature stage: lattice + honey pulse behind a floating visual.
 * Parent must be `position: relative`. Later feature-visual PRs wrap their
 * media in this — do not fork the pulse.
 */
export function FeatureStage({ children, className }: FeatureStageProps) {
  return (
    <>
      <FeatureDotField className={className} />
      <div className="relative z-1 w-full">{children}</div>
    </>
  );
}
