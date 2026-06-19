import NextLink from "next/link";
import type { ComponentProps } from "react";

import { useDocHref } from "@/hooks/use-doc-href";
import { isExternalLink } from "@/lib/docs-links";

export type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
};

export function Link({ href, ...props }: LinkProps) {
  const resolvedHref = useDocHref(href);

  if (isExternalLink(href)) {
    return (
      <a
        rel="noopener noreferrer"
        target="_blank"
        {...props}
        href={resolvedHref}
      />
    );
  }

  return <NextLink {...props} href={resolvedHref} />;
}
