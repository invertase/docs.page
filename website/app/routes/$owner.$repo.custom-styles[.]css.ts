import type { LoaderFunction } from 'remix';

async function getConfiguration({ owner, repo, ref }: Record<string, string>) {

  const host = process.env.NODE_ENV === 'production' ? 'https://api.docs.page' : 'http://localhost:8000';

  const endpoint = `${host}/config?owner=${owner}&repository=${repo}&ref=${ref}`;

  const { config } = await (await fetch(endpoint)).json();

  return config;
}

export let loader: LoaderFunction = async ({ params }) => {

  const owner = params.owner!

  const [repo, ref] = params.repo!.split('~')

  const config = await getConfiguration({ owner: params.owner!, repo, ref });

  let css: Response = new Response();

  if (config.experimentalMath) {
    console.log('here')
    const response = await fetch('https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css', {
      integrity: 'sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn',
    });
    css = response;
  }

  return css;
};
