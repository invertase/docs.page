import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextHead from 'next/head';
import NextRouter, { useRouter } from 'next/router';
import NProgress from 'nprogress';
import { MDXRemoteSerializeResult } from '@invertase/next-mdx-remote/dist/types';

import { Hydrate } from '../mdx';

import { ThemeStyles } from '../components/ThemeStyles';
import { Layout } from '../components/Layout';

import Homepage from '../templates/homepage';
import { Error, ErrorBoundary } from '../templates/error';
import { Loading } from '../templates/Loading';

import { ConfigContext } from '../utils/projectConfig';
import { IRenderError, redirect, renderError, RenderError } from '../utils/error';
import { Properties, SlugProperties, SlugPropertiesContext } from '../utils/properties';
import { getPageContent, HeadingNode, PageContent, PageContentContext } from '../utils/content';
import { getPullRequestMetadata } from '../utils/github';
import { CustomDomain, CustomDomainContext } from '../utils/domain';
import { getHeadTags } from '../utils/html';
import { mdxSerialize } from '../utils/mdx-serialize';
import { getHost, isProduction } from '../utils';
import { readFileSync } from 'fs';
import path from 'path';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', NProgress.start);
NextRouter.events.on('routeChangeComplete', NProgress.done);
NextRouter.events.on('routeChangeError', NProgress.done);

export default function Documentation(
  props: InferGetStaticPropsType<typeof getStaticProps>,
): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <Loading />;
  }

  const { page, error, properties, content, domain, source } = props;

  if (error) {
    return <Error {...error} />;
  }

  if (page) {
    return <Homepage />;
  }

  const tags = getHeadTags(properties, content);

  return (
    <>
      <NextHead>{tags}</NextHead>
      <CustomDomainContext.Provider value={domain}>
        <ConfigContext.Provider value={content.config}>
          <SlugPropertiesContext.Provider value={properties}>
            <PageContentContext.Provider value={content}>
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
  // Always pre-render the homepage.
  const paths = [`/${getHost()}`];

  // Since this call can be fairly large, only run it on production
  // and let the development pages fallback each time.
  if (isProduction()) {
    // const repositories = getRepositoriesList();
    // paths = [...paths, ...(await getRepositoriesPaths(repositories))];
    // console.info(`- gathered ${paths.length} static pages.`);
  }

  return {
    paths,
    fallback: true,
  };
};

type StaticProps = {
  page?: string;
  domain?: CustomDomain;
  properties?: SlugProperties;
  headings?: HeadingNode[];
  source?: MDXRemoteSerializeResult;
  content?: PageContent;
  error?: IRenderError;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ctx => {
  const host = getHost();
  const headings: HeadingNode[] = [];
  let source = null;
  let properties: Properties;
  let customDomain: CustomDomain = null;

  const params = (ctx.params.slug || []) as string[];
  const domain = params[0];
  let [, ...slug] = params;

  // When a request is caught by the `beforeFiles` rewrite, the `afterFiles` rewrite
  // also picks it up, so we need to manually override the slug.
  if (slug.length === 1 && slug[0] === host) {
    slug = [];
  }

  // If the domain is the root host, show the homepage
  if (domain === host && slug.length === 0) {
    return {
      props: {
        page: 'homepage',
      },
      revalidate: 30,
    };
  }

  // if (domain == host && slug.length === 1) {
  // Handle custom paths (e.g. `https://docs.page/about`);
  // }

  // If host is docs.page/localhost
  if (domain === host) {
    const [organization, repository] = slug;

    // Ensure both a org and repo exists.
    if (!organization || !repository) {
      return renderError(RenderError.invalidRequest());
    }

    properties = new Properties(slug);
  } else {
    // Request is from a custom domain
    const domains = JSON.parse(
      readFileSync(path.join(process.cwd(), 'domains.json'), 'utf-8'),
    ) as Array<[string, string]>;

    // Match the host with the domain
    const match = domains.find(item => item[0] === domain);

    // If no match, the domain is not enabled
    if (!match) {
      return renderError(RenderError.invalidDomain(domain));
    }

    customDomain = match[0];
    const [organization, repository] = match[1].split('/');
    properties = new Properties([organization, repository, ...slug]);
  }

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

  const content = await getPageContent(properties);

  if (!content) {
    // If there is no content, the repository is not found
    return renderError(RenderError.repositoryNotFound(properties));
  } else if (content.frontmatter.redirect) {
    // Redirect the user to another page
    return redirect(content.frontmatter.redirect, properties);
  } else {
    // At this point there is a repository, however there still might not be a file for the path

    // If no property ref has been set, assign the base branch (usually main or master)
    if (!properties.ref) {
      properties.setBaseRef(content.baseBranch);
    }

    if (content.markdown) {
      const serialization = await mdxSerialize(content);

      if (serialization.error) {
        return renderError(RenderError.serverError(properties));
      } else {
        source = serialization.source;
        content.headings = serialization.headings as unknown as HeadingNode[];
      }
    } else {
      return renderError(RenderError.pageNotFound(properties));
    }
  }

  return {
    props: {
      domain: customDomain,
      properties: properties.toObject(),
      source,
      headings,
      content,
    },
    revalidate: 30,
  };
};
