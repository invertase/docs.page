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

describe("ConfigSchema scripts.googleTagManager", () => {
  test("parses the bare string form unchanged", () => {
    const config = ConfigSchema.parse({
      scripts: { googleTagManager: "GTM-ABC123" },
    });

    expect(config.scripts.googleTagManager).toBe("GTM-ABC123");
  });

  test("parses the object form with an id and a verification token", () => {
    const config = ConfigSchema.parse({
      scripts: {
        googleTagManager: {
          id: "GTM-ABC123",
          verification: "abc123verificationtoken",
        },
      },
    });

    expect(config.scripts.googleTagManager).toEqual({
      id: "GTM-ABC123",
      verification: "abc123verificationtoken",
    });
  });

  test("parses the object form with an id only", () => {
    const config = ConfigSchema.parse({
      scripts: { googleTagManager: { id: "GTM-ABC123" } },
    });

    expect(config.scripts.googleTagManager).toEqual({
      id: "GTM-ABC123",
      verification: undefined,
    });
  });

  test("forgives an object without an id (falls back to undefined)", () => {
    const config = ConfigSchema.parse({
      scripts: { googleTagManager: { verification: "abc123" } },
    });

    expect(config.scripts.googleTagManager).toBeUndefined();
  });

  test("forgives invalid types (falls back to undefined)", () => {
    expect(
      ConfigSchema.parse({ scripts: { googleTagManager: 123 } }).scripts
        .googleTagManager,
    ).toBeUndefined();

    expect(
      ConfigSchema.parse({ scripts: { googleTagManager: "" } }).scripts
        .googleTagManager,
    ).toBeUndefined();

    expect(
      ConfigSchema.parse({ scripts: { googleTagManager: { id: 123 } } }).scripts
        .googleTagManager,
    ).toBeUndefined();
  });

  test("forgives an invalid verification but keeps the id", () => {
    const config = ConfigSchema.parse({
      scripts: { googleTagManager: { id: "GTM-ABC123", verification: 123 } },
    });

    expect(config.scripts.googleTagManager).toEqual({
      id: "GTM-ABC123",
      verification: undefined,
    });
  });

  test("defaults to undefined when omitted", () => {
    const config = ConfigSchema.parse({ scripts: {} });
    expect(config.scripts.googleTagManager).toBeUndefined();
  });
});
