import { createHash } from "node:crypto";
import { PostHog } from "posthog-node";

let _client: PostHog | null = null;
let _warned = false;

export function getPostHogClient(): PostHog | null {
  if (_client) {
    return _client;
  }
  const key = process.env.POSTHOG_KEY;
  if (!key) {
    if (!_warned) {
      console.warn("POSTHOG_KEY is not set — PostHog analytics is disabled.");
      _warned = true;
    }
    return null;
  }
  _client = new PostHog(key, {
    host: "https://eu.i.posthog.com",
    disableGeoip: true,
    enableExceptionAutocapture: true,
  });
  return _client;
}

// Hash a client IP before using it as a PostHog distinct ID, so PostHog never
// receives a raw IP address.
export function anonymizeIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex");
}

/**
 * Daily-rotating, cookieless visitor dedup key.
 *
 * Mirrors Plausible's visitor definition: SHA-256 of
 * `${YYYY-MM-DD}:${ip}:${userAgent}` using the UTC date, so unique-visitor
 * counts in PostHog can be reconciled with Plausible. The daily rotation is
 * deliberate for privacy — it stays cookieless, matches Plausible, and makes
 * cross-day visitor retention intentionally impossible. A missing IP or
 * User-Agent still yields a stable-per-day hash of whatever is present.
 */
export function visitorId(
  ip: string | null | undefined,
  userAgent: string | null | undefined,
  date: Date,
): string {
  const day = date.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  return createHash("sha256")
    .update(`${day}:${ip ?? ""}:${userAgent ?? ""}`)
    .digest("hex");
}

/**
 * Read the visitor IP + User-Agent from request headers, mirroring the same
 * inputs Plausible uses (`x-forwarded-for` / `user-agent`). Accepts a Web
 * `Headers` object, so it works both in App Router route handlers (`req.headers`)
 * and in `getServerSideProps` once the Node headers are converted to a Web
 * `Headers`. Prefers the first `x-forwarded-for` entry, falling back to
 * `x-real-ip`.
 */
export function readVisitorHeaders(headers: Headers): {
  ip: string | null;
  userAgent: string | null;
} {
  const forwardedFor = headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() || headers.get("x-real-ip") || null;
  const userAgent = headers.get("user-agent");
  return { ip, userAgent };
}
