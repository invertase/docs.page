import React from "react";

export type LayoutType = "default" | "wide";

type LayoutProps = {
  type: LayoutType;
  children: React.ReactNode | React.ReactNode[];
};

function Layout({ type, children }: LayoutProps) {
  switch (type) {
    case "wide":
      return <div>{children}</div>;
    case "default":
    default:
      return <div>{children}</div>;
  }
}

export const DEFAULT_LAYOUT: LayoutType = "default";

export { Layout };
