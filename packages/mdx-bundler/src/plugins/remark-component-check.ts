import type { Data, Node } from "unist";
import { visit } from "unist-util-visit";

interface DeclaredNode extends Node {
  value: string;
}

interface UndeclaredNode extends Node {
  name: string;
  data?: Data;
  value?: string;
  attributes?: Array<{
    type: string;
    name: string;
    value: string;
  }>;
}

export default function remarkComponentCheck(
  components: string[],
): () => (ast: Node) => Promise<void> {
  return () => {
    const keywords = ["var", "let", "const", "function"];
    const withExport = keywords.map((keyword) => new RegExp(`(export)[ \t]+${keyword}[ \t]`));
    const declared: string[] = [];

    function visitorForDeclared(node: DeclaredNode) {
      const exportKeyword = withExport.filter((expression) => expression.test(node.value))[0];

      if (exportKeyword) {
        const declaredName = node.value
          .replace(exportKeyword, "")
          .replace(/^[a-z0-9-_A-Z]*[ \t][a-z0-9-_A-Z]*[ \t]/, "")
          .split(" ")[0];

        if (declaredName) {
          declared.push(declaredName);
        }
      }
    }

    function visitorForUndeclared(node: UndeclaredNode) {
      if (!isUppercase(node.name.charAt(0))) {
        return;
      }

      if (!declared.includes(node.name) && !components.includes(node.name)) {
        node.attributes = [
          {
            type: "mdxJsxAttribute",
            name: "name",
            value: node.name,
          },
        ];

        node.name = "__InvalidComponent__";
      }
    }

    return async (ast: Node): Promise<void> => {
      visit(ast, "mdxjsEsm", visitorForDeclared);
      visit(ast, "mdxJsxFlowElement", visitorForUndeclared);
      visit(ast, "mdxJsxTextElement", visitorForUndeclared);
    };
  };
}

function isUppercase(value: string) {
  return value === value.toUpperCase();
}
