import React from 'react';
import { MDXRemote } from '@invertase/next-mdx-remote';

import { Link } from '../components/Link';

import { Heading } from './Heading';
import { Tabs, TabItem, TabsContext } from './Tabs';
import { Pre, PreProps } from './Pre';
import { Img } from './Img';
import { YouTube } from './YouTube';
import { Divider } from '../components/Divider';
import { MDXRemoteSerializeResult } from '@invertase/next-mdx-remote/dist/types';

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
  ) => <Img {...props} />,
  pre: (props: PreProps) => <Pre {...props} />,
  hr: Divider,

  // Custom MDX components
  Heading,
  Tabs,
  TabItem,
  Image: Img,
  Img,
  YouTube,
};

export function Hydrate({ source }: { source: MDXRemoteSerializeResult }): JSX.Element {
  return (
    <TabsContext>
      <MDXRemote {...source} components={components} />
    </TabsContext>
  );
}
