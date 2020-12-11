import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextHead from 'next/head';
import NextRouter, { useRouter } from 'next/router';
import NProgress from 'nprogress';

import { Hydrate } from '../mdx';

import { ThemeStyles } from '../components/ThemeStyles';
import { Layout } from '../components/Layout';
import { Error, ErrorBoundary } from '../templates/error';

import { ConfigContext } from '../utils/config';
import { IRenderError, redirect, RenderError } from '../utils/error';
import { SlugProperties, SlugPropertiesContext, Properties } from '../utils/properties';
import { PageContentContext, getPageContent, PageContent } from '../utils/content';
import { getPullRequestMetadata } from '../utils/github';
import { CustomDomain, CustomDomainContext } from '../utils/domain';
import { getHeadTags } from '../utils/html';
import {
  headerDepthToHeaderList,
  routeChangeComplete,
  routeChangeError,
  routeChangeStart,
} from '../utils';
import { mdxSerialize } from '../utils/mdx-serialize';
import { Loading } from '../templates/Loading';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', routeChangeStart);
NextRouter.events.on('routeChangeComplete', routeChangeComplete);
NextRouter.events.on('routeChangeError', routeChangeError);

export default function Documentation({
  domain, // TODO custom domains
  source,
  properties,
  page,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <Loading />;
  }

  if (error) {
    return <Error {...error} />;
  }

  const tags = getHeadTags(properties, page);

  return (
    <>
      <NextHead>{tags}</NextHead>
      <CustomDomainContext.Provider value={domain}>
        <ConfigContext.Provider value={page.config}>
          <SlugPropertiesContext.Provider value={properties}>
            <PageContentContext.Provider value={page}>
              <ThemeStyles />
              <Layout>
                <ErrorBoundary>
                  <Hydrate source={source} />
                </ErrorBoundary>
              </Layout>
            </PageContentContext.Provider>
          </SlugPropertiesContext.Provider>
        </ConfigContext.Provider>
      </CustomDomainContext.Provider>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

type StaticProps = {
  domain: CustomDomain;
  properties: SlugProperties;
  source?: string;
  page?: PageContent;
  error?: IRenderError;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({ params }) => {
  const slug = params.slug as string[];

  // Anything with less than 2 parts to the slug is an invalid URL.
  if (slug.length < 2) {
    return redirect('/');
  }

  let source = null;
  let error: RenderError = null;
  let page: PageContent;

  // Extract the slug properties from the request.
  const properties = new Properties(params.slug as string[]);

  console.time('GitHub');

  // If the ref looks like a PR, update the details to point towards
  // the PR owner (which might be a different repo)
  if (properties.isPullRequest()) {
    const metadata = await getPullRequestMetadata(
      properties.owner,
      properties.repository,
      parseInt(properties.ref),
    );

    // If a PR was found, update the property metadata
    if (metadata) {
      properties.setPullRequestMetadata(metadata);
    }
  }

  page = await getPageContent(properties);

  console.timeEnd('GitHub');

  console.time('MDX');

  if (!error) {
    if (!page) {
      console.error('Page not found');
      error = RenderError.pageNotFound(properties);
    } else if (page.frontmatter.redirect) {
      return redirect(page.frontmatter.redirect, properties);
    } else {
      const serialization = await mdxSerialize(page);

      if (serialization.error) {
        error = RenderError.serverError(properties);
      } else {
        source = serialization.source;
      }
    }
  }

  console.timeEnd('MDX');

  return {
    props: {
      domain: null, // await getCustomDomain(properties),
      properties: properties.toObject(),
      source,
      page,
      error: error?.toObject() ?? null,
    },
    revalidate: 30,
  };
};
