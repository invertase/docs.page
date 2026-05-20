import type { Schema } from "hast-util-sanitize";
import rehypeParse from "rehype-parse";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";
import type { DocIrNode } from "./types";
import { mapIrChildren } from "./visit";

/** Tailwind / utility classes used in docs HTML (badges, layout). */
const classNamePattern = /^[\w\s#:./\[\]()%&=-]+$/;

const docsHtmlSchema: Schema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [...(defaultSchema.attributes?.a ?? []), ["className", classNamePattern]],
    div: [...(defaultSchema.attributes?.div ?? []), ["className", classNamePattern]],
    img: [...(defaultSchema.attributes?.img ?? []), ["className", classNamePattern]],
    p: [["className", classNamePattern]],
    span: [["className", classNamePattern]],
  },
};

const sanitizeProcessor = unified()
  .use(rehypeParse, { fragment: true })
  .use(rehypeSanitize, docsHtmlSchema)
  .use(rehypeStringify);

export async function sanitizeHtml(html: string): Promise<string> {
  const trimmed = html.trim();
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
