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
    // `target="_blank"`/`rel="noopener"` only make sense for http(s) navigation.
    // Other schemes (mailto:, tel:, sms:, etc.) render as a plain anchor.
    const isHttpLink =
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("//");

    if (isHttpLink) {
      return (
        <a
          rel="noopener noreferrer"
          target="_blank"
          {...props}
          href={resolvedHref}
        />
      );
    }

    return <a {...props} href={resolvedHref} />;
  }

  return <NextLink {...props} href={resolvedHref} />;
}
