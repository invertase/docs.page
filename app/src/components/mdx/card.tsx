import type { PropsWithChildren } from "react";
import {
  Card as CardPrimitive,
  CardHeader,
  CardTitle,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { RiExternalLinkLine } from "@remixicon/react";
import { Button } from "../ui/button";
import { Link } from "../doc-link";
import { Icon } from "./icon";

type CardProps = PropsWithChildren<{
  title?: string;
  icon?: string;
  href?: string;
}>;

export function Card({ title, icon, href, children }: CardProps) {
  return (
    <CardPrimitive>
      {title || icon || href ? (
        <CardHeader>
          {href ? (
            <CardAction>
              <Button size="icon-sm" variant="outline" asChild>
                <Link href={href}>
                  <RiExternalLinkLine />
                </Link>
              </Button>
            </CardAction>
          ) : null}
          <CardTitle className="text-lg flex items-center gap-2">
            {icon ? <Icon name={icon} size={16} className="opacity-80" /> : null}
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
      ) : null}
      <CardContent className="space-y-4 text-foreground/90">{children}</CardContent>
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
