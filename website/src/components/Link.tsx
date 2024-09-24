import InternalLink from "next/link";
import type { ComponentProps } from "react";
import { useHref } from "~/context";
import { isExternalLink } from "~/utils";

type LinkProps = ComponentProps<"a">;

export function Link(props: LinkProps) {
  const href = useHref(props.href ?? "");

  if (isExternalLink(props.href ?? "")) {
    return (
      <a rel="noopener noreferrer" target="_blank" {...props} href={href} />
    );
  }

  return <InternalLink {...props} href={href} />;
}
