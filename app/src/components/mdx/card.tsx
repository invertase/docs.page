import { RiExternalLinkLine } from "@remixicon/react";
import type { PropsWithChildren } from "react";
import {
  CardAction,
  CardContent,
  CardHeader,
  Card as CardPrimitive,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "../doc-link";
import { Icon } from "./icon";

type CardProps = PropsWithChildren<{
  title?: string;
  icon?: string;
  href?: string;
}>;

export function Card({ title, icon, href, children }: CardProps) {
  return (
    <CardPrimitive
      className={cn("group relative", href && "border hover:border-primary")}
    >
      {href ? (
        <Link
          href={href}
          aria-label={title ?? href}
          className="absolute inset-0 z-10 rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="sr-only">{title ?? href}</span>
        </Link>
      ) : null}
      {title || icon || href ? (
        <CardHeader>
          {href ? (
            <CardAction>
              <RiExternalLinkLine className="size-4 opacity-80 group-hover:opacity-100 transition-opacity" />
            </CardAction>
          ) : null}
          <CardTitle>
            {icon && (
              <div className="mb-3">
                <Icon name={icon} size={20} className="text-primary" />
              </div>
            )}
            <span className="text-lg">{title}</span>
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent
        className={cn(
          "space-y-4 text-foreground/90",
          href &&
            "group-hover:text-primary [&_a]:relative [&_a]:z-20 [&_button]:relative [&_button]:z-20",
        )}
      >
        {children}
      </CardContent>
    </CardPrimitive>
  );
}

type CardGroupProps = PropsWithChildren<{
  cols?: number;
}>;

const smGridCols: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export function CardGroup({ cols = 2, children }: CardGroupProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        smGridCols[cols] ?? "sm:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}
