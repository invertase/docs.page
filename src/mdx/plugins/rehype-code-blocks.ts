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
    parent.properties['raw'] = toText(node);

    // Get any metadata from the code block
    const meta = (node.data?.meta as string) ?? '';

    const title = /title="(.*?)"/g.exec(meta)?.[1];

    if (title) parent.properties['title'] = title;
  }

  return (ast: Node): void => {
    visit(ast, 'element', visitor);
  };
}
