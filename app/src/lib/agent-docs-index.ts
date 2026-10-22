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
  return `> ## Documentation Index\n> Fetch the complete documentation index at: ${llmsTxtUrl}\n> Use this file to discover all available pages before exploring further.\n`;
}

/**
 * Split a leading YAML frontmatter block the same way gray-matter does.
 * The opening `---` must be the first bytes, and the block must close.
 */
function splitLeadingFrontmatter(content: string) {
  const bom = content.startsWith("\uFEFF") ? "\uFEFF" : "";
  const source = bom ? content.slice(bom.length) : content;

  if (!source.startsWith("---") || source.charAt(3) === "-") {
    return null;
  }

  const rest = source.slice(3);
  const closeIndex = rest.indexOf("\n---");
  if (closeIndex === -1) {
    return null;
  }

  let end = 3 + closeIndex + "\n---".length;
  if (source[end] === "\r") {
    end += 1;
  }
  if (source[end] === "\n") {
    end += 1;
  }

  return {
    frontmatter: `${bom}${source.slice(0, end)}`,
    body: source.slice(end),
  };
}

/**
 * Catalog pointer for markdown returned when an agent prefers `text/markdown`.
 * Inserted after YAML frontmatter so the opening `---` stays at the start of
 * the file and parsers still read title and description.
 */
export function prependAgentDocsIndex(content: string, llmsTxtUrl: string) {
  const notice = agentDocsIndexNotice(llmsTxtUrl);
  const split = splitLeadingFrontmatter(content);

  if (!split) {
    return `${notice}\n${content}`;
  }

  const spacer =
    split.body.startsWith("\n") || split.body.startsWith("\r") ? "" : "\n";

  return `${split.frontmatter}${notice}${spacer}${split.body}`;
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
