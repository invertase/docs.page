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
export default function rehypePluginMy(): (ast: Node) => void {
  //@ts-ignore
  function visitor(node: any, index) {
    node.visited === 'true';
    node.children[0].properties.style = 'display: inline;';
  }
  return (ast: Node): void => {
    //@ts-ignore
    console.log(ast);
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
