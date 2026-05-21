import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getAssetSrc } from "@/lib/docs-assets";
import { toBase64 } from "@/lib/utils";
import Head from "next/head";

export function Metadata() {
  const { bundle } = useDocPageContext();

  // Get the page title, starting with page frontmatter, then the config, and finally defaulting to "Documentation".
  const title =
    bundle.frontmatter.title || bundle.config.name || "Documentation";

  // Get the page description, starting with page frontmatter, then the config, and finally defaulting to undefined.
  const description =
    bundle.frontmatter.description || bundle.config.description;

  const noindex =
    bundle.frontmatter.noindex === true || bundle.config.seo?.noindex === true;

  let image = bundle.frontmatter.image
    ? String(bundle.frontmatter.image)
    : bundle.config.socialPreview;

  // Generate an image if not specificed globally or in frontmatter.
  // TODO: Old had !ctx.preview
  if (image === undefined) {
    // Check Open Graph logo from config.
    let logo = bundle.config.og.logo
      ? getAssetSrc(bundle, bundle.config.og.logo)
      : undefined;

    // If not specified, use the light or dark logo from config.
    if (!logo) {
      logo =
        bundle.config.logo.dark || bundle.config.logo.light
          ? getAssetSrc(
              bundle,
              bundle.config.logo.dark || bundle.config.logo.light || "",
            )
          : undefined;
    }

    const repository = bundle.config.og.github
      ? `${bundle.source.owner}/${bundle.source.repository}`
      : undefined;

    const params = JSON.stringify({
      title,
      description,
      logo,
      repository,
    });

    // TODO: Change me when we go live!
    image = `https://docspage-production.up.railway.app/api/og?params=${toBase64(params)}`;
  }

  return (
    <Head>
      <title>{String(title)}</title>
      <meta property="og:title" content={String(title)} />
      <meta name="twitter:title" content={String(title)} />

      {image ? (
        <>
          <meta property="og:image" content={image} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={image} />
        </>
      ) : null}

      {description ? (
        <>
          <meta name="description" content={String(description)} />
          <meta property="og:description" content={String(description)} />
          <meta name="twitter:description" content={String(description)} />
        </>
      ) : null}

      {bundle.config.favicon?.light ? (
        <link
          rel="icon"
          media={
            bundle.config.favicon?.dark
              ? // If there is a dark favicon, add a media query to prefer light mode only.
                "(prefers-color-scheme: light)"
              : undefined
          }
          href={getAssetSrc(bundle, bundle.config.favicon.light)}
        />
      ) : null}

      {bundle.config.favicon?.dark ? (
        <link
          rel="icon"
          media={
            bundle.config.favicon?.light
              ? // If there is a light favicon, add a media query to prefer dark mode only.
                "(prefers-color-scheme: dark)"
              : undefined
          }
          href={getAssetSrc(bundle, bundle.config.favicon.dark)}
        />
      ) : null}

      {noindex ? <meta name="robots" content="noindex" /> : null}
    </Head>
  );
}
