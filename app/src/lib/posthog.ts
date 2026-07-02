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
