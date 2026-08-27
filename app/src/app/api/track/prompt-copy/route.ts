import { getPostHogClient, readVisitorHeaders, visitorId } from "@/lib/posthog";
import { utmProperties } from "@/lib/utm";

/**
 * Records a copy of the homepage agent prompt.
 *
 * The homepage is server-rendered and cookieless (no posthog-js), so a
 * clipboard copy — which never leaves the browser — is only measurable if the
 * client pings the server. The hero's copy button beacons this route, we
 * capture `homepage:prompt_copy`, and nothing comes back.
 *
 * POST-only on purpose. The request carries no body and nothing
 * user-controlled is read, so it cannot be turned into an open data sink, and
 * requiring POST keeps link checkers, unfurl bots and crawlers — which only
 * ever send GET/HEAD — from recording copies no human performed.
 */
export function POST(req: Request) {
  const requestUrl = new URL(req.url);
  const { ip, userAgent } = readVisitorHeaders(req.headers);

  // Same anonymity model as `homepage:cta_click`: a daily-rotating, cookieless
  // visitor hash, no person profile. Queued (not flushed) to match every other
  // server-side capture in the app — the client is a long-lived singleton in a
  // standalone Node server, so its background flush drains the queue.
  getPostHogClient()?.capture({
    distinctId: visitorId(ip, userAgent, new Date()),
    event: "homepage:prompt_copy",
    properties: {
      // A no-op today — the hero beacons a bare path — but kept so this
      // event carries the same property shape as `homepage:cta_click`, and so
      // an utm-carrying beacon URL would be attributed the same way.
      ...utmProperties(requestUrl),
      $raw_user_agent: userAgent,
      $process_person_profile: false,
    },
  });

  return new Response(null, { status: 204 });
}
