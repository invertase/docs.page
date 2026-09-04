/**
 * Normalise one ignore-list entry to a bare lowercase hostname.
 *
 * Tolerates what people actually paste: a full URL, a `host:port`, a `*.`
 * or `.` prefix, a trailing dot, and surrounding whitespace. Returns
 * `undefined` for anything that is not a usable host.
 */
export function normalizeIgnoredHost(entry: unknown): string | undefined {
  if (typeof entry !== "string") {
    return undefined;
  }

  const trimmed = stripHostPrefix(entry.trim().toLowerCase());

  if (!trimmed) {
    return undefined;
  }

  // Parsing through URL keeps this honest about ports, credentials, paths and
  // IPv6 literals instead of hand-rolling a host grammar.
  const candidate = trimmed.includes("://") ? trimmed : `https://${trimmed}`;
  let hostname: string;

  try {
    hostname = new URL(candidate).hostname.toLowerCase();
  } catch {
    return undefined;
  }

  return normalizeHostname(hostname) || undefined;
}

/**
 * Build the ignore list from any number of sources. Each source may be a
 * comma-separated string, an array of entries, or absent; the result is the
 * de-duplicated union, so the CLI flag and docs.json add to each other rather
 * than replacing one another.
 */
export function parseIgnoredHosts(...sources: unknown[]): string[] {
  const hosts = new Set<string>();

  for (const source of sources) {
    for (const entry of splitIgnoreEntries(source)) {
      const host = normalizeIgnoredHost(entry);

      if (host) {
        hosts.add(host);
      }
    }
  }

  return [...hosts];
}

/**
 * Match a URL against the ignore list on hostname only. An entry covers the
 * host itself and its subdomains, so `npmjs.org` also covers `www.npmjs.org`
 * but never `evil-npmjs.org.attacker.net`.
 */
export function isIgnoredHost(url: string, ignoredHosts: readonly string[]) {
  if (ignoredHosts.length === 0) {
    return false;
  }

  let hostname: string;

  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return false;
  }

  const host = normalizeHostname(hostname);

  if (!host) {
    return false;
  }

  return ignoredHosts.some(
    (entry) => host === entry || host.endsWith(`.${entry}`),
  );
}

function splitIgnoreEntries(source: unknown): string[] {
  if (typeof source === "string") {
    return source.split(",");
  }

  if (Array.isArray(source)) {
    return source.flatMap(splitIgnoreEntries);
  }

  return [];
}

function stripHostPrefix(value: string) {
  return value.startsWith("*.") ? value.slice(2) : value;
}

function normalizeHostname(hostname: string) {
  // A leading dot is a common way to write "and its subdomains"; a trailing
  // dot is the fully qualified form of the same name.
  return stripHostPrefix(hostname).replace(/^\.+/, "").replace(/\.+$/, "");
}
