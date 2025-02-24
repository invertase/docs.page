import dynamic from "next/dynamic";
import Head from "next/head";
import Script from "next/script";
import { useState } from "react";
import { Content } from "~/components/Content";
import { Edit } from "~/components/Edit";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { PreviousNext } from "~/components/PreviousNext";
import { Scripts } from "~/components/Scripts";
import { Sidebar } from "~/components/Sidebar";
import { TableOfContents } from "~/components/TableOfContents";
import { Tabs } from "~/components/Tabs";
import { ThemeScripts } from "~/components/Theme";
import { type Context, PageContext, useTabs } from "~/context";
import { cn, getAssetSrc, toBase64 } from "~/utils";

import "nprogress/nprogress.css";

const NProgress = dynamic(() => import("~/components/NProgress"), {
  ssr: false,
});

export function Documentation({ ctx }: { ctx: Context }) {
  // Get the page title, starting with page frontmatter, then the config, and finally defaulting to "Documentation".
  const title =
    ctx.bundle.frontmatter.title || ctx.bundle.config.name || "Documentation";

  // Get the page description, starting with page frontmatter, then the config, and finally defaulting to undefined.
  const description =
    ctx.bundle.frontmatter.description || ctx.bundle.config.description;

  // Get the page image, starting with page frontmatter, then the config, and finally defaulting to the social preview.
  let image = ctx.bundle.frontmatter.image
    ? String(ctx.bundle.frontmatter.image)
    : ctx.bundle.config.socialPreview;

  // If there is no image, generate one.
  if (image === undefined && !ctx.preview) {
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

    image = `https://docs.page/api/og?params=${toBase64(params)}`;
  }
  // If it has been set to false, disable the image.
  else if (image === false) {
    image = undefined;
  }
  // Otherwise the image is a path, so we need to resolve it.
  else {
    image = getAssetSrc(ctx, String(image));
  }

  const noindex =
    ctx.bundle.frontmatter.noindex === true ||
    ctx.bundle.config.seo?.noindex === true;

  return (
    <PageContext.Provider value={ctx}>
      <Head>
        <title>{String(title)}</title>
        <meta property="og:title" content={String(title)} />
        <meta name="twitter:title" content={String(title)} />

        {description ? (
          <>
            <meta name="description" content={String(description)} />
            <meta property="og:description" content={String(description)} />
            <meta name="twitter:description" content={String(description)} />
          </>
        ) : null}

        {image ? (
          <>
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:image" content={image} />
          </>
        ) : null}

        {ctx.bundle.config.favicon?.light ? (
          <link
            rel="icon"
            media={
              ctx.bundle.config.favicon?.dark
                ? // If there is a dark favicon, add a media query to prefer light mode only.
                  "(prefers-color-scheme: light)"
                : undefined
            }
            href={getAssetSrc(ctx, ctx.bundle.config.favicon.light)}
          />
        ) : null}

        {ctx.bundle.config.favicon?.dark ? (
          <link
            rel="icon"
            media={
              ctx.bundle.config.favicon?.light
                ? // If there is a light favicon, add a media query to prefer dark mode only.
                  "(prefers-color-scheme: dark)"
                : undefined
            }
            href={getAssetSrc(ctx, ctx.bundle.config.favicon.dark)}
          />
        ) : null}

        {noindex ? <meta name="robots" content="noindex" /> : null}
      </Head>
      <Script
        dangerouslySetInnerHTML={{
          __html: `window.__docsPage = ${JSON.stringify(ctx)}`,
        }}
      />
      <Scripts />
      <NProgress />
      <DocumentationLayout />
    </PageContext.Provider>
  );
}

export function DocumentationLayout() {
  const hasTabs = useTabs().length > 0;
  const [sidebar, setSidebar] = useState(false);

  function toggleSidebar() {
    setSidebar((prev) => {
      const open = !prev;

      if (open) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }

      return open;
    });
  }

  return (
    <>
      <ThemeScripts />
      <Scripts />
      <section className="fixed z-10 inset-x-0 top-0 bg-background-dark/90 backdrop-blur">
        <Header onMenuToggle={toggleSidebar} />
        <Tabs onMenuToggle={toggleSidebar} />
      </section>
      <div className="max-w-8xl mx-auto px-0 md:px-5">
        <section
          className={cn(
            "fixed z-10 w-[17rem] bottom-0 overflow-y-auto translate-x-[-19rem] lg:translate-x-0 transition-transform",
            {
              "top-16": !hasTabs && !sidebar,
              "top-28": hasTabs && !sidebar,
              "translate-x-0 top-0 z-20 bg-background border-r border-black/10 dark:border-white/10":
                sidebar,
            },
          )}
        >
          <Sidebar onMenuToggle={toggleSidebar} />
        </section>
        <div
          className={cn("relative lg:pl-[17rem]", {
            "pt-16": !hasTabs,
            "pt-28": hasTabs,
          })}
        >
          <div
            role="button"
            className={cn(
              "bg-background/50 z-10 absolute inset-0 lg:opacity-0 transition-opacity",
              {
                "pointer-events-none opacity-0": !sidebar,
                "pointer-events-auto opacity-100": sidebar,
              },
            )}
            onClick={() => toggleSidebar()}
            onKeyDown={() => toggleSidebar()}
          />
          <section className="pt-8 ps-4 lg:ps-16 pe-4 flex">
            <div className="min-w-0 flex-1 pr-0 xl:pr-12">
              <Content />
              <Edit />
              <PreviousNext />
              <div className="h-px bg-black/5 dark:bg-white/5 my-12" />
              <Footer />
            </div>
            <div className="hidden xl:block relative lg:w-[17rem]">
              <TableOfContents />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
