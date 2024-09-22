import type { GetServerSidePropsContext } from "next/types";
import domains from "../../domains.json";
import { Redirect } from "./utils";
import { type BundlerOutput, getBundle } from "./api";

type BaseContext = {
  // The relative path of the current page, e.g. `/contributing`.
  path: string;
  // The bundle output for the current page.
  bundle: BundlerOutput;
};

type PreviewContext = BaseContext & {
  // The page is in preview mode.
  preview: true;
  // Returns a blob URL src for a given path.
  getFile: (path: string) => Promise<string | undefined>;
};

export type DocsPageContext = BaseContext & {
  // The owner of the repository, e.g. `invertase`.
  owner: string;
  // The repository name, e.g. `docs.page`.
  repository: string;
  // The branch or tag of the repository, e.g. `main`.
  ref?: string;
  // The domain assigned to the repository, e.g. `use.docs.page`.
  domain?: string;
  // Whether the page is using a vanity domain, e.g. `:org.docs.page/repo`
  vanity?: boolean;
  // The page is not in preview mode.
  preview: false;
};

export type Context = DocsPageContext | PreviewContext;

export async function getRequestContext(
  request: GetServerSidePropsContext["req"],
  opts: {
    owner: string;
    repository: string;
    path: string;
    ref: string | undefined;
    vanity: boolean;
  }
) {
  const { owner, repository, ref, path, vanity } = opts;

  const bundle = await getBundle({
    owner,
    repository,
    path,
    ref,
  }).catch((response) => {
    // Explict throw here to make it obvious that a response is being thrown.
    throw response;
  });

  // Get the current environment.
  // const environment = getEnvironment();

  // Check whether the repository has a domain assigned.
  const domain = domains
    .find(([, repo]) => repo === `${owner}/${repository}`)
    ?.at(0);

  // Check if the user has set a redirect in the frontmatter of this page.
  const redirectTo =
    typeof bundle.frontmatter.redirect === "string"
      ? bundle.frontmatter.redirect
      : undefined;

  // Redirect to the specified URL.
  if (redirectTo && redirectTo.length > 0) {
    if (redirectTo.startsWith("http://") || redirectTo.startsWith("https://")) {
      throw new Redirect(redirectTo);
    }

    let url = "";
    if (vanity) {
      url = `https://${owner}.docs.page/${repository}`;
      if (ref) url += `~${ref}`;
      url += redirectTo;
    } else if (domain && "TODO" === "production") {
      // TODO(migrate)
      // If there is a domain setup, always redirect to it.
      url = `https://${domain}`;
      if (ref) url += `/~${ref}`;
      url += redirectTo;
    } else {
      const requestUrl = new URL(request.url!);
      // If no domain, redirect to docs.page.
      url = `${requestUrl.origin}/${owner}/${repository}`;
      if (ref) url += `~${ref}`;
      url += redirectTo;
    }

    throw new Redirect(url);
  }

  // if (import.meta.env.PROD) { // TODO(migrate)
  //   // Track the page request.
  //   await trackPageRequest(args.request, owner, repository);
  // }

  return {
    path: ensureLeadingSlash(path),
    owner,
    repository,
    ref,
    domain: domain && 'TODO' === "production" ? domain : undefined, // TODO(migrate)
    vanity,
    bundle,
    preview: false,
  } satisfies Context;
}
