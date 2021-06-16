import { Plugin } from 'unified';
import { Node } from 'unist';
import visit from 'unist-util-visit';
import { hasProperty } from 'hast-util-has-property';
import { headingRank } from 'hast-util-heading-rank';
import { toText } from 'hast-util-to-text';

type RehypeHeadingsOptions = {
  headings: string[];
  callback: (nodes: any) => void;
};

const defaultOptions: RehypeHeadingsOptions = {
  headings: ['h2', 'h3', 'h4', 'h5', 'h6'],
  callback: () => {},
};

export default function rehypeHeadings(options: RehypeHeadingsOptions = defaultOptions) {
  const nodes = [];

  function visitor(node: any): void {
    if (headingRank(node) && hasProperty(node, 'id')) {
      if (options.headings.includes(node.tagName)) {
        nodes.push({
          id: node.properties.id,
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

// const allowedHeadings = options.headings || ['h2', 'h3', 'h4', 'h5', 'h6'];
// let nodes = [];

// return tree => {
//   visit(tree, 'element', visitor);

//   if (options.callback) {
//     options.callback(nodes);
//   }
// };

// function visitor(node) {
//   if (rank(node) && has(node, 'id')) {
//     if (allowedHeadings.includes(node.tagName)) {
//       nodes.push({
//         id: node.properties.id,
//         title: toString(node),
//         rank: rank(node),
//       });
//     }
//   }
// }
