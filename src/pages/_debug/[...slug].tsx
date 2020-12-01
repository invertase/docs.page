import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getPageContent, PageContent } from '../../content';
import { getSlugProperties, SlugProperties, SPLITTER } from '../../properties';
import { getDefaultBranch, getPullRequestMetadata } from '../../github';
import mdxSerialize from 'next-mdx-remote/serialize';
import { RepoInfo } from './components/RepoInfo';
import { Configuration } from './components/Configuration';
import { Error } from './components/Error';
import React from 'react';
import { RenderError } from './components/RenderError';
import { serializeError } from 'serialize-error';

// TODO type definitions
// import renderToString from "next-mdx-remote/render-to-string";
// import hydrate from "next-mdx-remote/hydrate";

export default function Debug({
  error,
  properties,
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="my-10 space-y-10">
      {!properties.ref && <Error>Repository not found</Error>}
      {!page && properties.ref && <Error>Page not found</Error>}

      <RepoInfo properties={properties} />
      {error && <RenderError error={error} />}
      {page && <Configuration config={page.config} />}
    </div>
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
  let properties: SlugProperties = getSlugProperties(params.slug as string[]);

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
  else if (/^[0-9]*$/.test(properties.ref)) {
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
      properties,
      source,
      page,
      error,
    },
    revalidate: 3,
  };
};
