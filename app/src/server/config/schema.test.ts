import { describe, expect, mock, test } from "bun:test";

// The config schema transitively imports the theme model, which pulls in
// `@/lib/fonts` (next/font/google). That module only loads inside the Next.js
// bundler, so stub it before importing the schema under `bun test`.
mock.module("@/lib/fonts", () => ({ fonts: {} }));

const { ConfigSchema } = await import("./schema");

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
