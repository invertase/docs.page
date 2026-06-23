import rehypeParse from "rehype-parse";
import rehypeSanitize, {
  defaultSchema,
  type Options as SanitizeSchema,
} from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import type { DocIrNode } from "./types";
import { mapIrChildren } from "./visit";

/** Tailwind / utility classes used in docs HTML (badges, layout). */
const classNamePattern = /^[\w\s#:./[\]()%&=-]+$/;

export const docsHtmlSchema: SanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames ?? []), "iframe"],
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ...(defaultSchema.attributes?.a ?? []),
      ["className", classNamePattern],
    ],
    div: [
      ...(defaultSchema.attributes?.div ?? []),
      ["className", classNamePattern],
    ],
    iframe: [
      "src",
      "width",
      "height",
      "title",
      "allow",
      "allowFullScreen",
      "sandbox",
      "loading",
      ["className", classNamePattern],
    ],
    img: [
      ...(defaultSchema.attributes?.img ?? []),
      ["className", classNamePattern],
    ],
    p: [["className", classNamePattern]],
    span: [["className", classNamePattern]],
  },
};

const sanitizeProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, docsHtmlSchema)
  .use(rehypeStringify);

/**
 * Converts markdown image links embedded in HTML (e.g. `[<img ...>](url)` inside
 * `<td>`) into plain HTML anchors. CommonMark does not parse markdown inside
 * block HTML, so this runs before sanitization.
 */
export function preprocessMarkdownInHtml(html: string): string {
  return html.replace(
    /\[(\s*<img\b[^>]*\/?>\s*)\]\(([^)]+)\)/gi,
    '<a href="$2">$1</a>',
  );
}

export async function sanitizeHtml(html: string): Promise<string> {
  const trimmed = preprocessMarkdownInHtml(html.trim());
  if (!trimmed) {
    return "";
  }

  const file = await sanitizeProcessor.process(trimmed);
  return String(file);
}

export async function sanitizeHtmlInIr(node: DocIrNode): Promise<DocIrNode> {
  switch (node.kind) {
    case "html":
      return { ...node, source: await sanitizeHtml(node.source) };
    case "root":
    case "component":
      return mapIrChildren(node, sanitizeHtmlInIr);
    default:
      return node;
  }
}
