import visit from 'unist-util-visit';
import { Node, Parent } from 'hast-util-heading-rank';
import { toText } from 'hast-util-to-text';

/**
 * Matches any `pre code` elements and extracts the raw code and titles from the code block and assigns to the parent.
 * @returns
 */
export default function rehypeCodeBlocks(): (ast: Node) => void {
  function visitor(node: Node, _i: number, parent: Parent) {
    // Only modify `pre code` tags, ignoring inline styles
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    // Raw value of the `code` block - used for copy/paste
    parent.properties['data-raw'] = toText(node);

    const title = (node.properties as Record<string, string>)?.title;

    if (title) {
      parent.properties['data-title'] = title;
    }
  }

  return (ast: Node): void => {
    visit(ast, 'element', visitor);
  };
}
