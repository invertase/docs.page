import { describe, expect, test } from "bun:test";
import type { IncomingHttpHeaders } from "node:http";
import {
  getRequestOriginFromHeaders,
  incomingHttpHeadersToWebHeaders,
} from "./incoming-http-headers";

describe("getRequestOriginFromHeaders", () => {
  test("uses a single forwarded proto and host", () => {
    expect(
      getRequestOriginFromHeaders(
        new Headers({
          "x-forwarded-proto": "https",
          "x-forwarded-host": "docs.page",
        }),
      ),
    ).toBe("https://docs.page");
  });

  test("takes the first hop when Cloudflare and Railway both append proto", () => {
    const incoming: IncomingHttpHeaders = {
      "x-forwarded-proto": ["https", "https"],
      host: "docs.page",
    };

    const origin = getRequestOriginFromHeaders(
      incomingHttpHeadersToWebHeaders(incoming),
    );

    expect(origin).toBe("https://docs.page");
    expect(new URL("/invertase/docs.page/llms.txt", origin).toString()).toBe(
      "https://docs.page/invertase/docs.page/llms.txt",
    );
  });

  test("takes the first hop from a comma-joined forwarded host", () => {
    expect(
      getRequestOriginFromHeaders({
        "x-forwarded-proto": "https, http",
        "x-forwarded-host": "docs.page, docs.page",
      }),
    ).toBe("https://docs.page");
  });
});
