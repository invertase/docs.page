import { describe, expect, test } from "bun:test";
import { hasNonLatin1, usesAutoOgImage } from "./docs-config";

describe("hasNonLatin1", () => {
  test("detects characters browser btoa cannot encode", () => {
    expect(hasNonLatin1("Ship docs - fast")).toBe(false);
    expect(hasNonLatin1("Ship docs \u2014 fast")).toBe(true);
  });
});

describe("usesAutoOgImage", () => {
  test("uses auto social image when no image override exists", () => {
    expect(usesAutoOgImage({})).toBe(true);
  });

  test("respects config and frontmatter image overrides", () => {
    expect(usesAutoOgImage({ socialPreview: "/og.png" })).toBe(false);
    expect(usesAutoOgImage({ socialPreview: false })).toBe(false);
    expect(usesAutoOgImage({}, { image: "/page-og.png" })).toBe(false);
  });
});
