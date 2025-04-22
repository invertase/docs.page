import type { ComponentProps } from "react";
import { useHref } from "~/context";
import { cn, isExternalLink } from "~/utils";
import { Icon } from "../Icon";

type CardGroupProps = ComponentProps<"div"> & {
  cols?: number;
};

export function CardGroup({
  cols,
  className,
  style,
  ...props
}: CardGroupProps) {
  return (
    <div
      className={cn("md:grid gap-4", className)}
      {...props}
      style={{
        ...style,
        gridTemplateColumns: `repeat(${cols || 2}, minmax(0, 1fr))`,
      }}
    />
  );
}

type CardProps = ComponentProps<"div"> & {
  href?: string;
  icon?: string;
  title?: string;
};

export function Card({ href, icon, title, children, ...props }: CardProps) {
  const _href = useHref(href || "");

  const card = (
    <div
      className="h-full p-6 mb-4 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 rounded-lg border border-black/10 dark:border-white/10 group-hover:border-primary"
      {...props}
    >
      {(title || icon) && (
        <h3 className="flex items-center gap-3">
          {!!icon && <Icon name={icon} />}
          {!!title && <span>{title}</span>}
        </h3>
      )}
      {children}
    </div>
  );

  return href ? (
    <a
      className="group block no-underline"
      href={_href}
      rel="noopener noreferrer"
      target={isExternalLink(_href) ? "_blank" : ""}
    >
      {card}
    </a>
  ) : (
    card
  );
}
