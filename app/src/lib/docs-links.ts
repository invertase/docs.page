export function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

// Matches an RFC-3986 URI scheme prefix (`scheme:`), e.g. `mailto:`, `tel:`,
// `sms:`, `geo:`, `file:`. Internal doc hrefs are path-like (`/foo`, `foo/bar`,
// `#anchor`, `?query`) and never start with a scheme, so this stays external-only.
const URI_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:/i;

export function isExternalLink(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    // Any other URL scheme (mailto:, tel:, sms:, etc.) is external too.
    URI_SCHEME_PATTERN.test(href)
  );
}
