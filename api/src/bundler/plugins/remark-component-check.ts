import type { Data, Node } from "unist";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { visit } from "unist-util-visit";

const components = [
	"Accordion",
	"AccordionGroup",
	"CodeGroup",
	"Icon",
	"Info",
	"Warning",
	"Error",
	"Success",
	"Heading",
	"Tweet",
	"Tabs",
	"TabItem",
	"Image",
	"YouTube",
	"Vimeo",
	"Video",
	"Zapp",
];

/**
 * Converts undefined JSX components into plain text nodes
 * @returns
 */

interface DeclaredNode extends Node {
	value: string;
}
interface UnDeclaredNode extends Node {
	name: string;
	data?: Data;
	value?: string;
}

export default function remarkComponentCheck(): (ast: Node) => void {
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
		// HTML elements are not components (e.g. <div>)
		if (!isUppercase(node.name.charAt(0))) {
			return;
		}

		if (!declared.includes(node.name) && !components.includes(node.name)) {
			node.type = "text";
			node.data = undefined;
			node.value = `\<${node.name}\ />`;
		}
	}

	return async (ast: Node): Promise<void> => {
		visit(ast, "mdxjsEsm", visitorForDeclared);
		visit(ast, "mdxJsxFlowElement", visitorForUndeclared);
		visit(ast, "mdxJsxTextElement", visitorForUndeclared);
	};
}

function isUppercase(str: string) {
	return str === str.toUpperCase();
}
