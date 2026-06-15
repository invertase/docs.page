import type { DocIrNode } from "./types";

type DocIrParentNode = Extract<
  DocIrNode,
  { kind: "root" } | { kind: "component" }
>;

export async function mapIrChildren(
  node: DocIrParentNode,
  fn: (child: DocIrNode) => Promise<DocIrNode>,
): Promise<DocIrParentNode> {
  return {
    ...node,
    children: await Promise.all(node.children.map(fn)),
  };
}
