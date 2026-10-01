import { normalizeIgnoredHost } from "./ignored-hosts";

/**
 * Severities a host override may assign. `off` is intentionally absent: an
 * override never turns a check off, and `--external-links off` still skips the
 * request before this map is consulted.
 */
export type OverrideSeverity = "warn" | "error";

const OVERRIDE_SEVERITIES = new Set<OverrideSeverity>(["warn", "error"]);

/**
 * Parse and merge severity overrides from docs.json and the CLI flag.
 *
 * Config is an object of host → severity. The flag is a comma-separated list of
 * `host=severity` pairs. Both sources are unioned; when the same host appears in
 * both, the flag wins. Empty hosts, unusable hosts, `off`, and unknown
 * severities are dropped.
 */
export function parseSeverityOverrideHosts(
  configValue: unknown,
  flagValue?: string,
): Map<string, OverrideSeverity> {
  const overrides = new Map<string, OverrideSeverity>();

  for (const [host, severity] of entriesFromConfig(configValue)) {
    overrides.set(host, severity);
  }

  for (const [host, severity] of entriesFromFlag(flagValue)) {
    overrides.set(host, severity);
  }

  return overrides;
}

/**
 * Resolve the override severity for a URL. Matching follows the ignore-list
 * hostname rules (exact host or subdomain). When more than one entry matches,
 * the longest hostname wins so `docs.example.com` beats `example.com`.
 */
export function resolveHostSeverityOverride(
  url: string,
  overrides: ReadonlyMap<string, OverrideSeverity>,
): OverrideSeverity | undefined {
  if (overrides.size === 0) {
    return undefined;
  }

  let hostname: string;

  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    return undefined;
  }

  const host = normalizeHostname(hostname);

  if (!host) {
    return undefined;
  }

  let bestHost: string | undefined;
  let bestSeverity: OverrideSeverity | undefined;

  for (const [entry, severity] of overrides) {
    if (host === entry || host.endsWith(`.${entry}`)) {
      if (bestHost === undefined || entry.length > bestHost.length) {
        bestHost = entry;
        bestSeverity = severity;
      }
    }
  }

  return bestSeverity;
}

function entriesFromConfig(source: unknown): Array<[string, OverrideSeverity]> {
  if (typeof source !== "object" || source === null || Array.isArray(source)) {
    return [];
  }

  const entries: Array<[string, OverrideSeverity]> = [];

  for (const [rawHost, rawSeverity] of Object.entries(
    source as Record<string, unknown>,
  )) {
    const parsed = parseHostSeverityPair(rawHost, rawSeverity);

    if (parsed) {
      entries.push(parsed);
    }
  }

  return entries;
}

function entriesFromFlag(source: unknown): Array<[string, OverrideSeverity]> {
  if (typeof source !== "string") {
    return [];
  }

  const entries: Array<[string, OverrideSeverity]> = [];

  for (const part of source.split(",")) {
    // Severity is always the trailing `warn`/`error` token; a pasted URL may
    // contain `=` in the path or query, so split on the last `=`.
    const separator = part.lastIndexOf("=");

    if (separator === -1) {
      continue;
    }

    const parsed = parseHostSeverityPair(
      part.slice(0, separator),
      part.slice(separator + 1).trim(),
    );

    if (parsed) {
      entries.push(parsed);
    }
  }

  return entries;
}

function parseHostSeverityPair(
  rawHost: unknown,
  rawSeverity: unknown,
): [string, OverrideSeverity] | undefined {
  const host = normalizeIgnoredHost(rawHost);

  if (!host) {
    return undefined;
  }

  if (typeof rawSeverity !== "string") {
    return undefined;
  }

  const severity = rawSeverity.trim().toLowerCase();

  if (!OVERRIDE_SEVERITIES.has(severity as OverrideSeverity)) {
    return undefined;
  }

  return [host, severity as OverrideSeverity];
}

function normalizeHostname(hostname: string) {
  // Leading/trailing dots are the FQDN / "and subdomains" spellings; URL
  // hostnames never carry a `*.` prefix (that is normalised on map keys).
  return hostname.replace(/^\.+/, "").replace(/\.+$/, "");
}
