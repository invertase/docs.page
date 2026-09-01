/**
 * LED state + pointer brush glow, adapted from vgpu triangle-led-front
 * led-buffer.ts (rev 90b65bf4…). No RGB edge tints, no line bands, no GUI.
 */

import type { GlyphLedLayout, LedSeat } from "./outline";
import { MAX_LEDS } from "./outline";

export const LED_FLOATS = 8;
const COLOR_OFFSET = 4;
const MAX_FRAME_DELTA = 0.1;

export type BrushState = {
  x: number;
  y: number;
  active: boolean;
  isMouse: boolean;
  glowEnabled: boolean;
  glowRadius: number;
  glowStrength: number;
  glowSmoothing: number;
  glowFacingEnabled: boolean;
  glowFacingFullDeg: number;
  glowFacingZeroDeg: number;
};

export type SceneTunables = {
  ledIntensity: number;
  brightnessMin: number;
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
} as const;

export const TUNABLE_DEFAULTS: SceneTunables = {
  ledIntensity: 1,
  brightnessMin: 0.09,
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
};

export function buildLedGeometry(
  layout: GlyphLedLayout,
  previous?: LedGeometryState,
): LedGeometryState {
  const data = new Float32Array(MAX_LEDS * LED_FLOATS);
  const normals = new Float32Array(MAX_LEDS * 2);
  const count = Math.min(MAX_LEDS, layout.positions.length);
  for (let i = 0; i < count; i++) {
    writeSeat(data, normals, i, layout.positions[i]!);
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
  tunables: SceneTunables,
  brush: BrushState,
) {
  const frameDelta =
    leds.lastFrameTime === undefined
      ? 0
      : Math.max(0, Math.min(time - leds.lastFrameTime, MAX_FRAME_DELTA));
  leds.lastFrameTime = time;

  const base = clamp01(tunables.brightnessMin);
  for (let i = 0; i < leds.count; i++) {
    leds.data[i * LED_FLOATS + 2] = base;
  }

  const glowStrength = brush.glowStrength;
  const glowRadius = brush.glowRadius;
  const glowOn =
    brush.active &&
    brush.isMouse &&
    brush.glowEnabled &&
    glowStrength > 0 &&
    glowRadius > 0;

  if (glowOn || leds.glowDecaying) {
    const smoothing = brush.glowSmoothing;
    const alpha = smoothing > 0 ? 1 - Math.exp(-frameDelta / smoothing) : 1;
    const px = brush.x;
    const py = brush.y;
    const facingOn = brush.glowFacingEnabled;
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
        leds.data[slot + 2] = mix(leds.data[slot + 2] ?? 0, 1, eased);
      }
    }
    leds.glowDecaying = glowOn || anyActive;
  }
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
