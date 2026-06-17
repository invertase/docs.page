import { RiExternalLinkLine } from "@remixicon/react";
import type { PropsWithChildren } from "react";
import {
  CardAction,
  CardContent,
  CardHeader,
  Card as CardPrimitive,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "../doc-link";
import { Button } from "../ui/button";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

type CardProps = PropsWithChildren<{
  title?: string;
  icon?: string;
  href?: string;
}>;

export function Card({ title, icon, href, children }: CardProps) {
  const container = (children: React.ReactNode) => {
    if (href) {
      return (
        <Link href={href} className="block">
          {children}
        </Link>
      )
    }

    return children;
  }

  return container(
    <CardPrimitive
      className={cn("group", href && "border hover:border-primary")}
    >
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
          href && "group-hover:text-primary",
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

export function CardGroup({ cols = 2, children }: CardGroupProps) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {children}
    </div>
  );
}
