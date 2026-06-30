import { createHash, createHmac } from "node:crypto";
import { PostHog } from "posthog-node";

let _client: PostHog | null = null;

export function getPostHogClient(): PostHog {
  if (!_client) {
    _client = new PostHog(process.env.POSTHOG_KEY ?? "", {
      host: process.env.POSTHOG_HOST ?? "https://eu.i.posthog.com",
      disableGeoip: true,
      enableExceptionAutocapture: true,
    });
  }
  return _client;
}

// Irreversibly anonymize a client IP before using it as a PostHog distinct ID,
// so PostHog never receives a raw IP. Uses an HMAC when a salt is configured.
export function anonymizeIp(ip: string): string {
  const salt = process.env.POSTHOG_IP_HASH_SALT;
  return salt
    ? createHmac("sha256", salt).update(ip).digest("hex")
    : createHash("sha256").update(ip).digest("hex");
}
