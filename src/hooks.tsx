import React, {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Config, ConfigContext } from './config';
import { PageContent, PageContentContext } from './content';
import { CustomDomain, CustomDomainContext } from './domain';
import { SlugProperties, SlugPropertiesContext } from './properties';
import googleAnalytics from './scripts/google-analytics';
import { isProduction } from './utils';

export function useCustomDomain(): CustomDomain {
  return useContext(CustomDomainContext);
}

export function useSlugProperties(): SlugProperties {
  return useContext(SlugPropertiesContext);
}

export function usePageContent(): PageContent {
  return useContext(PageContentContext);
}

export function useConfig(): Config {
  return useContext(ConfigContext);
}

export function useNoSSR() {
  const [ready, setReady] = useState<boolean>(false);
  useEffect(() => setReady(true), []);
  return ready;
}

// Returns a GitHub URL to edit the current page
export function useEditUrl(): string {
  const properties = useSlugProperties();
  const fileType = usePageContent().type;
  return `${properties.githubUrl}/edit/${properties.ref}/docs/${properties.path}.${fileType}`;
}

export function useBodyScrollLock(lock: boolean): void {
  useEffect(() => {
    const el = window.document.body;
    if (lock) el.style.overflowY = 'hidden';
    if (!lock) el.style.overflowY = 'auto';
  }, [lock]);
}

export function useLocalStorageToggle(
  key: string,
): [MutableRefObject<HTMLDivElement>, () => void, boolean] {
  const ref = useRef<HTMLDivElement>();
  const [visible, setVisible] = useState<boolean>();

  const onToggle = useCallback(() => {
    const el = ref.current;
    el.classList.toggle('hidden');
    const isVisible = !el.classList.contains('hidden');
    window.localStorage.setItem(`docs.page.${key}`, isVisible ? 'true' : 'false');
    setVisible(isVisible);
  }, [key]);

  return [ref, onToggle, visible];
}

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

  if (!page.flags.isFork && properties.isBaseBranch && page.flags.hasConfig) {
    tags.push(<meta key="noindex" name="robots" content="noindex" />);
  }

  if (config.logo) {
    tags.push(<link key="favicon" rel="icon" type="image/png" href={config.logo} />);
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
