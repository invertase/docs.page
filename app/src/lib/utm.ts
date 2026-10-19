/**
 * The utm params we recognise. Single source of truth for every consumer: the
 * event properties, the CTA link forwarding — so a param is never captured but
 * silently dropped from links (or vice versa) — and the homepage hero, which
 * forwards whatever the page was loaded with onto its copy-tracking beacon.
 * Exported because that hero is the one consumer outside this module.
 */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

// Capture UTM params present on the request URL as event properties (cookieless: event-level only).
export function utmProperties(url: URL): Record<string, string> {
  const props: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = url.searchParams.get(key);
    if (value) props[key] = value;
  }

  return props;
}

/**
 * The recognised utm params of a request, re-encoded as a query string
 * (`"?utm_source=..."`), or `""` when the request carries none.
 *
 * Appended server-side to the homepage CTA links so a visitor who lands from an
 * ad flight still carries that attribution into `/get-started`, which captures
 * `homepage:cta_click` from its own request URL. Only the five known keys are
 * forwarded — unknown query params are never reflected back into on-page links.
 */
export function utmQueryString(url: URL): string {
  const query = new URLSearchParams(utmProperties(url)).toString();

  return query ? `?${query}` : "";
}
