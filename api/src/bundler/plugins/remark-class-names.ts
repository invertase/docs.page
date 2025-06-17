import type { Node } from "unist";
import { visit } from "unist-util-visit";

interface MdxJsxAttribute {
  type: "mdxJsxAttribute";
  name: string;
  value: string;
}

interface MdxJsxElement extends Node {
  type: "mdxJsxFlowElement" | "mdxJsxTextElement";
  name: string;
  attributes: MdxJsxAttribute[];
}

export default function remarkFixClassname(): (tree: Node) => void {
  return (tree: Node) => {
    visit(tree, "mdxJsxFlowElement", (node: MdxJsxElement) => {
      if (!node.attributes) {
        node.attributes = [];
      }

      // Find class attribute
      const classAttr = node.attributes.find((attr) => attr.name === "class");
      if (classAttr) {
        // Add className attribute
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: "className",
          value: classAttr.value
        });
        // Remove class attribute
        node.attributes = node.attributes.filter((attr) => attr.name !== "class");
      }
    });

    // Also handle text elements (inline JSX)
    visit(tree, "mdxJsxTextElement", (node: MdxJsxElement) => {
      if (!node.attributes) {
        node.attributes = [];
      }

      // Find class attribute
      const classAttr = node.attributes.find((attr) => attr.name === "class");
      if (classAttr) {
        // Add className attribute
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: "className",
          value: classAttr.value
        });
        // Remove class attribute
        node.attributes = node.attributes.filter((attr) => attr.name !== "class");
      }
    });
  };
}