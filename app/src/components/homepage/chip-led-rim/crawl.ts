/**
 * Honey/periwinkle LED crawl for the homepage copy chip.
 *
 * Ports the 404 hex `updateLines` family (three travelling bands, oscillating
 * length/fade, hold deploy to periwinkle) onto a rounded-rect perimeter. The
 * 404 renderer is a full WebGPU hex scene — too heavy for a ~1px chip border —
 * so this keeps the same motion and brand colours in 2D canvas.
 *
 * Colours match `not-found-triangle-led.tsx` / `led-buffer.ts` on
 * `cursor/404-shader-dissolve-7370`: honey `#E69135` idle, periwinkle `#5368BD`
 * while the copy control is held or the 2s copied tick is showing.
 */

export const HONEY = "#E69135";
export const PERIWINKLE = "#5368BD";

export const HONEY_SRGB = { r: 230, g: 145, b: 53 } as const;
export const PERIWINKLE_SRGB = { r: 83, g: 104, b: 189 } as const;

/** Same family as 404 `HOVER_RGB_TINT_DEFAULTS.responseSmoothing`. */
export const DEPLOY_SMOOTHING = 0.2;
/** 404 `CLICK_SPEED_BOOST_PEAK` — crawl races during the honey→blue lerp. */
export const CLICK_SPEED_BOOST_PEAK = 10;
export const MAX_FRAME_DELTA = 0.1;
export const BRIGHTNESS_MIN = 0.08;
export const BRIGHTNESS_MAX = 1;
export const LED_SPACING_PX = 6.5;

const LINE_VELOCITIES = [-6.604, -4.71, -3.272] as const;
const LINE_SIZE_FREQ = [0.41, 0.31, 0.23] as const;
const LINE_SIZE_PHASE = [0, 2.1, 4.2] as const;
const LINE_FADE_FREQ = [0.52, 0.38, 0.28] as const;
const LINE_FADE_PHASE = [Math.PI / 2, 0.4, -0.6] as const;

export interface Srgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

export interface LedSite {
  x: number;
  y: number;
  angle: number;
}

export interface CrawlState {
  lineCenters: Float32Array;
  animationClock: number;
  lastFrameTime: number | undefined;
  deploy: number;
}

export function createCrawlState(): CrawlState {
  return {
    lineCenters: new Float32Array([0, 0.33, 0.66]),
    animationClock: 0,
    lastFrameTime: undefined,
    deploy: 0,
  };
}

export function mixSrgb(from: Srgb, to: Srgb, t: number): Srgb {
  const x = clamp01(t);
  return {
    r: from.r + (to.r - from.r) * x,
    g: from.g + (to.g - from.g) * x,
    b: from.b + (to.b - from.b) * x,
  };
}

export function srgbCss(color: Srgb, alpha = 1): string {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clamp01(alpha)})`;
}

export function ledCountForPerimeter(perimeter: number): number {
  return Math.max(48, Math.round(perimeter / LED_SPACING_PX));
}

/**
 * Sample `count` LED sites clockwise from the top edge, including the four
 * corner arcs so the strip follows `border-radius` instead of cutting corners.
 */
export function sampleRoundedRect(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  count: number,
): LedSite[] {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  const straightW = Math.max(0, width - 2 * r);
  const straightH = Math.max(0, height - 2 * r);
  const arc = r * (Math.PI / 2);
  const segments: PerimeterSegment[] = [
    { kind: "line", x0: x + r, y0: y, dx: 1, dy: 0, len: straightW },
    {
      kind: "arc",
      cx: x + width - r,
      cy: y + r,
      a0: -Math.PI / 2,
      sweep: Math.PI / 2,
      len: arc,
    },
    { kind: "line", x0: x + width, y0: y + r, dx: 0, dy: 1, len: straightH },
    {
      kind: "arc",
      cx: x + width - r,
      cy: y + height - r,
      a0: 0,
      sweep: Math.PI / 2,
      len: arc,
    },
    {
      kind: "line",
      x0: x + width - r,
      y0: y + height,
      dx: -1,
      dy: 0,
      len: straightW,
    },
    {
      kind: "arc",
      cx: x + r,
      cy: y + height - r,
      a0: Math.PI / 2,
      sweep: Math.PI / 2,
      len: arc,
    },
    { kind: "line", x0: x, y0: y + height - r, dx: 0, dy: -1, len: straightH },
    {
      kind: "arc",
      cx: x + r,
      cy: y + r,
      a0: Math.PI,
      sweep: Math.PI / 2,
      len: arc,
    },
  ];
  const perimeter = segments.reduce((sum, segment) => sum + segment.len, 0);
  const sites: LedSite[] = [];
  if (perimeter <= 0 || count <= 0) return sites;

  for (let i = 0; i < count; i++) {
    sites.push(pointOnPerimeter(segments, ((i + 0.5) / count) * perimeter));
  }
  return sites;
}

export function roundedRectPerimeter(
  width: number,
  height: number,
  radius: number,
): number {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  return 2 * (width + height - 4 * r) + 2 * Math.PI * r;
}

export function stepCrawl(
  state: CrawlState,
  time: number,
  ledCount: number,
  deployTarget: number,
  reduceMotion: boolean,
): { brightness: Float32Array; color: Srgb; deploy: number } {
  const lastFrameTime = state.lastFrameTime;
  const firstFrame = lastFrameTime === undefined;
  const frameDelta = firstFrame
    ? 0
    : Math.max(0, Math.min(time - lastFrameTime, MAX_FRAME_DELTA));
  state.lastFrameTime = time;

  state.deploy = smoothExp(
    state.deploy,
    deployTarget,
    frameDelta,
    DEPLOY_SMOOTHING,
  );
  const clickBoost =
    1 +
    (CLICK_SPEED_BOOST_PEAK - 1) * Math.sin(clamp01(state.deploy) * Math.PI);
  const boostedDelta = reduceMotion ? 0 : frameDelta * clickBoost;
  state.animationClock += boostedDelta;

  const brightness = new Float32Array(ledCount);
  if (ledCount <= 0) {
    return {
      brightness,
      color: mixSrgb(HONEY_SRGB, PERIWINKLE_SRGB, state.deploy),
      deploy: state.deploy,
    };
  }

  if (reduceMotion) {
    brightness.fill(0.45);
  } else {
    advanceBands(state, boostedDelta);
    fillBandBrightness(brightness, state, ledCount);
  }

  return {
    brightness,
    color: mixSrgb(HONEY_SRGB, PERIWINKLE_SRGB, state.deploy),
    deploy: state.deploy,
  };
}

export function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function wrap01(value: number): number {
  return ((value % 1) + 1) % 1;
}

/** Shortest distance on a unit ring, in [0, 0.5]. */
export function ringDistance(a: number, b: number): number {
  const delta = Math.abs(wrap01(a) - wrap01(b));
  return Math.min(delta, 1 - delta);
}

function advanceBands(state: CrawlState, boostedDelta: number) {
  for (let k = 0; k < 3; k++) {
    const velocity = LINE_VELOCITIES[k] ?? 0;
    // Velocities are "LEDs per second" on the 144-LED hex ring. Convert to a
    // unit-ring fraction so a chip with a different LED count crawls at the
    // same visual speed.
    state.lineCenters[k] = wrap01(
      (state.lineCenters[k] ?? 0) + (velocity / 144) * boostedDelta,
    );
  }
}

function fillBandBrightness(
  brightness: Float32Array,
  state: CrawlState,
  ledCount: number,
) {
  const fadeTime = state.animationClock;
  const halfByBand: number[] = [];
  const plateauByBand: number[] = [];
  const fadeByBand: number[] = [];

  for (let k = 0; k < 3; k++) {
    // Hex bands span ~1/3–1/2 of the ring. Keep that ratio, not a fixed LED count.
    const sizeMin = 48 / 144;
    const sizeMax = 81.6 / 144;
    const mid = (sizeMin + sizeMax) / 2;
    const amp = (sizeMax - sizeMin) / 2;
    const size =
      mid +
      amp *
        Math.sin(
          fadeTime * (LINE_SIZE_FREQ[k] ?? 0) + (LINE_SIZE_PHASE[k] ?? 0),
        );
    const half = Math.max(1 / ledCount, size * 0.5);
    halfByBand[k] = half;
    plateauByBand[k] = half * 0.5;
    fadeByBand[k] =
      0.5 +
      0.5 *
        Math.sin(
          fadeTime * (LINE_FADE_FREQ[k] ?? 0) + (LINE_FADE_PHASE[k] ?? 0),
        );
  }

  for (let i = 0; i < ledCount; i++) {
    const u = (i + 0.5) / ledCount;
    let coverage = 0;
    for (let k = 0; k < 3; k++) {
      const distance = ringDistance(u, state.lineCenters[k] ?? 0);
      const half = halfByBand[k] ?? 1;
      const plateau = plateauByBand[k] ?? 0;
      let profile = 0;
      if (distance <= plateau) {
        profile = 1;
      } else if (half > plateau) {
        profile = clamp01(1 - (distance - plateau) / (half - plateau));
      }
      coverage = Math.max(coverage, profile * (fadeByBand[k] ?? 0));
    }
    brightness[i] =
      BRIGHTNESS_MIN + (BRIGHTNESS_MAX - BRIGHTNESS_MIN) * clamp01(coverage);
  }
}

function smoothExp(
  current: number,
  target: number,
  dt: number,
  smoothing: number,
): number {
  if (smoothing <= 0 || !Number.isFinite(smoothing)) return target;
  const alpha = 1 - Math.exp(-Math.max(0, dt) / smoothing);
  const next = current + (target - current) * alpha;
  return Math.abs(next - target) < 0.0001 ? target : next;
}

type PerimeterSegment =
  | {
      kind: "line";
      x0: number;
      y0: number;
      dx: number;
      dy: number;
      len: number;
    }
  | {
      kind: "arc";
      cx: number;
      cy: number;
      a0: number;
      sweep: number;
      len: number;
    };

function pointOnPerimeter(
  segments: PerimeterSegment[],
  distance: number,
): LedSite {
  let remaining = distance;
  for (const segment of segments) {
    if (remaining > segment.len && segment !== segments[segments.length - 1]) {
      remaining -= segment.len;
      continue;
    }
    if (segment.kind === "line") {
      return {
        x: segment.x0 + segment.dx * remaining,
        y: segment.y0 + segment.dy * remaining,
        angle: Math.atan2(segment.dy, segment.dx),
      };
    }
    const t = segment.len > 0 ? remaining / segment.len : 0;
    const angle = segment.a0 + segment.sweep * t;
    return {
      x: segment.cx + Math.cos(angle) * (segment.len / (Math.PI / 2)),
      y: segment.cy + Math.sin(angle) * (segment.len / (Math.PI / 2)),
      angle: angle + Math.PI / 2,
    };
  }
  return { x: 0, y: 0, angle: 0 };
}
