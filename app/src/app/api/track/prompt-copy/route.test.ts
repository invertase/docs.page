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

function post(url = "https://docs.page/api/track/prompt-copy") {
  return POST(new Request(url, { method: "POST" }));
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

  test("exports no GET or HEAD handler, so crawlers cannot record copies", async () => {
    const route = await import("./route");

    expect("GET" in route).toBe(false);
    expect("HEAD" in route).toBe(false);
  });
});
