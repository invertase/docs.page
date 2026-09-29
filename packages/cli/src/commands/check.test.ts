import { afterEach, describe, expect, test } from "bun:test";

import { checkExternalUrl, resolveExternalIssueSeverity } from "./check";

const originalFetch = globalThis.fetch;

function mockFetch(respond: (method: string) => Response | Promise<Response>) {
  globalThis.fetch = ((input: unknown, init?: { method?: string }) => {
    void input;
    return Promise.resolve(respond(init?.method ?? "GET"));
  }) as typeof fetch;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("checkExternalUrl", () => {
  test("passes a reachable link", async () => {
    mockFetch(() => new Response(null, { status: 200 }));

    expect(await checkExternalUrl("https://example.com")).toBeUndefined();
  });

  test("treats bot-gate statuses as unverified", async () => {
    for (const status of [401, 403, 405, 429]) {
      mockFetch(() => new Response(null, { status }));

      const failure = await checkExternalUrl("https://example.com");

      expect(failure?.kind).toBe("unverified");
      expect(failure?.message).toContain("rejected an automated request");
      expect(failure?.message).toContain("not verified");
    }
  });

  test("treats missing and failing targets as broken", async () => {
    for (const status of [404, 410, 500, 503]) {
      mockFetch(() => new Response(null, { status }));

      const failure = await checkExternalUrl("https://example.com");

      expect(failure?.kind).toBe("broken");
      expect(failure?.message).toContain(`${status}`);
    }
  });

  test("treats an unreachable host as broken", async () => {
    globalThis.fetch = (() =>
      Promise.reject(new Error("getaddrinfo ENOTFOUND"))) as typeof fetch;

    const failure = await checkExternalUrl("https://example.invalid");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toContain("Unable to reach external link");
  });

  test("treats AbortError as a timed-out external link", async () => {
    globalThis.fetch = (() =>
      Promise.reject(
        new DOMException("The operation was aborted.", "AbortError"),
      )) as typeof fetch;

    const failure = await checkExternalUrl("https://example.com");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toBe("External link timed out after 10000ms.");
  });

  test("includes a distinct underlying cause in unreachable errors", async () => {
    const cause = new Error("connect ECONNREFUSED 127.0.0.1:443");
    globalThis.fetch = (() =>
      Promise.reject(new Error("fetch failed", { cause }))) as typeof fetch;

    const failure = await checkExternalUrl("https://example.com");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toBe(
      "Unable to reach external link: fetch failed: connect ECONNREFUSED 127.0.0.1:443",
    );
  });

  test("does not duplicate a cause already present in the message", async () => {
    const cause = new Error("ENOTFOUND");
    globalThis.fetch = (() =>
      Promise.reject(
        new Error("getaddrinfo ENOTFOUND", { cause }),
      )) as typeof fetch;

    const failure = await checkExternalUrl("https://example.invalid");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toBe(
      "Unable to reach external link: getaddrinfo ENOTFOUND",
    );
  });

  test("ignores an empty cause message on unreachable errors", async () => {
    const cause = new Error("");
    globalThis.fetch = (() =>
      Promise.reject(new Error("fetch failed", { cause }))) as typeof fetch;

    const failure = await checkExternalUrl("https://example.com");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toBe(
      "Unable to reach external link: fetch failed",
    );
  });

  test("falls back to GET when HEAD is rejected", async () => {
    mockFetch((method) =>
      method === "HEAD"
        ? new Response(null, { status: 405 })
        : new Response(null, { status: 200 }),
    );

    expect(await checkExternalUrl("https://example.com")).toBeUndefined();
  });

  test("classifies on the GET response when HEAD and GET disagree", async () => {
    mockFetch((method) =>
      method === "HEAD"
        ? new Response(null, { status: 403 })
        : new Response(null, { status: 404 }),
    );

    expect((await checkExternalUrl("https://example.com"))?.kind).toBe(
      "broken",
    );
  });
});

describe("resolveExternalIssueSeverity", () => {
  test("downgrades bot-gate failures to warnings", () => {
    const failure = { kind: "unverified", message: "" } as const;

    expect(resolveExternalIssueSeverity(failure, "error")).toBe("warn");
    expect(resolveExternalIssueSeverity(failure, "warn")).toBe("warn");
  });

  test("keeps the configured severity for broken links", () => {
    const failure = { kind: "broken", message: "" } as const;

    expect(resolveExternalIssueSeverity(failure, "error")).toBe("error");
    expect(resolveExternalIssueSeverity(failure, "warn")).toBe("warn");
  });
});
