import type { GitHubSource } from "./repo-source";

const NUMERIC_REF_PATTERN = /^[0-9]+$/;

export function isUnresolvedNumericRef(
  ref: string,
  source: Pick<GitHubSource, "type">,
) {
  return source.type === "branch" && NUMERIC_REF_PATTERN.test(ref);
}
