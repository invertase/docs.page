import { visit } from 'unist-util-visit';
import { hasProperty } from 'hast-util-has-property';
import { headingRank, Node as HastNode, Parent as HastParent } from 'hast-util-heading-rank';
import { toString } from 'mdast-util-to-string';
import { parseSelector } from 'hast-util-parse-selector';
import { Data as UnistData, Node as UnistNode } from 'unist';
import { Element as HastElement, Content as HastContent } from 'hast';

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

interface MyData extends UnistData {
  children: UnistNode[];
  tagName: string;
  properties: {
    id: string | number | boolean | (string | number)[];
  };
}

/**
 * Provides a list of heading elements in the AST.
 * @param options
 * @returns
 */
export default function rehypeHeadings(
  options: RehypeHeadingsOptions = defaultOptions,
): (ast: UnistNode<MyData>) => void {
  const nodes: HeadingNode[] = [];

  function visitor(node: HastElement): void {
    if (headingRank(node) && hasProperty(node, 'id')) {
      if (options.headings.includes(node.tagName as string)) {
        nodes.push({
          id: (node.properties as Record<string, string>).id,
          title: toString(node),
          rank: headingRank(node),
        });
      }
    }
  }

  function newVisitor(node: HastParent) {
    const newChildren = partition<HastContent>(node.children, headingTest).map(part => {
      const id =
        (
          part.filter((child: HastNode) => headingTest(child))[0] as HastElement
        )?.properties?.id?.toString() || '';

      return wrapSection(part as HastElement[], id);
    });

    node.children = newChildren;
  }

  return (ast: UnistNode<MyData>): void => {
    visit(ast, 'element', visitor);
    visit(ast, 'root', newVisitor);
    options.callback(nodes);
  };
}

const wrapSection: (children: HastElement[], id: string) => HastElement = (children, id) => {
  const wrap = parseSelector(`section${id ? `#${id}` : ''}`);
  wrap.children = children;
  return wrap;
};

const headingTest: (node: HastNode) => boolean = node =>
  !!headingRank(node) && hasProperty(node, 'id');

// partition an array based on a test function, e.g [a,b,b,b,a,b,b,a,b] should become [[a,b,b,b],[a,b,b],[a,b]]
function partition<T>(array: T[], test: (input: T) => boolean): T[][] {
  return array.reduce<T[][]>((prev, current) => {
    if (prev.length === 0) {
      return [[current]];
    }
    if (test(current)) {
      return [...prev, [current]];
    }

    return [...prev.slice(0, -1), [...prev[prev.length - 1], current]];
  }, []);
}
