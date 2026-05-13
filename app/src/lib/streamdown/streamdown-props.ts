/** Streamdown/React lowercases DOM attribute names (`groupid`). */
export function propValue<T>(
  props: Record<string, unknown>,
  key: string,
): T | undefined {
  return props[key] as T | undefined;
}

/** `rehype-sanitize` prefixes clobber-prone attrs (e.g. `id`). */
const SANITIZE_ID_PREFIX = "user-content-";

export function youtubeVideoIdFromSanitizedProps(
  props: Record<string, unknown>,
): string | undefined {
  const fromVideoId = propValue<string>(props, "videoid");
  if (fromVideoId) {
    return fromVideoId;
  }

  const raw = propValue<string>(props, "id");
  if (!raw) {
    return undefined;
  }

  return raw.startsWith(SANITIZE_ID_PREFIX)
    ? raw.slice(SANITIZE_ID_PREFIX.length)
    : raw;
}
