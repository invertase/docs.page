/**
 * LED state + lines rest motion + pointer brush glow from vgpu
 * triangle-led-front led-buffer.ts (rev 90b65bf4…). One wrap around the
 * traced Lexend outline instead of three triangle edges. Honey only —
 * no RGB edge tints, edge mode, or GUI.
 */

import type { GlyphLedLayout, LedSeat } from "./outline";
import { LEDS_PER_EDGE, MAX_LEDS } from "./outline";

export const LED_FLOATS = 8;
const COLOR_OFFSET = 4;
const MAX_FRAME_DELTA = 0.1;

export const LED_SDF_CROP_EXPANSION_PX = 2;
export const LED_EMITTER_MESH_EXPANSION_PX = 1;
export const BRIGHTNESS_MIN_HOVER_MULTIPLIER = 4;
export const BRIGHTNESS_MIN_HOVER_SMOOTHING = 0.2;
export const NOISE_ROTATION_START_SECONDS = 10;

const LINE_CENTERS_START = [6, 6, 6] as const;
const LINE_VELOCITIES = [-3.302, -2.355, -1.636] as const;
const LINE_SIZE_MIN = LEDS_PER_EDGE;
const LINE_SIZE_MAX = LEDS_PER_EDGE * 1.7;
const LINE_SIZE_MID = (LINE_SIZE_MIN + LINE_SIZE_MAX) / 2;
const LINE_SIZE_AMP = (LINE_SIZE_MAX - LINE_SIZE_MIN) / 2;
const LINE_SIZE_FREQ = [0.41, 0.31, 0.23] as const;
const LINE_SIZE_PHASE = [0, 2.1, 4.2] as const;
const LINE_FADE_FREQ = [0.52, 0.38, 0.28] as const;
const LINE_FADE_PHASE = [Math.PI / 2, 0.4, -0.6] as const;
const HOVER_FADE_SECONDS = 0.3;
const HOVER_HYSTERESIS = 1.2;

export type BrushState = {
  x: number;
  y: number;
  active: boolean;
  inside: boolean;
  isMouse: boolean;
  glowEnabled: boolean;
  glowRadius: number;
  glowStrength: number;
  glowSmoothing: number;
  glowFacingEnabled: boolean;
  glowFacingFullDeg: number;
  glowFacingZeroDeg: number;
  linesFadeDistance: number;
};

export type SceneTunables = {
  ledIntensity: number;
  brightnessMin: number;
  brightnessMinDark: number;
  brightnessMax: number;
};

/** Official DEFAULT_BRUSH radii, in CSS px; converted to scene px at the call site. */
export const DEFAULT_BRUSH = {
  glowEnabled: true,
  glowRadius: 165,
  glowStrength: 1,
  glowSmoothing: 0.23,
  glowFacingEnabled: true,
  glowFacingFullDeg: 90,
  glowFacingZeroDeg: 100,
  linesFadeDistance: 0.6,
} as const;

export const TUNABLE_DEFAULTS: SceneTunables = {
  ledIntensity: 1,
  brightnessMin: 0.09,
  brightnessMinDark: 0.05,
  brightnessMax: 1,
};

export type LedGeometryState = {
  data: Float32Array;
  normals: Float32Array;
  glowState: Float32Array;
  glowDecaying: boolean;
  lastFrameTime: number | undefined;
  count: number;
  tangentHalfLength: number;
  normalHalfThickness: number;
  glyphHeight: number;
  animationClock: number;
  lineCenters: Float32Array;
  lineVelocities: Float32Array;
  hoverTransition: number;
  hoverActive: boolean;
};

export function buildLedGeometry(
  layout: GlyphLedLayout,
  previous?: LedGeometryState,
): LedGeometryState {
  const data = new Float32Array(MAX_LEDS * LED_FLOATS);
  const normals = new Float32Array(MAX_LEDS * 2);
  const count = Math.min(MAX_LEDS, layout.positions.length);
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < count; i++) {
    const seat = layout.positions[i]!;
    writeSeat(data, normals, i, seat);
    if (seat.y < minY) minY = seat.y;
    if (seat.y > maxY) maxY = seat.y;
  }
  return {
    data,
    normals,
    glowState: previous?.glowState ?? new Float32Array(MAX_LEDS),
    glowDecaying: previous?.glowDecaying ?? false,
    lastFrameTime: previous?.lastFrameTime,
    count,
    tangentHalfLength: layout.shape.tangentHalfLength,
    normalHalfThickness: layout.shape.normalHalfThickness,
    glyphHeight: Number.isFinite(maxY - minY) ? Math.max(1, maxY - minY) : 1,
    animationClock: previous?.animationClock ?? NOISE_ROTATION_START_SECONDS,
    lineCenters: previous?.lineCenters ?? Float32Array.from(LINE_CENTERS_START),
    lineVelocities:
      previous?.lineVelocities ?? Float32Array.from(LINE_VELOCITIES),
    hoverTransition: previous?.hoverTransition ?? 0,
    hoverActive: previous?.hoverActive ?? false,
  };
}

function writeSeat(
  data: Float32Array,
  normals: Float32Array,
  i: number,
  seat: LedSeat,
) {
  const base = i * LED_FLOATS;
  data[base] = seat.x;
  data[base + 1] = seat.y;
  data[base + 2] = 0;
  data[base + 3] = seat.angle;
  data[base + COLOR_OFFSET] = 1;
  data[base + COLOR_OFFSET + 1] = 1;
  data[base + COLOR_OFFSET + 2] = 1;
  data[base + COLOR_OFFSET + 3] = 0;
  normals[i * 2] = seat.nx;
  normals[i * 2 + 1] = seat.ny;
}

export function computeLeds(
  leds: LedGeometryState,
  time: number,
  _tunables: SceneTunables,
  brush: BrushState,
  honey: readonly [number, number, number],
) {
  const firstFrame = leds.lastFrameTime === undefined;
  const frameDelta =
    leds.lastFrameTime === undefined
      ? 0
      : Math.max(0, Math.min(time - leds.lastFrameTime, MAX_FRAME_DELTA));
  leds.lastFrameTime = time;
  if (firstFrame) leds.animationClock = NOISE_ROTATION_START_SECONDS;
  leds.animationClock += frameDelta;
  const animTime = leds.animationClock;

  updateLines(leds, animTime, frameDelta);

  const linesHoverEnabled = (brush.linesFadeDistance ?? 0) > 0;
  let hoverTransition = 0;
  if (linesHoverEnabled) {
    let hoverTarget = 0;
    if (
      brush.active === true &&
      brush.isMouse === true &&
      brush.inside !== true
    ) {
      const enter = (brush.linesFadeDistance ?? 0) * leds.glyphHeight;
      const distance = outlineApproachDistance(leds, brush.x, brush.y);
      if (!leds.hoverActive && distance < enter) leds.hoverActive = true;
      else if (leds.hoverActive && distance > enter * HOVER_HYSTERESIS)
        leds.hoverActive = false;
      hoverTarget = leds.hoverActive ? 1 : 0;
    } else {
      leds.hoverActive = false;
    }
    if (leds.hoverTransition > 0.0001 || hoverTarget > 0) {
      const alpha =
        HOVER_FADE_SECONDS > 0
          ? 1 - Math.exp(-frameDelta / HOVER_FADE_SECONDS)
          : 1;
      leds.hoverTransition += (hoverTarget - leds.hoverTransition) * alpha;
    }
    hoverTransition = clamp01(leds.hoverTransition);
    if (hoverTransition > 0.0001) {
      const linesFade = 1 - hoverTransition;
      for (let i = 0; i < leds.count; i++) {
        leds.data[i * LED_FLOATS + 2] *= linesFade;
      }
    }
  } else if (leds.hoverTransition !== 0 || leds.hoverActive) {
    leds.hoverTransition = 0;
    leds.hoverActive = false;
  }

  const [hr, hg, hb] = honey;
  for (let i = 0; i < leds.count; i++) {
    const slot = i * LED_FLOATS;
    leds.data[slot + COLOR_OFFSET] = hr;
    leds.data[slot + COLOR_OFFSET + 1] = hg;
    leds.data[slot + COLOR_OFFSET + 2] = hb;
  }
  for (let i = leds.count; i < MAX_LEDS; i++) {
    leds.data[i * LED_FLOATS + 2] = 0;
  }

  const hoverGate = linesHoverEnabled ? hoverTransition : 1;
  const glowStrength = brush.glowStrength;
  const glowRadius = brush.glowRadius;
  const glowOn =
    brush.active === true &&
    brush.isMouse === true &&
    brush.glowEnabled === true &&
    glowStrength > 0 &&
    glowRadius > 0;

  if (glowOn || leds.glowDecaying) {
    const smoothing = brush.glowSmoothing;
    const alpha = smoothing > 0 ? 1 - Math.exp(-frameDelta / smoothing) : 1;
    const px = brush.x;
    const py = brush.y;
    const facingOn = brush.glowFacingEnabled === true;
    const facingCosFull = Math.cos((brush.glowFacingFullDeg * Math.PI) / 180);
    const facingCosZero = Math.cos((brush.glowFacingZeroDeg * Math.PI) / 180);
    const facingDenom = facingCosFull - facingCosZero;
    let anyActive = false;
    for (let i = 0; i < leds.count; i++) {
      const slot = i * LED_FLOATS;
      let target = 0;
      if (glowOn) {
        const dx = (leds.data[slot] ?? 0) - px;
        const dy = (leds.data[slot + 1] ?? 0) - py;
        const distance = Math.hypot(dx, dy);
        target = glowStrength * (1 - smoothstep(0, glowRadius, distance));
        if (facingOn && target > 0 && distance > 1e-4) {
          const cos =
            (leds.normals[i * 2] ?? 0) * (-dx / distance) +
            (leds.normals[i * 2 + 1] ?? 0) * (-dy / distance);
          const facing =
            facingDenom > 1e-6
              ? clamp01((cos - facingCosZero) / facingDenom)
              : cos >= facingCosFull
                ? 1
                : 0;
          target *= facing;
        }
      }
      const eased =
        (leds.glowState[i] ?? 0) + (target - (leds.glowState[i] ?? 0)) * alpha;
      leds.glowState[i] = eased;
      if (eased > 0.0001) {
        anyActive = true;
        const lift = eased * hoverGate;
        if (lift > 0.0001)
          leds.data[slot + 2] = mix(leds.data[slot + 2] ?? 0, 1, lift);
      }
    }
    leds.glowDecaying = glowOn || anyActive;
  }
}

function updateLines(
  leds: LedGeometryState,
  animTime: number,
  boostedDelta: number,
) {
  const count = leds.count;
  if (count <= 0) return;
  for (let k = 0; k < 3; k++) {
    leds.lineCenters[k] = wrapIndex(
      (leds.lineCenters[k] ?? 0) + (leds.lineVelocities[k] ?? 0) * boostedDelta,
      count,
    );
  }
  const fadeTime = animTime - NOISE_ROTATION_START_SECONDS;
  const halfByBand: number[] = [];
  const plateauByBand: number[] = [];
  const fadeByBand: number[] = [];
  for (let k = 0; k < 3; k++) {
    const size =
      LINE_SIZE_MID +
      LINE_SIZE_AMP *
        Math.sin(
          fadeTime * (LINE_SIZE_FREQ[k] ?? 0) + (LINE_SIZE_PHASE[k] ?? 0),
        );
    const half = Math.max(1, size * 0.5);
    halfByBand[k] = half;
    plateauByBand[k] = half * 0.5;
    fadeByBand[k] =
      0.5 +
      0.5 *
        Math.sin(
          fadeTime * (LINE_FADE_FREQ[k] ?? 0) + (LINE_FADE_PHASE[k] ?? 0),
        );
  }
  for (let i = 0; i < count; i++) {
    let coverage = 0;
    for (let k = 0; k < 3; k++) {
      const distance = Math.abs(
        signedWrappedDistance(i, leds.lineCenters[k] ?? 0, count),
      );
      const half = halfByBand[k] ?? 1;
      const plateau = plateauByBand[k] ?? 0;
      let profile = 0;
      if (distance <= plateau) {
        profile = 1;
      } else {
        profile = clamp01(1 - (distance - plateau) / (half - plateau));
      }
      coverage = Math.max(coverage, profile * (fadeByBand[k] ?? 0));
    }
    leds.data[i * LED_FLOATS + 2] = clamp01(coverage);
  }
}

function outlineApproachDistance(
  leds: LedGeometryState,
  px: number,
  py: number,
) {
  let nearest = Number.POSITIVE_INFINITY;
  for (let i = 0; i < leds.count; i++) {
    const base = i * LED_FLOATS;
    const distance = Math.hypot(
      (leds.data[base] ?? 0) - px,
      (leds.data[base + 1] ?? 0) - py,
    );
    if (distance < nearest) nearest = distance;
  }
  return nearest;
}

function signedWrappedDistance(a: number, b: number, period: number) {
  return ((((a - b) % period) + period + period / 2) % period) - period / 2;
}

function wrapIndex(value: number, count: number) {
  if (count <= 0) return 0;
  return ((value % count) + count) % count;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}
