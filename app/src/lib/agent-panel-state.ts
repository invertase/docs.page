import { getDocsRepoScopedPath } from "@/lib/docs-paths";
import type { ResolvedDocsRoute } from "@/lib/docs-routing";

const AGENT_PANEL_COOKIE_PREFIX = "dpa_open";

export function getAgentPanelCookieName(owner: string, repository: string) {
  return `${AGENT_PANEL_COOKIE_PREFIX}_${toCookiePart(owner)}_${toCookiePart(repository)}`;
}

export function getAgentPanelCookiePath(route: Pick<
  ResolvedDocsRoute,
  "requestMode" | "owner" | "repository" | "ref"
>) {
  return getDocsRepoScopedPath(route);
}

function toCookiePart(value: string) {
  return value.replace(/[^A-Za-z0-9_-]/g, "_");
}
