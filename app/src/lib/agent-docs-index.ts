import grayMatter from "gray-matter";
import yaml from "js-yaml";
import { getLlmsFullTxtPathname, getLlmsTxtPathname } from "@/lib/docs-paths";
import type { DocsRequestMode } from "@/lib/docs-routing";

const matter =
  typeof grayMatter === "function"
    ? grayMatter
    : (grayMatter as unknown as { default: typeof grayMatter }).default;

const yamlEngine = {
  parse(input: string) {
    const data = yaml.load(input);
    return data && typeof data === "object" ? data : {};
  },
  stringify(data: object) {
    return yaml.dump(data).trim();
  },
};

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
    const parsed = matter(content, { engines: { yaml: yamlEngine } });
    const rawMatter = typeof parsed.matter === "string" ? parsed.matter : "";
    const hasFrontmatter =
      rawMatter.trim() !== "" || parsed.content !== content;

    if (!hasFrontmatter) {
      return `${notice}\n${content}`;
    }

    const body = parsed.content.replace(/^\r?\n/, "");
    return matter.stringify(`${notice}\n${body}`, parsed.data, {
      engines: { yaml: yamlEngine },
    });
  } catch {
    // Never put the index above YAML. If the file cannot be split, leave it.
    return content;
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
