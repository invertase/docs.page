import { describe, expect, test } from "bun:test";
import { GET } from "./route";

function get(cta: string, url = `https://docs.page/api/go/${cta}`) {
  return GET(new Request(url), { params: Promise.resolve({ cta }) });
}

describe("GET /api/go/[cta]", () => {
  test("redirects known CTAs to their hardcoded destination", async () => {
    const hero = await get("get-started");
    expect(hero.status).toBe(302);
    expect(hero.headers.get("Location")).toBe("https://use.docs.page");

    const footer = await get("quickstart");
    expect(footer.status).toBe(302);
    expect(footer.headers.get("Location")).toBe(
      "https://use.docs.page/quickstart",
    );
  });

  test("is never cached, so the capture always runs", async () => {
    const response = await get("get-started");
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    expect(response.headers.get("CDN-Cache-Control")).toBe("no-store");
  });

  test("sends unknown slugs to the homepage instead of an arbitrary host", async () => {
    for (const cta of ["nope", "toString", "constructor", "__proto__"]) {
      const response = await get(cta);
      expect(response.status).toBe(302);
      expect(response.headers.get("Location")).toBe("/");
    }
  });

  test("ignores any destination supplied on the query string", async () => {
    const response = await get(
      "get-started",
      "https://docs.page/api/go/get-started?destination=https://evil.example.com",
    );
    expect(response.headers.get("Location")).toBe("https://use.docs.page");
  });
});
