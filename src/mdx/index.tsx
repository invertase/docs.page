import React, { useState, useEffect, isValidElement } from "react";
import cx from "classnames";
import hydrate from "next-mdx-remote/hydrate";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";

import { Header } from "../components/Header";
import { Link } from "../components/Link";

import { Heading } from "./Heading";
import { Tabs, TabItem, TabsContext } from "./Tabs";

const components = {
  // HTML element overrides
  a: (props: React.HTMLProps<HTMLAnchorElement>) => <Link {...props} />,
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <Heading {...props} type="h1" />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <Heading {...props} type="h2" />
  ),
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <Heading {...props} type="h3" />
  ),
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <Heading {...props} type="h4" />
  ),
  h5: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <Heading {...props} type="h5" />
  ),
  h6: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <Heading {...props} type="h6" />
  ),
  pre: (props: React.HTMLProps<HTMLPreElement>) => {
    const pre = (className?: string) => (
      <pre {...props} className={cx(props.className, className)} />
    );

    if (isValidElement(props.children) && props.children?.props?.live) {
      console.log(props.children?.props?.children ?? "");
      return (
        <div className="rounded overflow-hidden">
          <LiveProvider
            code={props.children?.props?.children ?? ""}
            scope={{ useState, useEffect }}
          >
            <div className="font-mono font-bold text-gray-900 px-2 py-3 bg-gray-500">
              LIVE EDITOR
            </div>
            <div className="bg-gray-800">
              <LiveEditor />
            </div>
            <LiveError />
            <div>
              <div className="font-mono font-bold text-gray-900 px-2 py-3 bg-gray-500">
                RESULT
              </div>
              <style global jsx>{`
                .live-preview * {
                  all: unset;
                }
              `}</style>
              <div className="live-preview bg-gray-800">
                <LivePreview />
              </div>
            </div>
          </LiveProvider>
        </div>
      );
    }

    if (isValidElement(props.children) && props.children?.props?.title) {
      return (
        <>
          <div className="bg-gray-800 border-gray-700 text-white font-mono border-b px-4 py-2 rounded-tr rounded-tl text-sm font-bold">
            {props.children.props.title}
          </div>
          {pre("code-block-title")}
        </>
      );
    }

    return pre();
  },

  // Custom MDX components
  Header,
  Tabs,
  TabItem,
};

export default components;

export function Hydrate({ source }: { source: any }) {
  return <TabsContext>{hydrate(source, { components })}</TabsContext>;
}
