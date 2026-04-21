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

function rewriteClassAttribute(node: MdxJsxElement) {
  if (!node.attributes) {
    node.attributes = [];
  }

  const classAttr = node.attributes.find((attribute) => attribute.name === "class");

  if (!classAttr) {
    return;
  }

  node.attributes.push({
    type: "mdxJsxAttribute",
    name: "className",
    value: classAttr.value,
  });

  node.attributes = node.attributes.filter((attribute) => attribute.name !== "class");
}

export default function remarkFixClassname(): (tree: Node) => void {
  return (tree: Node) => {
    visit(tree, "mdxJsxFlowElement", (node: MdxJsxElement) => {
      rewriteClassAttribute(node);
    });

    visit(tree, "mdxJsxTextElement", (node: MdxJsxElement) => {
      rewriteClassAttribute(node);
    });
  };
}
