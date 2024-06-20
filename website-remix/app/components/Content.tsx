import { type ComponentProps } from 'react';
import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';
import { usePageContext } from '~/context';
import { Icon } from './Icon';

import { Heading } from './mdx/Heading';
import { Link } from './mdx/Link';
import { Table } from './mdx/Table';
import { Section } from './mdx/Section';
import { Image } from './mdx/Image';
import { Tweet } from './mdx/Tweet';
import { Info, Warning, Error, Success } from './mdx/Callout';
import { YouTube } from './mdx/YouTube';
import { Accordion, AccordionGroup } from './mdx/Accordion';
import { Video } from './mdx/Video';
import { Vimeo } from './mdx/Vimeo';
import { Zapp } from './mdx/Zapp';

export function Content() {
  const { bundle } = usePageContext();
  const { default: MDX } = runSync(
    bundle.code,
    // @ts-expect-error - seems to be a bug in the types
    { ...runtime },
  );

  // Show the page title if the frontmatter or config has it enabled
  const showPageTitle =
    Boolean(bundle.frontmatter.showPageTitle) ||
    Boolean(bundle.config.content?.showPageTitle) ||
    false;

  const showPageImage =
    Boolean(bundle.frontmatter.showPageImage) ||
    Boolean(bundle.config.content?.showPageImage) ||
    false;

  const title = bundle.frontmatter.title;
  const description = bundle.frontmatter.description;
  const image = bundle.frontmatter.image;

  const showMeta = showPageTitle || showPageImage;

  return (
    <main className="flex-1 max-w-none">
      {showMeta && (
        <div className="space-y-4 mb-8">
          {!!title && (
            <>
              <Heading type="h1" className="dark:text-white text-5xl">
                {String(title)}
              </Heading>
              {!!description && (
                <div className="text-lg">
                  <p>{String(description)}</p>
                </div>
              )}
            </>
          )}
          {!!image && <Image zoom={false} src={String(image)} />}
        </div>
      )}
      <div
        className="prose dark:prose-invert
        prose-inline-code:before:content-none prose-inline-code:after:content-none prose-inline-code:border prose-inline-code:rounded prose-inline-code:py-0.5 prose-inline-code:px-1 prose-inline-code:border-black/20 prose-inline-code:dark:border-white/20 prose-inline-code:bg-black/5 prose-inline-code:dark:bg-white/5"
      >
        <MDX
          components={{
            /* HTML Overrides */
            h1: (props: ComponentProps<'h1'>) => <Heading {...props} type="h1" />,
            h2: (props: ComponentProps<'h2'>) => <Heading {...props} type="h2" anchor="true" />,
            h3: (props: ComponentProps<'h3'>) => <Heading {...props} type="h3" anchor="true" />,
            h4: (props: ComponentProps<'h4'>) => <Heading {...props} type="h4" anchor="true" />,
            h5: (props: ComponentProps<'h5'>) => <Heading {...props} type="h5" anchor="true" />,
            h6: (props: ComponentProps<'h6'>) => <Heading {...props} type="h6" anchor="true" />,
            a: (props: ComponentProps<'a'>) => <Link {...props} />,
            table: (props: ComponentProps<'table'>) => <Table {...props} />,
            section: (props: ComponentProps<'section'>) => <Section {...props} />,
            img: (props: ComponentProps<'img'>) => <Image {...props} />,
            /* Custom Components */
            Accordion,
            AccordionGroup,
            Image,
            Icon,
            Info,
            Warning,
            Error,
            Success,
            Tweet,
            Vimeo,
            Video,
            YouTube,
            X: Tweet,
            Zapp,
          }}
        />
      </div>
    </main>
  );
}
