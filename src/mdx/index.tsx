import React from 'react';
import cx from 'classnames';
import MdxRemote from 'next-mdx-remote/mdx-remote';

import { Header } from '../components/Header';
import { Link } from '../components/Link';

import { Heading } from './Heading';
import { Tabs, TabItem, TabsContext } from './Tabs';
import { Pre, PreProps, withCodeBlockTitle } from './Code';
import { Image } from './Image';
import { YouTube } from './YouTube';
import { usePageContent } from '../hooks';

const components = {
  // HTML element overrides
  a: (props: React.HTMLProps<HTMLAnchorElement>) => <Link {...props} />,
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h1" />,
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h2" />,
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h3" />,
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h4" />,
  h5: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h5" />,
  h6: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h6" />,
  img: (
    props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  ) => <Image {...props} />,
  pre: (props: PreProps) => {
    const pre = (className?: string) => (
      <Pre {...props} className={cx(props.className, className)} copy={props.raw} />
    );

    if (React.isValidElement(props.children) && props.children?.props?.title) {
      return withCodeBlockTitle(props.children?.props?.title, pre('code-block-title'));
    }

    return pre();
  },
  nav: (props: React.HTMLProps<HTMLDivElement>) => {
    const tableOfContents = usePageContent().frontmatter.tableOfContents;

    if (tableOfContents && props.className.includes('toc')) {
      return (
        <>
          <h3>Table of contents</h3>
          <nav {...props} className="toc mb-12 text-xs" />
        </>
      );
    }
    return null;
  },

  // Custom MDX components
  Header,
  Tabs,
  TabItem,
  Image,
  YouTube,
};

export function Hydrate({ source }: { source: any }) {
  return (
    <TabsContext>
      <MdxRemote source={source} components={components} />
    </TabsContext>
  );
}
