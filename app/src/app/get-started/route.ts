import { getPostHogClient, readVisitorHeaders, visitorId } from "@/lib/posthog";
import { utmProperties } from "@/lib/utm";

/**
 * Where the homepage CTAs land. Hardcoded server-side on purpose: the
 * destination is never read from the request, so this route cannot be turned
 * into an open redirect.
 */
const DESTINATION = "https://use.docs.page";

/** Kept as an event property so PostHog can break clicks down if more CTAs land here later. */
const CTA = "get-started";

/**
 * Tracked homepage CTA redirect.
 *
 * The homepage is server-rendered and cookieless (no posthog-js), so a CTA
 * click is only measurable if it passes through the server. The buttons link
 * here, we capture `homepage:cta_click`, then bounce the visitor on to the
 * docs.
 */
export function GET(req: Request) {
  const requestUrl = new URL(req.url);
  const { ip, userAgent } = readVisitorHeaders(req.headers);

  // Same anonymity model as `homepage:page_view`: a daily-rotating, cookieless
  // visitor hash, no person profile. Queued (not flushed) to match every other
  // server-side capture in the app — the client is a long-lived singleton in a
  // standalone Node server, so its background flush drains the queue.
  getPostHogClient()?.capture({
    distinctId: visitorId(ip, userAgent, new Date()),
    event: "homepage:cta_click",
    properties: {
      cta: CTA,
      destination: DESTINATION,
      // No-op unless the CTA link itself carries utm params, which keeps an ad
      // flight's attribution attached to the click when it does.
      ...utmProperties(requestUrl),
      $raw_user_agent: userAgent,
      $process_person_profile: false,
    },
  });

  return redirect();
}

/**
 * HEAD is answered explicitly so it never counts as a click.
 *
 * Without this export the App Router derives HEAD from GET, which would make
 * link checkers, uptime monitors and Slack/Twitter/iMessage unfurls each record
 * a `homepage:cta_click` no human ever performed. The response is byte-for-byte
 * the GET response (same 302, same `Location`) minus the capture, so previews
 * and validators still resolve the destination correctly.
 */
export function HEAD() {
  return redirect();
}

/** 302 (temporary) — the destination is expected to change. */
function redirect() {
  return new Response(null, {
    status: 302,
    headers: {
      Location: DESTINATION,
    },
  });
}
