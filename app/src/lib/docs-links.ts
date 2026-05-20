export function ensureLeadingSlash(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export function isExternalLink(href: string) {
  return (
    href.startsWith("http://")
    || href.startsWith("https://")
    || href.startsWith("//")
  );
}
