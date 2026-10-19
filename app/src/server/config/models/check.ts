import { z } from "zod";

function normalizeHost(entry: string): string | undefined {
  const trimmed = entry.trim().toLowerCase();
  const withoutWildcard = trimmed.startsWith("*.") ? trimmed.slice(2) : trimmed;

  if (!withoutWildcard) {
    return undefined;
  }

  const candidate = withoutWildcard.includes("://")
    ? withoutWildcard
    : `https://${withoutWildcard}`;
  let hostname: string;

  try {
    hostname = new URL(candidate).hostname.toLowerCase();
  } catch {
    return undefined;
  }

  const normalized = hostname.replace(/^\.+/, "").replace(/\.+$/, "");
  return normalized || undefined;
}

/**
 * Settings for `@docs.page/cli check`. The hosted app does not read these
 * itself, but they live in the schema so `docs.json` validates and
 * autocompletes the key instead of editors flagging it as unknown.
 */
export default z
  .object({
    /**
     * Hosts to skip when checking external links. The CLI accepts either a
     * comma-separated string or a list of hosts, and discards entries it
     * cannot normalise, so both shapes are permitted here.
     */
    ignoreExternalHosts: z
      .union([z.string(), z.array(z.string())])
      .optional()
      .catch(undefined),
    /**
     * Per-host severity for external-link failures. Values are `warn` or
     * `error` only (case-insensitive). Invalid entries and empty hosts are
     * dropped per key so one bad value does not wipe valid siblings; the
     * field-level catch still forgives a non-object value.
     */
    severityOverrideHosts: z
      .custom<Record<string, unknown>>(
        (value) =>
          typeof value === "object" && value !== null && !Array.isArray(value),
      )
      .transform((record) => {
        const result = new Map<string, "warn" | "error">();

        for (const [rawHost, rawSeverity] of Object.entries(record)) {
          const host = normalizeHost(rawHost);

          if (!host || typeof rawSeverity !== "string") {
            continue;
          }

          const severity = rawSeverity.trim().toLowerCase();

          if (severity === "warn" || severity === "error") {
            result.set(host, severity);
          }
        }

        return result.size > 0 ? Object.fromEntries(result) : undefined;
      })
      .optional()
      .catch(undefined),
  })
  .optional()
  .catch(undefined);
