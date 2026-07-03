import { describe, expect, test } from "bun:test";
import { visitorId } from "./posthog";

describe("visitorId", () => {
  const day = new Date("2026-07-03T12:00:00Z");

  test("is deterministic for the same inputs on the same UTC day", () => {
    const a = visitorId("203.0.113.1", "Mozilla/5.0", day);
    const b = visitorId(
      "203.0.113.1",
      "Mozilla/5.0",
      new Date("2026-07-03T23:59:59Z"),
    );
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  test("rotates daily", () => {
    const today = visitorId("203.0.113.1", "Mozilla/5.0", day);
    const tomorrow = visitorId(
      "203.0.113.1",
      "Mozilla/5.0",
      new Date("2026-07-04T00:00:00Z"),
    );
    expect(today).not.toBe(tomorrow);
  });

  test("differs by IP and by User-Agent", () => {
    const base = visitorId("203.0.113.1", "Mozilla/5.0", day);
    expect(visitorId("203.0.113.2", "Mozilla/5.0", day)).not.toBe(base);
    expect(visitorId("203.0.113.1", "curl/8.4.0", day)).not.toBe(base);
  });

  test("handles missing IP/UA gracefully with a stable per-day hash", () => {
    const a = visitorId(null, undefined, day);
    const b = visitorId(null, undefined, day);
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });
});
