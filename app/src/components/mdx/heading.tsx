import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { ExtraProps } from "streamdown";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingTagProps = ComponentProps<HeadingTag> & {
  id?: string;
  type: HeadingTag;
  node?: ExtraProps;
};

const styles = {
  h1: 'text-4xl font-semibold',
  h2: 'text-3xl font-medium pt-10',
  h3: 'text-2xl font-medium pt-8',
  h4: 'text-xl font-medium pt-3',
  h5: 'text-lg pt-3',
  h6: 'text-base pt-2',
} satisfies Record<HeadingTag, string>;

export function Heading(props: HeadingTagProps) {
  const { node, type, ...other} = props;
  const Tag = type;

  return <Tag {...other} className={cn('font-heading text-balance', styles[type])} data-heading="true" />;
}