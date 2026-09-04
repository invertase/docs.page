/**
 * The utm params we attribute on. Exported because the homepage hero forwards
 * whatever the page was loaded with onto its tracking beacon, and both ends
 * have to agree on which keys those are.
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
