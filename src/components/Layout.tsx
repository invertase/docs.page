import React, { useContext } from "react";
import cx from "classnames";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { ConfigContext } from "../config";
import { ContentContext } from "../content";

export type LayoutType = "default" | "wide" | "full" | "bare";

export const DEFAULT_LAYOUT: LayoutType = "default";

const widthMap: { [key in LayoutType] } = {
  default: "max-w-2xl",
  wide: "max-w-6xl",
  full: "max-w-full",
  bare: "",
};

export function Layout({ children }: { children: React.ReactNode }) {
  const config = useContext(ConfigContext);
  const page = useContext(ContentContext);

  if (!page || !config) {
    throw new Error("Layout must be a child of: ConfigContext, ContentContext");
  }

  // First check the frontmatter for a layout, then fallback to the config
  const layout = page.frontmatter.layout || config.defaultLayout;

  if (layout === "bare") {
    return <div>children</div>;
  }

  return (
    <>
      <Header />
      <WithSidebar>
        <article
          className={cx(
            "px-1 lg:px-0 py-20 prose dark:prose-dark mx-auto",
            widthMap[layout]
          )}
        >
          {children}
        </article>
      </WithSidebar>
    </>
  );
}

function WithSidebar({ children }: { children: React.ReactNode }) {
  // Check first whether there is a sidebar to render
  let enabled = useContext(ConfigContext).sidebar.length > 0;

  // If there is a sidebar, check whether the frontmatter has enabled/disabled it
  if (enabled) {
    enabled = useContext(ContentContext).frontmatter.sidebar;
  }

  return (
    <>
      {enabled && (
        <nav className="fixed inset-y-0 w-64 hidden desktop:block">
          <div className="flex h-full mt-16 overflow-y-auto overflow-x-hidden border-r dark:border-gray-700 p-4">
            <Sidebar />
          </div>
        </nav>
      )}
      <div
        className={cx("flex-1", {
          "pl-0 desktop:pl-64": enabled,
        })}
      >
        {children}
      </div>
    </>
  );
}
