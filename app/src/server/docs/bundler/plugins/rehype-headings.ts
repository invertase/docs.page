import type { Content as HastContent, Element as HastElement } from "hast";
import { hasProperty } from "hast-util-has-property";
import { headingRank } from "hast-util-heading-rank";
import { parseSelector } from "hast-util-parse-selector";
import { toString } from "mdast-util-to-string";
import type { Data as UnistData, Node as UnistNode } from "unist";
import { visit } from "unist-util-visit";

export type HeadingNode = {
  id: string;
  title: string;
  rank: number | null;
};

type RehypeHeadingsOptions = {
  headings: string[];
  callback: (nodes: HeadingNode[]) => void;
};

const defaultOptions: RehypeHeadingsOptions = {
  headings: ["h2", "h3", "h4", "h5", "h6"],
  callback: () => {},
};

interface MyData extends UnistData {
  children: UnistNode[];
  tagName: string;
  properties: {
    id: string | number | boolean | Array<string | number>;
  };
}

type RehypeNode = {
  children?: HastContent[];
  properties?: Record<string, unknown>;
  tagName?: string;
};

export default function rehypeHeadings(
  options: RehypeHeadingsOptions = defaultOptions,
): (ast: UnistNode) => void {
  const nodes: HeadingNode[] = [];

  function visitor(node: HastElement): void {
    if (headingRank(node) && hasProperty(node, "id")) {
      if (options.headings.includes(node.tagName as string)) {
        nodes.push({
          id: (node.properties as Record<string, string>).id,
          title: toString(node),
          rank: headingRank(node) ?? null,
        });
      }
    }
  }

  function rootVisitor(node: RehypeNode & { children: HastElement[] }) {
    const newChildren = partition<HastContent>(node.children, headingTest).map((part) => {
      const id =
        (part.filter((child) => headingTest(child))[0] as HastElement | undefined)?.properties?.id?.toString() ||
        "";

      return wrapSection(part as HastElement[], id);
    });

    node.children = newChildren;
  }

  return (ast: UnistNode): void => {
    visit(ast, "element", visitor);
    visit(ast, "root", rootVisitor);
    options.callback(nodes);
  };
}

const wrapSection = (children: HastElement[], id: string): HastElement => {
  const wrapped = parseSelector(`section${id ? `#${id}` : ""}`) as HastElement;
  wrapped.children = children;
  return wrapped;
};

const headingTest = (node: HastContent) =>
  !!headingRank(node as HastElement) && hasProperty(node as HastElement, "id");

function partition<T>(array: T[], test: (input: T) => boolean): T[][] {
  return array.reduce<T[][]>((previous, current) => {
    if (previous.length === 0) {
      return [[current]];
    }

    if (test(current)) {
      return [...previous, [current]];
    }

    return [...previous.slice(0, -1), [...previous[previous.length - 1], current]];
  }, []);
}
