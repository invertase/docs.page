import React from 'react';
import { getMDXComponent, ComponentMap } from 'mdx-bundler/client';

import { Link } from '../components/Link';
import { Divider } from '../components/Divider';

import { Heading } from './Heading';
import { Tabs, TabItem, TabsContext } from './Tabs';
import { Pre, PreProps } from './Pre';
import { Img } from './Img';
import { YouTube } from './YouTube';
import { Table } from './Table';

const components: ComponentMap = {
  // HTML element overrides
  a: (props: React.HTMLProps<HTMLAnchorElement>) => {
    return <Link {...props} className="hover:opacity-75" />;
  },
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h1" />,
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h2" />,
  h3: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h3" />,
  h4: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h4" />,
  h5: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h5" />,
  h6: (props: React.HTMLProps<HTMLHeadingElement>) => <Heading {...props} type="h6" />,
  pre: (props: PreProps) => <Pre {...props} />,
  hr: Divider,
  img: Img,
  table: Table,
  // Custom MDX components
  Heading,
  Tabs,
  TabItem,
  Image: Img,
  Img,
  YouTube,
};

export function Hydrate({ source }: { source: string }): JSX.Element {
  const Component = React.useMemo(() => getMDXComponent(source), [source]);

  return (
    <TabsContext>
      <Component components={components} />
    </TabsContext>
  );
}
