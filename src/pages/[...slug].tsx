import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Error from "next/error";
import matter from "gray-matter";

// TODO type definitions
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import mdxComponents from "../mdx";

import { ThemeStyles } from "../components/ThemeStyles";
import { Layout, LayoutType, DEFAULT_LAYOUT } from "../components/Layout";

import {
  getConfigUrl,
  getFileUrl,
  getSlugProperties,
  safeGet,
  SlugProperties,
} from "../utils";
import { defaultConfig, mergeConfig, ConfigContext, Config } from "../config";

export default function Documentation({
  source,
  properties,
  config,
  frontmatter,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!source) {
    return <Error statusCode={404} />;
  }

  // TODO theme
  // TODO edit file

  return (
    <ConfigContext.Provider value={config}>
      <ThemeStyles />
      <header className="flex items-center justify-center py-5">
        {properties.owner}/{properties.repository}
      </header>
      <Layout type={frontmatter.layout || DEFAULT_LAYOUT}>
        <article className="prose mx-auto">
          {hydrate(source, { components: mdxComponents })}
        </article>
      </Layout>
    </ConfigContext.Provider>
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
  frontmatter: {
    title?: string;
    description?: string;
    layout?: LayoutType;
  };
  source?: string;
  config: Config;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({
  params,
}) => {
  const slug = params.slug as string[];

  let config: Config = defaultConfig;
  let frontmatter = {};
  let properties: SlugProperties;
  let source = null;

  // Only allow paths with an owner & repository
  if (slug.length >= 2) {
    properties = getSlugProperties(params.slug as string[]);

    // Get a project `config.json` file
    const configUrl = getConfigUrl(properties);
    const projectConfig = await safeGet<Config>(configUrl);
    if (projectConfig) {
      config = mergeConfig(projectConfig);
    }

    // Get a file
    const fileUrl = getFileUrl(config, properties);
    const file = await safeGet<string>(fileUrl);

    if (file) {
      let { content, data } = matter(file || "");
      frontmatter = data;
      source = await renderToString(content, { components: mdxComponents });
    }
  }

  return {
    props: {
      config,
      frontmatter,
      properties,
      source,
    },
    revalidate: 30,
  };
};
