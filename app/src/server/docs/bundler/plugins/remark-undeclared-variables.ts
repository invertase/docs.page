import type { Data, Node } from "unist";
import { visit } from "unist-util-visit";

interface DeclaredNode extends Node {
  value: string;
}

interface UndeclaredNode extends Node {
  value: string;
  data?: Data;
  type: string;
}

export default function remarkUndeclaredVariables(): (ast: Node) => Promise<void> {
  const keywords = ["var", "let", "const", "function"];
  const withExport = keywords.map((keyword) => new RegExp(`(export)[ \t]+${keyword}[ \t]`));
  const declared: string[] = [];

  function visitorForDeclared(node: DeclaredNode) {
    const exportKeyword = withExport.filter((expression) => expression.test(node.value))[0];

    if (exportKeyword) {
      declared.push(
        node.value
          .replace(exportKeyword, "")
          .replace(/^[a-z0-9-_A-Z]*[ \t][a-z0-9-_A-Z]*[ \t]/, "")
          .split(" ")[0],
      );
    }
  }

  function visitorForUndeclared(node: UndeclaredNode) {
    if (node.value && !declared.includes(node.value)) {
      node.type = "text";
      node.data = undefined;
      node.value = `\\{${node.value}\\}`;
    }
  }

  return async (ast: Node): Promise<void> => {
    visit(ast, "mdxjsEsm", visitorForDeclared);
    visit(ast, "mdxFlowExpression", visitorForUndeclared);
    visit(ast, "mdxJsxTextElement", visitorForUndeclared);
  };
}
