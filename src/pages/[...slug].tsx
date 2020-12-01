import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import NextHead from 'next/head';
import NextRouter from 'next/router';
import NProgress from 'nprogress';
import DOMPurify from 'isomorphic-dompurify';

import mdxSerialize from 'next-mdx-remote/serialize';
import { Hydrate } from '../mdx';

import { ThemeStyles } from '../components/ThemeStyles';
import { Layout } from '../components/Layout';
import { ErrorBoundary } from '../components/ErrorBoundary';

import { ConfigContext } from '../config';
import { redirect, RenderError } from '../error';
import { SPLITTER, getSlugProperties, SlugProperties, SlugPropertiesContext } from '../properties';
import { ContentContext, getPageContent, PageContent } from '../content';
import { getDefaultBranch, getPullRequestMetadata } from '../github';

NProgress.configure({ showSpinner: false });
NextRouter.events.on('routeChangeStart', () => NProgress.start());
NextRouter.events.on('routeChangeComplete', () => NProgress.done());
NextRouter.events.on('routeChangeError', () => NProgress.done());

export default function Documentation({
  source,
  properties,
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { frontmatter, config } = page;

  return (
    <>
      <NextHead>
        <base href={properties.path} />
        <title>{frontmatter.title}</title>
        {!!frontmatter.description && <meta name="description" content={frontmatter.description} />}
      </NextHead>
      <ConfigContext.Provider value={config}>
        <SlugPropertiesContext.Provider value={properties}>
          <ContentContext.Provider value={page}>
            <ThemeStyles />
            <Layout>
              <ErrorBoundary>
                {page.type === 'html' && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(source),
                    }}
                  />
                )}
                {page.type !== 'html' && <Hydrate source={source} />}
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
    fallback: 'blocking',
  };
};

type StaticProps = {
  properties: SlugProperties;
  source?: string;
  page?: PageContent;
};

export const getStaticProps: GetStaticProps<StaticProps> = async ({ params }) => {
  const slug = params.slug as string[];

  // Anything with less than 2 parts to the slug is an invalid URL.
  // TODO: Uncomment in production
  // if (slug.length < 2) {
  //   return redirect('/');
  // }

  let source = null;
  let page: PageContent;

  // Extract the slug properties from the request.
  let properties: SlugProperties = getSlugProperties(params.slug as string[]);

  // If no ref was found in the slug, grab the default branch name
  // from the GQL API.
  if (!properties.ref) {
    const defaultBranch = await getDefaultBranch(properties.owner, properties.repository);

    if (!defaultBranch) {
      throw RenderError.repositoryNotFound(properties);
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

  if (!page) {
    throw RenderError.pageNotFound(properties);
  }

  if (page.frontmatter.redirect) {
    return redirect(page.frontmatter.redirect, properties);
  }

  try {
    if (page.type === 'html') {
      source = page.content;
    } else {
      source = await mdxSerialize(page.content, {
        mdxOptions: {
          rehypePlugins: [
            require('../../rehype-prism'), // Using local version to handle `react-live`
            require('../../rehype-prose'),
            require('rehype-slug'),
          ],
          remarkPlugins: [require('@fec/remark-a11y-emoji'), require('remark-admonitions')],
        },
      });
    }
  } catch (e) {
    throw RenderError.serverError(properties);
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
