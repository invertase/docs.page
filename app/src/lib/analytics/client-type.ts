export type ClientType = "human" | "ai_agent" | "crawler" | "automation";

/**
 * Known LLM / AI agent user-agents.
 *
 * Maintained from the public ai.robots.txt project
 * (https://github.com/ai-robots-txt/ai.robots.txt) and Dark Visitors
 * (https://darkvisitors.com/agents). Update this list as new agents are
 * published there.
 */
export const AI_AGENT_PATTERNS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bytespider",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
  "cohere-ai",
  "DuckAssistBot",
  "Diffbot",
  "ImagesiftBot",
  "Timpibot",
  "YouBot",
  "Omgilibot",
] as const;

/** Traditional search / social crawlers (non-AI). */
export const CRAWLER_PATTERNS = [
  "Googlebot",
  "bingbot",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
  "Slurp",
  "facebookexternalhit",
  "Twitterbot",
  "LinkedInBot",
  "Slackbot",
  "Discordbot",
  "WhatsApp",
  "TelegramBot",
  // Lighthouse ships a browser-like "Chrome-Lighthouse" UA, so it must be
  // caught before the browser check or it counts as a human. PostHog classifies
  // it as an seo_crawler.
  "Lighthouse",
] as const;

/** Generic bot fallback for crawlers not covered by an explicit pattern. */
const GENERIC_CRAWLER_PATTERN = /bot|crawler|spider|crawl/i;

/** Scripted / programmatic HTTP clients. */
export const AUTOMATION_PATTERNS = [
  "curl",
  "wget",
  "python-requests",
  "httpx",
  "aiohttp",
  "axios",
  "node-fetch",
  "undici",
  "Go-http-client",
  "okhttp",
  "Java/",
  // Headless / driven browsers. These carry a browser-like UA (e.g.
  // "HeadlessChrome") and would otherwise be counted as humans. PostHog
  // classifies them as automation (headless_browser).
  "HeadlessChrome",
  "PhantomJS",
  "Puppeteer",
  "Playwright",
  "Selenium",
  "Cypress",
] as const;

/** Real browser signature: a Mozilla token plus a known engine/brand token. */
const BROWSER_PATTERN = /mozilla\/.*(chrome|safari|firefox|edg|opr|gecko)/i;

function matchesAny(
  lowerUserAgent: string,
  patterns: readonly string[],
): boolean {
  return patterns.some((pattern) =>
    lowerUserAgent.includes(pattern.toLowerCase()),
  );
}

/**
 * Classify a request's User-Agent so PostHog can distinguish humans from
 * agents, crawlers and scripted clients.
 *
 * Checks run in the order ai_agent -> crawler -> automation -> human so a UA
 * that claims both "bot" and a known AI name lands in `ai_agent`. Matching is
 * case-insensitive. A real browser UA that matches none of the bot/script
 * lists is `human`; a missing/empty UA (or an unknown non-browser UA) is
 * treated as `automation` rather than optimistically counted as a human.
 */
export function classifyClient(
  userAgent: string | null | undefined,
): ClientType {
  const ua = userAgent?.trim() ?? "";
  if (ua === "") {
    return "automation";
  }

  const lower = ua.toLowerCase();

  if (matchesAny(lower, AI_AGENT_PATTERNS)) {
    return "ai_agent";
  }

  if (matchesAny(lower, CRAWLER_PATTERNS) || GENERIC_CRAWLER_PATTERN.test(ua)) {
    return "crawler";
  }

  if (matchesAny(lower, AUTOMATION_PATTERNS)) {
    return "automation";
  }

  if (BROWSER_PATTERN.test(ua)) {
    return "human";
  }

  return "automation";
}
