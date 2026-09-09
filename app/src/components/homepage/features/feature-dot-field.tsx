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
 * Rim band depth in lattice cells. 2 × 22px sits in the lg:p-12 inset;
 * both rings of the active side light so the wash reads at a glance.
 */
const EDGE = 2;
/** Travelling bloom width, in cells — wide enough to blend, not orb-sized. */
const PULSE_SIGMA = 3.15;
const CELLS_PER_SEC = 8;
/** Honey `#E69135` — brand token, not a new colour. */
const HONEY_RGB = "230, 145, 53";

type Run = {
  horizontal: boolean;
  /** Outer-rim cell on the chosen side. */
  axis0: number;
  /** +1 / −1 toward the stage interior. */
  inward: 1 | -1;
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

/** Deterministic 0–1 from a per-card seed so reloads keep the same motion. */
function hashSeed(seed: number | string): number {
  const str = String(seed);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickRun(
  el: HTMLElement,
  horizontal: boolean,
  rand: () => number,
  avoid?: Run,
): Run {
  const { minX, minY, maxX, maxY } = bounds(el);
  const dir: 1 | -1 = rand() < 0.5 ? 1 : -1;
  const flip = avoid && avoid.horizontal === horizontal;
  if (horizontal) {
    let top = rand() < 0.5;
    if (flip && avoid) top = avoid.axis0 !== minY;
    return {
      horizontal,
      axis0: top ? minY : maxY,
      inward: top ? 1 : -1,
      from: minX,
      to: maxX,
      dir,
      start: dir === 1 ? minX : maxX,
    };
  }
  let left = rand() < 0.5;
  if (flip && avoid) left = avoid.axis0 !== minX;
  return {
    horizontal,
    axis0: left ? minX : maxX,
    inward: left ? 1 : -1,
    from: minY,
    to: maxY,
    dir,
    start: dir === 1 ? minY : maxY,
  };
}

function bloom(dist: number) {
  return Math.exp(-(dist * dist) / (2 * PULSE_SIGMA * PULSE_SIGMA));
}

function smoothstep(t: number) {
  const u = Math.min(1, Math.max(0, t));
  return u * u * (3 - 2 * u);
}

function travelCells(run: Run) {
  return run.to - run.from + PULSE_SIGMA * 4;
}

export type FeatureDotFieldProps = {
  /** Extra classes on the absolute-fill wrapper. */
  className?: string;
  /**
   * Stable per-card seed (feature index). Desktop + mobile washes on the
   * same card must share this so one card stays internally consistent.
   * Derives phase, lead axis, speed, and the rim-run sequence.
   */
  seed?: number | string;
};

/**
 * Shared feature-stage backdrop: the homepage spot-grid plus two honey
 * blooms that pulse along rim strips (one H, one V; both EDGE rings).
 * `prefers-reduced-motion` keeps a gentle in-place pulse.
 *
 * Positioned `absolute inset-0` — drop behind any feature visual. Prefer
 * {@link FeatureStage} when you also need the stacking wrapper.
 */
export function FeatureDotField({ className, seed = 0 }: FeatureDotFieldProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Motion params and rim-run sequence use separate streams so a
    // layout() re-seed does not replay the phase/speed draws as edges.
    const motion = mulberry32(hashSeed(seed));
    const cellsPerSec = CELLS_PER_SEC * (0.86 + motion() * 0.28);
    const leadHorizontal = motion() < 0.5;
    const phase0 = motion();
    const phase1 = motion();
    const restPhase = motion() * Math.PI * 2;
    const makeRunRng = () => mulberry32(hashSeed(seed) ^ 0x9e3779b9);
    let rand = makeRunRng();

    type Pulse = { run: Run; started: number };
    const firstRun = pickRun(root, leadHorizontal, rand);
    const pulses: Pulse[] = [
      { run: firstRun, started: 0 },
      { run: pickRun(root, !leadHorizontal, rand, firstRun), started: 0 },
    ];
    let raf = 0;
    let visible = true;

    const paintRun = (run: Run, head: number, rect: DOMRect) => {
      for (let depth = 0; depth < EDGE; depth++) {
        const axis = run.axis0 + run.inward * depth;
        const falloff = 1 - depth * 0.12;
        for (let i = run.from; i <= run.to; i++) {
          const b = bloom(i - head) * falloff;
          if (b < 0.012) continue;
          const gx = run.horizontal ? i : axis;
          const gy = run.horizontal ? axis : i;
          const r = 1.25 + b * 0.28;
          const a = 0.16 + b * 0.52;
          drawDot(ctx, rect.left, rect.top, gx, gy, r * 1.55, a * 0.16);
          drawDot(ctx, rect.left, rect.top, gx, gy, r, a);
        }
      }
    };

    const durationOf = (run: Run) => (travelCells(run) / cellsPerSec) * 1000;

    const headOf = (pulse: Pulse, now: number) => {
      const travel = travelCells(pulse.run);
      const e = smoothstep((now - pulse.started) / durationOf(pulse.run));
      return pulse.run.start + pulse.run.dir * e * travel;
    };

    const pastEnd = (pulse: Pulse, now: number) => {
      return now - pulse.started >= durationOf(pulse.run);
    };

    const paintTravel = (now: number) => {
      const { rect } = bounds(root);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (pulses[0]!.started === 0) {
        pulses[0]!.started = now - durationOf(pulses[0]!.run) * phase0;
        pulses[1]!.started = now - durationOf(pulses[1]!.run) * phase1;
      }
      for (let n = 0; n < pulses.length; n++) {
        const pulse = pulses[n]!;
        const other = pulses[1 - n]!;
        if (pastEnd(pulse, now)) {
          pulse.run = pickRun(root, !pulse.run.horizontal, rand, other.run);
          pulse.started = now;
        }
        const head = headOf(pulse, now);
        paintRun(pulse.run, head, rect);
      }
    };

    const paintRest = (now: number) => {
      const { rect } = bounds(root);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pulse = 0.28 + 0.28 * (0.5 + 0.5 * Math.sin(now / 900 + restPhase));
      for (const item of pulses) {
        const mid = ((item.run.from + item.run.to) / 2) | 0;
        for (let depth = 0; depth < EDGE; depth++) {
          const axis = item.run.axis0 + item.run.inward * depth;
          for (const i of [mid - 3, mid, mid + 3]) {
            if (i < item.run.from || i > item.run.to) continue;
            const gx = item.run.horizontal ? i : axis;
            const gy = item.run.horizontal ? axis : i;
            drawDot(ctx, rect.left, rect.top, gx, gy, 2.1, pulse * 0.18);
            drawDot(ctx, rect.left, rect.top, gx, gy, 1.5, pulse);
          }
        }
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
      rand = makeRunRng();
      pulses[0] = { run: pickRun(root, leadHorizontal, rand), started: 0 };
      pulses[1] = {
        run: pickRun(root, !leadHorizontal, rand, pulses[0].run),
        started: 0,
      };
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
  }, [seed]);

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
  seed?: number | string;
}>;

/**
 * Right-panel feature stage: lattice + honey pulse behind a floating visual.
 * Parent must be `position: relative`. Later feature-visual PRs wrap their
 * media in this — do not fork the pulse.
 */
export function FeatureStage({ children, className, seed }: FeatureStageProps) {
  return (
    <>
      <FeatureDotField className={className} seed={seed} />
      <div className="relative z-1 w-full">{children}</div>
    </>
  );
}
