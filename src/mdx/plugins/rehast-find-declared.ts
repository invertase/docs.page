/* eslint-disable @typescript-eslint/no-explicit-any */
import visit from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
/**
 * Matches any `pre code` elements and extracts the raw code and titles from the code block and assigns to the parent.
 * @returns
 */

 const defaultOptions = {
  callback: (names: string[]) => {
    return;
  },
};

/**
 * Provides a list of declared variables
 * @returns
 */

export function rehastFindDeclared(options = defaultOptions): (ast: Node) => void {

  const keywords = ['var','let','const','function']
  const withExport = keywords.map(k => new RegExp(`(export)[ \t]+${k}[ \t]`));

  const names = []

  function visitor(node: Node, _i: number) {

    const exportKeyword = withExport.filter(re => re.test(node.value))

    if (!!exportKeyword) {
      names.push(node.value.replace(exportKeyword,'').replace( /^[a-z0-9-_A-Z]*[ \t][a-z0-9-_A-Z]*[ \t]/,'').split(' ')[0])
    }
  }

  return async (ast: Node): Promise<void> => {
    visit(ast, 'mdxjsEsm', visitor);
    options.callback(names)
  };
}

export function rehastFindUndeclared(options = defaultOptions): (ast: Node) => void {

  const names = []

  function visitor(node: Node, _i: number) {
      names.push(node.value)
  }

  return async (ast: Node): Promise<void> => {
    visit(ast, 'mdxFlowExpression', visitor);
    options.callback(names)
  };
}

export function rehastDeclareUndeclared(options): (ast: Node) => void {

  const names = []

  function visitor(node: Node, _i: number) {
      names.push(node.value)
  }

  return async (ast: Node): Promise<void> => {
    console.log(ast)
  };
}