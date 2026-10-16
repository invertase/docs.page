import NextLink from "next/link";
import type { ComponentProps } from "react";

import { useDocHref } from "@/hooks/use-doc-href";
import { isExternalLink } from "@/lib/docs-links";

export type LinkProps = Omit<ComponentProps<"a">, "href"> & {
  href: string;
  prefetch?: boolean;
};

export function Link({ href, prefetch = false, ...props }: LinkProps) {
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

  // Docs pages are GSSP and uncached at the edge. Viewport prefetch of a
  // sidebar (or any large link list) stampedes `/_next/data` + `/api/bundle`.
  return <NextLink {...props} href={resolvedHref} prefetch={prefetch} />;
}
