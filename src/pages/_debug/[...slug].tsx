import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getPageContent, PageContent } from '../../content';
import {
  Properties,
  SlugPropertiesContext,
  SPLITTER,
} from '../../properties';
import { getDefaultBranch, getPullRequestMetadata } from '../../github';
import mdxSerialize from 'next-mdx-remote/serialize';
import { RepoInfo } from '../../templates/debug/RepoInfo';
import { Configuration } from '../../templates/debug/Configuration';
import { Error } from '../../templates/debug/Error';
import { RenderError } from '../../templates/debug/RenderError';
import { serializeError } from 'serialize-error';
import { Header } from '../../components/Header';
import NextHead from 'next/head';

export default function Debug({
  error,
  properties,
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <NextHead>
        <base href={properties.path} />
        <title>
          Debug Mode | {properties.owner}/{properties.repository}
        </title>
      </NextHead>
      <SlugPropertiesContext.Provider value={properties}>
        <Header />
        <div className="my-10 space-y-10">
          {!properties.ref && <Error>Repository not found</Error>}
          {!page && properties.ref && <Error>Page not found</Error>}

          <RepoInfo properties={properties} />
          {error && <RenderError error={error} />}
          {page && <Configuration config={page.config} />}
        </div>
      </SlugPropertiesContext.Provider>
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
  error?: object;
  source?: any;
  properties?: any;
  page?: any;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({ params }) => {
  let source = null;
  let error = null;
  let page: PageContent;

  // Extract the slug properties from the request.
  let properties = new Properties(params.slug as string[]);

  // If no ref was found in the slug, grab the default branch name
  // from the GQL API.
  if (!properties.ref) {
    const defaultBranch = await getDefaultBranch(properties.owner, properties.repository);

    if (!defaultBranch) {
      properties.ref = null;
    } else {
      // Assign the default branch to the ref
      properties.ref = defaultBranch;
      properties.base = `${properties.base}${SPLITTER}${properties.ref}`;
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
      properties.owner = metadata.owner;
      properties.repository = metadata.repository;
      properties.ref = metadata.ref;
    }
  }

  page = await getPageContent(properties);
  if (page) {
    try {
      if (page.type === 'html') {
        source = page.content;
      } else {
        source = await mdxSerialize(page.content, {
          mdxOptions: {
            rehypePlugins: [
              require('../../../rehype-prism'), // Using local version to handle `react-live`
              require('../../../rehype-prose'),
              require('rehype-slug'),
            ],
            remarkPlugins: [require('@fec/remark-a11y-emoji'), require('remark-admonitions')],
          },
        });
      }
    } catch (e) {
      error = serializeError(e);
    }
  } else {
    console.error('No page content found');
  }

  return {
    props: {
      properties: properties.toObject(),
      source,
      page,
      error,
    },
    revalidate: 3,
  };
};
