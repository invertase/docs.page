import {
  type MetaDescriptor,
  type MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import type { HeadersFunction, LoaderFunctionArgs } from "@vercel/remix";
import { redirect } from "@vercel/remix";
import { Layout } from "~/Layout";
import { getBundle } from "~/api";
import { Scripts } from "~/components/Scripts";
import { type Context, PageContext } from "~/context";

import docsearch from "@docsearch/css/dist/style.css?url";
import { trackPageRequest } from "~/plausible";
import {
  ensureLeadingSlash,
  getAssetSrc,
  getEnvironment,
  getRequestParams,
} from "~/utils";
import domains from "../../../../domains.json";

export const loader = async (args: LoaderFunctionArgs) => {
  const requestUrl = new URL(args.request.url);
  const { owner, repository, ref, path } = getRequestParams(args);
  const environment = getEnvironment();

  const bundle = await getBundle({
    owner,
    repository,
    path,
    ref,
  }).catch((response) => {
    throw response;
  });

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
      throw redirect(redirectTo);
    }

    let url = "";
    if (domain && environment === "production") {
      // If there is a domain setup, always redirect to it.
      url = `https://${domain}`;
      if (ref) url += `/~${ref}`;
      url += redirectTo;
    } else {
      // If no domain, redirect to docs.page.
      url = `${requestUrl.origin}/${owner}/${repository}`;
      if (ref) url += `~${ref}`;
      url += redirectTo;
    }

    throw redirect(url);
  }

  if (import.meta.env.PROD) {
    // Track the page request.
    await trackPageRequest(args.request, owner, repository);
  }

  return {
    path: ensureLeadingSlash(path),
    owner,
    repository,
    ref,
    domain: domain && environment === "production" ? domain : undefined,
    bundle,
    preview: false,
  } satisfies Context;
};

export default function DocsPage() {
  const context = useLoaderData<typeof loader>();

  return (
    <PageContext.Provider value={context}>
      <Scripts />
      <Layout />
    </PageContext.Provider>
  );
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": "s-maxage=1, stale-while-revalidate=59",
});

export const meta: MetaFunction<typeof loader> = ({ data: ctx }) => {
  const descriptors: MetaDescriptor[] = [];

  if (!ctx) {
    return descriptors;
  }

  descriptors.push({
    tagName: "link",
    rel: "icon",
    href: ctx.bundle.config.favicon
      ? getAssetSrc(ctx, ctx.bundle.config.favicon)
      : "/favicon.ico",
  });

  // Add noindex meta tag if the frontmatter or config has noindex set to true.
  if (
    ctx.bundle.frontmatter.noindex === true ||
    ctx.bundle.config.seo?.noindex === true
  ) {
    descriptors.push({
      name: "robots",
      content: "noindex",
    });
  }

  const title =
    ctx.bundle.frontmatter.title || ctx.bundle.config.name || "docs.page";
  const description =
    ctx.bundle.frontmatter.description || ctx.bundle.config.description;

  let image = ctx.bundle.frontmatter.image
    ? String(ctx.bundle.frontmatter.image)
    : ctx.bundle.config.socialPreview;

  // If there is no image, generate one.
  if (image === undefined) {
    const params = JSON.stringify({
      owner: ctx.owner,
      repository: ctx.repository,
      title,
      description,
      // Use the light logo, and fallback to the dark logo
      logo:
        ctx.bundle.config.logo.light || ctx.bundle.config.logo.dark
          ? getAssetSrc(
              ctx,
              ctx.bundle.config.logo.light || ctx.bundle.config.logo.dark || "",
            )
          : undefined,
    });

    const base64String =
      typeof window !== "undefined"
        ? window.btoa(params)
        : Buffer.from(params).toString("base64");

    image = `https://og.docs.page?params=${base64String}`;
  }
  // If it has been set to false, disable the image.
  else if (image === false) {
    image = undefined;
  }
  // Otherwise the image is a path, so we need to resolve it.
  else {
    image = getAssetSrc(ctx, image);
  }

  descriptors.push({
    title,
  });

  descriptors.push({
    property: "og:title",
    content: title,
  });

  descriptors.push({
    name: "twitter:title",
    content: title,
  });

  if (image) {
    descriptors.push({
      name: "twitter:card",
      content: "summary_large_image",
    });

    descriptors.push({
      name: "twitter:image",
      content: image,
    });

    descriptors.push({
      property: "og:image",
      content: image,
    });
  }

  if (description) {
    descriptors.push({
      name: "description",
      content: description,
    });
    descriptors.push({
      property: "og:description",
      content: description,
    });
    descriptors.push({
      name: "twitter:description",
      content: description,
    });
  }

  if ("domain" in ctx && ctx.domain) {
    descriptors.push({
      property: "og:url",
      content: `https://${ctx.domain}`,
    });
  }

  if (ctx.bundle.config.social?.x) {
    descriptors.push({
      name: "twitter:site",
      content: `@${ctx.bundle.config.social.x}`,
    });
  }

  if (ctx.bundle.config.search?.docsearch) {
    // https://docsearch.algolia.com/docs/DocSearch-v3#preconnect
    descriptors.push({
      tagName: "link",
      rel: "preconnect",
      crossOrigin: "true",
      href: `https://${ctx.bundle.config.search?.docsearch.appId}-dsn.algolia.net`,
    });

    descriptors.push({
      tagName: "link",
      rel: "stylesheet",
      href: docsearch,
    });
  }

  return descriptors;
};
