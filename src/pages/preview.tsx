import React, { useState } from 'react';
import NextRouter from 'next/router';
import NProgress from 'nprogress';
import { Layout } from '../components/Layout';
import { ConfigContext } from '../utils/projectConfig';
import { PageContentContext } from '../utils/content';
import { EnvironmentContext } from '../utils/env';
import { SlugPropertiesContext } from '../utils/properties';
import { ErrorBoundary } from '../templates/error';
import { Error } from '../templates/preview/Error';
import { DebugModeContext } from '../utils/debug';
import { Head } from '../components/Head';
import { ThemeStyles } from '../components/ThemeStyles';
import { Hydrate } from '../mdx';
import { PreviewPageProps, PreviewModeContext } from '../utils/preview';
import { Preview } from '../templates/preview';
import { useDirectorySelector, usePollLocalDocs } from '../hooks';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', NProgress.start);
NextRouter.events.on('routeChangeComplete', NProgress.done);
NextRouter.events.on('routeChangeError', NProgress.done);

export default function Documentation(): JSX.Element {
  const { select, handles, config } = useDirectorySelector();

  const [pageProps, setPageProps] = useState<PreviewPageProps | null>(null);

  usePollLocalDocs(handles, config, 500, setPageProps);

  if (handles == null) {
    return (
      <>
        <Preview onSelect={select} />
      </>
    );
  }
  if (!pageProps) {
    NProgress.start();
    return (
      <>
        <>
          <Preview onSelect={select} />
        </>
      </>
    );
  }
  const { env, source, content, properties, error } = pageProps;
  if (error) {
    return <Error {...error} />;
  }

  NProgress.done();

  return (
    <>
      <EnvironmentContext.Provider value={env}>
        <ConfigContext.Provider value={config}>
          <SlugPropertiesContext.Provider value={properties}>
            <PageContentContext.Provider value={content}>
              <PreviewModeContext.Provider value={true}>
                <DebugModeContext.Provider value={false}>
                  <Head />
                  <ThemeStyles />
                  <Layout>
                    <ErrorBoundary>
                      <Hydrate source={source} />
                    </ErrorBoundary>
                  </Layout>
                </DebugModeContext.Provider>
              </PreviewModeContext.Provider>
            </PageContentContext.Provider>
          </SlugPropertiesContext.Provider>
        </ConfigContext.Provider>
      </EnvironmentContext.Provider>
    </>
  );
}
