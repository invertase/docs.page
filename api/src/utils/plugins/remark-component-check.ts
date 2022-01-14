/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-ignore
import { visit } from 'unist-util-visit';
import { Node } from 'unist';

const components = ['Heading', 'YouTube', 'Tabs', 'TabItem', 'Image', 'Img'];

/**
 * Converts undefined react components into plain text nodes
 * @returns
 */

interface DeclaredNode extends Node {
  value: string;
}
interface UnDeclaredNode extends Node {
  name: string;
  data: any;
  value: any;
}

export default function remarkComponentCheck({
  callback,
}: {
  callback: (warning: any) => void;
}): (ast: Node) => void {
  const keywords = ['var', 'let', 'const', 'function'];
  const withExport = keywords.map(k => new RegExp(`(export)[ \t]+${k}[ \t]`));

  const declared: string[] = [];

  function visitorForDeclared(node: DeclaredNode) {
    // Get the kind of export. This is actually stored in the Node, but the following was quicker for typescript:
    const exportKeyword = withExport.filter(re => re.test(node.value))[0];

    if (exportKeyword) {
      declared.push(
        node.value
          .replace(exportKeyword, '')
          .replace(/^[a-z0-9-_A-Z]*[ \t][a-z0-9-_A-Z]*[ \t]/, '')
          .split(' ')[0],
      );
    }
  }

  const undeclared: string[] = [];

  function visitorForUndeclared(node: UnDeclaredNode) {
    if (!declared.includes(node.name) && !components.includes(node.name)) {
      undeclared.push(node.name);
      node.type = 'text';
      node.data = undefined;
      node.value = `\{${node.name}\}`;

      callback({
        warningType: 'undefined component',
        line: node.position?.start?.line,
        column: node.position?.start?.column,
        detail: node.name,
      });
    }
  }

  return async (ast: Node): Promise<void> => {
    visit(ast, 'mdxjsEsm', visitorForDeclared);

    visit(ast, 'mdxJsxFlowElement', visitorForUndeclared);
  };
}
