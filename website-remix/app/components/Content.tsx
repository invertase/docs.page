import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';
import { usePageContext } from '~/context';
import { TableOfContents } from './TableOfContents';

import { Heading } from './mdx/Heading';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = any;

export function Content() {
  const { bundle } = usePageContext();
  const { default: MDX } = runSync(
    bundle.code,
    // @ts-expect-error - seems to be a bug in the types
    { ...runtime },
  );

  return (
    <div className="pt-5 w-full flex">
      <main
        className="
        flex-1 max-w-none pr-24 prose dark:prose-invert
        prose-inline-code:before:content-none prose-inline-code:after:content-none prose-inline-code:border prose-inline-code:rounded prose-inline-code:py-0.5 prose-inline-code:px-1 prose-inline-code:border-black/20 prose-inline-code:dark:border-white/20 prose-inline-code:bg-black/5 prose-inline-code:dark:bg-white/5
      "
      >
        <MDX
          components={{
            section(props: Props) {
              const { id, ...rest } = props;
              return (
                <section className="relative" data-section={id}>
                  <span id={id} className="pointer-events-none absolute -mt-36 pt-36" />
                  <div {...rest} />
                </section>
              );
            },
            h1: (props: Props) => <Heading {...props} type="h1" />,
            h2: (props: Props) => <Heading {...props} type="h2" anchor="true" />,
            h3: (props: Props) => <Heading {...props} type="h3" anchor="true" />,
            h4: (props: Props) => <Heading {...props} type="h4" anchor="true" />,
            h5: (props: Props) => <Heading {...props} type="h5" anchor="true" />,
            h6: (props: Props) => <Heading {...props} type="h6" anchor="true" />,
          }}
        />
      </main>
      <TableOfContents />
    </div>
  );
}
