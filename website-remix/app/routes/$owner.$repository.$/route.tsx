import type { LoaderFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import domains from '../../../../domains.json';
import { getBundle } from '../../api';
import { Context, PageContext } from '../../context';
import { Layout } from '../../Layout';

export const loader = async (args: LoaderFunctionArgs) => {
  const owner = args.params.owner;
  const path = args.params['*'] || '';
  let repository = args.params.repository;
  let ref: string | undefined;

  if (!owner || !repository) {
    // TODO Error
    throw new Error('Invalid repository');
  }

  // Check if the repo includes a ref (invertase/foo~bar)
  if (repository.includes('~')) {
    [repository, ref] = repository.split('~');
  }

  const bundle = await getBundle({
    owner,
    repository,
    path,
    ref,
  }).catch(() => {
    throw new Error('Failed to fetch bundle');
  });

  // Check whether the repository has a domain assigned.
  const domain = domains.find(([, repo]) => repo === `${owner}/${repository}`)?.at(0);

  // Check if the user has set a redirect in the frontmatter of this page.
  const redirectTo =
    typeof bundle.frontmatter.redirect === 'string' ? bundle.frontmatter.redirect : undefined;

  // Redirect to the specified URL.
  if (redirectTo && redirectTo.length > 0) {
    if (redirectTo.startsWith('http://') || redirectTo.startsWith('https://')) {
      throw redirect(redirectTo);
    }

    let url = '';
    if (domain) {
      // If there is a domain setup, always redirect to it.
      url = `https://${domain}`;
      if (ref) url += `/~${ref}`;
      url += redirectTo;
    } else {
      // If no domain, redirect to docs.page.
      url = `https://docs.page/${owner}/${repository}`;
      if (ref) url += `~${ref}`;
      url += redirectTo;
    }

    throw redirect(url);
  }

  return {
    url: args.request.url,
    owner,
    repository,
    ref,
    domain,
    bundle,
  } satisfies Context;
};

export default function DocsPage() {
  const context = useLoaderData<typeof loader>();

  return (
    <PageContext.Provider value={context}>
      <Layout />
    </PageContext.Provider>
  );
}
