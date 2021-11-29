import { createContext } from 'react';
import { getPageContent, HeadingNode, PageContent } from './content';
import { Environment } from './env';
import { IRenderError, RenderError } from './error';
import { mdxSerialize } from './mdx-serialize';
import { mergeConfig, ProjectConfig } from './projectConfig';
import { Properties, SlugProperties } from './properties';

export type PreviewMode = { enabled: boolean; onSelect: () => void };

export const PreviewModeContext = createContext<PreviewMode>({
  enabled: false,
  onSelect: () => {
    return;
  },
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
  errorCode,
}: {
  hash: string;
  config: string;
  text: string;
  errorCode?: number;
}): Promise<PreviewPageProps> {
  const params = hash.split('/');

  const owner = 'preview#';
  const name = 'index';
  const slug = params.slice(1);
  let error: IRenderError;
  let source = null;
  const headings: HeadingNode[] = [];

  // Build a request instance from the query
  const properties = await Properties.build([owner, name, ...slug]);

  if (errorCode === 404) {
    error = RenderError.pageNotFound(properties).toObject();
  }
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

export async function extractContents(
  handle: FileSystemFileHandle,
  configHandle: FileSystemFileHandle,
): Promise<[string, string]> {
  let config = mergeConfig({});
  let text: string;
  const errors: Error[] = [];
  try {
    // get docs.json from config handle
    const configFile = await configHandle.getFile();
    try {
      // build config from the file contents
      config = await mergeConfig(JSON.parse(await configFile.text()));
    } catch (e) {
      console.error('Problems with docs.json format');
      // errors.push(e);
    }
  } catch (e) {
    console.error('Unable to getFile config');
    // errors.push(e);
  }
  try {
    const file = await handle.getFile();
    try {
      text = await file.text();
    } catch (e) {
      console.error('unable to extract text from file.');
      errors.push(e);
    }
  } catch (e) {
    console.error('unable to getFile page');
    errors.push(e);
    throw new Error('unable to getFile page');
  }
  return [text, JSON.stringify(config)];
}

export type FileSystemFileHandles = { [path: string]: FileSystemFileHandle };

export async function iterateDirectory(
  directory: FileSystemDirectoryHandle,
  relativePath?: string,
  other?: FileSystemFileHandles,
): Promise<FileSystemFileHandles> {
  let handles: FileSystemFileHandles = {
    ...other,
  };

  for await (const entry of directory.values()) {
    if (entry.kind === 'file' && entry.name.endsWith('.mdx')) {
      handles[`${relativePath ?? ''}/${entry.name.replace('.mdx', '')}`] = entry;
    }

    if (entry.kind === 'directory') {
      handles = {
        ...handles,
        ...(await iterateDirectory(entry, `${relativePath ?? ''}/${entry.name}`, handles)),
      };
    }
  }

  return handles;
}
