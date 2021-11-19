import { createContext } from 'react';
import { getPageContent, HeadingNode, PageContent } from './content';
import { Environment } from './env';
import { RenderError } from './error';
import { mdxSerialize } from './mdx-serialize';
import { Properties, SlugProperties } from './properties';

export type PreviewMode = boolean;

export const PreviewModeContext = createContext<PreviewMode>(false);

export type PreviewPageProps = {
  env: Environment;
  properties: SlugProperties;
  headings: HeadingNode[];
  source?: string;
  content?: PageContent;
  error?: RenderError;
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
  let error: RenderError = null;

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
    error = RenderError.repositoryNotFound(properties);
  } else if (content.frontmatter.redirect) {
    // TODO: Redirect the user to another page
  } else {
    if (content.markdown) {
      const serialization = await mdxSerialize(content);

      if (serialization.errors) {
        error = RenderError.serverError(properties);
      } else {
        source = serialization.source;
        content.headings = serialization.headings as unknown as HeadingNode[];
      }
    } else {
      error = RenderError.pageNotFound(properties);
    }
  }

  return {
    env: (process.env.VERCEL_ENV ?? 'development') as Environment,
    properties: properties.toObject(content),
    source,
    headings,
    content,
    error: error,
  };
}
