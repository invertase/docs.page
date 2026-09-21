/**
 * The contract for the homepage prompt-copy beacon, shared by both ends of it.
 *
 * The hero puts the copied snippet's id on the beacon URL and the route handler
 * validates what arrives, so the param name and the set of ids have to agree.
 * They live here rather than in the hero because the hero is a browser
 * component — importing it from the route handler would pull React, `next/link`
 * and the icon set into the server module for no reason.
 */

/** Query param the hero sends the snippet id as; `sendBeacon` has no body. */
export const SNIPPET_PARAM = "snippet";

/** The hero's two setup snippets: the CLI command, and the agent prompt. */
const SNIPPET_IDS = ["terminal", "agent"] as const;

export type SnippetId = (typeof SNIPPET_IDS)[number];

/**
 * Whether a beacon's snippet param names a snippet we actually ship.
 *
 * The param is the one user-controlled value the route reads, so it is checked
 * against this closed set and dropped otherwise — an arbitrary string must
 * never become an event property.
 */
export function isSnippetId(value: unknown): value is SnippetId {
  return SNIPPET_IDS.some((id) => id === value);
}
