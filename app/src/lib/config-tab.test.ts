import { describe, expect, test } from "bun:test";
import { matchesConfigTab } from "./config-tab";

describe("matchesConfigTab", () => {
  test("shows items without a tab restriction", () => {
    expect(matchesConfigTab(undefined, "backend")).toBe(true);
    expect(matchesConfigTab(undefined, undefined)).toBe(true);
  });

  test("matches a single tab string", () => {
    expect(matchesConfigTab("backend", "backend")).toBe(true);
    expect(matchesConfigTab("backend", "frontend")).toBe(false);
  });

  test("matches when the active tab is included in an array", () => {
    expect(matchesConfigTab(["backend", "frontend"], "backend")).toBe(true);
    expect(matchesConfigTab(["backend", "frontend"], "frontend")).toBe(true);
    expect(matchesConfigTab(["backend", "frontend"], "debugging")).toBe(false);
  });

  test("shows restricted items when no tab is active", () => {
    expect(matchesConfigTab("backend", undefined)).toBe(true);
    expect(matchesConfigTab(["backend", "frontend"], undefined)).toBe(true);
  });
});
