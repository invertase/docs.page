import type { PropsWithChildren } from "react";
import { Badge } from "../ui/badge";

type PropertyProps = PropsWithChildren<{
  name?: string;
  type?: string;
  required?: boolean;
  optional?: boolean;
}>;

export function Property(props: PropertyProps) {
  if (!props.name) {
    return null;
  }
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-primary">{props.name}</span>
        {props.type !== undefined ? <Badge variant="outline">{props.type}</Badge> : null}
        {props.required !== undefined ? <Badge variant="destructive">required</Badge> : null}
        {props.optional !== undefined ? <Badge variant="secondary" className="bg-yellow-500/30">optional</Badge> : null}
      </div>
      <div className="text-sm mt-3 space-y-4">{props.children}</div>
    </div>
  )
}