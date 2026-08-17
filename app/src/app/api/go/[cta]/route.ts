import { getPostHogClient, readVisitorHeaders, visitorId } from "@/lib/posthog";
import { utmProperties } from "@/lib/utm";
import { setDocsCacheHeaders, TRACKING_REDIRECT_CACHE_HEADERS } from "@/proxy";

/**
 * Homepage CTA slug -> destination. Hardcoded server-side on purpose: the
 * destination is never read from the request, so this route cannot be turned
 * into an open redirect.
 */
const CTA_DESTINATIONS = {
  "get-started": "https://use.docs.page",
  quickstart: "https://use.docs.page/quickstart",
} as const;

type CtaSlug = keyof typeof CTA_DESTINATIONS;

/** Unknown slug (stale or hand-edited link): send the visitor home, don't 404. */
const FALLBACK_DESTINATION = "/";

function isCtaSlug(value: string): value is CtaSlug {
  // `hasOwn`, not `in`: `in` would also match inherited keys like `toString`.
  return Object.hasOwn(CTA_DESTINATIONS, value);
}

type RouteContext = {
  params: Promise<{
    cta: string;
  }>;
};

/**
 * Tracked homepage CTA redirect.
 *
 * The homepage is server-rendered and cookieless (no posthog-js), so a CTA
 * click is only measurable if it passes through the server. The buttons link
 * here, we capture `homepage:cta_click`, then bounce the visitor on to the real
 * destination.
 */
export async function GET(req: Request, context: RouteContext) {
  const target = await resolveCta(context);

  if (!target) {
    return redirect(FALLBACK_DESTINATION);
  }

  const { cta, destination } = target;
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
      cta,
      destination,
      // No-op unless the CTA link itself carries utm params, which keeps an ad
      // flight's attribution attached to the click when it does.
      ...utmProperties(requestUrl),
      $raw_user_agent: userAgent,
      $process_person_profile: false,
    },
  });

  return redirect(destination);
}

/**
 * HEAD is answered explicitly so it never counts as a click.
 *
 * Without this export the App Router derives HEAD from GET, which would make
 * link checkers, uptime monitors and Slack/Twitter/iMessage unfurls each record
 * a `homepage:cta_click` no human ever performed. The response is byte-for-byte
 * the GET response (same 302, same `Location`, same `no-store`) minus the
 * capture, so previews and validators still resolve the destination correctly.
 */
export async function HEAD(_req: Request, context: RouteContext) {
  const target = await resolveCta(context);
  return redirect(target?.destination ?? FALLBACK_DESTINATION);
}

/** Resolve the route param to a known CTA, or `null` for an unknown slug. */
async function resolveCta(
  context: RouteContext,
): Promise<{ cta: CtaSlug; destination: string } | null> {
  const { cta } = await context.params;
  return isCtaSlug(cta) ? { cta, destination: CTA_DESTINATIONS[cta] } : null;
}

/**
 * 302 (temporary) — the destination map is expected to change. Never cached:
 * a stored redirect would be replayed without reaching this handler, silently
 * dropping every subsequent event.
 */
function redirect(destination: string) {
  const response = new Response(null, {
    status: 302,
    headers: {
      Location: destination,
    },
  });
  setDocsCacheHeaders(response.headers, TRACKING_REDIRECT_CACHE_HEADERS);
  return response;
}
