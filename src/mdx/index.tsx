import React from 'react';
import { RemoteComponent } from '../components/RemoteComponent.js';
import { ComponentMap } from 'mdx-bundler/client';
import { MDXRemote } from 'next-mdx-remote';

import { Link } from '../components/Link';
import { Divider } from '../components/Divider';

import { Heading } from './Heading';
import { Tabs, TabItem, TabsContext } from './Tabs';
import { Pre, PreProps } from './Pre';
import { Img } from './Img';
import { YouTube } from './YouTube';

const components: ComponentMap = remoteComponents => {
  return {
    // HTML element overrides
    a: (props: React.HTMLProps<HTMLAnchorElement>) => (
      <Link {...props} className="hover:opacity-75" />
    ),
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
    ...remoteComponents,
  };
};

export function Hydrate({
  source,
  config,
  properties,
}: {
  source: string;
  config: any;
  properties: any;
}): JSX.Element {
  const remoteComponents = {};

  config?.components?.forEach(([name, path]) => {
    const url = `https://raw.githubusercontent.com/${properties.owner}/${properties.repository}/${properties.ref}${path}`;

    remoteComponents[name] = () => RemoteComponent({ url });
  });

  const allComponents = components(remoteComponents);

  return (
    <TabsContext>
      <MDXRemote compiledSource={source} components={allComponents} />
    </TabsContext>
  );
}
