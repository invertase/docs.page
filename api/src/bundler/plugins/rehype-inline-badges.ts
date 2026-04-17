/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Content} Content
 */

import type { Element, Node as HastNode } from "hast";
import type { Node } from "hast-util-heading-rank/lib";
import { isBadge } from "is-badge";
import { visit } from "unist-util-visit";

type ElementWithVisited = Element & { visited?: string };

function isElementWithVisited(node: HastNode): node is ElementWithVisited {
  return node.type === "element";
}

/**
 * Provides a list of heading elements in the AST.
 * @param options
 * @returns
 */
export default function rehypeInlineBadges(): (ast: Node) => void {
  function visitor(node: HastNode) {
    if (!isElementWithVisited(node)) return;
    node.visited === "true";
    const child = node.children?.[0];
    if (child?.type === "element" && child.properties) {
      child.properties.style = "display: inline;";
    }
  }
  return (ast: Node): void => {
    visit(ast, containsBadge, visitor);
  };
}

const containsBadge = (node: HastNode): boolean => {
  if (!isElementWithVisited(node) || node.tagName !== "a") return false;
  const first = node.children?.[0];
  if (first?.type !== "element" || first.tagName !== "img") return false;
  const src = first.properties?.src;
  return (
    typeof src === "string" &&
    isBadge(src) &&
    node.visited !== "true"
  );
};
