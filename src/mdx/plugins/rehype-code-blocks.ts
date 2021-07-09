/* eslint-disable @typescript-eslint/no-explicit-any */
import visit from 'unist-util-visit';
import { Node } from 'hast-util-heading-rank';
import { toText } from 'hast-util-to-text';

/**
 * Matches any `pre code` elements and extracts the raw code and titles from the code block and assigns to the parent.
 * @returns
 */
export default function rehypeCodeBlocks(): (ast: Node) => void {
  function visitor(node: any, _i: number, parent: any) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    // Raw value of the `code` block - used for copy/paste
    parent.properties['raw'] = toText(node);

    // Get any metadata from the code block
    const meta = (node.data?.meta as string) ?? '';

    const title = extractTitle(meta);
    if (title) parent.properties['title'] = title;
  }

  return (ast: Node): void => {
    visit(ast, 'element', visitor);
  };
}

function extractTitle(meta: string): string | null {
  // https://regex101.com/r/4JngU0/1
  const match =
    /(?:title="(?<title1>.*)"|title='(?<title2>.*)'|title=(?<title3>.*?)\s|title=(?<title4>.*?)$)/gm.exec(
      meta,
    );

  if (!match) {
    return null;
  }

  const title = Object.values(match.groups).find(value => value !== undefined);
  return title || null;
}
