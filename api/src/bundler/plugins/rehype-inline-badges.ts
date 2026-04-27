/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Content} Content
 */

import type { Node } from "hast-util-heading-rank/lib";
import { isBadge } from "is-badge";
import { visit } from "unist-util-visit";

/**
 * Provides a list of heading elements in the AST.
 * @param options
 * @returns
 */
export default function rehypeInlineBadges(): (ast: Node) => void {
  //@ts-expect-error
  function visitor(node: NodeWithChildren) {
    node.visited === "true";
    node.children[0].properties.style = "display: inline;";
  }
  return (ast: Node): void => {
    //@ts-expect-error
    visit(ast, containsBadge, visitor);
  };
}
//@ts-expect-error
const containsBadge = (node) =>
  node.tagName === "a" &&
  node.children[0].tagName === "img" &&
  isBadge(node?.children[0]?.properties.src) &&
  node.visited !== "true";
