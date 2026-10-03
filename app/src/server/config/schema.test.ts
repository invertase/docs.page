import { describe, expect, mock, test } from "bun:test";

// The config schema transitively imports the theme model, which pulls in
// `@/lib/fonts` (next/font/google). That module only loads inside the Next.js
// bundler, so stub it before importing the schema under `bun test`.
mock.module("@/lib/fonts", () => ({ fonts: {} }));

const { ConfigSchema } = await import("./schema");
const { V1ConfigSchema } = await import("./v1.schema");

describe("ConfigSchema redirects", () => {
  test("parses a redirects map of string -> string", () => {
    const config = ConfigSchema.parse({
      redirects: { "/foo": "/foo/bar", "bar/baz": "bar" },
    });

    expect(config.redirects).toEqual({
      "/foo": "/foo/bar",
      "bar/baz": "bar",
    });
  });

  test("defaults to an empty map when omitted", () => {
    const config = ConfigSchema.parse({});
    expect(config.redirects).toEqual({});
  });

  test("forgives an invalid redirects value (falls back to {})", () => {
    const config = ConfigSchema.parse({
      // non-string values are invalid; the `.catch({})` convention keeps
      // parsing resilient instead of throwing on a malformed field.
      redirects: { "/foo": 123 },
    });

    expect(config.redirects).toEqual({});
  });
});

describe("ConfigSchema scripts.googleSiteVerification", () => {
  test("parses a verification token", () => {
    const config = ConfigSchema.parse({
      scripts: { googleSiteVerification: "aBcD1234exampleToken" },
    });

    expect(config.scripts.googleSiteVerification).toBe("aBcD1234exampleToken");
  });

  test("forgives an empty string (falls back to undefined)", () => {
    const config = ConfigSchema.parse({
      scripts: { googleSiteVerification: "" },
    });

    expect(config.scripts.googleSiteVerification).toBeUndefined();
  });

  test("forgives an invalid type (falls back to undefined)", () => {
    expect(
      ConfigSchema.parse({ scripts: { googleSiteVerification: 123 } }).scripts
        .googleSiteVerification,
    ).toBeUndefined();

    expect(
      ConfigSchema.parse({
        scripts: { googleSiteVerification: { token: "abc" } },
      }).scripts.googleSiteVerification,
    ).toBeUndefined();
  });

  test("defaults to undefined when omitted", () => {
    const config = ConfigSchema.parse({ scripts: {} });
    expect(config.scripts.googleSiteVerification).toBeUndefined();
  });

  test("does not affect googleTagManager, which stays a plain string", () => {
    const config = ConfigSchema.parse({
      scripts: {
        googleTagManager: "GTM-ABC123",
        googleSiteVerification: "aBcD1234exampleToken",
      },
    });

    expect(config.scripts.googleTagManager).toBe("GTM-ABC123");
    expect(config.scripts.googleSiteVerification).toBe("aBcD1234exampleToken");
  });
});

describe("removed scripts.plausible option", () => {
  test("strips scripts.plausible from existing configs without failing", () => {
    const result = ConfigSchema.safeParse({
      scripts: { googleTagManager: "GTM-ABC123", plausible: true },
    });

    expect(result.success).toBe(true);
    expect(result.data?.scripts.googleTagManager).toBe("GTM-ABC123");
    expect(result.data?.scripts).not.toHaveProperty("plausible");
  });

  test("strips a self-hosted scripts.plausible URL", () => {
    const config = ConfigSchema.parse({
      scripts: { plausible: "https://plausible.example.com/js/script.js" },
    });

    expect(config.scripts).not.toHaveProperty("plausible");
  });

  test("ignores v1 plausibleAnalytics keys when converting", () => {
    const config = V1ConfigSchema.parse({
      googleAnalytics: "G-ABC123",
      plausibleAnalytics: true,
      plausibleAnalyticsScript: "https://plausible.example.com/js/script.js",
    });

    expect(config.scripts.googleAnalytics).toBe("G-ABC123");
    expect(config.scripts).not.toHaveProperty("plausible");
  });
});

describe("ConfigSchema agent.models", () => {
  test("parses a single-provider override", () => {
    const config = ConfigSchema.parse({
      agent: { key: "value from cli", models: { google: "gemini-3.0-pro" } },
    });

    expect(config.agent.models).toEqual({ google: "gemini-3.0-pro" });
  });

  test("parses a multi-provider override", () => {
    const config = ConfigSchema.parse({
      agent: {
        models: {
          google: "gemini-3.0-pro",
          openai: "gpt-5-mini",
          anthropic: "claude-sonnet-4-5",
          xai: "grok-4",
        },
      },
    });

    expect(config.agent.models).toEqual({
      google: "gemini-3.0-pro",
      openai: "gpt-5-mini",
      anthropic: "claude-sonnet-4-5",
      xai: "grok-4",
    });
  });

  test("defaults to undefined when omitted", () => {
    const config = ConfigSchema.parse({ agent: { key: "value from cli" } });
    expect(config.agent.models).toBeUndefined();
  });

  test("forgives an invalid type for one provider without dropping siblings", () => {
    const config = ConfigSchema.parse({
      // the per-field `.catch(undefined)` is what keeps `openai` here: a
      // record-level catch would discard every override over one bad entry.
      agent: { models: { google: 123, openai: "gpt-5-mini" } },
    });

    expect(config.agent.models?.google).toBeUndefined();
    expect(config.agent.models?.openai).toBe("gpt-5-mini");
  });

  test("forgives an empty string for one provider without dropping siblings", () => {
    const config = ConfigSchema.parse({
      agent: { models: { google: "", openai: "gpt-5-mini" } },
    });

    expect(config.agent.models?.google).toBeUndefined();
    expect(config.agent.models?.openai).toBe("gpt-5-mini");
  });

  test("strips an unknown provider key and keeps the valid entries", () => {
    const config = ConfigSchema.parse({
      agent: { models: { gooogle: "gemini-3.0-pro", openai: "gpt-5-mini" } },
    });

    expect(config.agent.models).toEqual({ openai: "gpt-5-mini" });
  });

  test("forgives an invalid models value (falls back to undefined)", () => {
    const config = ConfigSchema.parse({
      agent: { key: "value from cli", models: "gemini-3.0-pro" },
    });

    expect(config.agent.models).toBeUndefined();
    expect(config.agent.key).toBe("value from cli");
  });

  test("does not affect agent.key or agent.limits", () => {
    const config = ConfigSchema.parse({
      agent: {
        key: "value from cli",
        limits: { ip: 10, repo: 20 },
        models: { google: "gemini-3.0-pro" },
      },
    });

    expect(config.agent.key).toBe("value from cli");
    expect(config.agent.limits).toEqual({ ip: 10, repo: 20 });

    const defaults = ConfigSchema.parse({ agent: {} });
    expect(defaults.agent.key).toBeUndefined();
    expect(defaults.agent.limits).toEqual({ ip: 200, repo: 10_000 });
  });
});

describe("ConfigSchema check.severityOverrideHosts", () => {
  test("accepts a host to warn|error map", () => {
    const config = ConfigSchema.parse({
      name: "fixture",
      check: {
        severityOverrideHosts: {
          "rnfirebase.io": "error",
          "stackoverflow.com": "warn",
        },
      },
    });

    expect(config.check?.severityOverrideHosts).toEqual({
      "rnfirebase.io": "error",
      "stackoverflow.com": "warn",
    });
  });

  test("forgives a bad severityOverrideHosts shape without dropping siblings", () => {
    const config = ConfigSchema.parse({
      name: "fixture",
      check: {
        ignoreExternalHosts: ["example.com"],
        severityOverrideHosts: "rnfirebase.io=error",
      },
    });

    expect(config.check?.ignoreExternalHosts).toEqual(["example.com"]);
    expect(config.check?.severityOverrideHosts).toBeUndefined();
  });

  test("forgives invalid severity values without dropping siblings", () => {
    const config = ConfigSchema.parse({
      name: "fixture",
      check: {
        ignoreExternalHosts: "example.com",
        severityOverrideHosts: { "rnfirebase.io": "off" },
      },
    });

    expect(config.check?.ignoreExternalHosts).toBe("example.com");
    expect(config.check?.severityOverrideHosts).toBeUndefined();
  });

  test("normalizes valid hosts and drops invalid entries per key", () => {
    const config = ConfigSchema.parse({
      name: "fixture",
      check: {
        severityOverrideHosts: {
          "RNFirebase.IO": "ERROR",
          "https://StackOverflow.COM/questions/1": "warn",
          "localhost:3000": "error",
          "*.npmjs.org": "WARN",
          ".example.org": "error",
          "firebase.google.com.": "warn",
          "bad.com": "off",
          "also.com": "fatal",
          "": "error",
          "   ": "warn",
          "not a host": "error",
        },
      },
    });

    expect(config.check?.severityOverrideHosts).toEqual({
      "rnfirebase.io": "error",
      "stackoverflow.com": "warn",
      localhost: "error",
      "npmjs.org": "warn",
      "example.org": "error",
      "firebase.google.com": "warn",
    });
  });

  test("uses the later entry when normalized hosts collide", () => {
    const config = ConfigSchema.parse({
      name: "fixture",
      check: {
        severityOverrideHosts: {
          "Example.COM": "warn",
          "https://example.com/docs": "error",
        },
      },
    });

    expect(config.check?.severityOverrideHosts).toEqual({
      "example.com": "error",
    });
  });

  test("retains __proto__ as an own host property", () => {
    const input = JSON.parse(`{
      "name": "fixture",
      "check": {
        "severityOverrideHosts": {
          "__proto__": "error",
          "example.com": "warn"
        }
      }
    }`);
    const config = ConfigSchema.parse(input);
    const overrides = config.check?.severityOverrideHosts;
    const protoOverride = Object.getOwnPropertyDescriptor(
      overrides ?? {},
      "__proto__",
    );

    expect(protoOverride).toBeDefined();
    expect(protoOverride?.value).toBe("error");
    expect(overrides?.["example.com"]).toBe("warn");
  });

  test("lowercases uppercase WARN and ERROR severities", () => {
    const config = ConfigSchema.parse({
      name: "fixture",
      check: {
        severityOverrideHosts: {
          "rnfirebase.io": "ERROR",
          "stackoverflow.com": "WARN",
        },
      },
    });

    expect(config.check?.severityOverrideHosts).toEqual({
      "rnfirebase.io": "error",
      "stackoverflow.com": "warn",
    });
  });
});
