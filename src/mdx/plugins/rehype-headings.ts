import visit from 'unist-util-visit';
import { hasProperty } from 'hast-util-has-property';
import { headingRank, Node } from 'hast-util-heading-rank';
import { toText } from 'hast-util-to-text';
import { HeadingNode } from '../../utils/content';

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

  function visitor(node: Node): void {
    if (headingRank(node) && hasProperty(node, 'id')) {
      if (options.headings.includes(node.tagName as string)) {
        nodes.push({
          id: (node.properties as Record<string, string>).id,
          title: toText(node),
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
