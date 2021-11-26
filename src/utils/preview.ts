import { createContext } from 'react';
import { getPageContent, HeadingNode, PageContent } from './content';
import { Environment } from './env';
import { IRenderError, RenderError } from './error';
import { mdxSerialize } from './mdx-serialize';
import { ProjectConfig } from './projectConfig';
import { Properties, SlugProperties } from './properties';

export type PreviewMode = { enabled: boolean; onSelect: () => void };

export const PreviewModeContext = createContext<PreviewMode>({
  enabled: false,
  onSelect: () => {},
});

export type PreviewPageProps = {
  env: Environment;
  properties: SlugProperties;
  headings: HeadingNode[];
  source?: string;
  content?: PageContent;
  config: ProjectConfig;
  error?: IRenderError;
};

export async function buildPreviewProps({
  hash,
  config,
  text,
}: {
  hash: string;
  config: string;
  text: string;
}): Promise<PreviewPageProps> {
  const params = hash.split('/');

  const owner = 'preview#';
  const name = 'index';
  const slug = params.slice(1);

  let source = null;
  const headings: HeadingNode[] = [];
  let error: IRenderError = null;

  // Build a request instance from the query
  const properties = await Properties.build([owner, name, ...slug]);

  const localContent = {
    isFork: false,
    baseBranch: 'main',
    config,
    md: text,
    path: hash,
  };

  const content = await getPageContent(properties, localContent);

  if (!content) {
    // If there is no content, the repository is not found
    error = RenderError.repositoryNotFound(properties).toObject();
  } else if (content.frontmatter.redirect) {
    // TODO: Redirect the user to another page
  } else {
    if (content.markdown) {
      const serialization = await mdxSerialize(content);

      if (serialization.errors) {
        error = RenderError.serverError(properties).toObject();
      } else {
        source = serialization.source;
        content.headings = serialization.headings as unknown as HeadingNode[];
      }
    } else {
      error = RenderError.pageNotFound(properties).toObject();
    }
  }

  return {
    env: (process.env.VERCEL_ENV ?? 'development') as Environment,
    properties: properties.toObject(content),
    source,
    headings,
    content,
    error: error,
    config: JSON.parse(config),
  };
}
