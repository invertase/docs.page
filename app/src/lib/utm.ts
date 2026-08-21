// Capture UTM params present on the request URL as event properties (cookieless: event-level only).
export function utmProperties(url: URL): Record<string, string> {
  const props: Record<string, string> = {};

  for (const key of [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
  ]) {
    const value = url.searchParams.get(key);
    if (value) props[key] = value;
  }

  return props;
}
