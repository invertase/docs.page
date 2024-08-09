import type { ComponentProps } from "react";
import { Error } from "./Callout";

type InvalidComponentProps = ComponentProps<"div"> & {
  // The name of the original component, provided by the bundler.
  name?: string;
};

export function InvalidComponent(props: InvalidComponentProps) {
  if (!props.name) {
    return null;
  }

  return (
    <div data-invalid-component={props.name} className="mb-3">
      <div className="rounded-xl px-5 py-4 bg-red-500 text-white font-bold ring ring-red-500/30 ring-offset-2 ring-offset-background">
        Markdown content contains an invalid component declaration called{" "}
        <code className="text-white">
          {"<"}
          {props.name}
          {" />"}
        </code>
        . To remove this error, either declare the component locally or remove
        the declaration.
      </div>
    </div>
  );
}
