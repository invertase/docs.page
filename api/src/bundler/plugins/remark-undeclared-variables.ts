import type { Data, Node } from "unist";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";

/**
 * Converts undeclared variables into plain text nodes
 * @returns
 */

interface DeclaredNode extends Node {
	value: string;
}
interface UnDeclaredNode extends Node {
	value: string;
	data?: Data;
}

export default function remarkUndeclaredVariables(): (ast: Node) => void {
	const keywords = ["var", "let", "const", "function"];
	const withExport = keywords.map((k) => new RegExp(`(export)[ \t]+${k}[ \t]`));

	const declared: string[] = [];

	function visitorForDeclared(node: DeclaredNode) {
		// Get the kind of export. This is actually stored in the Node, but the following was quicker for typescript:
		const exportKeyword = withExport.filter((re) => re.test(node.value))[0];

		if (exportKeyword) {
			declared.push(
				node.value
					.replace(exportKeyword, "")
					.replace(/^[a-z0-9-_A-Z]*[ \t][a-z0-9-_A-Z]*[ \t]/, "")
					.split(" ")[0],
			);
		}
	}

	function visitorForUndeclared(node: UnDeclaredNode) {
		if (node.value && !declared.includes(node.value)) {
			node.type = "text";
			node.data = undefined;
			node.value = `\{${node.value}\}`;
		}
	}

	return async (ast: Node): Promise<void> => {
		visit(ast, "mdxjsEsm", visitorForDeclared);
		visit(ast, "mdxFlowExpression", visitorForUndeclared);
		visit(ast, "mdxJsxTextElement", visitorForUndeclared);
	};
}
