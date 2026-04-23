import {
  Children,
  isValidElement,
  type ReactNode,
} from "react";
import { getCustomComponentProps } from "@/lib/docs-markdown";
import type { ExtraProps } from "streamdown";

type ChildWithNodeProps = {
  children?: ReactNode;
  node?: ExtraProps["node"];
};

export type CustomComponentChild = {
  children?: ReactNode;
  props: Record<string, string | boolean>;
};

export function getChildrenComponents(
  children: ReactNode,
  componentName: string,
): CustomComponentChild[] {
  return Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) {
      return [];
    }

    const childProps = child.props as ChildWithNodeProps;
    const componentProps = getCustomComponentProps(childProps.node, componentName);
    if (componentProps) {
      return [{ props: componentProps, children: childProps.children }];
    }

    const nestedChildren = childProps.children;
    return nestedChildren
      ? getChildrenComponents(nestedChildren, componentName)
      : [];
  });
}
