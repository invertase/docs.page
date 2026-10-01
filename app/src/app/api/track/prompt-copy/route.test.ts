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

const { POST } = await import("./route");

const ENDPOINT = "https://docs.page/api/track/prompt-copy";

function post(url = ENDPOINT) {
  return POST(new Request(url, { method: "POST" }));
}

/** The beacon carries everything as query params — sendBeacon sends no body. */
function beacon(params: Record<string, string>) {
  return post(`${ENDPOINT}?${new URLSearchParams(params).toString()}`);
}

function lastProperties() {
  return captured.at(-1)?.properties ?? {};
}

beforeEach(() => {
  captured.length = 0;
});

describe("POST /api/track/prompt-copy", () => {
  test("answers 204 with no body", async () => {
    const response = post();

    expect(response.status).toBe(204);
    expect(await response.text()).toBe("");
  });

  test("records a prompt copy", () => {
    post();

    expect(captured).toHaveLength(1);
    expect(captured[0]?.event).toBe("homepage:prompt_copy");
    expect(captured[0]?.distinctId).toBe("test-visitor-id");
    expect(captured[0]?.properties?.$raw_user_agent).toBe("test-agent");
    // Cookieless: the daily visitor hash must never be promoted to a person.
    expect(captured[0]?.properties?.$process_person_profile).toBe(false);
  });

  test("records one event per request", () => {
    post();
    post();

    expect(captured.map((event) => event.event)).toEqual([
      "homepage:prompt_copy",
      "homepage:prompt_copy",
    ]);
  });

  // The one discriminator on the event, and the one user-controlled value the
  // route reads: it has to survive for the ids we ship and never for anything
  // else, or the humans/agents split is either missing or forgeable.
  test.each(["terminal", "agent"])("records the %s snippet", (snippet) => {
    beacon({ snippet });

    expect(captured).toHaveLength(1);
    expect(captured[0]?.event).toBe("homepage:prompt_copy");
    expect(lastProperties().snippet).toBe(snippet);
  });

  test("keeps the two snippets apart across copies", () => {
    beacon({ snippet: "terminal" });
    beacon({ snippet: "agent" });

    expect(captured.map((event) => event.properties?.snippet)).toEqual([
      "terminal",
      "agent",
    ]);
  });

  test.each([
    ["an unknown id", { snippet: "not-a-snippet" }],
    ["an id differing only in case", { snippet: "Agent" }],
    ["an empty id", { snippet: "" }],
    ["a would-be injection", { snippet: '{"$set":{"admin":true}}' }],
  ])("drops %s rather than echoing it", (_label, params) => {
    beacon(params);

    expect(captured).toHaveLength(1);
    // Absent, not present-and-empty: a bogus value must not become a property
    // value, and must not create a `snippet` breakdown bucket in PostHog.
    expect("snippet" in lastProperties()).toBe(false);
  });

  test("omits the property when the beacon carries no snippet", () => {
    post();

    expect(captured).toHaveLength(1);
    expect("snippet" in lastProperties()).toBe(false);
  });

  test("answers 204 whatever the snippet param says", async () => {
    for (const snippet of ["terminal", "agent", "not-a-snippet"]) {
      const response = beacon({ snippet });

      expect(response.status).toBe(204);
      expect(await response.text()).toBe("");
    }
  });

  test("attributes utm params carried on the beacon URL", () => {
    beacon({
      snippet: "agent",
      utm_source: "slack",
      utm_medium: "social",
      utm_campaign: "agent-ready",
      utm_term: "docs",
      utm_content: "hero",
      // Not one of the five keys we attribute on, so it must not be captured.
      utm_bogus: "nope",
    });

    expect(lastProperties()).toMatchObject({
      snippet: "agent",
      utm_source: "slack",
      utm_medium: "social",
      utm_campaign: "agent-ready",
      utm_term: "docs",
      utm_content: "hero",
    });
    expect("utm_bogus" in lastProperties()).toBe(false);
  });

  test("exports no GET or HEAD handler, so crawlers cannot record copies", async () => {
    const route = await import("./route");

    expect("GET" in route).toBe(false);
    expect("HEAD" in route).toBe(false);
  });
});
