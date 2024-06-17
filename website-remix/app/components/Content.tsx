import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';
import { usePageContext } from '~/context';
import { TableOfContents } from './TableOfContents';

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
      <main className="flex-1 prose dark:prose-invert max-w-none pr-24">
        <MDX
          components={{
            section(props: Props) {
              const { id, ...rest } = props;
              return (
                <section className="relative" data-section={id}>
                  <span id={id} className="pointer-events-none absolute -mt-20 pt-36" />
                  <div {...rest} />
                </section>
              );
            },
            // h1: () => 'lol',
            // h2: () => 'lol',
            // h3: () => 'lol',
          }}
        />
      </main>
      <TableOfContents />
    </div>
  );
}
