import { useContext } from 'react';
import { Config, ConfigContext } from './config';
import { PageContent, PageContentContext } from './content';
import { SlugProperties, SlugPropertiesContext } from './properties';
import googleAnalytics from './scripts/google-analytics';

export function useSlugProperties(): SlugProperties {
  return useContext(SlugPropertiesContext);
}

export function usePageContent(): PageContent {
  return useContext(PageContentContext);
}

export function useConfig(): Config {
  return useContext(ConfigContext);
}

// Returns a GitHub URL to edit the current page
export function useEditUrl(): string {
  const properties = useSlugProperties();
  const fileType = usePageContent().type;
  return `${properties.url}/edit/${properties.ref}/docs/${properties.path}.${fileType}`;
}

export function useHeadTags(properties: SlugProperties, page: PageContent) {
  const { frontmatter, config } = page;

  const title = (() => {
    if (!config.name && frontmatter.title) return frontmatter.title;
    if (!frontmatter.title && config.name) return config.name;
    if (!frontmatter.title && !config.name) return 'docs.page';
    return `${frontmatter.title} | ${config.name}`;
  })();

  const tags = [
    <title>{title}</title>,
    <meta property="og:site_name" content="docs.page" />,
    <meta property="og:title" content={title} />,
    <meta property="og:url" content={`https://docs.page${properties.base}/${properties.path}`} />,
    <meta name="twitter:title" content={title} />,
    <meta name="twitter:image:alt" content={title} />,
    <meta name="twitter:card" content="summary_large_image" />,
  ];

  if (config.logo) {
    tags.push(<link rel="icon" type="image/png" href={config.logo} />);
  }

  if (frontmatter.description) {
    tags.push(<meta name="description" content={frontmatter.description} />);
    tags.push(<meta property="og:description" content={frontmatter.description} />);
    tags.push(<meta name="twitter:description" content={frontmatter.description} />);
  }

  if (frontmatter.image) {
    tags.push(<meta property="og:image" content={frontmatter.image} />);
  } else if (config.socialPreview) {
    tags.push(<meta property="og:image" content={config.socialPreview} />);
  }

  if (config.googleAnalytics) {
    tags.push(
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics}`}
      />,
    );
    tags.push(
      <script dangerouslySetInnerHTML={{ __html: googleAnalytics(config.googleAnalytics) }} />,
    );
  }

  if (config.docsearch) {
    tags.push(
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.css"
      />,
    );
    tags.push(
      <script
        type="text/javascript"
        src="https://cdn.jsdelivr.net/npm/docsearch.js@2/dist/cdn/docsearch.min.js"
      />,
    );
  }

  return tags;
}
