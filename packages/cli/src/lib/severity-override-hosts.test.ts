import { describe, expect, test } from "bun:test";

import {
  parseSeverityOverrideHosts,
  resolveHostSeverityOverride,
} from "./severity-override-hosts";

describe("parseSeverityOverrideHosts", () => {
  test("reads an object from docs.json", () => {
    const overrides = parseSeverityOverrideHosts({
      "rnfirebase.io": "error",
      "stackoverflow.com": "warn",
    });

    expect(overrides.get("rnfirebase.io")).toBe("error");
    expect(overrides.get("stackoverflow.com")).toBe("warn");
    expect(overrides.size).toBe(2);
  });

  test("parses a comma-separated host=severity flag", () => {
    const overrides = parseSeverityOverrideHosts(
      undefined,
      "rnfirebase.io=error, stackoverflow.com=warn",
    );

    expect(overrides.get("rnfirebase.io")).toBe("error");
    expect(overrides.get("stackoverflow.com")).toBe("warn");
  });

  test("splits flag pairs on the last = so URLs with = still parse", () => {
    expect([
      ...parseSeverityOverrideHosts(
        undefined,
        "https://example.com/path?q=1=error",
      ).entries(),
    ]).toEqual([["example.com", "error"]]);

    expect([
      ...parseSeverityOverrideHosts(
        undefined,
        "https://example.com/foo=bar=warn",
      ).entries(),
    ]).toEqual([["example.com", "warn"]]);

    // A fragment with no `=` is still dropped.
    expect(parseSeverityOverrideHosts(undefined, "nocolon").size).toBe(0);
  });

  test("lets the flag override the same host from docs.json", () => {
    const overrides = parseSeverityOverrideHosts(
      { "example.com": "warn", "other.com": "error" },
      "example.com=error",
    );

    expect(overrides.get("example.com")).toBe("error");
    expect(overrides.get("other.com")).toBe("error");
  });

  test("drops garbage, empty hosts, off, and unknown severities", () => {
    const overrides = parseSeverityOverrideHosts(
      {
        "": "error",
        "not a host": "warn",
        "good.com": "off",
        "also.com": "fatal",
        "ok.com": "ERROR",
        "bad.com": 123,
      },
      "=error,bad=,garbage,*.npmjs.org=warn,https://Example.COM:8080/a=error,off.host=off",
    );

    expect([...overrides.entries()].sort()).toEqual([
      ["example.com", "error"],
      ["npmjs.org", "warn"],
      ["ok.com", "error"],
    ]);
  });

  test("accepts the same host spellings as the ignore list", () => {
    const overrides = parseSeverityOverrideHosts({
      "*.NPMJS.ORG.": "warn",
      "https://stackoverflow.com/questions/1": "error",
      "localhost:3000": "warn",
    });

    expect(overrides.get("npmjs.org")).toBe("warn");
    expect(overrides.get("stackoverflow.com")).toBe("error");
    expect(overrides.get("localhost")).toBe("warn");
  });

  test("ignores non-object config sources", () => {
    expect(parseSeverityOverrideHosts(["example.com=error"]).size).toBe(0);
    expect(parseSeverityOverrideHosts("example.com=error").size).toBe(0);
    expect(parseSeverityOverrideHosts(null).size).toBe(0);
  });
});

describe("resolveHostSeverityOverride", () => {
  test("matches the host exactly", () => {
    const overrides = parseSeverityOverrideHosts({
      "example.com": "error",
    });

    expect(
      resolveHostSeverityOverride("https://example.com/page", overrides),
    ).toBe("error");
  });

  test("matches subdomains", () => {
    const overrides = parseSeverityOverrideHosts({
      "npmjs.org": "warn",
    });

    expect(
      resolveHostSeverityOverride("https://www.npmjs.org/package/x", overrides),
    ).toBe("warn");
    expect(
      resolveHostSeverityOverride("https://a.b.npmjs.org/", overrides),
    ).toBe("warn");
  });

  test("never matches a lookalike host", () => {
    const overrides = parseSeverityOverrideHosts({
      "npmjs.org": "error",
    });

    expect(
      resolveHostSeverityOverride(
        "https://evil-npmjs.org.attacker.net/",
        overrides,
      ),
    ).toBeUndefined();
    expect(
      resolveHostSeverityOverride("https://npmjs.org.attacker.net/", overrides),
    ).toBeUndefined();
    expect(
      resolveHostSeverityOverride("https://notnpmjs.org/", overrides),
    ).toBeUndefined();
  });

  test("picks the longest matching hostname", () => {
    const overrides = parseSeverityOverrideHosts({
      "example.com": "warn",
      "docs.example.com": "error",
    });

    expect(
      resolveHostSeverityOverride("https://docs.example.com/a", overrides),
    ).toBe("error");
    expect(
      resolveHostSeverityOverride("https://api.example.com/a", overrides),
    ).toBe("warn");
    expect(
      resolveHostSeverityOverride("https://example.com/a", overrides),
    ).toBe("warn");
  });

  test("returns undefined when nothing matches or the URL is unparsable", () => {
    const overrides = parseSeverityOverrideHosts({
      "example.com": "error",
    });

    expect(
      resolveHostSeverityOverride("https://other.com/", overrides),
    ).toBeUndefined();
    expect(resolveHostSeverityOverride("not a url", overrides)).toBeUndefined();
    expect(resolveHostSeverityOverride("https://example.com/", new Map())).toBe(
      undefined,
    );
    expect(
      resolveHostSeverityOverride("https://./", overrides),
    ).toBeUndefined();
  });
});
