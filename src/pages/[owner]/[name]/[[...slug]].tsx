import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextRouter, { useRouter } from 'next/router';
import union from 'lodash.union';
import NProgress from 'nprogress';

import domains from '../../../../domains.json';
import repositories from '../../../../repositories.json';

import { Hydrate } from '../../../mdx';

import { Head } from '../../../components/Head';
import { ThemeStyles } from '../../../components/ThemeStyles';
import { Layout } from '../../../components/Layout';
import { Error, ErrorBoundary } from '../../../templates/error';

import { ConfigContext } from '../../../utils/projectConfig';
import { IRenderError, redirect, RenderError } from '../../../utils/error';
import { Properties, SlugProperties, SlugPropertiesContext } from '../../../utils/properties';
import {
  getPageContent,
  HeadingNode,
  PageContent,
  PageContentContext,
} from '../../../utils/content';
import { CustomDomain, CustomDomainContext } from '../../../utils/domain';
import { mdxSerialize } from '../../../utils/mdx-serialize';
import { Loading } from '../../../templates/Loading';
import { isProduction } from '../../../utils';
import { getRepositoryPaths } from '../../../utils/github';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', NProgress.start);
NextRouter.events.on('routeChangeComplete', NProgress.done);
NextRouter.events.on('routeChangeError', NProgress.done);

export default function Documentation({
  domain,
  source,
  properties,
  content,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <Loading />;
  }

  if (error) {
    return <Error {...error} />;
  }

  return (
    <>
      <CustomDomainContext.Provider value={domain}>
        <ConfigContext.Provider value={content.config}>
          <SlugPropertiesContext.Provider value={properties}>
            <PageContentContext.Provider value={content}>
              <Head />
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
  let paths = [];

  // Since this call can be fairly large, only run it on production
  // and let the development pages fallback each time.
  if (isProduction()) {
    console.info(` fetching paths for ${repositories.length} repositories.`);
    console.time();
    const promises = repositories.map(repository => getRepositoryPaths(repository));
    const results = await Promise.all(promises);
    paths = union(...results);
    console.timeEnd();
  }

  return {
    paths,
    fallback: true,
  };
};

type StaticProps = {
  domain: CustomDomain;
  properties: SlugProperties;
  headings: HeadingNode[];
  source?: string;
  content?: PageContent;
  error?: IRenderError;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ctx => {
  const owner = ctx.params.owner as string;
  const name = ctx.params.name as string;
  const slug = (ctx.params.slug || []) as string[];

  let source = null;
  const headings: HeadingNode[] = [];
  let error: RenderError = null;

  // Build a request instance from the query
  const properties = await Properties.build([owner, name, ...slug]);

  // Query GitHub for the content
  const content = await getPageContent(properties);

  if (!content) {
    // If there is no content, the repository is not found
    error = RenderError.repositoryNotFound(properties);
  } else if (content.frontmatter.redirect) {
    // Redirect the user to another page
    return redirect(content.frontmatter.redirect, properties);
  } else {
    // Set the base branch
    properties.baseBranch = content.baseBranch;

    if (content.markdown) {
      const serialization = await mdxSerialize(content);

      if (serialization.error) {
        error = RenderError.serverError(properties);
      } else {
        source = serialization.source;
        content.headings = serialization.headings as unknown as HeadingNode[];
      }
    } else {
      error = RenderError.pageNotFound(properties);
    }
  }

  // Get the array of domains from the local filesystem & match a potential domain
  const domain =
    domains.find(
      ([, repository]) => repository === `${properties.owner}/${properties.repository}`,
    )?.[0] || null;

  return {
    props: {
      domain,
      properties: properties.toObject(),
      source,
      headings,
      content,
      error: error?.toObject() ?? null,
    },
    revalidate: 30,
  };
};
