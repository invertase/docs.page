import { beforeAll, describe, expect, test } from "bun:test";

import type { ResolvedDocsRoute } from "@/lib/docs-routing";
import {
  resolveConfigRedirectDestination,
  resolveFrontmatterRedirectDestination,
} from "./docs-redirect";

// Force the production docs base so destination assertions are deterministic
// (see getPublicDocsSiteBase / getDocsEnvironment).
beforeAll(() => {
  process.env.NODE_ENV = "production";
  delete process.env.VERCEL;
});

function makeRoute(
  overrides: Partial<ResolvedDocsRoute> = {},
): ResolvedDocsRoute {
  return {
    owner: "invertase",
    repository: "docs.page",
    ref: null,
    docPath: "",
    requestMode: "canonical",
    vanity: false,
    customDomain: false,
    canonicalPathname: "/invertase/docs.page",
    publicPathname: "/invertase/docs.page",
    canonicalUrl: null,
    ...overrides,
  };
}

const BASE = "https://docs.page/invertase/docs.page";

describe("resolveConfigRedirectDestination", () => {
  test("fires for a matching (deleted-page) key against the repo doc-root", async () => {
    const destination = await resolveConfigRedirectDestination(
      makeRoute({ docPath: "foo" }),
      { "/foo": "/foo/bar" },
    );

    expect(destination).toBe(`${BASE}/foo/bar`);
  });

  test("resolves relative-path values against the doc-root, not the bad path", async () => {
    // The incoming path is junk (`bar/baz`), but the value resolves cleanly
    // against the repo doc-root rather than relative to the incoming path.
    const destination = await resolveConfigRedirectDestination(
      makeRoute({ docPath: "bar/baz" }),
      { "bar/baz": "bar" },
    );

    expect(destination).toBe(`${BASE}/bar`);
  });

  test("matches keys tolerant of leading/trailing slashes", async () => {
    const withSlash = await resolveConfigRedirectDestination(
      makeRoute({ docPath: "foo" }),
      { "/foo/": "/new" },
    );
    expect(withSlash).toBe(`${BASE}/new`);

    const withoutSlash = await resolveConfigRedirectDestination(
      makeRoute({ docPath: "foo" }),
      { foo: "/new" },
    );
    expect(withoutSlash).toBe(`${BASE}/new`);
  });

  test("passes external URL values through verbatim", async () => {
    const destination = await resolveConfigRedirectDestination(
      makeRoute({ docPath: "old" }),
      { old: "https://example.com/new" },
    );

    expect(destination).toBe("https://example.com/new");
  });

  test("anchors the destination to the ref when present", async () => {
    const destination = await resolveConfigRedirectDestination(
      makeRoute({ docPath: "foo", ref: "next" }),
      { foo: "bar" },
    );

    expect(destination).toBe(`${BASE}~next/bar`);
  });

  test("returns null when no key matches", async () => {
    const destination = await resolveConfigRedirectDestination(
      makeRoute({ docPath: "missing" }),
      { foo: "bar" },
    );

    expect(destination).toBeNull();
  });

  test("api routes are excluded by routing, not by this resolver", async () => {
    // Api-style routes (mcp / llms.txt / sitemap.xml / robots.txt / search.json
    // / og) are App Router route files under `app/api/...` and never reach the
    // Pages Router doc-page catch-all where this resolver is wired, so they can
    // never be redirected — even if a config key happens to match their name.
    // This test documents that the exclusion is structural: the resolver itself
    // has no notion of api paths, so relying on route separation is essential.
    const fs = await import("node:fs");
    // import.meta.dir is .../app/src/lib; api routes live at
    // .../app/src/app/api/[owner]/[repo].
    const apiRouterDir = `${import.meta.dir}/../app/api/[owner]/[repo]`;
    const filesInApiRouter = fs.readdirSync(apiRouterDir);

    // sitemap.xml / llms.txt / robots.txt / mcp / search.json all live here as
    // their own App Router route directories, physically separate from the
    // Pages Router doc-page catch-all (src/pages/[[...path]].tsx).
    expect(filesInApiRouter).toEqual(
      expect.arrayContaining([
        "sitemap.xml",
        "llms.txt",
        "robots.txt",
        "mcp",
        "search.json",
      ]),
    );
  });

  test("returns null when there are no redirects", async () => {
    expect(
      await resolveConfigRedirectDestination(makeRoute({ docPath: "foo" }), {}),
    ).toBeNull();
    expect(
      await resolveConfigRedirectDestination(
        makeRoute({ docPath: "foo" }),
        undefined,
      ),
    ).toBeNull();
  });
});

describe("resolveFrontmatterRedirectDestination (unchanged behaviour)", () => {
  test("resolves a relative frontmatter redirect against the doc-root", async () => {
    const destination = await resolveFrontmatterRedirectDestination(
      makeRoute({ docPath: "old" }),
      { frontmatter: { redirect: "new" } },
    );

    expect(destination).toBe(`${BASE}/new`);
  });

  test("returns null with no frontmatter redirect", async () => {
    const destination = await resolveFrontmatterRedirectDestination(
      makeRoute({ docPath: "old" }),
      { frontmatter: {} },
    );

    expect(destination).toBeNull();
  });
});
