import { getLlmsFullTxtPathname, getLlmsTxtPathname } from "@/lib/docs-paths";
import type { DocsRequestMode } from "@/lib/docs-routing";

type DocsIndexRoute = {
  requestMode: DocsRequestMode;
  owner: string;
  repository: string;
  ref: string | null;
};

function absoluteUtilityUrl(pathname: string, origin: string): string {
  return new URL(pathname, origin).toString();
}

/** Absolute `llms.txt` URL for the site the agent is reading. */
export function agentLlmsTxtUrl(route: DocsIndexRoute, origin: string) {
  return absoluteUtilityUrl(getLlmsTxtPathname(route), origin);
}

export function agentLlmsFullTxtUrl(route: DocsIndexRoute, origin: string) {
  return absoluteUtilityUrl(getLlmsFullTxtPathname(route), origin);
}

/**
 * Mintlify-style catalog pointer. Prepended to markdown returned when an
 * agent prefers `text/markdown` over HTML, so the first thing it reads is
 * where to fetch the rest of the site.
 */
export function prependAgentDocsIndex(content: string, llmsTxtUrl: string) {
  return `> ## Documentation Index\n> Fetch the complete documentation index at: ${llmsTxtUrl}\n> Use this file to discover all available pages before exploring further.\n\n${content}`;
}

export function agentDocsIndexLinkHeader(
  route: DocsIndexRoute,
  origin: string,
) {
  const llmsTxtUrl = agentLlmsTxtUrl(route, origin);
  const llmsFullTxtUrl = agentLlmsFullTxtUrl(route, origin);

  return `<${llmsTxtUrl}>; rel="llms-txt", <${llmsFullTxtUrl}>; rel="llms-full-txt"`;
}

export function buildAgentMarkdownResponse(args: {
  content: string;
  route: DocsIndexRoute;
  origin: string;
}) {
  const llmsTxtUrl = agentLlmsTxtUrl(args.route, args.origin);

  return {
    body: prependAgentDocsIndex(args.content, llmsTxtUrl),
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      Link: agentDocsIndexLinkHeader(args.route, args.origin),
      "x-llms-txt": llmsTxtUrl,
    },
  };
}
