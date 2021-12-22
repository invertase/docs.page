/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import { visit } from 'unist-util-visit';
import { hasProperty } from 'hast-util-has-property';
import { headingRank, Node } from 'hast-util-heading-rank';
import { toString } from 'mdast-util-to-string';
import { parseSelector } from 'hast-util-parse-selector';

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
  headings: ['h2', 'h3', 'h4', 'h5', 'h6'],
  callback: () => {
    return;
  },
};

/**
 * Provides a list of heading elements in the AST.
 * @param options
 * @returns
 */
export default function rehypeHeadings(
  options: RehypeHeadingsOptions = defaultOptions,
): (ast: Node) => void {
  const nodes: HeadingNode[] = [];

  function visitor(node: any, index: number | null, parent: any): void {
    if (headingRank(node) && hasProperty(node, 'id')) {
      if (options.headings.includes(node.tagName as string)) {
        const id = (node.properties as Record<string, string>).id
        const wrap = parseSelector(`section#${id}`)
        wrap.children = [node];
        //@ts-ignore
        parent.children[index] = wrap;
        nodes.push({
          id,
          title: toString(node),
          rank: headingRank(node),
        });
      }
    }
  }

  return (ast: Node): void => {
    visit(ast, 'element', visitor);

    options.callback(nodes);
  };
}
