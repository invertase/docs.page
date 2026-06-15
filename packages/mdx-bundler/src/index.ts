import frontmatter from "gray-matter";
import { mdxToDocIr } from "./docs-ir/from-mdx";
import { highlightCodeBlocksInIr } from "./docs-ir/highlight-code-blocks";
import type { DocIrNode } from "./docs-ir/types";
import { extractHeadingNodes, type HeadingNode } from "./markdown/headings";
import { replaceMoustacheVariables } from "./variables";

export { mdxToDocIr, preprocessMdxSource } from "./docs-ir/from-mdx";
export { highlightCodeBlocksInIr } from "./docs-ir/highlight-code-blocks";
export { sanitizeHtml, sanitizeHtmlInIr } from "./docs-ir/sanitize-html";
export type { DocIrNode, DocIrPropValue } from "./docs-ir/types";
export type { HeadingNode } from "./markdown/headings";
export { extractHeadingNodes } from "./markdown/headings";
export { replaceMoustacheVariables } from "./variables";

const DEFAULT_HEADER_DEPTH = 3;
const TOC_MIN_DEPTH = 2;

export type RenderDocOptions = {
  /** Mustache variables resolved from the docs config (`config.variables`). */
  variables?: Record<string, unknown>;
  /** Maximum heading depth included in the table of contents. */
  headerDepth?: number;
};

export type RenderDocResult = {
  /** Variable-substituted markdown with the frontmatter block stripped. */
  markdown: string;
  /** Parsed and syntax-highlighted document IR ready for the renderer. */
  docIr: DocIrNode;
  headings: HeadingNode[];
  frontmatter: Record<string, unknown>;
};

/**
 * Pure markdown → docIr transform shared by the hosted app bundler and the local
 * CLI preview server. Given raw MDX (with frontmatter) and the relevant config
 * options, it produces the exact `docIr`/`headings`/`frontmatter` payload the
 * renderer consumes. It performs no IO and is safe to run under Node and Bun.
 */
export async function renderDoc(
  rawMarkdown: string,
  options: RenderDocOptions = {},
): Promise<RenderDocResult> {
  const { content, data } = frontmatter(rawMarkdown);

  const markdown = replaceMoustacheVariables(options.variables ?? {}, content);

  const headings = extractHeadingNodes(markdown, {
    tocMinDepth: TOC_MIN_DEPTH,
    tocMaxDepth: options.headerDepth ?? DEFAULT_HEADER_DEPTH,
  });

  const docIr = await highlightCodeBlocksInIr(await mdxToDocIr(markdown));

  return {
    markdown,
    docIr,
    headings,
    frontmatter: data,
  };
}
