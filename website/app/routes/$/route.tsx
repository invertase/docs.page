import {
  type MetaDescriptor,
  type MetaFunction,
  useLoaderData,
} from "@remix-run/react";
import type { HeadersFunction, LoaderFunctionArgs } from "@vercel/remix";
import { Scripts } from "~/components/Scripts";
import { type Context, PageContext } from "~/context";
import { DocsLayout } from "~/layouts/DocsLayout";

import docsearch from "@docsearch/css/dist/style.css?url";
import { getAssetSrc, getRequestContext, getRequestParams } from "~/utils";
import { DocsPage } from "~/layouts/DocsPage";

export const loader = async (args: LoaderFunctionArgs) => {
  const params = getRequestParams(args);
  return await getRequestContext(args, params);
};

export default function DocsPageRoute() {
  const ctx = useLoaderData<typeof loader>();
  return <DocsPage ctx={ctx} />;
}

export const headers: HeadersFunction = () => ({
  "Cache-Control": "s-maxage=1, stale-while-revalidate=59",
});

export const meta: MetaFunction<typeof loader> = ({ data: ctx }) => {
  const descriptors: MetaDescriptor[] = [];

  if (!ctx) {
    return descriptors;
  }

  if (ctx.bundle.config.favicon?.light) {
    descriptors.push({
      tagName: "link",
      rel: "icon",
      media: ctx.bundle.config.favicon?.dark
        ? // If there is a dark favicon, add a media query to prefer light mode only.
          "(prefers-color-scheme: light)"
        : undefined,
      href: getAssetSrc(ctx, ctx.bundle.config.favicon.light),
    });
  }

  if (ctx.bundle.config.favicon?.dark) {
    descriptors.push({
      tagName: "link",
      rel: "icon",
      media: ctx.bundle.config.favicon?.light
        ? // If there is a light favicon, add a media query to prefer dark mode only.
          "(prefers-color-scheme: dark)"
        : undefined,
      href: getAssetSrc(ctx, ctx.bundle.config.favicon.dark),
    });
  }

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
              ctx.bundle.config.logo.light || ctx.bundle.config.logo.dark || ""
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
