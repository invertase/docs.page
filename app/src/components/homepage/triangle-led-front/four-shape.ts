import { LEDS_PER_EDGE, HEX_SIDES } from './settings';

/**
 * Outer silhouette of Lexend Light '4' (unit height, y-down, bbox center).
 * Simple concave polygon — no self-intersection at the bar/stem join.
 */
export const FOUR_SILHOUETTE: readonly (readonly [number, number])[] = [
  [0.1029, 0.5],
  [0.2114, 0.5],
  [0.2114, 0.2286],
  [0.3857, 0.2286],
  [0.3857, 0.1229],
  [0.2114, 0.1229],
  [0.2114, -0.5],
  [0.1243, -0.5],
  [-0.3857, 0.1229],
  [-0.3329, 0.2286],
  [0.1029, 0.2286],
];

export const FOUR_SILHOUETTE_N = FOUR_SILHOUETTE.length;
export const FOUR_UNIT_HALF_WIDTH = 0.3857;
/** Hex perimeter is 3H with 144 LEDs → pitch H/48. */
export const HEX_LED_PITCH_TO_HEIGHT = 3 / (LEDS_PER_EDGE * HEX_SIDES);
export const FOUR_LED_COUNT = Math.round(
  silhouettePerimeter(FOUR_SILHOUETTE) / HEX_LED_PITCH_TO_HEIGHT,
);
export const HEX_LED_COUNT = LEDS_PER_EDGE * HEX_SIDES;
export const TOTAL_LED_COUNT = HEX_LED_COUNT + FOUR_LED_COUNT * 2;
export const FOUR_HEX_GAP_TO_HEIGHT = 0.05;
export const LED_RADIUS_TO_HEIGHT = 0.0236;
export const LED_NORMAL_HALF_TO_RADIUS = 2;
export const LED_TANGENT_GAP_PX = 1;

const STEM_CENTER = { x: 0.15715, y: 0 };
const STEM_HALF = { x: 0.05425, y: 0.5 };
const BAR_CENTER = { x: 0.0264, y: 0.17575 };
const BAR_HALF = { x: 0.3593, y: 0.05285 };
const DIAG_A = { x: 0.16785, y: -0.5 };
const DIAG_B = { x: -0.3593, y: 0.1757 };
const DIAG_THICK = 0.05425;

export interface FourTransform {
  center: { x: number; y: number };
  height: number;
}

export interface LedSpot {
  x: number;
  y: number;
  angle: number;
}

export interface FourLayout {
  transform: FourTransform;
  positions: LedSpot[];
  tangentHalfLength: number;
  normalHalfThickness: number;
}

export function fourTransform(
  hexCenter: { x: number; y: number },
  hexHeight: number,
  hexInradius: number,
  side: -1 | 1,
): FourTransform {
  const fourHalf = FOUR_UNIT_HALF_WIDTH * hexHeight;
  const gap = FOUR_HEX_GAP_TO_HEIGHT * hexHeight;
  return {
    center: {
      x: hexCenter.x + side * (hexInradius + gap + fourHalf),
      y: hexCenter.y,
    },
    height: hexHeight,
  };
}

export function fourWorldPoint(
  unit: readonly [number, number],
  transform: FourTransform,
) {
  return {
    x: transform.center.x + unit[0] * transform.height,
    y: transform.center.y + unit[1] * transform.height,
  };
}

/** Stem ∪ bar ∪ diagonal — solid at overlaps (closes the join hole). */
export function sdfFour(
  point: { x: number; y: number },
  transform: FourTransform,
) {
  const p = {
    x: (point.x - transform.center.x) / transform.height,
    y: (point.y - transform.center.y) / transform.height,
  };
  return sdfFourUnit(p) * transform.height;
}

export function fourLedLayout(transform: FourTransform): FourLayout {
  const pts = FOUR_SILHOUETTE.map((unit) => fourWorldPoint(unit, transform));
  const edgeLens: number[] = [];
  let peri = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    edgeLens.push(len);
    peri += len;
  }
  const positions: LedSpot[] = [];
  const count = FOUR_LED_COUNT;
  for (let i = 0; i < count; i++) {
    const s = ((i + 0.5) / count) * peri;
    let acc = 0;
    for (let e = 0; e < pts.length; e++) {
      const len = edgeLens[e] ?? 0;
      if (acc + len >= s || e === pts.length - 1) {
        const a = pts[e];
        const b = pts[(e + 1) % pts.length];
        const t = len > 0 ? Math.min(1, Math.max(0, (s - acc) / len)) : 0;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        positions.push({
          x: a.x + dx * t,
          y: a.y + dy * t,
          angle: Math.atan2(dy, dx),
        });
        break;
      }
      acc += len;
    }
  }
  const pitch = transform.height * HEX_LED_PITCH_TO_HEIGHT;
  const radius = transform.height * LED_RADIUS_TO_HEIGHT;
  const normalHalfThickness = radius * LED_NORMAL_HALF_TO_RADIUS;
  const tangentHalfLength = Math.max(0, pitch * 0.5 - LED_TANGENT_GAP_PX * 0.5);
  return { transform, positions, tangentHalfLength, normalHalfThickness };
}

function silhouettePerimeter(pts: readonly (readonly [number, number])[]) {
  let peri = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    peri += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return peri;
}

function sdfFourUnit(p: { x: number; y: number }) {
  return Math.min(
    sdfBox(p, STEM_CENTER, STEM_HALF),
    sdfBox(p, BAR_CENTER, BAR_HALF),
    sdfOrientedBox(p, DIAG_A, DIAG_B, DIAG_THICK),
  );
}

function sdfBox(
  p: { x: number; y: number },
  center: { x: number; y: number },
  half: { x: number; y: number },
) {
  const dx = Math.abs(p.x - center.x) - half.x;
  const dy = Math.abs(p.y - center.y) - half.y;
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0);
}

function sdfOrientedBox(
  p: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
  th: number,
) {
  const bax = b.x - a.x;
  const bay = b.y - a.y;
  const len = Math.hypot(bax, bay);
  const dx = bax / Math.max(len, 1e-8);
  const dy = bay / Math.max(len, 1e-8);
  const qx = p.x - (a.x + b.x) * 0.5;
  const qy = p.y - (a.y + b.y) * 0.5;
  const rx = Math.abs(dx * qx + dy * qy) - len * 0.5;
  const ry = Math.abs(-dy * qx + dx * qy) - th;
  return Math.hypot(Math.max(rx, 0), Math.max(ry, 0)) + Math.min(Math.max(rx, ry), 0);
}
