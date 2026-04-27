import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import type { ExtraProps } from "streamdown";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingTagProps = ComponentProps<HeadingTag> & {
  id?: string;
  type: HeadingTag;
  node?: ExtraProps;
};

const styles = {
  h1: "text-4xl font-normal",
  h2: "text-3xl font-normal pt-6",
  h3: "text-2xl font-normal pt-5",
  h4: "text-xl font-normal pt-3",
  h5: "text-lg font-normal pt-3",
  h6: "text-base font-normal pt-2",
} satisfies Record<HeadingTag, string>;

export function Heading(props: HeadingTagProps) {
  const { node, type, id, ...other } = props;
  const Tag = type;

  return (
    <Tag
      {...other}
      id={id}
      className={cn(
        "font-heading text-balance",
        styles[type],
        id != null && id !== "" && "scroll-mt-[var(--docs-header-h,6rem)]",
      )}
      data-heading="true"
    />
  );
}
