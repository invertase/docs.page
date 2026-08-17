import { beforeEach, describe, expect, mock, test } from "bun:test";

type CapturedEvent = {
  distinctId: string;
  event: string;
  properties?: Record<string, unknown>;
};

const captured: CapturedEvent[] = [];

// Stub the PostHog client before importing the route, so the capture is
// observable in-process and a test run can never emit a real event — the module
// is replaced, so no key is read and no request is ever made.
mock.module("@/lib/posthog", () => ({
  getPostHogClient: () => ({
    capture: (event: CapturedEvent) => {
      captured.push(event);
    },
  }),
  readVisitorHeaders: () => ({ ip: "203.0.113.1", userAgent: "test-agent" }),
  visitorId: () => "test-visitor-id",
}));

const { GET, HEAD } = await import("./route");

function get(cta: string, url = `https://docs.page/api/go/${cta}`) {
  return GET(new Request(url), { params: Promise.resolve({ cta }) });
}

function head(cta: string, url = `https://docs.page/api/go/${cta}`) {
  return HEAD(new Request(url, { method: "HEAD" }), {
    params: Promise.resolve({ cta }),
  });
}

beforeEach(() => {
  captured.length = 0;
});

describe("GET /api/go/[cta]", () => {
  test("redirects known CTAs to their hardcoded destination", async () => {
    const hero = await get("get-started");
    expect(hero.status).toBe(302);
    expect(hero.headers.get("Location")).toBe("https://use.docs.page");

    const footer = await get("quickstart");
    expect(footer.status).toBe(302);
    expect(footer.headers.get("Location")).toBe(
      "https://use.docs.page/quickstart",
    );
  });

  test("is never cached, so the capture always runs", async () => {
    const response = await get("get-started");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("CDN-Cache-Control")).toBe("no-store");
  });

  test("sends unknown slugs to the homepage instead of an arbitrary host", async () => {
    for (const cta of ["nope", "toString", "constructor", "__proto__"]) {
      const response = await get(cta);
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe("/");
    }
  });

  test("ignores any destination supplied on the query string", async () => {
    const response = await get(
      "get-started",
      "https://docs.page/api/go/get-started?destination=https://evil.example.com",
    );
    expect(response.headers.get("Location")).toBe("https://use.docs.page");
  });

  test("records a click for a known CTA", async () => {
    await get("get-started");

    expect(captured).toHaveLength(1);
    expect(captured[0]?.event).toBe("homepage:cta_click");
    expect(captured[0]?.properties?.cta).toBe("get-started");
    expect(captured[0]?.properties?.destination).toBe("https://use.docs.page");
  });

  test("records no click for an unknown slug", async () => {
    await get("nope");
    expect(captured).toHaveLength(0);
  });
});

describe("HEAD /api/go/[cta]", () => {
  test("redirects exactly like GET, uncached", async () => {
    const hero = await head("get-started");
    expect(hero.status).toBe(302);
    expect(hero.headers.get("Location")).toBe("https://use.docs.page");
    expect(hero.headers.get("Cache-Control")).toBe("no-store");
    expect(hero.headers.get("CDN-Cache-Control")).toBe("no-store");

    const footer = await head("quickstart");
    expect(footer.status).toBe(302);
    expect(footer.headers.get("Location")).toBe(
      "https://use.docs.page/quickstart",
    );
  });

  test("sends unknown slugs to the homepage, like GET", async () => {
    for (const cta of ["nope", "toString", "constructor", "__proto__"]) {
      const response = await head(cta);
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe("/");
    }
  });

  // The reason HEAD is exported at all: link checkers, uptime monitors and
  // unfurl bots send HEAD, and an App-Router-derived HEAD would run GET's body
  // and record a click no human performed.
  test("does not record a click, while GET does", async () => {
    await head("get-started");
    expect(captured).toEqual([]);

    await get("get-started");
    expect(captured.map((event) => event.event)).toEqual([
      "homepage:cta_click",
    ]);
  });
});
