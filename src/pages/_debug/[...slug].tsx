// TODO remove eslint disable once file complete
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import NextHead from 'next/head';
import cx from 'classnames';

import { DarkModeToggle } from '../../components/DarkModeToggle';
import { ExternalLink } from '../../components/Link';
import { Properties, SlugProperties } from '../../utils/properties';
import { IRenderError, RenderError } from '../../utils/error';
import { Frontmatter, getPageContent, HeadingNode, PageContent } from '../../utils/content';
import { ProjectConfig } from '../../utils/projectConfig';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getGitHubContents, getPullRequestMetadata } from '../../utils/github';
import { mdxSerialize } from '../../utils/mdx-serialize';
import { Pill } from '../../components/Pill';
import { useRouter } from 'next/router';

type Tab = 'overview' | 'content' | 'config' | 'frontmatter';

const tabs: { [key in Tab]: string } = {
  overview: 'Overview',
  content: 'Content',
  config: 'Config',
  frontmatter: 'Frontmatter',
};

export default function DebugPage({
  error,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const isFallback = useRouter().isFallback;
  const [tab, setTab] = useState<Tab>('overview');

  const onTabSwitch = useCallback((activeTab: Tab) => {
    setTab(activeTab);
  }, []);

  return (
    <>
      <NextHead>
        <title>Debug | docs.page</title>
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
      </NextHead>
      <header className="bg-gray-800 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto flex h-16 py-4">
          <div className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/docs-page-logo.png" alt="docs.page" className="max-h-full" />
          </div>
          <DarkModeToggle />
        </div>
      </header>
      <section className="max-w-4xl mx-auto mt-24">
        <h1 className="dark:text-white text-5xl font-extrabold">Debug Mode</h1>
        <div
          className={cx('my-6 h-8 transition-opacity', {
            'opacity-0': isFallback,
            'opacity-100': !isFallback,
          })}
        >
          {!isFallback && (
            <>
              <Pill type="error" disabled={!!error}>
                Page has Errors
              </Pill>
              {content?.flags.isFork === true && <Pill type="warn">Page is a fork</Pill>}
              <Pill type={content?.flags.isIndexable ? 'success' : 'warn'}>
                {content?.flags.isIndexable ? 'Indexable' : 'Not Indexable'}
              </Pill>
            </>
          )}
        </div>
        <div className="desktop:hidden">
          <div className="mt-6">
            <label htmlFor="selected-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="selected-tab"
              name="selected-tab"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
            >
              {Object.entries(tabs).map(([key, value]) => (
                <option key={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="hidden desktop:block">
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex dark:text-white space-x-8">
                {Object.entries(tabs).map(([key, value]) => (
                  <div
                    key={key}
                    className={cx(
                      'border-transparent whitespace-nowrap py-4 px-1 border-b-2 font-medium tracking-wide',
                      {
                        'text-blue-500 border-blue-500 hover:text-blue-400 hover:border-blue-400':
                          tab === key,
                        'hover:text-gray-500 hover:border-gray-500 dark:hover:text-gray-300 dark:hover:border-gray-300':
                          tab !== key,
                      },
                    )}
                    role="button"
                    tabIndex={0}
                    onClick={() => onTabSwitch(key as Tab)}
                  >
                    {value}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className="py-8 dark:text-white">{tab === 'overview' && <Overview />}</div>
      </section>
    </>
  );
}

function Row({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex py-4 px-4 border-b dark:border-gray-700">
      <div className="w-1/2 font-semibold">{title}</div>
      <div className="w-1/2">
        {!!href && <ExternalLink href={href}>{children}</ExternalLink>}
        {!href && children}
      </div>
    </div>
  );
}

function Overview() {
  return (
    <div className="">
      <Row title="Owner">
        <code>invertase</code>
      </Row>
      <Row title="Repository">
        <code>melos</code>
      </Row>
      <Row title="Ref">
        <code>docs-testing</code>
      </Row>
      <Row title="Ref Type">
        <code>branch</code>
      </Row>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

type StaticProps = {
  properties: SlugProperties;
  error?: IRenderError;
  content?: PageContent;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({ params }) => {
  const properties = new Properties(params.slug as string[]);
  let error: RenderError = null;
  let content: PageContent = null;

  const isPullRequest = properties.isPullRequest();

  if (isPullRequest) {
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

  content = await getPageContent(properties);

  if (!content) {
    error = RenderError.repositoryNotFound(properties);
  } else {
    if (!properties.ref) {
      properties.setBaseRef(content.baseBranch);
    }

    if (!content.markdown) {
      error = RenderError.pageNotFound(properties);
    } else {
      const serialization = await mdxSerialize(content);

      if (serialization.error) {
        error = RenderError.serverError(properties);
      } else {
        content.headings = serialization.headings as HeadingNode[];
      }
    }
  }

  return {
    props: {
      properties: properties.toObject(),
      error: error?.toObject() ?? null,
      content,
    },
  };
};

// import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
// import { getPageContent, PageContent } from '../../utils/content';
// import { Properties, SlugPropertiesContext, SPLITTER } from '../../utils/properties';
// import { getDefaultBranch, getPullRequestMetadata } from '../../utils/github';
// import mdxSerialize from 'next-mdx-remote/serialize';
// import { RepoInfo } from '../../templates/debug/RepoInfo';
// import { Configuration } from '../../templates/debug/Configuration';
// import { Error } from '../../templates/debug/Error';
// import { RenderError } from '../../templates/debug/RenderError';
// import { serializeError } from 'serialize-error';
// import { Header } from '../../components/Header';
// import NextHead from 'next/head';
// import { getHeadTags } from '../../hooks';
// import { MetaTags } from '../../templates/debug/MetaTags';

// export default function Debug({
//   error,
//   properties,
//   page,
// }: InferGetStaticPropsType<typeof getStaticProps>) {
//   let tags = null;
//   if (properties.ref) {
//     tags = getHeadTags(properties, page);
//   }

//   return (
//     <>
//       <NextHead>
//         <base href={properties.path} />
//         <meta name="robots" content="noindex" />
//         <title>
//           Debug Mode | {properties.owner}/{properties.repository}
//         </title>
//       </NextHead>
//       <SlugPropertiesContext.Provider value={properties}>
//         <Header />
//         <div className="my-10 space-y-10">
//           {!properties.ref && <Error>Repository not found</Error>}
//           {!page && properties.ref && <Error>Page not found</Error>}

//           <RepoInfo properties={properties} />

//           {error && <RenderError error={error} />}
//           {page && (
//             <>
//               <Configuration config={page.config} />
//               <MetaTags tags={tags} />
//             </>
//           )}
//         </div>
//       </SlugPropertiesContext.Provider>
//     </>
//   );
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   return {
//     paths: [],
//     fallback: 'blocking',
//   };
// };

// type StaticProps = {
//   error?: object;
//   source?: any;
//   properties?: any;
//   page?: any;
// };

// export const getStaticProps: GetStaticProps<StaticProps> = async ({ params }) => {
//   let source = null;
//   let error = null;
//   let page: PageContent;

//   // Extract the slug properties from the request.
//   let properties = new Properties(params.slug as string[]);
//   console.log(properties);

//   // If no ref was found in the slug, grab the default branch name
//   // from the GQL API.
//   if (!properties.ref) {
//     const defaultBranch = await getDefaultBranch(properties.owner, properties.repository);

//     if (!defaultBranch) {
//       properties.ref = null;
//     } else {
//       // Assign the default branch to the ref
//       properties.ref = defaultBranch;
//       properties.base = `${properties.base}${SPLITTER}${properties.ref}`;
//     }
//   }
//   // If the ref looks like a PR
//   else if (properties.isPullRequest()) {
//     const metadata = await getPullRequestMetadata(
//       properties.owner,
//       properties.repository,
//       parseInt(properties.ref),
//     );

//     // If a PR was found, update the property metadata
//     if (metadata) {
//       properties.owner = metadata.owner;
//       properties.repository = metadata.repository;
//       properties.ref = metadata.ref;
//     }
//   }

//   page = await getPageContent(properties);
//   if (page) {
//     try {
//       source = await mdxSerialize(page.content, {
//         mdxOptions: {
//           rehypePlugins: [
//             require('../../../rehype-prism'), // Using local version to handle `react-live`
//             require('../../../rehype-prose'),
//             require('rehype-slug'),
//           ],
//           remarkPlugins: [require('@fec/remark-a11y-emoji'), require('remark-admonitions')],
//         },
//       });
//     } catch (e) {
//       error = serializeError(e);
//     }
//   } else {
//     // TODO: Temporary workaround to check if repo exists if user has given a branch or PR
//     const defaultBranch = await getDefaultBranch(properties.owner, properties.repository);
//     if (!defaultBranch) properties.ref = null;
//     console.error('No page content found');
//   }

//   return {
//     props: {
//       properties: properties.toObject(),
//       source,
//       page,
//       error,
//     },
//     revalidate: 3,
//   };
// };
