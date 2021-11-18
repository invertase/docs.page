import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextRouter, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { Layout } from '../components/Layout';
import { ConfigContext, mergeConfig, ProjectConfig } from '../utils/projectConfig';
import { getPageContent, HeadingNode, PageContent, PageContentContext } from '../utils/content';
import { Environment, EnvironmentContext } from '../utils/env';
import { IRenderError, redirect, RenderError } from '../utils/error';
import { Properties, SlugProperties, SlugPropertiesContext } from '../utils/properties';
import { mdxSerialize } from '../utils/mdx-serialize';
import { ErrorBoundary } from '../templates/error';
import { DebugModeContext } from '../utils/debug';
import { Head } from '../components/Head';
import { ThemeStyles } from '../components/ThemeStyles';
import { Hydrate } from '../mdx';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', NProgress.start);
NextRouter.events.on('routeChangeComplete', NProgress.done);
NextRouter.events.on('routeChangeError', NProgress.done);

type Paths = { [path: string]: File };

async function iterateDirectory(
  directory: FileSystemDirectoryHandle,
  relativePath?: string,
  other?: Paths,
): Promise<Paths> {
  let paths: Paths = {
    ...other,
  };

  for await (const entry of directory.values()) {
    if (entry.kind === 'file' && entry.name.endsWith('.mdx')) {
      paths[`${relativePath ?? ''}/${entry.name.replace('.mdx', '')}`] = await entry.getFile();
    }

    if (entry.kind === 'directory') {
      paths = {
        ...paths,
        ...(await iterateDirectory(entry, `${relativePath ?? ''}/${entry.name}`, paths)),
      };
    }
  }

  return paths;
}

function useHashChange(): string {
  const [hash, setHash] = useState('');

  function onHashChange() {
    return setHash(window.location.hash.replace('#', ''));
  }

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return hash;
}

function useDirectorySelector() {
  const [error, setError] = useState<Error | null>(null);
  const [pending, setPending] = useState(false);
  const [paths, setPaths] = useState<Paths | null>();
  const [config, setConfig] = useState<ProjectConfig | null>();

  const select = useCallback(async () => {
    setPending(true);
    try {
      const handle = await window.showDirectoryPicker();
      let docs: FileSystemDirectoryHandle;
      let foundDocsJson = false;
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && entry.name === 'docs.json') {
          const configFile = await entry.getFile();
          const configText = JSON.parse(await configFile.text());

          setConfig(mergeConfig(configText));
          foundDocsJson = true;
        }
        if (entry.kind === 'directory' && entry.name === 'docs') {
          docs = entry;
        }
      }

      if (!foundDocsJson) {
        throw new Error('No docs.json found');
      }

      if (!docs) {
        throw new Error('No docs directory found');
      }

      // TODO set config
      setPaths(await iterateDirectory(docs));
    } catch (e) {
      setError(e);
    } finally {
      setPending(false);
    }
  }, []);

  return { select, paths, error, pending, config };
}

export default function Documentation(): JSX.Element {
  const { select, paths, error, pending, config } = useDirectorySelector();

  const hash = useHashChange();
  const [pageProps, setPageProps] = useState<PageProps | null>(null);
  useEffect(() => {
    if (!paths) {
      return;
    }

    const file = hash !== '' ? paths[hash] : paths['/index'];
    
    // TODO handle no file (404)
    if (!file) {
      console.log('file not found, 404');
      return;
    }

    // TODO update state and show page
    file.text().then(async text => {
      setPageProps(await buildPreviewProps({ hash, config: JSON.stringify(config), text }));
    });
  }, [paths, hash]);

  if (pending) {
    return <div>Waiting for user...</div>;
  }

  if (error) {
    console.error(error);
    return <div>Something went wrong!</div>;
  }

  if (paths == null) {
    return <button onClick={select}>Select Directory!</button>;
  }

  if (!pageProps) {
    return <>not loaded</>;
  }
  const { env, source, content, properties } = pageProps;

  return (
    <>
      <EnvironmentContext.Provider value={env}>
        <ConfigContext.Provider value={config}>
          <SlugPropertiesContext.Provider value={properties}>
            <PageContentContext.Provider value={content}>
              <DebugModeContext.Provider value={false}>
                <Head />
                <ThemeStyles />
                <Layout>
                  <ErrorBoundary>
                    <Hydrate source={source} />
                  </ErrorBoundary>
                </Layout>
              </DebugModeContext.Provider>
            </PageContentContext.Provider>
          </SlugPropertiesContext.Provider>
        </ConfigContext.Provider>
      </EnvironmentContext.Provider>
    </>
  );
}

type PageProps = {
  env: Environment;
  properties: SlugProperties;
  headings: HeadingNode[];
  source?: string;
  content?: PageContent;
  error?: Error;
};

async function buildPreviewProps({
  hash,
  config,
  text,
}: {
  hash: string;
  config: string;
  text: string;
}): Promise<PageProps> {
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
    error: null,
  };
};