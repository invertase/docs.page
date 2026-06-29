import { describe, expect, test } from "bun:test";
import { resolveInternalDocHref } from "./docs-nav";
import type { ResolvedDocsRoute } from "./docs-routing";

function createRoute(
  overrides: Partial<ResolvedDocsRoute> = {},
): ResolvedDocsRoute {
  return {
    owner: "invertase",
    repository: "docs.page",
    ref: null,
    docPath: "writing-content",
    requestMode: "canonical",
    vanity: false,
    customDomain: false,
    canonicalPathname: "/invertase/docs.page/writing-content",
    publicPathname: "/invertase/docs.page/writing-content",
    canonicalUrl: null,
    ...overrides,
  };
}

describe("resolveInternalDocHref", () => {
  test("returns bare hash fragments unchanged", () => {
    const route = createRoute();

    expect(resolveInternalDocHref(route, "#section")).toBe("#section");
    expect(resolveInternalDocHref(route, "#my-heading")).toBe("#my-heading");
  });

  test("prefixes internal page paths", () => {
    const route = createRoute();

    expect(resolveInternalDocHref(route, "/writing-content")).toBe(
      "/invertase/docs.page/writing-content",
    );
    expect(resolveInternalDocHref(route, "/other-page")).toBe(
      "/invertase/docs.page/other-page",
    );
  });

  test("prefixes internal page paths with hash fragments", () => {
    const route = createRoute();

    expect(resolveInternalDocHref(route, "/other-page#section")).toBe(
      "/invertase/docs.page/other-page#section",
    );
  });

  test("returns external links unchanged", () => {
    const route = createRoute();

    expect(resolveInternalDocHref(route, "https://example.com")).toBe(
      "https://example.com",
    );
    expect(
      resolveInternalDocHref(route, "https://example.com/page#section"),
    ).toBe("https://example.com/page#section");
  });

  test("returns bare hash fragments unchanged in preview mode", () => {
    const route = createRoute({ requestMode: "preview" });

    expect(resolveInternalDocHref(route, "#section")).toBe("#section");
  });

  test("prefixes preview paths but not bare hash fragments", () => {
    const route = createRoute({ requestMode: "preview" });

    expect(resolveInternalDocHref(route, "/writing-content")).toBe(
      "/preview/writing-content",
    );
  });

  test("includes ref in prefixed paths", () => {
    const route = createRoute({ ref: "main" });

    expect(resolveInternalDocHref(route, "/writing-content")).toBe(
      "/invertase/docs.page~main/writing-content",
    );
  });
});
