import type { ComponentProps } from "react";
import { Link as InternalLink } from "~/components/Link";
import { cn } from "~/utils";

type LinkProps = ComponentProps<"a">;

// A styled link proxy component.
export function Link(props: LinkProps) {
  const className = cn(
    "font-bold no-underline border-b border-primary hover:border-b-2",
    props.className,
  );

  return <InternalLink {...props} className={className} />;
}
