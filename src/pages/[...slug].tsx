import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Error from "next/error";
import Head from "next/head";

// TODO type definitions
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import mdxComponents from "../mdx";

import { ThemeStyles } from "../components/ThemeStyles";
import { Layout } from "../components/Layout";

import { GithubGQLClient } from "../utils";
import { defaultConfig, ConfigContext, Config } from "../config";
import {
  getSlugProperties,
  SlugProperties,
  SlugPropertiesContext,
} from "../properties";
import { Frontmatter, getPageContent, PageContent } from "../content";

export default function Documentation({
  source,
  properties,
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!source) {
    return <Error statusCode={404} />;
  }

  const { frontmatter, config } = page;

  return (
    <>
      <Head>
        <base href={properties.base} />
        <title>{frontmatter.title}</title>
        {!!frontmatter.description && (
          <meta name="description" content={frontmatter.description} />
        )}
      </Head>
      <ConfigContext.Provider value={config}>
        <SlugPropertiesContext.Provider value={properties}>
          <ThemeStyles />

          <Layout
            type={
              page.type === "html"
                ? "bare"
                : frontmatter.layout || config.defaultLayout
            }
          >
            {hydrate(source, { components: mdxComponents })}
          </Layout>
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

type StaticProps = {
  properties: SlugProperties;
  source?: string;
  page: PageContent;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params,
}) => {
  const slug = params.slug as string[];

  let config: Config = defaultConfig;
  let frontmatter = {};
  let properties: SlugProperties;
  let source = null;
  let page: PageContent;

  // Only allow paths with an owner & repository
  if (slug.length >= 2) {
    properties = getSlugProperties(params.slug as string[]);

    // If no branch was found in the slug, grab the default branch name
    // from the GQL API.
    if (!properties.branch) {
      const { repository } = await GithubGQLClient({
        query: `
          query RepositoryConfig($owner: String!, $repository: String!) {
            repository(owner: $owner, name: $repository) {
              branch: defaultBranchRef {
                name
              }
            }
          }
        `,
        owner: properties.owner,
        repository: properties.repository,
      });

      // Assign the default branch
      properties.branch = repository.branch?.name ?? "";
    }

    page = await getPageContent(properties);
    
    if (page) {
      try {
        source = await renderToString(page.content, {
          components: mdxComponents,
        });
      } catch (e) {
        console.log(e);
        // TODO pass error down...
      }
    }
  }

  return {
    props: {
      properties,
      source,
      page,
    },
    revalidate: 30,
  };
};
