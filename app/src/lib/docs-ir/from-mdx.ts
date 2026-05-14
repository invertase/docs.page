import type { Root } from "mdast";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
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

export async function mdxToDocIr(source: string): Promise<DocIrNode> {
  const processor = unified().use(remarkParse).use(remarkMdx);
  const tree = await processor.run(processor.parse(source));

  return {
    kind: "root",
    children: childrenToIr((tree as Root as MdastNode).children ?? [], source),
  };
}

function childrenToIr(children: MdastNode[], source: string): DocIrNode[] {
  return children.flatMap((child) => nodeToIr(child, source));
}

function nodeToIr(node: MdastNode, source: string): DocIrNode[] {
  if (node.type && UNSUPPORTED_NODE_TYPES.has(node.type)) {
    throw new Error(`Unsupported MDX syntax: ${node.type}`);
  }

  switch (node.type) {
    case "mdxJsxFlowElement":
    case "mdxJsxTextElement":
      return [
        {
          kind: "component",
          name: node.name ?? "Unknown",
          props: mdxAttributesToProps(node.attributes ?? []),
          children: childrenToIr(node.children ?? [], source),
        },
      ];
    case "paragraph":
      if (node.children?.length === 1 && node.children[0]?.type === "mdxJsxTextElement") {
        return nodeToIr(node.children[0], source);
      }

      assertNoInlineDocComponents(node);
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

function assertNoInlineDocComponents(node: MdastNode): void {
  for (const child of node.children ?? []) {
    if (child.type === "mdxJsxTextElement") {
      throw new Error(
        "MDX JSX elements must be authored as standalone block elements.",
      );
    }
  }
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
    if (attr.type !== "mdxJsxAttribute" || !attr.name) {
      throw new Error("Unsupported MDX JSX attribute syntax.");
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
        if (property.type !== "Property" || property.computed || !property.key || !property.value) {
          throw new Error(`Unsupported MDX JSX expression attribute: ${attrName}`);
        }
        const key = estreePropertyKey(property.key);
        out[key] = estreeExpressionToProp(attrName, property.value);
      }
      return out;
    }
  }

  throw new Error(`Unsupported MDX JSX expression attribute: ${attrName}`);
}

function estreePropertyKey(key: NonNullable<EstreeExpression["properties"]>[number]["key"]): string {
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
  while (lastContent >= firstContent && lines[lastContent]?.trim().length === 0) {
    lastContent -= 1;
  }

  const contentLines = lines.slice(firstContent, lastContent + 1);
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

