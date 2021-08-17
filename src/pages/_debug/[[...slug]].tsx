import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextRouter, { useRouter } from 'next/router';
import union from 'lodash.union';
import NProgress from 'nprogress';

import domains from '../../../domains.json';
import repositories from '../../../repositories.json';

import { ConfigContext, SidebarItem } from '../../utils/projectConfig';
import { IRenderError, redirect } from '../../utils/error';
import { Properties, SlugProperties, SlugPropertiesContext } from '../../utils/properties';
import { getPageContent, HeadingNode, PageContent, PageContentContext } from '../../utils/content';
import { CustomDomain, CustomDomainContext } from '../../utils/domain';
import { mdxSerialize } from '../../utils/mdx-serialize';
import { Loading } from '../../templates/Loading';
import { isProduction } from '../../utils';
import { getRepositoryPaths } from '../../utils/github';
import { Environment, EnvironmentContext } from '../../utils/env';
import { Debug } from '../../templates/debug';
import { ThemeStyles } from '../../components/ThemeStyles';
import { Head } from '../../components/Head';
import { DebugModeContext } from '../../utils/debug';
import { Layout } from '../../components/Layout';
import { IWarning } from '../../utils/warning';
import { hasArrowFunction } from '../../mdx/plugins/remark-component-check';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', NProgress.start);
NextRouter.events.on('routeChangeComplete', NProgress.done);
NextRouter.events.on('routeChangeError', NProgress.done);

export default function Documentation({
  env,
  domain,
  properties,
  content,
  errors,
  files,
  warnings,
  statusCode,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <Loading />;
  }

  const sidebarData = files;
  content.config.sidebar = sidebarData;

  return (
    <>
      <EnvironmentContext.Provider value={env}>
        <CustomDomainContext.Provider value={domain}>
          <ConfigContext.Provider value={content.config}>
            <SlugPropertiesContext.Provider value={properties}>
              <PageContentContext.Provider value={content}>
                <DebugModeContext.Provider value={true}>
                  <Head />
                  <ThemeStyles />
                  <Layout>
                    <Debug
                      warnings={warnings}
                      blameUrl={properties.blameUrl}
                      properties={properties}
                      errors={errors}
                      content={content}
                      statusCode={statusCode}
                    ></Debug>
                  </Layout>
                </DebugModeContext.Provider>
              </PageContentContext.Provider>
            </SlugPropertiesContext.Provider>
          </ConfigContext.Provider>
        </CustomDomainContext.Provider>
      </EnvironmentContext.Provider>
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

interface ISerializationProps {
  line: string;
  column: string;
  src: string;
  start: number;
  end: number;
  message: string;
}

type StaticProps = {
  env: Environment;
  domain: CustomDomain;
  properties: SlugProperties;
  headings: HeadingNode[];
  source?: string;
  content?: PageContent;
  error?: IRenderError;
  errors?: ISerializationProps[];
  files: SidebarItem[];
  warnings: IWarning[];
  statusCode: number;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ctx => {
  const originalSlug = (ctx.params.slug || []) as string[];
  const owner = originalSlug[0];
  const name = originalSlug[1];
  const base = owner + '/' + name;

  // get all files for sidebar
  function formatFileName(p: string): SidebarItem {
    return ['/docs' + p.slice(base.length + 1), p.slice(base.length + 1)];
  }
  const files = await getRepositoryPaths(base);
  const uniqueFiles = Array.from(
    new Set(files.map(path => (path.slice(path.length - 1) === '/' ? path : path + '/'))),
  );
  const formattedFiles = uniqueFiles.map(formatFileName);

  const slug = originalSlug.slice(2);
  let source,
    errors,
    warnings,
    statusCode = null;
  const headings: HeadingNode[] = [];

  // Build a request instance from the query
  const properties = await Properties.build([owner, name, ...slug]);

  // Query GitHub for the content
  const content = await getPageContent(properties);

  if (!content) {
    // If there is no content, the repository is not found
    statusCode = 404;
  } else if (content.frontmatter.redirect) {
    // Redirect the user to another page
    return redirect(content.frontmatter.redirect, properties);
  } else {
    if (content.markdown) {
      const serialization = await mdxSerialize(content);
      warnings = serialization.warnings;
      if (!!serialization.errors) {
        statusCode = 500;
        errors = serialization.errors;
      } else {
        source = serialization.source;
        content.headings = serialization.headings as unknown as HeadingNode[];
      }
    } else {
      statusCode = 404;
    }
  }

  // Get the array of domains from the local filesystem & match a potential domain
  const domain =
    domains.find(
      ([, repository]) => repository === `${properties.owner}/${properties.repository}`,
    )?.[0] || null;

  return {
    props: {
      env: (process.env.VERCEL_ENV ?? 'development') as Environment,
      domain,
      properties: properties.toObject(content),
      source: source ?? null,
      headings,
      content,
      errors: errors ?? [],
      files: formattedFiles,
      warnings: warnings,
      statusCode,
    },
    revalidate: 30,
  };
};
