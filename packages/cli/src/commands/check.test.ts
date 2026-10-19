import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  checkExternalUrl,
  createExternalLinkScheduler,
  EXTERNAL_LINK_CONCURRENCY,
  EXTERNAL_LINK_PER_HOST_CONCURRENCY,
  type ExternalCheckRuntime,
  type ExternalLinkAttempt,
  externalRetryDelayMs,
  formatDebugAttemptLine,
  formatDebugHostSummaryLines,
  formatDebugTrace,
  getExternalLinkHostname,
  resolveExternalIssueSeverity,
  runCheck,
} from "./check";

const originalFetch = globalThis.fetch;
const originalLog = console.log;
const tempDirs: string[] = [];

type ScriptedFetchItem =
  | Response
  | Error
  | ((method: string) => Response | Error | Promise<Response | Error>);

/**
 * Offline external-check harness: scripted fetch queue, recorded sleeps, and
 * injectable `now` so Retry-After HTTP-dates are deterministic.
 */
function createOfflineHarness(initialNowMs = 1_000_000) {
  const waits: number[] = [];
  const methods: string[] = [];
  const queue: ScriptedFetchItem[] = [];
  let nowMs = initialNowMs;

  const runtime: ExternalCheckRuntime = {
    sleep: async (ms: number) => {
      waits.push(ms);
    },
    now: () => nowMs,
  };

  function installFetch() {
    globalThis.fetch = ((input: unknown, init?: { method?: string }) => {
      void input;
      const method = init?.method ?? "GET";
      methods.push(method);

      const next = queue.shift();

      if (next === undefined) {
        return Promise.reject(new Error("unexpected fetch: queue empty"));
      }

      return Promise.resolve().then(async () => {
        const resolved = typeof next === "function" ? await next(method) : next;

        if (resolved instanceof Error) {
          throw resolved;
        }

        return resolved;
      });
    }) as typeof fetch;
  }

  installFetch();

  return {
    waits,
    methods,
    runtime,
    enqueue(...items: ScriptedFetchItem[]) {
      queue.push(...items);
    },
    setNow(ms: number) {
      nowMs = ms;
    },
    remaining() {
      return queue.length;
    },
  };
}

function response(
  status: number,
  init?: { statusText?: string; retryAfter?: string },
) {
  const headers = new Headers();

  if (init?.retryAfter !== undefined) {
    headers.set("Retry-After", init.retryAfter);
  }

  return new Response(null, {
    status,
    statusText: init?.statusText,
    headers,
  });
}

function droppedConnectionError(code: string, message = "fetch failed"): Error {
  const cause = Object.assign(new Error(`socket ${code}`), { code });
  return new Error(message, { cause });
}

function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/** Flush queued microtasks so scheduler acquire/run progress settles. */
async function flushMicrotasks(times = 8) {
  for (let index = 0; index < times; index += 1) {
    await Promise.resolve();
  }
}

/** Yield to the event loop so fs work in `runCheck` can progress. */
async function waitUntil(
  predicate: () => boolean,
  attempts = 500,
): Promise<void> {
  for (let index = 0; index < attempts; index += 1) {
    if (predicate()) {
      return;
    }

    await new Promise<void>((resolve) => {
      setImmediate(resolve);
    });
  }

  throw new Error("condition was not met");
}

function mockFetch(respond: (method: string) => Response | Promise<Response>) {
  globalThis.fetch = ((input: unknown, init?: { method?: string }) => {
    void input;
    return Promise.resolve(respond(init?.method ?? "GET"));
  }) as typeof fetch;
}

function captureLogs() {
  const lines: string[] = [];

  console.log = (...args: unknown[]) => {
    lines.push(args.map(String).join(" "));
  };

  return lines;
}

async function createTempProject(externalUrls: string | string[]) {
  const rootDir = await mkdtemp(path.join(tmpdir(), "docs-page-check-"));
  tempDirs.push(rootDir);

  const urls = Array.isArray(externalUrls) ? externalUrls : [externalUrls];
  const links = urls
    .map((url, index) => `[external-${index}](${url})`)
    .join("\n\n");

  await writeFile(
    path.join(rootDir, "docs.json"),
    JSON.stringify({ name: "debug-fixture" }),
  );
  await mkdir(path.join(rootDir, "docs"), { recursive: true });
  await writeFile(
    path.join(rootDir, "docs", "index.mdx"),
    `# Fixture\n\n${links}\n`,
  );

  return rootDir;
}

const quietCheckOptions = {
  externalLinks: "error",
  internalLinks: "off",
  assets: "off",
  render: "off",
  metadata: "off",
} as const;

/** No-op sleep so any accidental retry path in older tests stays offline. */
const instantRuntime: ExternalCheckRuntime = {
  sleep: async () => undefined,
  now: () => Date.now(),
};

afterEach(async () => {
  globalThis.fetch = originalFetch;
  console.log = originalLog;

  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();

    if (dir) {
      await rm(dir, { recursive: true, force: true });
    }
  }
});

describe("externalRetryDelayMs", () => {
  test("honours Retry-After delta-seconds", () => {
    expect(externalRetryDelayMs(0, "1", 0)).toBe(1_000);
  });

  test("caps Retry-After delta-seconds at 2000ms", () => {
    expect(externalRetryDelayMs(0, "120", 0)).toBe(2_000);
  });

  test("waits 0ms for Retry-After of 0", () => {
    expect(externalRetryDelayMs(0, "0", 0)).toBe(0);
  });

  test("caps Retry-After HTTP-date far ahead at 2000ms", () => {
    const nowMs = Date.parse("Wed, 01 Jan 2020 00:00:00 GMT");
    const ahead = new Date(nowMs + 5_000).toUTCString();

    expect(externalRetryDelayMs(0, ahead, nowMs)).toBe(2_000);
  });

  test("waits 0ms for Retry-After HTTP-date in the past", () => {
    const nowMs = Date.parse("Wed, 01 Jan 2020 00:00:00 GMT");
    const past = new Date(nowMs - 5_000).toUTCString();

    expect(externalRetryDelayMs(0, past, nowMs)).toBe(0);
  });

  test("uses 200ms then 400ms when Retry-After is missing", () => {
    expect(externalRetryDelayMs(0, null, 0)).toBe(200);
    expect(externalRetryDelayMs(1, undefined, 0)).toBe(400);
  });

  test("uses exponential backoff when Retry-After is unparseable", () => {
    expect(externalRetryDelayMs(0, "not-a-delay", 0)).toBe(200);
    expect(externalRetryDelayMs(1, "soon", 0)).toBe(400);
  });

  test("treats blank Retry-After as missing", () => {
    expect(externalRetryDelayMs(0, "   ", 0)).toBe(200);
  });
});

describe("checkExternalUrl", () => {
  test("passes a reachable link", async () => {
    mockFetch(() => new Response(null, { status: 200 }));

    expect(await checkExternalUrl("https://example.com")).toBeUndefined();
  });

  test("treats bot-gate statuses as unverified", async () => {
    for (const status of [401, 403, 405, 429]) {
      mockFetch(() => new Response(null, { status }));

      const failure = await checkExternalUrl(
        "https://example.com",
        undefined,
        instantRuntime,
      );

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

  test("records HEAD and GET attempts when an attempts array is provided", async () => {
    mockFetch((method) =>
      method === "HEAD"
        ? new Response(null, { status: 405 })
        : new Response(null, { status: 200 }),
    );

    const attempts: ExternalLinkAttempt[] = [];

    expect(
      await checkExternalUrl("https://example.com/docs", attempts),
    ).toBeUndefined();
    expect(attempts).toHaveLength(2);
    expect(attempts[0]).toMatchObject({
      hostname: "example.com",
      method: "HEAD",
      outcome: 405,
    });
    expect(attempts[1]).toMatchObject({
      hostname: "example.com",
      method: "GET",
      outcome: 200,
    });
    expect(Number.isInteger(attempts[0]?.durationMs)).toBe(true);
    expect(Number.isInteger(attempts[1]?.durationMs)).toBe(true);
  });

  test("records timeout and unreachable outcomes on attempts", async () => {
    const timeoutAttempts: ExternalLinkAttempt[] = [];
    globalThis.fetch = (() =>
      Promise.reject(
        new DOMException("The operation was aborted.", "AbortError"),
      )) as typeof fetch;

    await checkExternalUrl("https://example.com", timeoutAttempts);

    expect(timeoutAttempts).toEqual([
      expect.objectContaining({
        hostname: "example.com",
        method: "HEAD",
        outcome: "timeout",
      }),
      expect.objectContaining({
        hostname: "example.com",
        method: "GET",
        outcome: "timeout",
      }),
    ]);

    const unreachableAttempts: ExternalLinkAttempt[] = [];
    globalThis.fetch = (() =>
      Promise.reject(new Error("getaddrinfo ENOTFOUND"))) as typeof fetch;

    await checkExternalUrl("https://example.invalid", unreachableAttempts);

    expect(unreachableAttempts).toEqual([
      expect.objectContaining({
        hostname: "example.invalid",
        method: "HEAD",
        outcome: "unreachable",
      }),
      expect.objectContaining({
        hostname: "example.invalid",
        method: "GET",
        outcome: "unreachable",
      }),
    ]);
  });

  test("falls back to the raw URL when hostname parsing fails", async () => {
    mockFetch(() => new Response(null, { status: 200 }));

    const attempts: ExternalLinkAttempt[] = [];

    expect(await checkExternalUrl("not a url", attempts)).toBeUndefined();
    expect(attempts).toEqual([
      expect.objectContaining({
        hostname: "not a url",
        method: "HEAD",
        outcome: 200,
      }),
    ]);
  });

  test("retries 429 then succeeds on 200 and records the wait", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(response(429), response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.methods).toEqual(["HEAD", "HEAD"]);
    expect(harness.waits).toEqual([200]);
    expect(harness.remaining()).toBe(0);
  });

  test("waits 1000ms for Retry-After: 1 on 429", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(response(429, { retryAfter: "1" }), response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.waits).toEqual([1_000]);
  });

  test("caps Retry-After: 120 wait at 2000ms", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(response(429, { retryAfter: "120" }), response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.waits).toEqual([2_000]);
  });

  test("caps Retry-After HTTP-date 5s ahead at 2000ms", async () => {
    const nowMs = Date.parse("Wed, 01 Jan 2020 00:00:00 GMT");
    const harness = createOfflineHarness(nowMs);
    const ahead = new Date(nowMs + 5_000).toUTCString();
    harness.enqueue(response(429, { retryAfter: ahead }), response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.waits).toEqual([2_000]);
  });

  test("waits 0ms for Retry-After HTTP-date in the past", async () => {
    const nowMs = Date.parse("Wed, 01 Jan 2020 00:00:00 GMT");
    const harness = createOfflineHarness(nowMs);
    const past = new Date(nowMs - 5_000).toUTCString();
    harness.enqueue(response(429, { retryAfter: past }), response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.waits).toEqual([0]);
  });

  test("uses 200ms then 400ms for unparseable Retry-After across retries", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(
      response(429, { retryAfter: "nope" }),
      response(429, { retryAfter: "still-nope" }),
      response(200),
    );

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.waits).toEqual([200, 400]);
  });

  test("stops after three 429 HEAD attempts without calling GET", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(response(429), response(429), response(429));

    const failure = await checkExternalUrl(
      "https://example.com",
      undefined,
      harness.runtime,
    );

    expect(failure?.kind).toBe("unverified");
    expect(failure?.message).toContain("429");
    expect(harness.methods).toEqual(["HEAD", "HEAD", "HEAD"]);
    expect(harness.waits).toEqual([200, 400]);
    expect(harness.remaining()).toBe(0);
  });

  test("does not retry non-retryable statuses", async () => {
    for (const status of [401, 403, 404, 500, 503]) {
      const harness = createOfflineHarness();
      harness.enqueue(response(status), response(status));

      await checkExternalUrl("https://example.com", undefined, harness.runtime);

      expect(harness.methods).toEqual(["HEAD", "GET"]);
      expect(harness.waits).toEqual([]);
      expect(harness.remaining()).toBe(0);
    }

    const harness405 = createOfflineHarness();
    harness405.enqueue(response(405), response(405));

    await checkExternalUrl(
      "https://example.com",
      undefined,
      harness405.runtime,
    );

    expect(harness405.methods).toEqual(["HEAD", "GET"]);
    expect(harness405.waits).toEqual([]);
  });

  test("does not retry AbortError", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(
      new DOMException("The operation was aborted.", "AbortError"),
      new DOMException("The operation was aborted.", "AbortError"),
    );

    const failure = await checkExternalUrl(
      "https://example.com",
      undefined,
      harness.runtime,
    );

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toBe("External link timed out after 10000ms.");
    expect(harness.methods).toEqual(["HEAD", "GET"]);
    expect(harness.waits).toEqual([]);
  });

  test("does not retry ENOTFOUND", async () => {
    const harness = createOfflineHarness();
    const notFound = Object.assign(new Error("getaddrinfo ENOTFOUND"), {
      code: "ENOTFOUND",
    });
    harness.enqueue(notFound, notFound);

    const failure = await checkExternalUrl(
      "https://example.invalid",
      undefined,
      harness.runtime,
    );

    expect(failure?.kind).toBe("broken");
    expect(harness.methods).toEqual(["HEAD", "GET"]);
    expect(harness.waits).toEqual([]);
  });

  test("retries ECONNRESET on error.cause then succeeds", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(droppedConnectionError("ECONNRESET"), response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.methods).toEqual(["HEAD", "HEAD"]);
    expect(harness.waits).toEqual([200]);
  });

  test("retries when dropped-connection code is on the error itself", async () => {
    const harness = createOfflineHarness();
    const reset = Object.assign(new Error("read ECONNRESET"), {
      code: "ECONNRESET",
    });
    harness.enqueue(reset, response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.methods).toEqual(["HEAD", "HEAD"]);
    expect(harness.waits).toEqual([200]);
  });

  test("uses the production sleep path for a zero Retry-After wait", async () => {
    const methods: string[] = [];
    globalThis.fetch = ((input: unknown, init?: { method?: string }) => {
      void input;
      methods.push(init?.method ?? "GET");
      const next =
        methods.length === 1
          ? response(429, { retryAfter: "0" })
          : response(200);
      return Promise.resolve(next);
    }) as typeof fetch;

    expect(await checkExternalUrl("https://example.com")).toBeUndefined();
    expect(methods).toEqual(["HEAD", "HEAD"]);
  });

  test("falls through to GET after exhausted ECONNRESET on HEAD", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(
      droppedConnectionError("ECONNRESET"),
      droppedConnectionError("ECONNRESET"),
      droppedConnectionError("ECONNRESET"),
      response(200),
    );

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.methods).toEqual(["HEAD", "HEAD", "HEAD", "GET"]);
    expect(harness.waits).toEqual([200, 400]);
  });

  test("retries GET 429 after a non-retryable HEAD 405 fallthrough", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(response(405), response(429), response(200));

    expect(
      await checkExternalUrl("https://example.com", undefined, harness.runtime),
    ).toBeUndefined();
    expect(harness.methods).toEqual(["HEAD", "GET", "GET"]);
    expect(harness.waits).toEqual([200]);
    expect(harness.remaining()).toBe(0);
  });

  test("records one debug attempt per try including failed retries", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(response(429), response(429), response(200));
    const attempts: ExternalLinkAttempt[] = [];

    expect(
      await checkExternalUrl("https://example.com", attempts, harness.runtime),
    ).toBeUndefined();
    expect(attempts).toEqual([
      expect.objectContaining({ method: "HEAD", outcome: 429 }),
      expect.objectContaining({ method: "HEAD", outcome: 429 }),
      expect.objectContaining({ method: "HEAD", outcome: 200 }),
    ]);
  });

  test("reports last 429 as unverified after HEAD retries are exhausted", async () => {
    const harness = createOfflineHarness();
    harness.enqueue(
      response(429, { statusText: "Too Many Requests" }),
      response(429, { statusText: "Too Many Requests" }),
      response(429, { statusText: "Too Many Requests" }),
    );

    const failure = await checkExternalUrl(
      "https://example.com",
      undefined,
      harness.runtime,
    );

    expect(failure).toEqual({
      kind: "unverified",
      message:
        "External link host rejected an automated request (429 Too Many Requests); the link was not verified.",
    });
  });

  test("reports last dropped connection as broken after retries are exhausted", async () => {
    const harness = createOfflineHarness();
    const reset = droppedConnectionError("ECONNRESET");
    harness.enqueue(reset, reset, reset, reset, reset, reset);

    const failure = await checkExternalUrl(
      "https://example.com",
      undefined,
      harness.runtime,
    );

    expect(failure?.kind).toBe("broken");
    expect(failure?.message).toContain("Unable to reach external link");
    expect(harness.methods).toEqual([
      "HEAD",
      "HEAD",
      "HEAD",
      "GET",
      "GET",
      "GET",
    ]);
    expect(harness.waits).toEqual([200, 400, 200, 400]);
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

  test("applies a host override to an unverified bot-gate", () => {
    const failure = { kind: "unverified", message: "" } as const;

    expect(resolveExternalIssueSeverity(failure, "warn", "error")).toBe(
      "error",
    );
    expect(resolveExternalIssueSeverity(failure, "error", "warn")).toBe("warn");
  });

  test("applies a host override to a broken link", () => {
    const failure = { kind: "broken", message: "" } as const;

    expect(resolveExternalIssueSeverity(failure, "error", "warn")).toBe("warn");
    expect(resolveExternalIssueSeverity(failure, "warn", "error")).toBe(
      "error",
    );
  });
});

describe("getExternalLinkHostname", () => {
  test("returns a lowercase hostname without port or path", () => {
    expect(getExternalLinkHostname("https://WWW.Example.COM:8443/path")).toBe(
      "www.example.com",
    );
  });

  test("treats www and apex as distinct hosts", () => {
    expect(getExternalLinkHostname("https://www.example.com/a")).toBe(
      "www.example.com",
    );
    expect(getExternalLinkHostname("https://example.com/a")).toBe(
      "example.com",
    );
  });

  test("falls back to a lowercased raw string when URL parsing fails", () => {
    expect(getExternalLinkHostname("NOT A URL")).toBe("not a url");
  });
});

describe("createExternalLinkScheduler", () => {
  test("defaults match the exported concurrency constants", () => {
    expect(EXTERNAL_LINK_CONCURRENCY).toBe(8);
    expect(EXTERNAL_LINK_PER_HOST_CONCURRENCY).toBe(2);
  });

  test("caps one host at two in-flight checks until slots are released", async () => {
    const scheduler = createExternalLinkScheduler();
    const gates = Array.from({ length: 6 }, () => createDeferred<void>());
    let inFlight = 0;
    let maxInFlight = 0;
    const started: number[] = [];

    const tasks = gates.map((gate, index) =>
      scheduler.run("example.com", async () => {
        started.push(index);
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await gate.promise;
        inFlight -= 1;
      }),
    );

    await flushMicrotasks();
    expect(started).toEqual([0, 1]);
    expect(maxInFlight).toBe(2);
    expect(inFlight).toBe(2);

    gates[0]?.resolve();
    await flushMicrotasks();
    expect(started).toEqual([0, 1, 2]);
    expect(inFlight).toBe(2);

    for (const gate of gates) {
      gate.resolve();
    }

    await Promise.all(tasks);
    expect(started).toEqual([0, 1, 2, 3, 4, 5]);
    expect(maxInFlight).toBe(2);
    expect(inFlight).toBe(0);
  });

  test("keeps global capacity at 8 while capping each host at 2", async () => {
    const scheduler = createExternalLinkScheduler();
    const hosts = ["a.test", "b.test", "c.test", "d.test"];
    // 4 hosts × 3 URLs = 12 tasks; global 8 and per-host 2 can both bind.
    const gates = hosts.flatMap((host) =>
      [0, 1, 2].map((index) => ({
        host,
        index,
        gate: createDeferred<void>(),
      })),
    );

    let globalInFlight = 0;
    let maxGlobalInFlight = 0;
    let sawMoreThanTwoGlobal = false;
    const hostInFlight = new Map<string, number>();
    const maxHostInFlight = new Map<string, number>();

    const tasks = gates.map(({ host, gate }) =>
      scheduler.run(host, async () => {
        globalInFlight += 1;
        maxGlobalInFlight = Math.max(maxGlobalInFlight, globalInFlight);
        if (globalInFlight > 2) {
          sawMoreThanTwoGlobal = true;
        }

        const nextHost = (hostInFlight.get(host) ?? 0) + 1;
        hostInFlight.set(host, nextHost);
        maxHostInFlight.set(
          host,
          Math.max(maxHostInFlight.get(host) ?? 0, nextHost),
        );

        await gate.promise;

        globalInFlight -= 1;
        hostInFlight.set(host, (hostInFlight.get(host) ?? 1) - 1);
      }),
    );

    await flushMicrotasks();
    expect(maxGlobalInFlight).toBe(8);
    expect(globalInFlight).toBe(8);
    expect(sawMoreThanTwoGlobal).toBe(true);

    for (const host of hosts) {
      expect(maxHostInFlight.get(host)).toBe(2);
      expect(hostInFlight.get(host)).toBe(2);
    }

    for (const { gate } of gates) {
      gate.resolve();
    }

    await Promise.all(tasks);
    expect(maxGlobalInFlight).toBe(8);
    expect(globalInFlight).toBe(0);
  });

  test("duplicate URL cache hits do not take a second slot or start a second fetch", async () => {
    const scheduler = createExternalLinkScheduler({
      globalLimit: 2,
      perHostLimit: 2,
    });
    const cache = new Map<string, Promise<string>>();
    const gate = createDeferred<void>();
    let fetchStarts = 0;
    let inFlight = 0;
    let maxInFlight = 0;

    const runCached = (url: string) => {
      const existing = cache.get(url);

      if (existing) {
        return existing;
      }

      const check = scheduler.run(getExternalLinkHostname(url), async () => {
        fetchStarts += 1;
        inFlight += 1;
        maxInFlight = Math.max(maxInFlight, inFlight);
        await gate.promise;
        inFlight -= 1;
        return "ok";
      });
      cache.set(url, check);
      return check;
    };

    const first = runCached("https://example.com/same");
    const second = runCached("https://example.com/same");
    // A distinct URL should still obtain the second per-host slot.
    const otherGate = createDeferred<void>();
    const other = scheduler.run("example.com", async () => {
      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);
      await otherGate.promise;
      inFlight -= 1;
      return "other";
    });

    await flushMicrotasks();
    expect(fetchStarts).toBe(1);
    expect(first).toBe(second);
    expect(inFlight).toBe(2);
    expect(maxInFlight).toBe(2);

    gate.resolve();
    otherGate.resolve();
    expect(await first).toBe("ok");
    expect(await second).toBe("ok");
    expect(await other).toBe("other");
    expect(fetchStarts).toBe(1);
    expect(maxInFlight).toBe(2);
  });

  test("waits on the host queue then resumes after a host slot frees", async () => {
    const scheduler = createExternalLinkScheduler({
      globalLimit: 8,
      perHostLimit: 1,
    });
    const firstGate = createDeferred<void>();
    const order: string[] = [];

    const first = scheduler.run("host.example", async () => {
      order.push("first-start");
      await firstGate.promise;
      order.push("first-end");
    });
    const second = scheduler.run("host.example", async () => {
      order.push("second-start");
    });

    await flushMicrotasks();
    expect(order).toEqual(["first-start"]);

    firstGate.resolve();
    await Promise.all([first, second]);
    expect(order).toEqual(["first-start", "first-end", "second-start"]);
  });

  test("releases the host slot after rejection without swallowing the error", async () => {
    const scheduler = createExternalLinkScheduler({
      globalLimit: 8,
      perHostLimit: 1,
    });
    const firstGate = createDeferred<void>();
    const failure = new Error("first check failed");
    const order: string[] = [];

    const first = scheduler.run("host.example", async () => {
      order.push("first-start");
      await firstGate.promise;
      order.push("first-reject");
      throw failure;
    });
    const second = scheduler.run("host.example", async () => {
      order.push("second-start");
      return "second-ok";
    });

    await flushMicrotasks();
    expect(order).toEqual(["first-start"]);

    firstGate.resolve();
    await expect(first).rejects.toBe(failure);
    expect(await second).toBe("second-ok");
    expect(order).toEqual(["first-start", "first-reject", "second-start"]);
  });

  test("waits on the global pool then resumes after a global slot frees", async () => {
    const scheduler = createExternalLinkScheduler({
      globalLimit: 1,
      perHostLimit: 2,
    });
    const firstGate = createDeferred<void>();
    const order: string[] = [];

    const first = scheduler.run("a.example", async () => {
      order.push("a-start");
      await firstGate.promise;
      order.push("a-end");
    });
    const second = scheduler.run("b.example", async () => {
      order.push("b-start");
    });

    await flushMicrotasks();
    expect(order).toEqual(["a-start"]);

    firstGate.resolve();
    await Promise.all([first, second]);
    expect(order).toEqual(["a-start", "a-end", "b-start"]);
  });

  test("skips a host-blocked waiter when a global slot frees for another host", async () => {
    const scheduler = createExternalLinkScheduler({
      globalLimit: 2,
      perHostLimit: 1,
    });
    const aGate = createDeferred<void>();
    const bGate = createDeferred<void>();
    const order: string[] = [];

    const a1 = scheduler.run("a.example", async () => {
      order.push("a1-start");
      await aGate.promise;
      order.push("a1-end");
    });
    const b1 = scheduler.run("b.example", async () => {
      order.push("b1-start");
      await bGate.promise;
      order.push("b1-end");
    });

    await flushMicrotasks();
    expect(order).toEqual(["a1-start", "b1-start"]);

    // A2 is host-blocked; C waits only on the global pool.
    const a2 = scheduler.run("a.example", async () => {
      order.push("a2-start");
    });
    const c1 = scheduler.run("c.example", async () => {
      order.push("c1-start");
    });

    await flushMicrotasks();
    expect(order).toEqual(["a1-start", "b1-start"]);

    // Freeing B's global slot cannot start A2 (host still full), so C runs.
    bGate.resolve();
    await flushMicrotasks();
    expect(order).toEqual(["a1-start", "b1-start", "b1-end", "c1-start"]);

    aGate.resolve();
    await Promise.all([a1, b1, a2, c1]);
    expect(order).toEqual([
      "a1-start",
      "b1-start",
      "b1-end",
      "c1-start",
      "a1-end",
      "a2-start",
    ]);
  });

  test("holds a slot across an in-check wait so another URL on the host cannot start", async () => {
    const scheduler = createExternalLinkScheduler({
      globalLimit: 8,
      perHostLimit: 1,
    });
    const retryWait = createDeferred<void>();
    const order: string[] = [];

    const first = scheduler.run("retry.example", async () => {
      order.push("first-start");
      // Simulate a retry backoff while still holding the host slot.
      await retryWait.promise;
      order.push("first-end");
    });
    const second = scheduler.run("retry.example", async () => {
      order.push("second-start");
    });

    await flushMicrotasks();
    expect(order).toEqual(["first-start"]);

    retryWait.resolve();
    await Promise.all([first, second]);
    expect(order).toEqual(["first-start", "first-end", "second-start"]);
  });
});

describe("formatDebugAttemptLine", () => {
  test("formats a 2xx attempt", () => {
    expect(
      formatDebugAttemptLine({
        hostname: "example.com",
        method: "HEAD",
        outcome: 200,
        durationMs: 12,
      }),
    ).toBe("debug example.com HEAD 200 12ms");
  });

  test("formats bot-gate statuses including 429", () => {
    expect(
      formatDebugAttemptLine({
        hostname: "api.example.com",
        method: "GET",
        outcome: 429,
        durationMs: 3,
      }),
    ).toBe("debug api.example.com GET 429 3ms");
  });

  test("formats a broken status such as 404", () => {
    expect(
      formatDebugAttemptLine({
        hostname: "example.com",
        method: "GET",
        outcome: 404,
        durationMs: 8,
      }),
    ).toBe("debug example.com GET 404 8ms");
  });

  test("formats a timeout outcome", () => {
    expect(
      formatDebugAttemptLine({
        hostname: "slow.example",
        method: "HEAD",
        outcome: "timeout",
        durationMs: 10000,
      }),
    ).toBe("debug slow.example HEAD timeout 10000ms");
  });

  test("formats an unreachable outcome", () => {
    expect(
      formatDebugAttemptLine({
        hostname: "missing.invalid",
        method: "GET",
        outcome: "unreachable",
        durationMs: 1,
      }),
    ).toBe("debug missing.invalid GET unreachable 1ms");
  });
});

describe("formatDebugHostSummaryLines", () => {
  test("counts 429 in both unverified and 429s", () => {
    expect(
      formatDebugHostSummaryLines([
        {
          hostname: "rate.limited",
          method: "HEAD",
          outcome: 429,
          durationMs: 2,
        },
        {
          hostname: "rate.limited",
          method: "GET",
          outcome: 429,
          durationMs: 4,
        },
      ]),
    ).toEqual([
      "debug host rate.limited requests=2 ok=0 unverified=2 broken=0 timeouts=0 429s=2",
    ]);
  });

  test("sorts host summary lines by hostname", () => {
    expect(
      formatDebugHostSummaryLines([
        {
          hostname: "zeta.example",
          method: "HEAD",
          outcome: 200,
          durationMs: 1,
        },
        {
          hostname: "alpha.example",
          method: "GET",
          outcome: 404,
          durationMs: 2,
        },
      ]),
    ).toEqual([
      "debug host alpha.example requests=1 ok=0 unverified=0 broken=1 timeouts=0 429s=0",
      "debug host zeta.example requests=1 ok=1 unverified=0 broken=0 timeouts=0 429s=0",
    ]);
  });

  test("counts each outcome class once per attempt", () => {
    expect(
      formatDebugHostSummaryLines([
        {
          hostname: "mixed.example",
          method: "HEAD",
          outcome: 200,
          durationMs: 1,
        },
        {
          hostname: "mixed.example",
          method: "GET",
          outcome: 403,
          durationMs: 1,
        },
        {
          hostname: "mixed.example",
          method: "HEAD",
          outcome: 404,
          durationMs: 1,
        },
        {
          hostname: "mixed.example",
          method: "GET",
          outcome: "timeout",
          durationMs: 1,
        },
        {
          hostname: "mixed.example",
          method: "HEAD",
          outcome: "unreachable",
          durationMs: 1,
        },
      ]),
    ).toEqual([
      "debug host mixed.example requests=5 ok=1 unverified=1 broken=2 timeouts=1 429s=0",
    ]);
  });
});

describe("formatDebugTrace", () => {
  test("emits HEAD plus GET attempt lines before the host summary", () => {
    const attempts: ExternalLinkAttempt[] = [
      {
        hostname: "example.com",
        method: "HEAD",
        outcome: 405,
        durationMs: 5,
      },
      {
        hostname: "example.com",
        method: "GET",
        outcome: 200,
        durationMs: 7,
      },
    ];

    expect(formatDebugTrace(attempts)).toEqual([
      "debug example.com HEAD 405 5ms",
      "debug example.com GET 200 7ms",
      "debug host example.com requests=2 ok=1 unverified=1 broken=0 timeouts=0 429s=0",
    ]);
  });
});

describe("runCheck debug output", () => {
  test("prints attempt and summary lines when debug is true", async () => {
    const rootDir = await createTempProject("https://example.com/page");
    mockFetch(() => new Response(null, { status: 200 }));
    const lines = captureLogs();

    const exitCode = await runCheck(rootDir, {
      ...quietCheckOptions,
      debug: true,
    });

    expect(exitCode).toBe(0);

    const debugLines = lines.filter((line) => line.startsWith("debug "));

    expect(debugLines).toEqual([
      expect.stringMatching(/^debug example\.com HEAD 200 \d+ms$/),
      "debug host example.com requests=1 ok=1 unverified=0 broken=0 timeouts=0 429s=0",
    ]);
  });

  test("prints nothing with a debug prefix when debug is omitted", async () => {
    const rootDir = await createTempProject("https://example.com/page");
    mockFetch(() => new Response(null, { status: 200 }));
    const lines = captureLogs();

    await runCheck(rootDir, quietCheckOptions);

    expect(lines.some((line) => line.startsWith("debug "))).toBe(false);
  });

  test("prints nothing with a debug prefix when debug is false", async () => {
    const rootDir = await createTempProject("https://example.com/page");
    mockFetch(() => new Response(null, { status: 200 }));
    const lines = captureLogs();

    await runCheck(rootDir, {
      ...quietCheckOptions,
      debug: false,
    });

    expect(lines.some((line) => line.startsWith("debug "))).toBe(false);
  });

  test("prints no debug lines when external links are off", async () => {
    const rootDir = await createTempProject("https://example.com/page");
    let fetchCalls = 0;
    globalThis.fetch = ((..._args: unknown[]) => {
      fetchCalls += 1;
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch;
    const lines = captureLogs();

    await runCheck(rootDir, {
      ...quietCheckOptions,
      externalLinks: "off",
      debug: true,
    });

    expect(fetchCalls).toBe(0);
    expect(lines.some((line) => line.startsWith("debug "))).toBe(false);
  });

  test("prints no debug lines when the host is ignored", async () => {
    const rootDir = await createTempProject("https://example.com/page");
    let fetchCalls = 0;
    globalThis.fetch = ((..._args: unknown[]) => {
      fetchCalls += 1;
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch;
    const lines = captureLogs();

    await runCheck(rootDir, {
      ...quietCheckOptions,
      ignoreExternalHosts: "example.com",
      debug: true,
    });

    expect(fetchCalls).toBe(0);
    expect(lines.some((line) => line.startsWith("debug "))).toBe(false);
  });

  test("prints HEAD and GET attempt lines for a single URL", async () => {
    const rootDir = await createTempProject("https://example.com/docs");
    mockFetch((method) =>
      method === "HEAD"
        ? new Response(null, { status: 405 })
        : new Response(null, { status: 200 }),
    );
    const lines = captureLogs();

    await runCheck(rootDir, {
      ...quietCheckOptions,
      debug: true,
    });

    const debugLines = lines.filter((line) => line.startsWith("debug "));

    expect(debugLines[0]).toMatch(/^debug example\.com HEAD 405 \d+ms$/);
    expect(debugLines[1]).toMatch(/^debug example\.com GET 200 \d+ms$/);
    expect(debugLines[2]).toBe(
      "debug host example.com requests=2 ok=1 unverified=1 broken=0 timeouts=0 429s=0",
    );
  });

  test("checks a duplicated external URL once when debug is on", async () => {
    const url = "https://example.com/shared";
    const rootDir = await createTempProject([url, url]);
    const methodCounts = { HEAD: 0, GET: 0 };
    globalThis.fetch = ((input: unknown, init?: { method?: string }) => {
      void input;
      const method = (init?.method ?? "GET") as "GET" | "HEAD";
      methodCounts[method] += 1;
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch;
    const lines = captureLogs();

    const exitCode = await runCheck(rootDir, {
      ...quietCheckOptions,
      debug: true,
    });

    expect(exitCode).toBe(0);
    expect(methodCounts.HEAD).toBe(1);
    expect(methodCounts.GET).toBe(0);

    const debugLines = lines.filter((line) => line.startsWith("debug "));

    expect(debugLines).toEqual([
      expect.stringMatching(/^debug example\.com HEAD 200 \d+ms$/),
      "debug host example.com requests=1 ok=1 unverified=0 broken=0 timeouts=0 429s=0",
    ]);
  });

  test("keeps failing-link exit code and issue text when debug is on", async () => {
    const rootDir = await createTempProject("https://example.com/missing");
    mockFetch(
      () => new Response(null, { status: 404, statusText: "Not Found" }),
    );

    const baselineLines = captureLogs();
    const baselineExit = await runCheck(rootDir, quietCheckOptions);

    console.log = originalLog;
    const debugRunLines = captureLogs();
    mockFetch(
      () => new Response(null, { status: 404, statusText: "Not Found" }),
    );
    const debugExit = await runCheck(rootDir, {
      ...quietCheckOptions,
      debug: true,
    });

    expect(baselineExit).toBe(1);
    expect(debugExit).toBe(1);
    expect(debugRunLines.filter((line) => !line.startsWith("debug "))).toEqual(
      baselineLines,
    );
    expect(
      baselineLines.some((line) => line.includes("External link returned 404")),
    ).toBe(true);
  });
});

describe("runCheck external link per-host concurrency", () => {
  test("caps concurrent fetches for one host at two via the command path", async () => {
    const urls = [
      "https://example.com/a",
      "https://example.com/b",
      "https://example.com/c",
      "https://example.com/d",
      "https://example.com/e",
      "https://example.com/f",
    ];
    const rootDir = await createTempProject(urls);
    const gates = new Map<
      string,
      ReturnType<typeof createDeferred<Response>>
    >();
    let inFlight = 0;
    let maxInFlight = 0;

    for (const url of urls) {
      gates.set(url, createDeferred<Response>());
    }

    globalThis.fetch = ((input: unknown, init?: { method?: string }) => {
      const url = String(input);
      const method = init?.method ?? "GET";

      // Only the first attempt (HEAD) participates in the concurrency sample.
      if (method !== "HEAD") {
        return Promise.resolve(new Response(null, { status: 200 }));
      }

      inFlight += 1;
      maxInFlight = Math.max(maxInFlight, inFlight);

      const gate = gates.get(url);

      if (!gate) {
        inFlight -= 1;
        return Promise.reject(new Error(`unexpected url ${url}`));
      }

      return gate.promise.finally(() => {
        inFlight -= 1;
      });
    }) as typeof fetch;

    captureLogs();
    const checkPromise = runCheck(rootDir, quietCheckOptions);

    await waitUntil(() => maxInFlight === 2 && inFlight === 2);
    expect(maxInFlight).toBe(2);
    expect(inFlight).toBe(2);

    // While the first two stay open, no additional host fetches may start.
    await flushMicrotasks(16);
    expect(inFlight).toBe(2);
    expect(maxInFlight).toBe(2);

    for (const gate of gates.values()) {
      gate.resolve(new Response(null, { status: 200 }));
    }

    expect(await checkPromise).toBe(0);
    expect(maxInFlight).toBe(2);
    expect(inFlight).toBe(0);
  });
});

describe("runCheck severityOverrideHosts", () => {
  test("reads severityOverrideHosts from docs.json and upgrades a 403 to error", async () => {
    const rootDir = await createTempProject("https://rnfirebase.io/docs");
    await writeFile(
      path.join(rootDir, "docs.json"),
      JSON.stringify({
        name: "override-fixture",
        check: { severityOverrideHosts: { "rnfirebase.io": "error" } },
      }),
    );
    mockFetch(
      () => new Response(null, { status: 403, statusText: "Forbidden" }),
    );
    const lines = captureLogs();

    const exitCode = await runCheck(rootDir, {
      ...quietCheckOptions,
      externalLinks: "warn",
    });

    expect(exitCode).toBe(1);
    expect(
      lines.some((line) => line.includes("error") && line.includes("403")),
    ).toBe(true);
  });

  test("applies a CLI severity override flag for a 403", async () => {
    const rootDir = await createTempProject("https://rnfirebase.io/docs");
    mockFetch(
      () => new Response(null, { status: 403, statusText: "Forbidden" }),
    );
    const lines = captureLogs();

    const exitCode = await runCheck(rootDir, {
      ...quietCheckOptions,
      externalLinks: "warn",
      severityOverrideHosts: "rnfirebase.io=error",
    });

    expect(exitCode).toBe(1);
    expect(
      lines.some((line) => line.includes("error") && line.includes("403")),
    ).toBe(true);
  });

  test("downgrades a 404 to warn when the host is mapped to warn", async () => {
    const rootDir = await createTempProject("https://stackoverflow.com/q/1");
    mockFetch(
      () => new Response(null, { status: 404, statusText: "Not Found" }),
    );
    const lines = captureLogs();

    const exitCode = await runCheck(rootDir, {
      ...quietCheckOptions,
      externalLinks: "error",
      severityOverrideHosts: "stackoverflow.com=warn",
    });

    expect(exitCode).toBe(0);
    expect(
      lines.some((line) => line.includes("warn") && line.includes("404")),
    ).toBe(true);
    expect(
      lines.some((line) => /\berror\b/.test(line) && line.includes("404")),
    ).toBe(false);
  });

  test("keeps an unlisted host 403 as warn when external-links is error", async () => {
    const rootDir = await createTempProject("https://example.com/page");
    mockFetch(
      () => new Response(null, { status: 403, statusText: "Forbidden" }),
    );
    const lines = captureLogs();

    const exitCode = await runCheck(rootDir, quietCheckOptions);

    expect(exitCode).toBe(0);
    expect(
      lines.some((line) => line.includes("warn") && line.includes("403")),
    ).toBe(true);
  });

  test("does not request a mapped host when external-links is off", async () => {
    const rootDir = await createTempProject("https://rnfirebase.io/docs");
    await writeFile(
      path.join(rootDir, "docs.json"),
      JSON.stringify({
        name: "override-fixture",
        check: { severityOverrideHosts: { "rnfirebase.io": "error" } },
      }),
    );
    let fetchCalls = 0;
    globalThis.fetch = ((..._args: unknown[]) => {
      fetchCalls += 1;
      return Promise.resolve(new Response(null, { status: 200 }));
    }) as typeof fetch;
    captureLogs();

    const exitCode = await runCheck(rootDir, {
      ...quietCheckOptions,
      externalLinks: "off",
    });

    expect(exitCode).toBe(0);
    expect(fetchCalls).toBe(0);
  });

  test("upgrades a 403 to error when external-links is warn and the host is mapped to error", async () => {
    const rootDir = await createTempProject("https://example.com/page");
    mockFetch(
      () => new Response(null, { status: 403, statusText: "Forbidden" }),
    );
    const lines = captureLogs();

    const exitCode = await runCheck(rootDir, {
      ...quietCheckOptions,
      externalLinks: "warn",
      severityOverrideHosts: "example.com=error",
    });

    expect(exitCode).toBe(1);
    expect(
      lines.some((line) => line.includes("error") && line.includes("403")),
    ).toBe(true);
  });
});
