import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import {
  checkExternalUrl,
  type ExternalLinkAttempt,
  formatDebugAttemptLine,
  formatDebugHostSummaryLines,
  formatDebugTrace,
  resolveExternalIssueSeverity,
  runCheck,
} from "./check";

const originalFetch = globalThis.fetch;
const originalLog = console.log;
const tempDirs: string[] = [];

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
