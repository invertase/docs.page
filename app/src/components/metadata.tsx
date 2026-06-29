import Head from "next/head";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getAssetSrc } from "@/lib/docs-assets";
import { toBase64 } from "@/lib/utils";

export function Metadata() {
  const { bundle, route } = useDocPageContext();

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

  const faviconLight = bundle.config.favicon?.light
    ? getAssetSrc(bundle, bundle.config.favicon.light)
    : undefined;
  const faviconDark = bundle.config.favicon?.dark
    ? getAssetSrc(bundle, bundle.config.favicon.dark)
    : undefined;
  const faviconDefault = faviconLight ?? faviconDark;

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

      {faviconDefault ? (
        <>
          <link rel="icon" href={faviconDefault} />
          {faviconLight && faviconDark && faviconLight !== faviconDark ? (
            <link
              rel="icon"
              href={faviconDark}
              media="(prefers-color-scheme: dark)"
            />
          ) : null}
        </>
      ) : null}

      {route.canonicalUrl ? (
        <link rel="canonical" href={route.canonicalUrl} />
      ) : null}

      {noindex ? <meta name="robots" content="noindex" /> : null}
    </Head>
  );
}
