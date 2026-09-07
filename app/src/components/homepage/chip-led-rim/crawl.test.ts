import { describe, expect, test } from "bun:test";
import {
  BRIGHTNESS_MIN,
  clamp01,
  createCrawlState,
  HONEY_SRGB,
  ledCountForPerimeter,
  mixSrgb,
  PERIWINKLE_SRGB,
  ringDistance,
  roundedRectPerimeter,
  sampleRoundedRect,
  stepCrawl,
  wrap01,
} from "./crawl";

describe("chip LED crawl", () => {
  test("wrap01 stays on the unit ring", () => {
    expect(wrap01(0)).toBe(0);
    expect(wrap01(1)).toBe(0);
    expect(wrap01(-0.25)).toBeCloseTo(0.75);
    expect(wrap01(1.25)).toBeCloseTo(0.25);
  });

  test("ringDistance is the shortest arc", () => {
    expect(ringDistance(0.05, 0.95)).toBeCloseTo(0.1);
    expect(ringDistance(0.2, 0.2)).toBe(0);
    expect(ringDistance(0, 0.5)).toBeCloseTo(0.5);
  });

  test("mixSrgb lerps honey to periwinkle", () => {
    expect(mixSrgb(HONEY_SRGB, PERIWINKLE_SRGB, 0)).toEqual(HONEY_SRGB);
    expect(mixSrgb(HONEY_SRGB, PERIWINKLE_SRGB, 1)).toEqual(PERIWINKLE_SRGB);
    const mid = mixSrgb(HONEY_SRGB, PERIWINKLE_SRGB, 0.5);
    expect(mid.r).toBeCloseTo((230 + 83) / 2);
    expect(mid.g).toBeCloseTo((145 + 104) / 2);
    expect(mid.b).toBeCloseTo((53 + 189) / 2);
  });

  test("sampleRoundedRect follows the perimeter and stays on the box", () => {
    const sites = sampleRoundedRect(0, 0, 200, 40, 12, 80);
    expect(sites).toHaveLength(80);
    for (const site of sites) {
      expect(site.x).toBeGreaterThanOrEqual(-0.01);
      expect(site.x).toBeLessThanOrEqual(200.01);
      expect(site.y).toBeGreaterThanOrEqual(-0.01);
      expect(site.y).toBeLessThanOrEqual(40.01);
    }
    const onTop = sites.filter((site) => site.y < 0.5);
    const onRight = sites.filter((site) => site.x > 199.5);
    expect(onTop.length).toBeGreaterThan(8);
    expect(onRight.length).toBeGreaterThan(2);
  });

  test("led count scales with perimeter but never drops below 48", () => {
    expect(ledCountForPerimeter(20)).toBe(48);
    expect(
      ledCountForPerimeter(roundedRectPerimeter(400, 50, 12)),
    ).toBeGreaterThan(80);
  });

  test("idle crawl stays honey; deploy target reaches periwinkle", () => {
    const idle = createCrawlState();
    const idleFrame = stepCrawl(idle, 1, 64, 0, false);
    expect(idleFrame.color).toEqual(HONEY_SRGB);
    expect(idleFrame.brightness.length).toBe(64);
    expect(Math.min(...idleFrame.brightness)).toBeGreaterThanOrEqual(
      BRIGHTNESS_MIN - 1e-6,
    );

    const deploying = createCrawlState();
    let last = stepCrawl(deploying, 0, 64, 1, false);
    for (let i = 1; i <= 40; i++) {
      last = stepCrawl(deploying, i * 0.05, 64, 1, false);
    }
    expect(last.deploy).toBeCloseTo(1);
    expect(last.color).toEqual(PERIWINKLE_SRGB);
  });

  test("reduced motion freezes crawl but still deploys colour", () => {
    const state = createCrawlState();
    const first = stepCrawl(state, 0, 32, 0, true);
    const second = stepCrawl(state, 0.5, 32, 0, true);
    expect([...first.brightness]).toEqual([...second.brightness]);
    expect(
      first.brightness.every((value) => Math.abs(value - 0.45) < 1e-5),
    ).toBe(true);

    for (let i = 1; i <= 40; i++) {
      stepCrawl(state, 0.5 + i * 0.05, 32, 1, true);
    }
    expect(state.deploy).toBeCloseTo(1);
    expect(stepCrawl(state, 3, 32, 1, true).color).toEqual(PERIWINKLE_SRGB);
  });

  test("clamp01 saturates", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.4)).toBe(0.4);
  });
});
