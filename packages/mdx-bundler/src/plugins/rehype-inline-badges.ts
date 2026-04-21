import { isBadge } from "is-badge";
import type { Node } from "unist";
import { visit } from "unist-util-visit";

type NodeWithChildren = Node & {
  visited?: string;
  children: Array<{
    tagName?: string;
    properties: Record<string, unknown>;
  }>;
  tagName?: string;
};

export default function rehypeInlineBadges(): (ast: NodeWithChildren) => void {
  function visitor(node: NodeWithChildren) {
    node.visited = "true";

    if (node.children[0]) {
      node.children[0].properties.style = "display: inline;";
    }
  }

  return (ast: NodeWithChildren): void => {
    visit(ast as Node, containsBadge as never, visitor as never);
  };
}

const containsBadge = (node: NodeWithChildren) =>
  node.tagName === "a" &&
  node.children[0]?.tagName === "img" &&
  isBadge(String(node.children[0]?.properties?.src ?? "")) &&
  node.visited !== "true";
