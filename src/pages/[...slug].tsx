import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextHead from 'next/head';
import NextRouter from 'next/router';
import NProgress from 'nprogress';
import DOMPurify from 'isomorphic-dompurify';

import mdxSerialize from 'next-mdx-remote/serialize';
import { Hydrate } from '../mdx';

import { ThemeStyles } from '../components/ThemeStyles';
import { Layout } from '../components/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';

import { ConfigContext } from '../config';
import { redirect, RenderError } from '../error';
import { SlugProperties, SlugPropertiesContext, Properties } from '../properties';
import { PageContentContext, getPageContent, PageContent } from '../content';
import { getDefaultBranch, getPullRequestMetadata } from '../github';
import { useHeadTags } from '../hooks';
import { CustomDomain, CustomDomainContext } from '../domain';
import { routeChangeComplete, routeChangeError, routeChangeStart } from '../utils';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', routeChangeStart);
NextRouter.events.on('routeChangeComplete', routeChangeComplete);
NextRouter.events.on('routeChangeError', routeChangeError);

export default function Documentation({
  domain,
  source,
  properties,
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const tags = useHeadTags(properties, page);

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
                  {page.type === 'html' && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(source),
                      }}
                    />
                  )}
                  {page.type !== 'html' && <Hydrate source={source} />}
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
    fallback: 'blocking',
  };
};

type StaticProps = {
  domain: CustomDomain;
  properties: SlugProperties;
  source?: string;
  page?: PageContent;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({ params }) => {
  const slug = params.slug as string[];

  // Anything with less than 2 parts to the slug is an invalid URL.
  if (slug.length < 2) {
    return redirect('/');
  }

  let source = null;
  let page: PageContent;

  // Extract the slug properties from the request.
  const properties = new Properties(params.slug as string[]);

  // If no ref was found in the slug, grab the default branch name
  // from the GQL API.
  if (!properties.ref) {
    const defaultBranch = await getDefaultBranch(properties.owner, properties.repository);

    if (!defaultBranch) {
      throw RenderError.repositoryNotFound(properties);
    } else {
      properties.setDefaultBranch(defaultBranch);
    }
  }
  // If the ref looks like a PR
  else if (properties.isPullRequest()) {
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

  if (!page) {
    throw RenderError.pageNotFound(properties);
  }

  if (page.frontmatter.redirect) {
    return redirect(page.frontmatter.redirect, properties);
  }

  try {
    if (page.type === 'html') {
      source = page.content;
    } else {
      source = await mdxSerialize(page.content, {
        mdxOptions: {
          rehypePlugins: [
            require('../../rehype-prism'),
            // require('../../rehype-prose'),
            require('rehype-slug'),
          ],
          remarkPlugins: [
            require('remark-unwrap-images'),
            require('@fec/remark-a11y-emoji'),
            require('remark-admonitions'),
          ],
        },
      });
    }
  } catch (e) {
    console.log(e);
    throw RenderError.serverError(properties);
  }

  return {
    props: {
      domain: null, // await getCustomDomain(properties),
      properties: properties.toObject(),
      source,
      page,
    },
    revalidate: 30,
  };
};
