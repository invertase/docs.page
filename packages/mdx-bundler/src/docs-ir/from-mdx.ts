import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { sanitizeHtmlInIr } from "./sanitize-html";
import type { DocIrNode, DocIrPropValue } from "./types";

type MdastNode = {
  type?: string;
  value?: string;
  lang?: string | null;
  meta?: string | null;
  name?: string | null;
  attributes?: Array<{
    type?: string;
    name?: string;
    value?: unknown;
  }>;
  position?: {
    start?: { offset?: number };
    end?: { offset?: number };
  };
  children?: MdastNode[];
};

type EstreeProgram = {
  type?: string;
  body?: Array<{
    type?: string;
    expression?: EstreeExpression;
  }>;
};

type EstreeExpression = {
  type?: string;
  value?: unknown;
  elements?: EstreeExpression[];
  properties?: Array<{
    type?: string;
    computed?: boolean;
    key?: { type?: string; name?: string; value?: unknown };
    value?: EstreeExpression;
  }>;
};

type MdxExpressionValue = {
  type?: string;
  value?: string;
  data?: {
    estree?: EstreeProgram;
  };
};

const UNSUPPORTED_NODE_TYPES = new Set([
  "mdxjsEsm",
  "mdxFlowExpression",
  "mdxTextExpression",
]);

/**
 * Normalizes content that is valid GitHub-flavored markdown but invalid MDX so
 * remark-mdx can parse the document without failing the whole bundle.
 */
export function preprocessMdxSource(source: string): string {
  const withoutHtmlComments = source.replace(/<!--[\s\S]*?-->/g, "");
  return withoutHtmlComments.replace(/<(?![/A-Za-z{])/g, "&lt;");
}

export async function mdxToDocIr(source: string): Promise<DocIrNode> {
  const preprocessed = preprocessMdxSource(source);
  const tree = parseToMdast(preprocessed);

  const root: DocIrNode = {
    kind: "root",
    children: childrenToIr(
      (tree as Root as MdastNode).children ?? [],
      preprocessed,
    ),
  };

  return sanitizeHtmlInIr(root);
}

function parseToMdast(source: string): Root {
  const mdxProcessor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMdx);

  try {
    return mdxProcessor.parse(source) as Root;
  } catch {
    return unified().use(remarkParse).use(remarkGfm).parse(source) as Root;
  }
}

const PHRASING_NODE_TYPES = new Set([
  "text",
  "emphasis",
  "strong",
  "delete",
  "inlineCode",
  "link",
  "image",
  "break",
  "mdxJsxTextElement",
]);

function childrenToIr(children: MdastNode[], source: string): DocIrNode[] {
  const result: DocIrNode[] = [];
  let phrasingBatch: MdastNode[] = [];

  const flushPhrasingBatch = () => {
    if (phrasingBatch.length === 0) {
      return;
    }

    const markdown = markdownFromNodeRange(phrasingBatch, source);
    if (markdown.trim().length > 0) {
      result.push({
        kind: "markdown",
        source: normalizeMarkdownLeaf(markdown),
      });
    }

    phrasingBatch = [];
  };

  for (const child of children) {
    if (isPhrasingContent(child)) {
      phrasingBatch.push(child);
      continue;
    }

    flushPhrasingBatch();
    result.push(...safeNodeToIr(child, source));
  }

  flushPhrasingBatch();
  return result;
}

function isPhrasingContent(node: MdastNode): boolean {
  return node.type !== undefined && PHRASING_NODE_TYPES.has(node.type);
}

function listItemHasStructuredBlocks(node: MdastNode): boolean {
  return (node.children ?? []).some(
    (child) => child.type !== "paragraph" && child.type !== "list",
  );
}

function listHasStructuredItems(node: MdastNode): boolean {
  return (node.children ?? []).some(listItemHasStructuredBlocks);
}

function markdownFromNodeRange(nodes: MdastNode[], source: string): string {
  if (nodes.length === 0) {
    return "";
  }

  const start = nodes[0]?.position?.start?.offset;
  const end = nodes[nodes.length - 1]?.position?.end?.offset;

  if (
    typeof start === "number" &&
    typeof end === "number" &&
    start >= 0 &&
    end >= start
  ) {
    return source.slice(start, end);
  }

  return nodes.map((node) => sourceForNode(node, source)).join("");
}

function safeNodeToIr(node: MdastNode, source: string): DocIrNode[] {
  try {
    return nodeToIr(node, source);
  } catch {
    return markdownLeafFromNode(node, source);
  }
}

function nodeToIr(node: MdastNode, source: string): DocIrNode[] {
  if (node.type && UNSUPPORTED_NODE_TYPES.has(node.type)) {
    return markdownLeafFromNode(node, source);
  }

  switch (node.type) {
    case "mdxJsxFlowElement":
    case "mdxJsxTextElement":
      return jsxElementToIr(node, source);
    case "paragraph":
      if (
        node.children?.length === 1 &&
        node.children[0]?.type === "mdxJsxTextElement"
      ) {
        return jsxElementToIr(node.children[0], source);
      }

      // Inline JSX on one line (e.g. <TabItem>...</TabItem>) is wrapped in a paragraph
      // with mdxJsxTextElement siblings. Convert each element directly — childrenToIr
      // would batch mdxJsxTextElement as phrasing content into a single markdown leaf.
      if (node.children?.some((c) => c.type === "mdxJsxTextElement")) {
        const result: DocIrNode[] = [];

        for (const child of node.children ?? []) {
          if (child.type === "mdxJsxTextElement") {
            result.push(...jsxElementToIr(child, source));
            continue;
          }

          if (child.type === "text") {
            const text = child.value ?? "";
            if (text.trim().length === 0) {
              continue;
            }

            result.push(...markdownLeafFromNode(child, source));
            continue;
          }

          result.push(...safeNodeToIr(child, source));
        }

        return result;
      }

      return markdownLeafOrChildren(node, source);
    case "list":
      if (listHasStructuredItems(node)) {
        return childrenToIr(node.children ?? [], source);
      }
      return markdownLeafOrChildren(node, source);
    case "listItem":
      if (listItemHasStructuredBlocks(node)) {
        return childrenToIr(node.children ?? [], source);
      }
      return markdownLeafOrChildren(node, source);
    case "thematicBreak":
      return [{ kind: "thematicBreak" }];
    case "code":
      return [
        {
          kind: "code",
          lang: node.lang ?? undefined,
          meta: node.meta ?? undefined,
          value: node.value ?? "",
        },
      ];
    default:
      return markdownLeafOrChildren(node, source);
  }
}

function jsxElementToIr(node: MdastNode, source: string): DocIrNode[] {
  const name = node.name ?? "";

  if (isHtmlElementName(name)) {
    return htmlLeafFromNode(node, source);
  }

  if (isMdxComponentName(name)) {
    return [
      {
        kind: "component",
        name,
        props: mdxAttributesToProps(node.attributes ?? []),
        children: childrenToIr(node.children ?? [], source),
      },
    ];
  }

  return markdownLeafFromNode(node, source);
}

/** Lowercase tags are treated as HTML (e.g. p, img, a). */
function isHtmlElementName(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

/** PascalCase tags are docs.page MDX components; the renderer owns the component map. */
function isMdxComponentName(name: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(name);
}

function markdownLeafFromNode(node: MdastNode, source: string): DocIrNode[] {
  const markdown = sourceForNode(node, source);
  if (markdown.trim().length > 0) {
    return [{ kind: "markdown", source: normalizeMarkdownLeaf(markdown) }];
  }

  return [];
}

function htmlLeafFromNode(node: MdastNode, source: string): DocIrNode[] {
  const html = sourceForNode(node, source);
  if (html.trim().length > 0) {
    return [{ kind: "html", source: normalizeMarkdownLeaf(html) }];
  }

  return [];
}

function markdownLeafOrChildren(node: MdastNode, source: string): DocIrNode[] {
  const markdown = sourceForNode(node, source);
  if (markdown.trim().length > 0) {
    return [{ kind: "markdown", source: normalizeMarkdownLeaf(markdown) }];
  }

  if (node.children?.length) {
    return childrenToIr(node.children, source);
  }

  return [];
}

function mdxAttributesToProps(
  attributes: NonNullable<MdastNode["attributes"]>,
): Record<string, DocIrPropValue> {
  const props: Record<string, DocIrPropValue> = {};

  for (const attr of attributes) {
    try {
      if (attr.type !== "mdxJsxAttribute" || !attr.name) {
        continue;
      }

      if (attr.value === null || attr.value === undefined) {
        props[attr.name] = true;
        continue;
      }

      if (
        typeof attr.value === "string" ||
        typeof attr.value === "number" ||
        typeof attr.value === "boolean"
      ) {
        props[attr.name] = attr.value;
        continue;
      }

      props[attr.name] = expressionAttributeToProp(attr.name, attr.value);
    } catch {
      // Skip attributes that cannot be converted; keep the component renderable.
    }
  }

  return props;
}

function expressionAttributeToProp(
  name: string,
  value: unknown,
): DocIrPropValue {
  if (!isMdxExpressionValue(value)) {
    throw new Error(`Unsupported MDX JSX expression attribute: ${name}`);
  }

  const expression = value.data?.estree?.body?.[0]?.expression;
  if (!expression) {
    throw new Error(`Unsupported MDX JSX expression attribute: ${name}`);
  }

  return estreeExpressionToProp(name, expression);
}

function estreeExpressionToProp(
  attrName: string,
  expression: EstreeExpression,
): DocIrPropValue {
  switch (expression.type) {
    case "Literal":
      if (
        expression.value === null ||
        typeof expression.value === "string" ||
        typeof expression.value === "number" ||
        typeof expression.value === "boolean"
      ) {
        return expression.value;
      }
      break;
    case "ArrayExpression":
      return (expression.elements ?? []).map((element) =>
        estreeExpressionToProp(attrName, element),
      );
    case "ObjectExpression": {
      const out: Record<string, DocIrPropValue> = {};
      for (const property of expression.properties ?? []) {
        if (
          property.type !== "Property" ||
          property.computed ||
          !property.key ||
          !property.value
        ) {
          throw new Error(
            `Unsupported MDX JSX expression attribute: ${attrName}`,
          );
        }
        const key = estreePropertyKey(property.key);
        out[key] = estreeExpressionToProp(attrName, property.value);
      }
      return out;
    }
  }

  throw new Error(`Unsupported MDX JSX expression attribute: ${attrName}`);
}

function estreePropertyKey(
  key: NonNullable<EstreeExpression["properties"]>[number]["key"],
): string {
  if (key?.type === "Identifier" && typeof key.name === "string") {
    return key.name;
  }
  if (key?.type === "Literal" && typeof key.value === "string") {
    return key.value;
  }
  throw new Error("Unsupported MDX JSX object property key.");
}

function isMdxExpressionValue(value: unknown): value is MdxExpressionValue {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as MdxExpressionValue).type === "mdxJsxAttributeValueExpression"
  );
}

function sourceForNode(node: MdastNode, source: string): string {
  const start = node.position?.start?.offset;
  const end = node.position?.end?.offset;

  if (
    typeof start !== "number" ||
    typeof end !== "number" ||
    start < 0 ||
    end < start
  ) {
    return node.value ?? "";
  }

  return source.slice(start, end);
}

function normalizeMarkdownLeaf(markdown: string): string {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const firstContent = lines.findIndex((line) => line.trim().length > 0);

  if (firstContent === -1) {
    return "";
  }

  let lastContent = lines.length - 1;
  while (
    lastContent >= firstContent &&
    lines[lastContent]?.trim().length === 0
  ) {
    lastContent -= 1;
  }

  const contentLines = lines.slice(firstContent, lastContent + 1);
  if (contentLines.some((line) => /^\s*\|/.test(line))) {
    return normalizeTableMarkdown(contentLines);
  }

  const minimumIndent = Math.min(
    ...contentLines
      .filter((line) => line.trim().length > 0)
      .map((line) => line.match(/^[ \t]*/)![0].length),
  );

  if (!Number.isFinite(minimumIndent) || minimumIndent === 0) {
    return contentLines.join("\n");
  }

  return contentLines
    .map((line) => line.slice(Math.min(minimumIndent, line.length)))
    .join("\n");
}

function normalizeTableMarkdown(lines: string[]): string {
  return lines
    .map((line) =>
      line.trim().length === 0 ? line : line.replace(/^[ \t]+(?=\|)/, ""),
    )
    .join("\n");
}
