// Some crude typings for next-mdx-remote

declare module "next-mdx-remote/mdx-remote" {
  import React from "react";
  declare type Props = {
    source: any;
    components?: { [key: any]: JSX.Element };
  };
  declare const _default: React.MemoExoticComponent<(
    props: Props
  ) => JSX.Element>;
  export default _default;
}

declare module "next-mdx-remote/serialize" {
  type Options = {
    mdxOptions?: {
      rehypePlugins: Array<any>;
      remarkPlugins: Array<any>;
    };
  };

  export default async function (
    content: string,
    options?: Options
  ): Promise<any>;
}
