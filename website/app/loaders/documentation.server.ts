import { BundleSuccess, fetchBundle, BundleResponseData, BundleError } from '@docs.page/server';
import { json, LoaderFunction } from 'remix';

export type DocumentationLoader = {
  bundle: BundleSuccess;
  owner: string;
  repo: string;
  path: string;
  ref?: string;
};

export function isBundleError(bundle: any): bundle is BundleError {
  return bundle.errors.length > 0;
}

export const docsLoader: LoaderFunction = async ({ params }) => {
  const owner = params.owner!;
  let repo = params.repo!;
  const path = params['*']!;
  let ref: string | undefined;

  // Check if the repo includes a ref
  if (repo.includes('~')) {
    [repo, ref] = repo.split('~');
  }

  let bundle: BundleResponseData;

  try {
    bundle = await fetchBundle({ owner, repository: repo, path, ref });
  } catch (error) {
    console.log(error);
    throw new Response('Something went wrong', {
      status: 500,
    });
  }

  if (isBundleError(bundle)) {
    console.log(bundle);
    // TODO send errors somehow
    throw new Response('Bad request', {
      status: 400,
    });
  }

  // if (!bundle.config) {
  //   throw new Response('Repository not found', {
  //     status: 404,
  //   });
  // }

  return json({
    bundle,
    owner,
    repo,
    path,
  });
};
