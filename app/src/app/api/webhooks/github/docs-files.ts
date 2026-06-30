/**
 * Determines whether a changed file path belongs to the docs.page
 * documentation set.
 *
 * A path is considered a docs file when any of the following hold:
 * - its basename is exactly `docs.json` or `docs.yaml` (at any depth), or
 * - any of its path segments is the `docs` directory.
 *
 * Matching on path segments (rather than the repo root) means a docs
 * config/directory living inside a monorepo subdirectory is still detected,
 * e.g. `packages/x/docs/y.mdx` or `app/docs.yaml`.
 */
export function isDocsFile(path: string): boolean {
  const segments = path.split("/");
  const basename = segments[segments.length - 1];

  if (basename === "docs.json" || basename === "docs.yaml") {
    return true;
  }

  // Treat the file as a docs file when a `docs` directory appears anywhere
  // in its path (i.e. the file lives under a `docs/` segment).
  return segments.slice(0, -1).includes("docs");
}

/** Returns true when any of the changed file paths is a docs file. */
export function hasDocsChanges(paths: readonly string[]): boolean {
  return paths.some(isDocsFile);
}
