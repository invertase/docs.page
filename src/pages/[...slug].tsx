import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextHead from 'next/head';
import NextRouter from 'next/router';
import NProgress from 'nprogress';

import mdxSerialize from 'next-mdx-remote/serialize';
import { Hydrate } from '../mdx';

import { ThemeStyles } from '../components/ThemeStyles';
import { Layout } from '../components/Layout';
import { Error, ErrorBoundary } from '../templates/error';

import { ConfigContext } from '../config';
import { IRenderError, redirect, RenderError } from '../error';
import { SlugProperties, SlugPropertiesContext, Properties } from '../properties';
import { PageContentContext, getPageContent, PageContent } from '../content';
import { getDefaultBranch, getPullRequestMetadata } from '../github';
import { getHeadTags } from '../hooks';
import { CustomDomain, CustomDomainContext } from '../domain';
import {
  headerDepthToHeaderList,
  routeChangeComplete,
  routeChangeError,
  routeChangeStart,
} from '../utils';

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
    fallback: 'blocking',
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

  // If no ref was found in the slug, grab the default branch name
  // from the GQL API.
  if (!properties.ref) {
    const defaultBranch = await getDefaultBranch(properties.owner, properties.repository);

    if (!defaultBranch) {
      console.error('Repo not found');
      error = RenderError.repositoryNotFound(properties);
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

  if (!error) {
    if (!page) {
      console.error('Page not found');
      error = RenderError.pageNotFound(properties);
    } else if (page.frontmatter.redirect) {
      return redirect(page.frontmatter.redirect, properties);
    } else {
      try {
        source = await mdxSerialize(page.content, {
          mdxOptions: {
            rehypePlugins: [
              // Convert `pre` blogs into prism formatting
              require('../../rehype-prism'),
              // Add an `id` to all heading tags
              require('rehype-slug'),
              // Create a table of contents above the page
              page.frontmatter.tableOfContents
                ? [
                    require('@jsdevtools/rehype-toc'),
                    {
                      headings: headerDepthToHeaderList(page.config.headerDepth),
                    },
                  ]
                : [],
              // Make emojis accessible
              require('rehype-accessible-emojis').rehypeAccessibleEmojis,
            ],
            remarkPlugins: [
              // Sanitize any JSX nodes within MD
              require('../../remark-sanitize-jsx'),
              // Ensure any `img` tags are not wrapped in `p` tags
              require('remark-unwrap-images'),
              // Convert any admonition to HTML
              require('remark-admonitions'),
            ],
          },
        });
      } catch (e) {
        console.log('!!!', e);
        error = RenderError.serverError(properties);
      }
    }
  }

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
