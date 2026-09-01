import { describe, expect, test } from "bun:test";
import {
  buildLedGeometry,
  computeLeds,
  DEFAULT_BRUSH,
  LED_FLOATS,
  NOISE_ROTATION_START_SECONDS,
  TUNABLE_DEFAULTS,
} from "./led-buffer";
import type { GlyphLedLayout } from "./outline";

function ringLayout(count: number): GlyphLedLayout {
  const positions = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    return {
      x: 200 + Math.cos(angle) * 80,
      y: 200 + Math.sin(angle) * 80,
      angle,
      nx: Math.cos(angle),
      ny: Math.sin(angle),
    };
  });
  return {
    positions,
    shape: {
      normalHalfThickness: 4,
      tangentHalfLength: 6,
      centerSpacing: 14,
    },
  };
}

function brightness(leds: ReturnType<typeof buildLedGeometry>) {
  return Array.from(
    { length: leds.count },
    (_, i) => leds.data[i * LED_FLOATS + 2] ?? 0,
  );
}

const idleBrush = {
  ...DEFAULT_BRUSH,
  x: -1000,
  y: -1000,
  active: false,
  inside: false,
  isMouse: false,
};

const honey = [1, 0.5, 0.1] as const;

describe("404 LED lines rest motion", () => {
  test("starts the official animation clock at 10s and crawls bands around the ring", () => {
    const leds = buildLedGeometry(ringLayout(72));
    computeLeds(leds, 0, TUNABLE_DEFAULTS, idleBrush, honey);
    expect(leds.animationClock).toBe(NOISE_ROTATION_START_SECONDS);

    computeLeds(leds, 0.5, TUNABLE_DEFAULTS, idleBrush, honey);
    const first = brightness(leds);
    expect(Math.max(...first)).toBeGreaterThan(0.2);
    expect(Math.max(...first) - Math.min(...first)).toBeGreaterThan(0.2);

    computeLeds(leds, 1.0, TUNABLE_DEFAULTS, idleBrush, honey);
    const later = brightness(leds);
    const shifted = first.some(
      (value, i) => Math.abs(value - (later[i] ?? 0)) > 0.05,
    );
    expect(shifted).toBe(true);
  });

  test("fades idle bands on pointer approach so local glow can lift", () => {
    const leds = buildLedGeometry(ringLayout(72));
    computeLeds(leds, 0, TUNABLE_DEFAULTS, idleBrush, honey);
    computeLeds(leds, 0.2, TUNABLE_DEFAULTS, idleBrush, honey);
    const idleMax = Math.max(...brightness(leds));

    const approach = {
      ...DEFAULT_BRUSH,
      glowEnabled: false,
      x: 200 + 80 + 20,
      y: 200,
      active: true,
      inside: false,
      isMouse: true,
    };
    for (let t = 0.3; t <= 1.2; t += 0.1) {
      computeLeds(leds, t, TUNABLE_DEFAULTS, approach, honey);
    }
    expect(leds.hoverActive).toBe(true);
    expect(leds.hoverTransition).toBeGreaterThan(0.5);
    expect(Math.max(...brightness(leds))).toBeLessThan(idleMax);
  });
});
