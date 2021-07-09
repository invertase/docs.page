import React from 'react';
import NextHead from 'next/head';
import Script from 'next/script';
import { useCustomDomain, usePageContent, useSlugProperties } from '../hooks';
import { getImageSrc } from './Image';
import { isProduction } from '../utils';
import { SlugProperties } from '../utils/properties';
import { PageContent } from '../utils/content';
import { CustomDomain } from '../utils/domain';

export function Head(): JSX.Element {
  const properties = useSlugProperties();
  const content = usePageContent();
  const domain = useCustomDomain();

  return (
    <>
      <NextHead>
        {getHeadTags({
          properties,
          content,
          domain,
        })}
      </NextHead>
      {isProduction() && content.config.googleTagManager && (
        <Script>
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${content.config.googleTagManager}');`}
        </Script>
      )}
    </>
  );
}

type HeadContext = {
  properties: SlugProperties;
  content: PageContent;
  domain: CustomDomain;
};

export function getHeadTags({ properties, content, domain }: HeadContext): JSX.Element[] {
  const { frontmatter, config } = content;

  const title = (() => {
    if (!config.name && frontmatter.title) return frontmatter.title;
    if (!frontmatter.title && config.name) return config.name;
    if (!frontmatter.title && !config.name) return 'docs.page';
    return `${frontmatter.title} | ${config.name}`;
  })();

  const tags = [
    <title key="title">{title}</title>,
    <meta key="theme-color" name="theme-color" content={config.theme} />,
    <meta key="og:site_name" property="og:site_name" content="docs.page" />,
    <meta key="og:title" property="og:title" content={title} />,
    <meta
      key="og:url"
      property="og:url"
      content={`https://docs.page${properties.base}/${properties.path}`}
    />,
    <meta key="twitter:title" name="twitter:title" content={title} />,
    <meta key="twitter:image:alt" name="twitter:image:alt" content={title} />,
    <meta key="twitter:card" name="twitter:card" content="summary_large_image" />,
  ];

  // Add a canonical tag if a domain is enabled
  if (domain) {
    let canonical = `https://${domain}/`;
    if (properties.ref) canonical += `~${encodeURIComponent(properties.ref)}/`;
    canonical += properties.path;
    if (canonical.endsWith('/index')) canonical = canonical.slice(0, -6);
    tags.push(<link key="canonical" rel="canonical" href={canonical} />);
  }

  if (!content.flags.isIndexable) {
    tags.push(<meta key="noindex" name="robots" content="noindex" />);
  }

  if (config.favicon) {
    tags.push(
      <link
        key="favicon"
        rel="icon"
        type="image/png"
        href={getImageSrc(properties, config.favicon)}
      />,
    );
  } else {
    tags.push(
      <link
        key="favicon"
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="https://docs.page/favicons/favicon-32x32.png"
      />,
    );
  }

  if (frontmatter.description) {
    tags.push(<meta key="description" name="description" content={frontmatter.description} />);
    tags.push(
      <meta key="og:description" property="og:description" content={frontmatter.description} />,
    );
    tags.push(
      <meta
        key="twitter:description"
        name="twitter:description"
        content={frontmatter.description}
      />,
    );
  }

  if (frontmatter.image) {
    tags.push(<meta key="og:image:frontmatter" property="og:image" content={frontmatter.image} />);
  } else if (config.socialPreview) {
    tags.push(<meta key="og:image:config" property="og:image" content={config.socialPreview} />);
  }

  if (config.docsearch?.appId) {
    tags.push(
      <link
        key="docsearch"
        rel="preconnect"
        href={`https://${config.docsearch.appId}-dsn.algolia.net`}
      />,
    );
  }

  return tags;
}
