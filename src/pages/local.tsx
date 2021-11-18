import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextRouter, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { Layout } from '../components/Layout';
import { ConfigContext, mergeConfig } from '../utils/projectConfig';
import { PageContentContext } from '../utils/content';
import { EnvironmentContext } from '../utils/env';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', NProgress.start);
NextRouter.events.on('routeChangeComplete', NProgress.done);
NextRouter.events.on('routeChangeError', NProgress.done);

const config = mergeConfig({});

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

  const select = useCallback(async () => {
    setPending(true);
    try {
      const handle = await window.showDirectoryPicker();
      let config: File;
      let docs: FileSystemDirectoryHandle;
      for await (const entry of handle.values()) {
        if (entry.kind === 'file' && entry.name === 'docs.json') {
          config = await entry.getFile();
        }
        if (entry.kind === 'directory' && entry.name === 'docs') {
          docs = entry;
        }
      }

      if (!config) {
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

  return { select, paths, error, pending };
}

export default function Documentation(): JSX.Element {
  const { select, paths, error, pending } = useDirectorySelector();
  const hash = useHashChange();

  useEffect(() => {
    if (!paths) {
      return;
    }

    const file = paths[hash];

    // TODO handle no file (404)
    if (!file) {
      console.log('file not found, 404');
      return;
    }

    // TODO update state and show page
    file.text().then(text => {
      console.log(text);
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

  return (
    <EnvironmentContext.Provider value={'preview'}>
      <ConfigContext.Provider value={config}>
        <PageContentContext.Provider
          value={{
            flags: { hasConfig: false, hasFrontmatter: true, isFork: false, isIndexable: false },
            frontmatter: {
              title: 'test',
              description: 'test',
              sidebar: false,
              redirect: 'test',
              image: '',
            },
            markdown: '',
            path: '',
            baseBranch: 'main',
            config,
            headings: [],
          }}
        >
          <Layout>
            <button className="border-solid" onClick={select}>
              click to pick directory
            </button>
          </Layout>
        </PageContentContext.Provider>
      </ConfigContext.Provider>
    </EnvironmentContext.Provider>
  );
  //   return (
  //     <>
  //       <EnvironmentContext.Provider value={env}>
  //         <CustomDomainContext.Provider value={domain}>
  //           <ConfigContext.Provider value={content.config}>
  //             <SlugPropertiesContext.Provider value={properties}>
  //               <PageContentContext.Provider value={content}>
  //                 <DebugModeContext.Provider value={false}>
  //                   <Head />
  //                   <ThemeStyles />
  //                   <Layout>
  //                     <ErrorBoundary>
  //                       <Hydrate source={source} />
  //                     </ErrorBoundary>
  //                   </Layout>
  //                 </DebugModeContext.Provider>
  //               </PageContentContext.Provider>
  //             </SlugPropertiesContext.Provider>
  //           </ConfigContext.Provider>
  //         </CustomDomainContext.Provider>
  //       </EnvironmentContext.Provider>
  //     </>
  //   );
}
