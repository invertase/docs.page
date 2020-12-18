import { isProduction } from './index';
import { PageContent } from './content';
import { SlugProperties } from './properties';
import googleAnalytics from '../scripts/google-analytics';
import { getImageSrc } from '../components/Image';

export function getHeadTags(properties: SlugProperties, page?: PageContent) {
  const { frontmatter, config } = page;

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

  if (page.flags.isFork || !properties.isBaseBranch || !page.flags.hasConfig) {
    tags.push(<meta key="noindex" name="robots" content="noindex" />);
  }

  if (config.logo) {
    tags.push(
      <link
        key="favicon"
        rel="icon"
        type="image/png"
        href={getImageSrc(properties, config.logo)}
      />,
    );
  } else {
    tags.push(
      <link key="favicon" rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />,
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

  if (isProduction() && config.googleAnalytics) {
    tags.push(
      <script
        key="config:googleAnalytics"
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics}`}
      />,
    );
    tags.push(
      <script
        key="config:googleAnalytics:script"
        dangerouslySetInnerHTML={{ __html: googleAnalytics(config.googleAnalytics) }}
      />,
    );
  }

  if (config.docsearch) {
    tags.push(
      <link
        key="config:docsearch:css"
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
      />,
    );
    tags.push(
      <script
        key="config:docsearch:js"
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
      />,
    );
  }

  return tags;
}
