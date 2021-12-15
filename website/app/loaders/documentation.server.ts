import { BundleSuccess, fetchBundle, BundleResponseData, BundleError } from '@docs.page/server';
import { json, LoaderFunction, ThrownResponse } from 'remix';

// A thrown error from the loader containing the bundle error.
export type ThrownBundleError = ThrownResponse<number, BundleError | null>;

// Response from the loader containing the bundle data.
export type DocumentationLoader = {
  // The bundle data.
  bundle: BundleSuccess;
  // The owner of the request, e.g. `invertase`
  owner: string;
  // The repository of the request e.g. `react-native-firebase`
  repo: string;
  // The path of the request, e.g. `/getting-started`
  path: string;
  // An optional ref (e.g. PR, branch, tag).
  ref?: string;
};

// Utility to guard against a bundler error.
export function isBundleError(bundle: any): bundle is BundleError {
  return bundle.errors !== undefined;
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
    throw json(null, 500);
  }

  if (isBundleError(bundle)) {
    throw json(bundle, 400);
  }

  if (bundle.config === null || bundle.code === null) {
    throw json(null, 404);
  }

  return json({
    bundle,
    owner,
    repo,
    path,
  });
};
