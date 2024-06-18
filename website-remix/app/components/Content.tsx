import { type ComponentProps } from 'react';
import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';
import { usePageContext } from '~/context';
import { TableOfContents } from './TableOfContents';
import { Icon } from './Icon';

import { Heading } from './mdx/Heading';
import { Link } from './mdx/Link';
import { Table } from './mdx/Table';
import { Section } from './mdx/Section';
import { Image } from './mdx/Image';

export function Content() {
  const { bundle } = usePageContext();
  const { default: MDX } = runSync(
    bundle.code,
    // @ts-expect-error - seems to be a bug in the types
    { ...runtime },
  );

  return (
    <div className="w-full flex">
      <main
        className="
        flex-1 max-w-none pr-24 prose dark:prose-invert
        prose-inline-code:before:content-none prose-inline-code:after:content-none prose-inline-code:border prose-inline-code:rounded prose-inline-code:py-0.5 prose-inline-code:px-1 prose-inline-code:border-black/20 prose-inline-code:dark:border-white/20 prose-inline-code:bg-black/5 prose-inline-code:dark:bg-white/5
      "
      >
        <MDX
          components={{
            /* HTML Overrides */
            h1: (props: ComponentProps<'h1'>) => <Heading {...props} type="h1" />,
            h2: (props: ComponentProps<'h2'>) => <Heading {...props} type="h2" anchor />,
            h3: (props: ComponentProps<'h3'>) => <Heading {...props} type="h3" anchor />,
            h4: (props: ComponentProps<'h4'>) => <Heading {...props} type="h4" anchor />,
            h5: (props: ComponentProps<'h5'>) => <Heading {...props} type="h5" anchor />,
            h6: (props: ComponentProps<'h6'>) => <Heading {...props} type="h6" anchor />,
            a: (props: ComponentProps<'a'>) => <Link {...props} />,
            table: (props: ComponentProps<'table'>) => <Table {...props} />,
            section: (props: ComponentProps<'section'>) => <Section {...props} />,
            img: (props: ComponentProps<'img'>) => <Image {...props} />,
            /* Custom Components */
            Image,
            Icon,
          }}
        />
      </main>
      <TableOfContents />
    </div>
  );
}
