import matter from "gray-matter";
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

/**
 * Catalog pointer for markdown returned when an agent prefers `text/markdown`.
 * gray-matter splits any leading frontmatter so the index is the first body
 * content and title and description still parse.
 */
export function prependAgentDocsIndex(content: string, llmsTxtUrl: string) {
  const notice = agentDocsIndexNotice(llmsTxtUrl);

  try {
    const parsed = matter(content);
    const hasFrontmatter =
      parsed.matter.trim() !== "" || parsed.content !== content;

    if (!hasFrontmatter) {
      return `${notice}\n${content}`;
    }

    const body = parsed.content.replace(/^\r?\n/, "");
    return matter.stringify(`${notice}\n${body}`, parsed.data);
  } catch {
    return `${notice}\n${content}`;
  }
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
