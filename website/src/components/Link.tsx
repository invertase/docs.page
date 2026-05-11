import InternalLink from "next/link";
import type { ComponentProps } from "react";
import { useContext } from "react";

import { buttonVariants } from "~/components/ui/button";
import type { Context } from "~/context";
import { PageContext } from "~/context";
import { cn } from "~/lib/utils";
import { ensureLeadingSlash, getHref, isExternalLink } from "~/utils";

export type LinkProps = ComponentProps<"a"> & {
  variant?: "marketingNav";
};

function resolveHref(
  href: string | undefined,
  ctx: Context | undefined,
): string {
  const raw = String(href ?? "");
  if (ctx === undefined) {
    return isExternalLink(raw) ? raw : ensureLeadingSlash(raw);
  }
  return getHref(ctx, raw);
}

export function Link({ className, variant, ...props }: LinkProps) {
  const ctx = useContext(PageContext);
  const href = resolveHref(props.href, ctx);

  const mergedClassName =
    variant === "marketingNav"
      ? cn(
          buttonVariants({ variant: "ghost", size: "default" }),
          "font-mono",
          "text-marketing-link hover:text-marketing-nav-link-hover",
          "hover:bg-transparent aria-expanded:bg-transparent dark:hover:bg-transparent dark:aria-expanded:bg-transparent",
          className,
        )
      : className;

  if (isExternalLink(props.href ?? "")) {
    return (
      <a
        rel="noopener noreferrer"
        target="_blank"
        {...props}
        href={href}
        className={mergedClassName}
      />
    );
  }

  return <InternalLink {...props} href={href} className={mergedClassName} />;
}
