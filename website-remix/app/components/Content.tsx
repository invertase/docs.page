import * as runtime from 'react/jsx-runtime';
import { runSync } from '@mdx-js/mdx';
import { usePageContext } from '~/context';

export function Content() {
  const { bundle } = usePageContext();
  const { default: MDX } = runSync(
    bundle.code,
    // @ts-expect-error - seems to be a bug in the types
    { ...runtime },
  );

  return (
    <div className='pt-5'>
      <MDX
        components={{
          // h1: () => 'lol',
          // h2: () => 'lol',
          // h3: () => 'lol',
        }}
      />
    </div>
  );
}
