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

function get(url = "https://docs.page/get-started") {
  return GET(new Request(url));
}

beforeEach(() => {
  captured.length = 0;
});

describe("GET /get-started", () => {
  test("redirects to the hardcoded destination", () => {
    const response = get();
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("https://use.docs.page");
  });

  test("ignores any destination supplied on the query string", () => {
    const response = get(
      "https://docs.page/get-started?destination=https://evil.example.com",
    );
    expect(response.headers.get("Location")).toBe("https://use.docs.page");
  });

  test("records a click", () => {
    get();

    expect(captured).toHaveLength(1);
    expect(captured[0]?.event).toBe("homepage:cta_click");
    expect(captured[0]?.distinctId).toBe("test-visitor-id");
    expect(captured[0]?.properties?.cta).toBe("get-started");
    expect(captured[0]?.properties?.destination).toBe("https://use.docs.page");
    expect(captured[0]?.properties?.$process_person_profile).toBe(false);
    expect(captured[0]?.properties?.$raw_user_agent).toBe("test-agent");
  });

  test("carries utm params from the CTA link onto the event", () => {
    get("https://docs.page/get-started?utm_source=x&utm_campaign=launch");

    expect(captured[0]?.properties?.utm_source).toBe("x");
    expect(captured[0]?.properties?.utm_campaign).toBe("launch");
  });
});

describe("HEAD /get-started", () => {
  test("redirects exactly like GET", () => {
    const response = HEAD();
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe("https://use.docs.page");
  });

  // The reason HEAD is exported at all: link checkers, uptime monitors and
  // unfurl bots send HEAD, and an App-Router-derived HEAD would run GET's body
  // and record a click no human performed.
  test("does not record a click, while GET does", () => {
    HEAD();
    expect(captured).toEqual([]);

    get();
    expect(captured.map((event) => event.event)).toEqual([
      "homepage:cta_click",
    ]);
  });
});
