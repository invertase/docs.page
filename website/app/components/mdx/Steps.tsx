import type { ComponentProps } from "react";
import { cn } from "~/utils";
import { Icon } from "../Icon";
import { Heading } from "./Heading";

type TableProps = ComponentProps<"ul"> & {
  children: JSX.Element[];
};

export function Steps(props: TableProps) {
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

type StepProps = ComponentProps<"li"> & {
  icon?: string;
  title?: string;
  children: JSX.Element[];
};

export function Step(props: StepProps) {
  return (
    <li
      className="relative flex gap-12"
      style={{
        counterIncrement: "line-number",
      }}
    >
      <div className="absolute w-px bg-black/10 dark:bg-white/10 bottom-0 left-6 ml-[2px] top-12" />
      <div className="shrink-0 size-10 bg-black/10 dark:bg-white/10 rounded-md flex items-center justify-center">
        {props.icon ? (
          <Icon name={props.icon} />
        ) : (
          <span className="before:content-[counter(line-number)] text-xl font-bold" />
        )}
      </div>
      <div className="grow pb-6">
        {!!props.title && (
          <Heading type="h3" className="m-0">
            {props.title}
          </Heading>
        )}
        <div>{props.children}</div>
      </div>
    </li>
  );
}
