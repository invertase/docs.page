import type { LoaderFunction } from 'remix';

async function getConfig({ owner, repo }: Record<string, string>) {
  const endpoint = `https://raw.githubusercontent.com/${owner}/${repo}/main/docs.json`;
  const res = await (await fetch(endpoint)).text();

  return JSON.parse(res);
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const config = await getConfig({ owner: params.owner!, repo: params.repo! });

  let css: Response = new Response();

  if (config.experimentalMath) {
    const response = await fetch('https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css', {
      integrity: 'sha384-RZU/ijkSsFbcmivfdRBQDtwuwVqK7GMOw6IMvKyeWL2K5UAlyp6WonmB8m7Jd0Hn',
    });
    css = response;
  }

  return css;
};
