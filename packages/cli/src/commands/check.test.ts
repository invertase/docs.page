import { afterEach, describe, expect, test } from "bun:test";

import { checkExternalUrl, resolveExternalIssueSeverity } from "./check";

const originalFetch = globalThis.fetch;
const originalSetTimeout = globalThis.setTimeout;

function mockFetch(
  respond: (
    method: string,
    signal?: AbortSignal,
  ) => Response | Promise<Response>,
) {
  globalThis.fetch = ((
    input: unknown,
    init?: { method?: string; signal?: AbortSignal },
  ) => {
    void input;
    return Promise.resolve(respond(init?.method ?? "GET", init?.signal));
  }) as typeof fetch;
}

/**
 * Reject every request with `error`, mirroring how `fetch` surfaces a
 * network-level failure.
 */
function mockFetchRejection(error: () => unknown) {
  globalThis.fetch = (() => Promise.reject(error())) as typeof fetch;
}

/**
 * Node's `fetch` wraps network-level failures as `TypeError: fetch failed` and
 * puts the diagnosis on `error.cause`.
 */
function fetchFailure(cause: { message: string; code?: string }) {
  return Object.assign(new TypeError("fetch failed"), {
    cause: Object.assign(new Error(cause.message), { code: cause.code }),
  });
}

/**
 * Never settle until the request signal aborts, the way a runtime does when our
 * own timeout fires. The abort message differs between Node and Bun, so only
 * the error name is realistic here.
 */
function mockFetchAbort() {
  globalThis.fetch = ((input: unknown, init?: { signal?: AbortSignal }) => {
    void input;

    return new Promise((_resolve, reject) => {
      const abort = () => {
        const error = new Error("This operation was aborted");
        error.name = "AbortError";
        reject(error);
      };

      if (init?.signal?.aborted) {
        abort();
        return;
      }

      init?.signal?.addEventListener("abort", abort, { once: true });
    });
  }) as typeof fetch;
}

/**
 * Fire the command's own 10s link timeout immediately so the abort path can be
 * exercised without waiting for it.
 */
function shortenTimeout(matchMs: number) {
  globalThis.setTimeout = ((
    handler: (...args: unknown[]) => void,
    delay?: number,
    ...rest: unknown[]
  ) =>
    originalSetTimeout(
      handler,
      delay === matchMs ? 0 : delay,
      ...rest,
    )) as unknown as typeof setTimeout;
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  globalThis.setTimeout = originalSetTimeout;
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
    mockFetchRejection(() =>
      fetchFailure({
        message: "getaddrinfo ENOTFOUND example.invalid",
        code: "ENOTFOUND",
      }),
    );

    const failure = await checkExternalUrl("https://example.invalid");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toContain("Unable to reach external link");
    expect(failure?.message).toContain("getaddrinfo ENOTFOUND example.invalid");
    expect(failure?.message).not.toContain("fetch failed");
    expect(resolveExternalIssueSeverity(failure!, "error")).toBe("error");
  });

  test("reports the cause of a dropped connection", async () => {
    mockFetchRejection(() =>
      fetchFailure({ message: "other side closed", code: "UND_ERR_SOCKET" }),
    );

    const failure = await checkExternalUrl("https://example.com");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toBe(
      "Unable to reach external link: other side closed (UND_ERR_SOCKET)",
    );
    expect(resolveExternalIssueSeverity(failure!, "error")).toBe("error");
  });

  test("reports the cause of a refused connection and a TLS failure", async () => {
    mockFetchRejection(() =>
      fetchFailure({
        message: "connect ECONNREFUSED 127.0.0.1:9",
        code: "ECONNREFUSED",
      }),
    );

    expect((await checkExternalUrl("https://example.com"))?.message).toBe(
      "Unable to reach external link: connect ECONNREFUSED 127.0.0.1:9",
    );

    mockFetchRejection(() =>
      fetchFailure({
        message: "self-signed certificate",
        code: "DEPTH_ZERO_SELF_SIGNED_CERT",
      }),
    );

    expect((await checkExternalUrl("https://example.com"))?.message).toBe(
      "Unable to reach external link: self-signed certificate (DEPTH_ZERO_SELF_SIGNED_CERT)",
    );
  });

  test("walks nested causes and survives a cyclic chain", async () => {
    mockFetchRejection(() => {
      const root = Object.assign(new Error("redirect count exceeded"), {
        code: "UND_ERR_REDIRECT",
      });
      const middle = new Error("fetch failed", { cause: root });
      // A cycle must not hang or throw.
      (root as { cause?: unknown }).cause = middle;

      return new TypeError("fetch failed", { cause: middle });
    });

    const failure = await checkExternalUrl("https://example.com");

    expect(failure?.message).toBe(
      "Unable to reach external link: redirect count exceeded (UND_ERR_REDIRECT)",
    );
  });

  test("falls back to the error message when there is no cause", async () => {
    mockFetchRejection(() => new Error("boom"));

    expect((await checkExternalUrl("https://example.com"))?.message).toBe(
      "Unable to reach external link: boom",
    );
  });

  test("falls back to Unknown error for a valueless rejection", async () => {
    mockFetchRejection(() => undefined);

    expect((await checkExternalUrl("https://example.com"))?.message).toBe(
      "Unable to reach external link: Unknown error",
    );
  });

  test("reports our own timeout as a timeout", async () => {
    mockFetchAbort();
    shortenTimeout(10_000);

    const failure = await checkExternalUrl("https://example.com");

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toBe("External link timed out after 10s.");
    expect(failure?.message).not.toContain("Unable to reach external link");
    expect(failure?.message).not.toContain("aborted");
    expect(resolveExternalIssueSeverity(failure!, "error")).toBe("error");
  });

  test("keeps an empty status text from leaving a stray space", async () => {
    for (const status of [522, 524]) {
      mockFetch(() => new Response(null, { status, statusText: "" }));

      const failure = await checkExternalUrl("https://example.com");

      expect(failure?.kind).toBe("broken");
      expect(failure?.message).toBe(`External link returned ${status}.`);
      expect(failure?.message).not.toContain("  ");
      expect(failure?.message).not.toContain(" .");
      expect(resolveExternalIssueSeverity(failure!, "error")).toBe("error");
    }
  });

  test("keeps an empty status text out of the bot-gate message", async () => {
    mockFetch(() => new Response(null, { status: 403, statusText: "" }));

    const failure = await checkExternalUrl("https://example.com");

    expect(failure?.kind).toBe("unverified");
    expect(failure?.message).toContain("(403)");
    expect(resolveExternalIssueSeverity(failure!, "error")).toBe("warn");
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
