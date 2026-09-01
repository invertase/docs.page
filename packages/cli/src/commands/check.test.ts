import { afterEach, describe, expect, test } from "bun:test";

import {
  checkExternalUrl,
  isIgnoredHost,
  normalizeIgnoredHost,
  parseIgnoredHosts,
  resolveExternalIssueSeverity,
} from "./check";

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

describe("normalizeIgnoredHost", () => {
  test("keeps a plain hostname", () => {
    expect(normalizeIgnoredHost("npmjs.org")).toBe("npmjs.org");
  });

  test("lowercases and trims", () => {
    expect(normalizeIgnoredHost("  StackOverflow.COM \t")).toBe(
      "stackoverflow.com",
    );
  });

  test("strips wildcard, leading and trailing dots", () => {
    expect(normalizeIgnoredHost("*.npmjs.org")).toBe("npmjs.org");
    expect(normalizeIgnoredHost(".npmjs.org")).toBe("npmjs.org");
    expect(normalizeIgnoredHost("npmjs.org.")).toBe("npmjs.org");
    expect(normalizeIgnoredHost("https://*.npmjs.org")).toBe("npmjs.org");
  });

  test("accepts a pasted URL or host:port", () => {
    expect(normalizeIgnoredHost("https://stackoverflow.com/questions/1")).toBe(
      "stackoverflow.com",
    );
    expect(normalizeIgnoredHost("http://Example.COM:8080/a?b=c#d")).toBe(
      "example.com",
    );
    expect(normalizeIgnoredHost("//example.com")).toBe("example.com");
    expect(normalizeIgnoredHost("localhost:3000")).toBe("localhost");
  });

  test("rejects empty and unusable entries", () => {
    expect(normalizeIgnoredHost("")).toBeUndefined();
    expect(normalizeIgnoredHost("   ")).toBeUndefined();
    expect(normalizeIgnoredHost("..")).toBeUndefined();
    expect(normalizeIgnoredHost("not a host")).toBeUndefined();
    expect(normalizeIgnoredHost(undefined)).toBeUndefined();
    expect(normalizeIgnoredHost(42)).toBeUndefined();
  });
});

describe("parseIgnoredHosts", () => {
  test("splits a comma separated flag value", () => {
    expect(parseIgnoredHosts("npmjs.org, stackoverflow.com")).toEqual([
      "npmjs.org",
      "stackoverflow.com",
    ]);
  });

  test("accepts an array from docs.json", () => {
    expect(parseIgnoredHosts(["npmjs.org", "*.stackoverflow.com"])).toEqual([
      "npmjs.org",
      "stackoverflow.com",
    ]);
  });

  test("unions the config value and the flag value without duplicates", () => {
    // "example.com" comes only from the config and "stackoverflow.com" only
    // from the flag, so neither source may replace the other; "npmjs.org" is
    // in both and must appear once.
    expect(
      parseIgnoredHosts(
        ["example.com", "npmjs.org"],
        "NPMJS.ORG, stackoverflow.com",
      ),
    ).toEqual(["example.com", "npmjs.org", "stackoverflow.com"]);
  });

  test("drops empty and garbage entries", () => {
    expect(parseIgnoredHosts(",, npmjs.org ,,not a host,", undefined)).toEqual([
      "npmjs.org",
    ]);
    expect(parseIgnoredHosts(undefined, null, 42, {})).toEqual([]);
  });
});

describe("isIgnoredHost", () => {
  const hosts = parseIgnoredHosts("npmjs.org, stackoverflow.com");

  test("matches the host exactly", () => {
    expect(isIgnoredHost("https://npmjs.org/package/x", hosts)).toBe(true);
  });

  test("matches subdomains", () => {
    expect(isIgnoredHost("https://www.npmjs.org/package/x", hosts)).toBe(true);
    expect(isIgnoredHost("https://a.b.npmjs.org/", hosts)).toBe(true);
  });

  test("ignores the port, path, query and case of the target", () => {
    expect(isIgnoredHost("https://NPMJS.ORG:8443/a?b=c#d", hosts)).toBe(true);
    expect(isIgnoredHost("https://npmjs.org./a", hosts)).toBe(true);
  });

  test("never matches a lookalike host", () => {
    expect(isIgnoredHost("https://evil-npmjs.org.attacker.net/", hosts)).toBe(
      false,
    );
    expect(isIgnoredHost("https://npmjs.org.attacker.net/", hosts)).toBe(false);
    expect(isIgnoredHost("https://notnpmjs.org/", hosts)).toBe(false);
    expect(isIgnoredHost("https://attacker.net/?q=npmjs.org", hosts)).toBe(
      false,
    );
  });

  test("does not match when the list is empty or the URL is unparsable", () => {
    expect(isIgnoredHost("https://npmjs.org/", [])).toBe(false);
    expect(isIgnoredHost("not a url", hosts)).toBe(false);
  });
});
