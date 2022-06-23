import {
  fetchBundle,
  BundleSuccess,
  BundleResponseData,
  BundleError,
  ErrorReason,
  OutputConfig,
} from '@docs.page/server';
import { json, redirect, LoaderFunction, ThrownResponse } from 'remix';
import { isExternalLink } from '~/components/DocsLink';
import { replaceVariables } from '~/utils';
export type ThrownError = ThrownBundleError | ThrownNotFoundError;

// A thrown error from the loader containing the bundle error.
export type ThrownBundleError = ThrownResponse<number, BundleError | null>;

export type ThrownNotFoundError = ThrownResponse<
  number,
  Pick<DocumentationLoader, 'owner' | 'repo' | 'path'> & { reason: ErrorReason }
>;

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
  source: {
    type: 'PR' | 'commit' | 'branch';
    owner: string;
    repository: string;
    ref: string;
  };
  // The bundle data.
  code: string;
  // Page heading nodes.
  headings: BundleSuccess['headings'];
  // Configuration for the repo.
  config: OutputConfig;
  // Any page frontmatter.
  frontmatter: BundleSuccess['frontmatter'];
  // base branch
  baseBranch: string;
};

// Utility to guard against a bundler error.
export function isBundleError(bundle: BundleSuccess | BundleError): bundle is BundleError {
  return bundle.hasOwnProperty('statusCode');
}

// @ts-ignore
export const docsLoader: LoaderFunction = async ({ params }) => {
  const owner = params.owner!;
  let repo = params.repo!;
  const path = params['*']!;
  let ref: string | undefined;

  // Check if the repo includes a ref
  if (repo.includes('~')) {
    [repo, ref] = repo.split('~');
  }

  let response: BundleResponseData;

  try {
    response = await fetchBundle({ owner, repository: repo, path, ref });
  } catch (error) {
    // If the bundler failed (e.g. API down), throw a server error
    throw json(null, 500);
  }

  // If the bundler errors, return the error as a bad request.
  if (isBundleError(response)) {
    switch (response.statusCode) {
      case 404:
        throw json<ThrownNotFoundError['data']>(
          {
            owner,
            repo,
            path,
            reason: response.reason,
          },
          404,
        );

      default:
        throw json(response, response.statusCode);
    }
  }

  // Apply a redirect if provided in the frontmatter
  if (response.frontmatter.redirect) {
    const href = response.frontmatter.redirect;
    if (isExternalLink(href)) {
      return redirect(href);
    }
    return redirect(`/${owner}/${repo}${response.frontmatter.redirect}`);
  }

  const config = response.config;
  const code = replaceVariables(config.variables, response.code);

  return json<DocumentationLoader>(
    {
      owner,
      repo,
      path,
      ref,
      source: response.source,
      code,
      headings: response.headings,
      config,
      frontmatter: response.frontmatter,
      baseBranch: response.baseBranch ?? 'main',
    },
    {
      headers: {
        // 'cache-control': 'max-age=0, must-revalidate',
      },
    },
  );
};
