import type { LoaderFunction } from 'remix';
import { getConfiguration } from '~/utils/config';

export const loader: LoaderFunction = async ({ params }) => {
  let css: Response = new Response('', {
    headers: {
      'Content-Type': 'text/css',
    },
  });
  try {
    const owner = params.owner!;

    const [repo, ref] = params.repo!.split('~');

    const config = await getConfiguration({ owner, repo, ref });

    if (config?.experimentalMath) {
      const response = await fetch('https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css', {
        integrity: 'sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn',
      });
      css = response;
    }
  } catch (e) {
    console.log(e);
  }

  return css;
};
