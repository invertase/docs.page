import { describe, expect, test } from "bun:test";
import { classifyClient } from "./client-type";

describe("classifyClient", () => {
  test("classifies known AI agents", () => {
    expect(
      classifyClient(
        "Mozilla/5.0 (compatible; GPTBot/1.1; +https://openai.com/gptbot)",
      ),
    ).toBe("ai_agent");
    expect(
      classifyClient(
        "Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)",
      ),
    ).toBe("ai_agent");
  });

  test("prefers ai_agent over a generic bot match", () => {
    // UA that also contains "bot" must still land in ai_agent.
    expect(classifyClient("PerplexityBot/1.0 (bot)")).toBe("ai_agent");
  });

  test("classifies traditional crawlers", () => {
    expect(
      classifyClient(
        "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      ),
    ).toBe("crawler");
    expect(classifyClient("SomeRandomCrawler/1.0 spider")).toBe("crawler");
  });

  test("classifies scripted / programmatic clients", () => {
    expect(classifyClient("curl/8.4.0")).toBe("automation");
    expect(classifyClient("python-requests/2.31.0")).toBe("automation");
  });

  test("classifies headless / driven browsers as automation", () => {
    // Browser-like UAs that would otherwise pass the human check.
    expect(
      classifyClient(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/120.0.0.0 Safari/537.36",
      ),
    ).toBe("automation");
  });

  test("classifies Chrome-Lighthouse as a crawler", () => {
    // Lighthouse carries a browser-like UA but must not count as a human.
    expect(
      classifyClient(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Chrome-Lighthouse",
      ),
    ).toBe("crawler");
  });

  test("treats missing or empty UA as automation", () => {
    expect(classifyClient(null)).toBe("automation");
    expect(classifyClient(undefined)).toBe("automation");
    expect(classifyClient("   ")).toBe("automation");
  });

  test("classifies real browsers as human", () => {
    expect(
      classifyClient(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      ),
    ).toBe("human");
  });
});
