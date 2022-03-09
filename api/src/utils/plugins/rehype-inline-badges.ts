/**
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Content} Content
 */

import { isBadge } from 'is-badge';

import { visit } from 'unist-util-visit';
import { Node } from 'hast-util-heading-rank';

/**
 * Provides a list of heading elements in the AST.
 * @param options
 * @returns
 */
export default function rehypeInlineBadges(): (ast: Node) => void {
  //@ts-ignore
  function visitor(node: NodeWithChildren) {
    node.visited === 'true';
    node.children[0].properties.style = 'display: inline;';
  }
  return (ast: Node): void => {
    //@ts-ignore
    visit(ast, containsBadge, visitor);
  };
}
//@ts-ignore
const containsBadge = node =>
  node.tagName === 'a' &&
  node.children[0].tagName === 'img' &&
  isBadge(node?.children[0]?.properties.src) &&
  node.visited !== 'true';
