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

function agentDocsIndexNotice(llmsTxtUrl: string) {
  return [
    "> ## Documentation Index",
    `> Fetch the complete documentation index at: ${llmsTxtUrl}`,
    "> Use this file to discover all available pages before exploring further.",
    "",
  ].join("\n");
}

const LEADING_FRONTMATTER = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;

/**
 * Catalog pointer for markdown returned when an agent prefers `text/markdown`.
 * Leading YAML fences are left untouched so title and description still parse.
 */
export function prependAgentDocsIndex(content: string, llmsTxtUrl: string) {
  const notice = agentDocsIndexNotice(llmsTxtUrl);
  const frontmatter = content.match(LEADING_FRONTMATTER)?.[0];

  if (!frontmatter) {
    return `${notice}\n${content}`;
  }

  const body = content.slice(frontmatter.length).replace(/^\r?\n/, "");
  return `${frontmatter}${notice}\n${body}`;
}

export function agentDocsIndexLinkHeader(
  route: DocsIndexRoute,
  origin: string,
) {
  const llmsTxtUrl = agentLlmsTxtUrl(route, origin);
  const llmsFullTxtUrl = agentLlmsFullTxtUrl(route, origin);

  return `<${llmsTxtUrl}>; rel="llms-txt", <${llmsFullTxtUrl}>; rel="llms-full-txt"`;
}

function rawMarkdownHeaders() {
  return {
    "Content-Type": "text/markdown; charset=utf-8",
    Vary: "Accept",
  };
}

export function buildAgentMarkdownResponse(args: {
  content: string;
  route: DocsIndexRoute;
  origin: string;
}) {
  try {
    const llmsTxtUrl = agentLlmsTxtUrl(args.route, args.origin);

    return {
      body: prependAgentDocsIndex(args.content, llmsTxtUrl),
      headers: {
        ...rawMarkdownHeaders(),
        Link: agentDocsIndexLinkHeader(args.route, args.origin),
        "x-llms-txt": llmsTxtUrl,
      },
    };
  } catch {
    return {
      body: args.content,
      headers: rawMarkdownHeaders(),
    };
  }
}
