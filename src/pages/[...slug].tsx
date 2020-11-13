import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Error from "next/error";
import Head from "next/head";
import A2A from "a2a";

// TODO type definitions
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import mdxComponents from "../mdx";

import { ThemeStyles } from "../components/ThemeStyles";
import { Layout } from "../components/Layout";
import { ErrorBoundary } from "../components/ErrorBoundary";

import { ConfigContext } from "../config";
import {
  SPLITTER,
  getSlugProperties,
  SlugProperties,
  SlugPropertiesContext,
} from "../properties";
import { ContentContext, getPageContent, PageContent } from "../content";
import { getDefaultBranch, getPullRequestMetadata } from "../github";

export default function Documentation({
  source,
  properties,
  page,
  error,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (error) {
    return <div className="text-red-500">{JSON.stringify(error)}</div>;
  }

  if (!source) {
    return <Error statusCode={404} />;
  }
  const { frontmatter, config } = page;

  return (
    <>
      <Head>
        <base href={properties.path} />
        <title>{frontmatter.title}</title>
        {!!frontmatter.description && (
          <meta name="description" content={frontmatter.description} />
        )}
      </Head>
      <ConfigContext.Provider value={config}>
        <SlugPropertiesContext.Provider value={properties}>
          <ContentContext.Provider value={page}>
            <ThemeStyles />
            <Layout>
              <ErrorBoundary>
                {hydrate(source, { components: mdxComponents })}
              </ErrorBoundary>
            </Layout>
          </ContentContext.Provider>
        </SlugPropertiesContext.Provider>
      </ConfigContext.Provider>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

type ErrorProps = {
  message: string;
  stack: string;
  code: string;
};

type StaticProps = {
  properties: SlugProperties;
  source?: string;
  page: PageContent;
  error?: ErrorProps;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params,
}) => {
  const slug = params.slug as string[];

  let error: ErrorProps = null;
  let properties: SlugProperties;
  let source = null;
  let page: PageContent;

  // Anything with less than 2 parts to the slug is an invalid URL.
  if (slug.length < 2) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  // Extract the slug properties from the request.
  properties = getSlugProperties(params.slug as string[]);

  // If no branch was found in the slug, grab the default branch name
  // from the GQL API.
  if (!properties.ref) {
    const [error, response] = await getDefaultBranch(
      properties.owner,
      properties.repository
    );

    if (error) {
      // todo convert error - owner/repo not found
    } else {
      const { repository } = response;
      // Assign the default branch
      properties.ref = repository.branch.name;
      properties.base = `${properties.base}${SPLITTER}${properties.ref}`;
    }
  }
  // If the ref looks like a PR
  else if (/^[0-9]*$/.test(properties.ref)) {
    const metadata = await getPullRequestMetadata(
      properties.owner,
      properties.repository,
      parseInt(properties.ref)
    );

    if (metadata) {
      properties.owner = metadata.owner;
      properties.repository = metadata.repository;
      properties.ref = metadata.ref;
    }
  }

  page = await getPageContent(properties);

  if (page) {
    try {
      source = await renderToString(page.content, {
        components: mdxComponents,
      });
    } catch (e) {
      // TODO handle server rendering fail - such as trying to render a full HTML document
      console.log("GOT ERROR", e);
      error = {
        message: e?.message ?? "An unknown error ocurred",
        stack: e?.stack,
        code: e?.code,
      };
    }
  }

  return {
    props: {
      properties,
      source,
      page,
      error,
    },
    revalidate: 30,
  };
};
