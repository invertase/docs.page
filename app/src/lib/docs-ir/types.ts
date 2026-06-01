export type DocIrNode =
  | { kind: "root"; children: DocIrNode[] }
  | {
      kind: "component";
      name: string;
      props: Record<string, DocIrPropValue>;
      children: DocIrNode[];
    }
  | { kind: "markdown"; source: string }
  | { kind: "html"; source: string }
  | {
      kind: "code";
      lang?: string;
      meta?: string;
      value: string;
      highlighted?: string;
      title?: string;
    }
  | { kind: "thematicBreak" };

export type DocIrPropValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: DocIrPropValue }
  | DocIrPropValue[];
