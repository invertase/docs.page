import { getPostHogClient, readVisitorHeaders, visitorId } from "@/lib/posthog";
import { isSnippetId, SNIPPET_PARAM } from "@/lib/prompt-copy";
import { utmProperties } from "@/lib/utm";

/**
 * Records a copy of one of the homepage hero snippets.
 *
 * The homepage is server-rendered and cookieless (no posthog-js), so a
 * clipboard copy — which never leaves the browser — is only measurable if the
 * client pings the server. The hero's copy button beacons this route, we
 * capture `homepage:prompt_copy`, and nothing comes back.
 *
 * POST-only on purpose. The request carries no body, and the one
 * user-controlled value it does read — the snippet id on the URL — is checked
 * against a closed set and dropped if it is not in it, so no caller-chosen
 * string can reach PostHog and the route cannot be turned into an open data
 * sink. Requiring POST keeps link checkers, unfurl bots and crawlers — which
 * only ever send GET/HEAD — from recording copies no human performed.
 */
export function POST(req: Request) {
  const requestUrl = new URL(req.url);
  const { ip, userAgent } = readVisitorHeaders(req.headers);

  // Which tab was copied. `terminal` and `agent` are the only ids we ship, so
  // anything else — absent, misspelt, hand-crafted — leaves the property off
  // the event entirely rather than being echoed into PostHog.
  const snippet = requestUrl.searchParams.get(SNIPPET_PARAM);

  // Same anonymity model as `homepage:cta_click`: a daily-rotating, cookieless
  // visitor hash, no person profile. Queued (not flushed) to match every other
  // server-side capture in the app — the client is a long-lived singleton in a
  // standalone Node server, so its background flush drains the queue.
  getPostHogClient()?.capture({
    distinctId: visitorId(ip, userAgent, new Date()),
    event: "homepage:prompt_copy",
    properties: {
      ...(isSnippetId(snippet) ? { snippet } : {}),
      // The hero forwards the page's own utm params onto the beacon URL, so a
      // copy is attributed to the campaign that brought the visitor in.
      ...utmProperties(requestUrl),
      $raw_user_agent: userAgent,
      $process_person_profile: false,
    },
  });

  return new Response(null, { status: 204 });
}
