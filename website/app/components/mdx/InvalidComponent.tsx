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
    <Error>
      Markdown content contains an invalid component declaration called{" "}
      <code>
        {"<"}
        {props.name}
        {" />"}
      </code>
      . To remove this error, either declare the component locally or remove the
      declaration.
    </Error>
  );
}
