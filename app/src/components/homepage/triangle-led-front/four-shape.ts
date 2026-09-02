import { LEDS_PER_EDGE, HEX_SIDES } from './settings';

/** Lexend Light '4' outline in unit space: height 1, y-down, origin at bbox center. */
export const FOUR_UNIT_POINTS: readonly (readonly [number, number])[] = [
  [0.1029, 0.5],
  [0.1029, -0.3671],
  [0.1343, -0.3571],
  [-0.28, 0.1486],
  [-0.2914, 0.1229],
  [0.3857, 0.1229],
  [0.3857, 0.2286],
  [-0.3329, 0.2286],
  [-0.3857, 0.1229],
  [0.1243, -0.5],
  [0.2114, -0.5],
  [0.2114, 0.5],
];

export const FOUR_UNIT_HALF_WIDTH = 0.3857;
export const FOUR_LED_COUNT = 96;
export const HEX_LED_COUNT = LEDS_PER_EDGE * HEX_SIDES;
export const TOTAL_LED_COUNT = HEX_LED_COUNT + FOUR_LED_COUNT * 2;
export const FOUR_HEX_GAP_TO_HEIGHT = 0.05;
export const LED_RADIUS_TO_HEIGHT = 0.0236;
export const LED_NORMAL_HALF_TO_RADIUS = 2;
export const LED_TANGENT_GAP_PX = 1;

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

export function sdfFour(
  point: { x: number; y: number },
  transform: FourTransform,
) {
  const p = {
    x: (point.x - transform.center.x) / transform.height,
    y: (point.y - transform.center.y) / transform.height,
  };
  return sdfPolygon12(p, FOUR_UNIT_POINTS) * transform.height;
}

export function fourLedLayout(transform: FourTransform): FourLayout {
  const pts = FOUR_UNIT_POINTS.map((unit) => fourWorldPoint(unit, transform));
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
  const spacing = peri / Math.max(1, count);
  const radius = transform.height * LED_RADIUS_TO_HEIGHT;
  const normalHalfThickness = radius * LED_NORMAL_HALF_TO_RADIUS;
  const tangentHalfLength = Math.max(0, spacing * 0.5 - LED_TANGENT_GAP_PX * 0.5);
  return { transform, positions, tangentHalfLength, normalHalfThickness };
}

function sdfPolygon12(
  p: { x: number; y: number },
  pts: readonly (readonly [number, number])[],
) {
  let d = dist2(p, pts[0]);
  let s = 1;
  for (let i = 0; i < pts.length; i++) {
    const i0 = pts[i];
    const i1 = pts[(i + 1) % pts.length];
    const ex = i1[0] - i0[0];
    const ey = i1[1] - i0[1];
    const wx = p.x - i0[0];
    const wy = p.y - i0[1];
    const el2 = ex * ex + ey * ey;
    const t = el2 > 0 ? Math.min(1, Math.max(0, (wx * ex + wy * ey) / el2)) : 0;
    const bx = wx - ex * t;
    const by = wy - ey * t;
    d = Math.min(d, bx * bx + by * by);
    const c0 = p.y >= i0[1];
    const c1 = p.y < i1[1];
    const c2 = ex * wy > ey * wx;
    if ((c0 && c1 && c2) || (!c0 && !c1 && !c2)) s = -s;
  }
  return s * Math.sqrt(d);
}

function dist2(p: { x: number; y: number }, q: readonly [number, number]) {
  const dx = p.x - q[0];
  const dy = p.y - q[1];
  return dx * dx + dy * dy;
}

