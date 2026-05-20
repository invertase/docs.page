import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { RiHashtag } from "@remixicon/react";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

export type HeadingTagProps = ComponentProps<HeadingTag> & {
  id?: string;
  type: HeadingTag;
  node?: unknown;
};

const styles = {
  h1: "text-3xl md:text-4xl",
  h2: "text-3xl pt-8",
  h3: "text-2xl pt-8",
  h4: "text-xl pt-3",
  h5: "text-lg pt-3",
  h6: "text-base pt-2",
} satisfies Record<HeadingTag, string>;

export function Heading(props: HeadingTagProps) {
  const { node, id, type, ...other } = props;
  const Tag = type;

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3 font-heading text-balance text-foreground",
        styles[type],
      )}
    >
      <span id={id} data-heading="true" className="absolute -mt-36 pt-36" />
      <Tag {...other} />
      {id ? (
        <Button variant="outline" size="icon" asChild>
          <a
            href={`#${id}`}
            className="opacity-0 group-hover:opacity-70 transition-opacity"
          >
            <RiHashtag />
          </a>
        </Button>
      ) : null}
    </div>
  );
}
