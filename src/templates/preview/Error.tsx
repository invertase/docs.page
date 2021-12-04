import React from 'react';
import NextHead from 'next/head';

import { Footer } from '../homepage/Footer';

import { Title } from './Title';
import { ExternalLink, Link } from '../../components/Link';
import { QuickLinks } from '../error/QuickLinks';

export * from '../error/ErrorBoundary';

export function Error({
  statusCode,
  foundDocs,
}: {
  statusCode: number;
  foundDocs?: boolean;
}): JSX.Element {
  return (
    <>
      <NextHead>
        <meta key="noindex" name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />

        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
      </NextHead>
      <section className="mt-20 max-w-4xl mx-auto px-2">
        <Title statusCode={statusCode} />
        <div className="my-16 prose dark:prose-dark max-w-none">
          {statusCode === 500 && <ServerError />}
          {statusCode !== 500 && foundDocs ? <NotFound /> : <PageMissing />}
        </div>
        <QuickLinks />
        <Footer />
      </section>
    </>
  );
}

export function ServerError(): JSX.Element {
  return (
    <>
      <p>Something went wrong whilst building your preview.</p>
      <p>
        This could have happened because of an issue with your local Markdown content, or something
        internal. If you think that it is not a problem with your markdown, feel free to{' '}
        <ExternalLink href="https://github.com/invertase/docs.page/issues">
          report an issue
        </ExternalLink>
        .
      </p>
    </>
  );
}

export function PageMissing(): JSX.Element {
  return (
    <>
      <p>
        We found your <code>/docs</code> subdirectory, but not this specific route in your docs.
      </p>
      <p>
        If this error persists or you don't think this is the problem, feel free to{' '}
        <ExternalLink href="https://github.com/invertase/docs.page/issues">
          report an issue
        </ExternalLink>
        .
      </p>
    </>
  );
}

export function NotFound(): JSX.Element {
  return (
    <>
      <p>
        This could be because we couldn't find the <code>/docs</code> subdirectory, or{' '}
        <code>/docs/index.mdx</code> file in the directory you selected. Please check you're
        selecting the root of your project and not the <code>/docs</code> directory itself.
      </p>
      <p>
        If this error persists or you don't think this is the problem, feel free to{' '}
        <ExternalLink href="https://github.com/invertase/docs.page/issues">
          report an issue
        </ExternalLink>
        .
      </p>
    </>
  );
}
