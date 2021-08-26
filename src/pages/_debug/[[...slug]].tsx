import React from 'react';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextRouter, { useRouter } from 'next/router';
import union from 'lodash.union';
import NProgress from 'nprogress';

import domains from '../../../domains.json';
import repositories from '../../../repositories.json';

import { ConfigContext } from '../../utils/projectConfig';
import { redirect } from '../../utils/error';
import { Properties, SlugProperties, SlugPropertiesContext } from '../../utils/properties';
import {
  createDebugContent,
  getPageContent,
  HeadingNode,
  PageContent,
  PageContentContext,
} from '../../utils/content';
import { CustomDomain, CustomDomainContext } from '../../utils/domain';
import { mdxSerialize } from '../../utils/mdx-serialize';
import { Loading } from '../../templates/Loading';
import { isProduction } from '../../utils';
import { getRepositoryPaths } from '../../utils/github';
import { Environment, EnvironmentContext } from '../../utils/env';
import { Debug } from '../../templates/debug';
import { ThemeStyles } from '../../components/ThemeStyles';
import { Head } from '../../components/Head';
import {
  checkExistence,
  DebugModeContext,
  formatConfigData,
  formatRepoData,
  formatWarningDebugData,
  getUniquePaths,
  ITableData,
} from '../../utils/debug';
import { Layout } from '../../components/Layout';
import { ErrorBoundary } from '../../templates/error';

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
  repoData,
  configData,
  warningData,
  statusCode,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const { isFallback } = useRouter();
  if (isFallback) {
    return <Loading />;
  }

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
                  <ErrorBoundary>
                    <Layout>
                      <Debug
                        blameUrl={properties.blameUrl}
                        repoData={repoData}
                        configData={configData}
                        errors={errors}
                        warningData={warningData}
                        statusCode={statusCode}
                      ></Debug>
                    </Layout>
                  </ErrorBoundary>
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
    const promises = repositories.map(repository =>
      getRepositoryPaths(repository).then(paths => paths.map(p => '/_debug' + p)),
    );
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
  env: Environment;
  domain: CustomDomain;
  properties: SlugProperties;
  headings: HeadingNode[];
  source?: string;
  content?: PageContent;
  repoData: ITableData;
  configData: ITableData;
  warningData: ITableData;
  statusCode: number;
  errors?: {
    line?: number;
    column?: number;
    message?: string;
    start?: number;
    end?: number;
  }[];
};

export const getStaticProps: GetStaticProps<StaticProps> = async ctx => {
  const originalSlug = (ctx.params.slug || []) as string[];
  const owner = originalSlug[0];
  const name = originalSlug[1];
  const base = owner + '/' + name;
  const slug = originalSlug.slice(2);
  // Build a request instance from the query
  const properties = await Properties.build([owner, name, ...slug]);
  // Get the array of domains from the local filesystem & match a potential domain
  const domain =
    domains.find(
      ([, repository]) => repository === `${properties.owner}/${properties.repository}`,
    )?.[0] || null;

  const filePath = `${properties.source.ref}:docs/${properties.path}`;

  const existence = await checkExistence(owner, name, filePath);

  // return early if can't find something
  if (!existence.owner || !existence.name || !existence.path) {
    const statusCode = 404;
    const content = createDebugContent();

    const repoData = formatRepoData(properties, filePath, existence);
    const configData = formatConfigData(content, statusCode);
    const warningData = formatWarningDebugData([], statusCode);

    return {
      props: {
        env: (process.env.VERCEL_ENV ?? 'development') as Environment,
        domain,
        properties: properties.toObject(content),
        headings: [],
        content,
        errors: [],
        repoData,
        configData,
        warningData,
        statusCode,
      },
      revalidate: 30,
    };
  }

  let errors,
    warnings,
    statusCode,
    formattedFiles = null;

  statusCode = 200;

  const headings: HeadingNode[] = [];

  // Query GitHub for the content
  const content = await getPageContent(properties);

  if (content.frontmatter.redirect) {
    // Redirect the user to another page
    return redirect('_debug' + content.frontmatter.redirect, properties);
  } else {
    // get all files for sidebar:
    const serialization = await mdxSerialize(content);
    warnings = serialization.warnings;

    if (!!serialization.errors) {
      statusCode = 500;
      errors = serialization.errors;
      console.log(errors);
      
    } else {
      content.headings = serialization.headings as unknown as HeadingNode[];
    }
  }
  // make a sidebar to navigate between debug pages:
  formattedFiles = await getUniquePaths(base);
  content.config.sidebar = formattedFiles;

  // format data
  const repoData = formatRepoData(properties, filePath, existence);
  const configData = formatConfigData(content, statusCode);
  const warningData = formatWarningDebugData(warnings, statusCode);
  console.log({
    env: (process.env.VERCEL_ENV ?? 'development') as Environment,
    domain,
    properties: properties.toObject(content),
    headings,
    content,
    errors: errors ?? [],
    repoData,
    configData,
    warningData,
    statusCode,
  });
  
  return {
    props: {
      env: (process.env.VERCEL_ENV ?? 'development') as Environment,
      domain,
      properties: properties.toObject(content),
      headings,
      content,
      errors: errors ?? [],
      repoData,
      configData,
      warningData,
      statusCode,
    },
    revalidate: 30,
  };
};
