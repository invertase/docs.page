import { BundleSuccess, fetchBundle, BundleResponseData, BundleError } from '@docs.page/server';
import { json, redirect, LoaderFunction, ThrownResponse } from 'remix';
import { replaceVariables } from '~/utils';
import { mergeConfig, ProjectConfig } from '~/utils/config';

// A thrown error from the loader containing the bundle error.
export type ThrownBundleError = ThrownResponse<number, BundleError | null>;

// Response from the loader containing the bundle data.
export type DocumentationLoader = {
  // The owner of the request, e.g. `invertase`
  owner: string;
  // The repository of the request e.g. `react-native-firebase`
  repo: string;
  // The path of the request, e.g. `/getting-started`
  path: string;
  // An optional ref (e.g. PR, branch, tag) provided to the URL.
  ref?: string;
  // The source of the content (e.g. main, master, PR, ref)
  source: string;
  // The bundle data.
  code: string;
  // Page heading nodes.
  headings: BundleSuccess['headings'];
  // Configuration for the repo.
  config: ProjectConfig;
  // Any page frontmatter.
  frontmatter: BundleSuccess['frontmatter'];
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
    // If the bundler failed (e.g. API down), throw a server error
    throw json(null, 500);
  }

  // If the bundler errors, return the error as a bad request.
  if (isBundleError(bundle)) {
    throw json(bundle, 400);
  }

  // No bundled code or config should 404
  if (bundle.config === null || bundle.code === null) {
    throw json({}, 404);
  }
  console.log('debug', bundle);

  // Apply a redirect if provided in the frontmatter
  if (bundle.frontmatter.redirect) {
    return redirect(bundle.frontmatter.redirect);
  }

  const config = mergeConfig(bundle.config);
  const code = replaceVariables(config.variables, bundle.code);

  const response: DocumentationLoader = {
    owner,
    repo,
    path,
    ref,
    source: 'main',
    code,
    headings: bundle.headings,
    config: mergeConfig(bundle.config),
    frontmatter: bundle.frontmatter,
  };

  return json(response);
};
