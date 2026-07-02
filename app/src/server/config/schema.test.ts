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
