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
        nodes.push({
          id : (node?.properties as Record<string, string>).id,
          title: toString(node),
          rank: headingRank(node),
        });
      }
    }
  }

  function newVisitor(node : any, index: number | null, parent: any) {

    const newChildren = partition(node.children,headingTest).map(part => {
      
      const id = part.filter(child => headingTest(child))[0]?.properties?.id || null
      return wrapSection(part,id); }
    ).filter(section => section.properties.id)

    node.children = newChildren;
  }

  return (ast: Node): void => {
    // console.log(ast)
    visit(ast, 'element', visitor);
    // console.log(ast)
    visit(ast,'root',newVisitor)
    options.callback(nodes);
  };
}

const wrapSection : (children: any[],id: string) => any = (children,id) => { 
  const wrap = parseSelector(`section${id ? `#${id}` : ''}`);
  wrap.children = children;
  return wrap;
}
const headingTest : (node: any) => boolean =  node => !!headingRank(node) && hasProperty(node,'id')

// partition an array based on a test function, e.g [a,b,b,b,a,b,b,a,b] should become [[a,b,b,b],[a,b,b],[a,b]]
function partition<T>(array : T[], test : (input : T) => boolean) : T[][] {
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