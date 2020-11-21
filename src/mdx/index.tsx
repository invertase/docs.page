import React from "react";
import cx from "classnames";
import MdxRemote from "next-mdx-remote/mdx-remote";

import { Header } from "../components/Header";
import { Link } from "../components/Link";

import { Heading } from "./Heading";
import { Tabs, TabItem, TabsContext } from "./Tabs";
import { LiveCode, withCodeBlockTitle } from "./Code";

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
      <div>
        {" "}
        {/* Wrapping in a div prevents the `prose` class from removing margins */}
        <pre {...props} className={cx("mb-4", props.className, className)} />
      </div>
    );

    // @ts-ignore
    if (React.isValidElement(props.children) && props.live === "true") {
      return <LiveCode code={props.children?.props?.children ?? ""} />;
    }

    if (React.isValidElement(props.children) && props.children?.props?.title) {
      return withCodeBlockTitle(
        props.children?.props?.title,
        pre("code-block-title")
      );
    }

    return pre();
  },

  // Custom MDX components
  Header,
  Tabs,
  TabItem,
};

export function Hydrate({ source }: { source: any }) {
  return (
    <TabsContext>
      <MdxRemote source={source} components={components} />
    </TabsContext>
  );
}
