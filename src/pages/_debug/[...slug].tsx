// TODO remove eslint disable once file complete
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useState } from 'react';
import NextHead from 'next/head';
import cx from 'classnames';
import Link from 'next/link';

import { DarkModeToggle } from '../../components/DarkModeToggle';
import { ExternalLink } from '../../components/Link';
import { Properties, SlugProperties } from '../../utils/properties';
import { IRenderError, RenderError } from '../../utils/error';
import { Frontmatter, getPageContent, HeadingNode, PageContent } from '../../utils/content';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { getPullRequestMetadata } from '../../utils/github';
import { mdxSerialize } from '../../utils/mdx-serialize';
import { useRouter } from 'next/router';

import { GitHub } from '../../components/Icons';
import { ProjectConfig } from '../../utils/projectConfig';

type Tab = 'general' | 'properties' | 'content' | 'config' | 'frontmatter';

const tabs: { [key in Tab]: string } = {
  general: 'General',
  properties: 'Properties',
  content: 'Content',
  config: 'Config',
  frontmatter: 'Frontmatter',
};

export default function DebugPage({
  properties,
  error,
  content,
}: InferGetStaticPropsType<typeof getStaticProps>): JSX.Element {
  const isFallback = useRouter().isFallback;
  const [tab, setTab] = useState<Tab>('general');

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
        <div className="flex h-16 max-w-4xl py-4 mx-auto">
          <div className="flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/docs-page-logo.png" alt="docs.page" className="max-h-full" />
          </div>
          <DarkModeToggle />
        </div>
      </header>
      <section className="max-w-4xl mx-auto mt-24">
        <h1 className="text-5xl font-extrabold dark:text-white">Debug Mode</h1>
        <div
          className={cx('my-6 h-8 transition-opacity', {
            'opacity-0': isFallback,
            'opacity-100': !isFallback,
          })}
        >
          {!isFallback && (
            <>
              <StatusButton successText="No errors" failedText="Errors found" value={!error} />

              <StatusButton
                successText="Valid config"
                failedText="Invalid config"
                value={content?.flags.hasConfig}
              />

              {!content.flags.isFork && (
                <button className="px-3 py-1 mr-2 text-sm text-white bg-green-500 rounded-lg">
                  Forked
                </button>
              )}

              <StatusButton
                successText="Indexed"
                failedText="Not indexed"
                value={!content?.config.noindex}
              />
            </>
          )}
        </div>
        <div className="lg:hidden">
          <div className="mt-6">
            <label htmlFor="selected-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="selected-tab"
              name="selected-tab"
              className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            >
              {Object.entries(tabs).map(([key, value]) => (
                <option key={key}>{value}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="mt-6">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px space-x-8 dark:text-white">
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
        <div className="py-8 dark:text-white">
          {tab === 'general' && <GeneralTab properties={properties} />}
          {tab === 'properties' && <PropertiesTab properties={properties} />}
          {tab === 'content' && <ContentTab properties={content.markdown} />}
          {tab === 'config' && <ConfigTab properties={content.config} />}
          {tab === 'frontmatter' && <FrontMatterTab properties={content.frontmatter} />}
        </div>
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
    <div className="flex px-4 py-4 border-b dark:border-gray-700">
      <div className="w-1/2 font-semibold">{title}</div>
      <div className="w-1/2">
        {!!href && <ExternalLink href={href}>{children}</ExternalLink>}
        {!href && children}
      </div>
    </div>
  );
}

function StatusButton({
  value,
  successText,
  failedText,
}: {
  value: string | boolean;
  successText: string;
  failedText: string;
}) {
  const activeStyle = value ? 'bg-green-500' : 'bg-red-500';
  const title = value ? successText : failedText;
  return (
    <button className={`px-3 py-1 mr-2 text-sm text-white ${activeStyle} rounded-lg`}>
      {title}
    </button>
  );
}

function GeneralTab({ properties }: { properties: SlugProperties }) {
  return (
    <div className="">
      <Row title="Owner">
        <code>invertase</code>
        <code>{properties?.owner}</code>
      </Row>
      <Row title="Repository">
        <code>melos</code>
        <code>{properties?.repository}</code>
      </Row>
    </div>
  );
}

function PropertiesTab({ properties }: { properties: SlugProperties }) {
  return (
    <div className="">
      <Row title="Ref">
        <code>docs-testing</code>
        <code>{properties.ref}</code>
      </Row>
      <Row title="Ref Type">
        <code>branch</code>
        <code>{properties.refType}</code>
      </Row>
      <Row title="Hash">
        <code>{properties?.hash}</code>
      </Row>
      <Row title="Github Url">
        <Link href={properties?.githubUrl} passHref>
          <code className="flex space-x-4 cursor-pointer">
            <GitHub size={26} className="text-black dark:text-white hover:opacity-80" />
            <span>{properties?.githubUrl}</span>
          </code>
        </Link>
      </Row>
      <Row title="Base Branch">
        <StatusButton successText="Active" failedText="InActive" value={properties.isBaseBranch} />
      </Row>
    </div>
  );
}

function ContentTab({ properties }: { properties: string }) {
  return <div className="">{properties}</div>;
}

function ConfigTab({ properties }: { properties: ProjectConfig }) {
  const mapItems = $ => {
    if (!$.length) return 'n/a';

    return $.map(([title]) => title).join(', ');
  };

  return (
    <div className="">
      <Row title="Logo">
        <code>{properties.logo || 'n/a'}</code>
      </Row>
      <Row title="Name">
        <code>{properties.name}</code>
      </Row>
      <Row title="Default Layout">{/* <code>{properties.defaultLayout}</code> */}</Row>
      <Row title="Header Depth">
        <code>{properties.headerDepth}</code>
      </Row>
      <Row title="Theme">
        <code className="flex space-x-4">
          {/* <span>{properties.theme}</span> */}
          <button className="p-3" style={{ backgroundColor: properties.theme }}></button>
        </code>
      </Row>
      <Row title="Navigation">{mapItems(properties.navigation)}</Row>
      <Row title="Sidebar">{mapItems(properties.sidebar)}</Row>
      <Row title="Google Analytics">
        <StatusButton
          successText="Active"
          failedText="InActive"
          value={properties.googleAnalytics}
        />
      </Row>
      <Row title="Zoom Images">
        <StatusButton successText="Active" failedText="InActive" value={properties.zoomImages} />
      </Row>
      <Row title="No Index">
        <StatusButton successText="Active" failedText="InActive" value={properties.noindex} />
      </Row>
    </div>
  );
}

function FrontMatterTab({ properties }: { properties: Frontmatter }) {
  return (
    <div className="">
      <Row title="Title">{/* <code>{properties.title}</code> */}</Row>
      <Row title="Description">{/* <code>{properties.description}</code> */}</Row>

      <Row title="Redirect">{/* <code>{properties.redirect || 'n/a'}</code> */}</Row>
      <Row title="layout">{/* <code>{properties.layout || 'n/a'}</code> */}</Row>
      <Row title="Image">{/* <code>{properties.image || 'n/a'}</code> */}</Row>
      <Row title="Table of contents">
        {/* <StatusButton
          successText="Active"
          failedText="InActive"
          value={properties.tableOfContents}
        /> */}
      </Row>
      <Row title="Sidebar">
        {/* <StatusButton successText="Active" failedText="InActive" value={properties.sidebar} /> */}
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
