import { cn } from "@/lib/utils";
import type { ComponentProps, PropsWithChildren } from "react";
import { Icon } from "./icon";

type StepsProps = PropsWithChildren<ComponentProps<"ul">>;

export function Steps(props: StepsProps) {
  const { children, className } = props;

  return (
    <ul
      className={cn("pl-0", className)}
      style={{
        counterReset: "line-number",
      }}
    >
      {children}
    </ul>
  );
}

type StepProps = PropsWithChildren<ComponentProps<"li">> & {
  icon?: string;
  title?: string;
};

export function Step(props: StepProps) {
  return (
    <li
      className="relative flex gap-12"
      style={{
        counterIncrement: "line-number",
      }}
    >
      <div className="absolute w-px bg-sidebar-foreground/10 bottom-3 left-5 top-12" />
      <div className="shrink-0 size-10 rounded-full flex items-center justify-center bg-sidebar-accent">
        {props.icon ? (
          <Icon name={props.icon} size={15} />
        ) : (
          <span className="before:content-[counter(line-number)] text-lg font-medium" />
        )}
      </div>
      <div className="w-full min-w-0 pb-6 mt-1">
        {!!props.title && (
          <h3 className="m-0 text-xl font-medium">
            {props.title}
          </h3>
        )}
        <div>{props.children}</div>
      </div>
    </li>
  );
}