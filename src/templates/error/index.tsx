import React from 'react';
import NextHead from 'next/head';

import { ErrorType, IRenderError } from '../../utils/error';
import { Footer } from '../homepage/Footer';

import { QuickLinks } from './QuickLinks';
import { Title } from './Title';
import { Link, ExternalLink } from '../../components/Link';
import { DarkModeToggle } from '../../components/DarkModeToggle';

export * from './ErrorBoundary';

export function Error(error: IRenderError): JSX.Element {
  return (
    <>
      <NextHead>
        <meta key="noindex" name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
      </NextHead>
      <section className="mt-20 max-w-4xl mx-auto px-2">
        <div className="text-center lg:text-left font-mono dark:text-white mb-10">
          <ExternalLink href="https://docs.page">
            <span className="mr-1 text-xl">←</span>Go to docs.page
          </ExternalLink>
        </div>
        <Title statusCode={error.statusCode} />
        <div className="my-16 prose dark:prose-dark max-w-none">
          {error.statusCode === 500 && <ServerError {...error} />}
          {error.statusCode !== 500 && <NotFound {...error} />}
        </div>
        <QuickLinks />
        <div className="mb-6">
          <DarkModeToggle />
        </div>
        <Footer />
      </section>
    </>
  );
}

export function ServerError({ properties }: IRenderError): JSX.Element {
  return (
    <>
      <p>Something went wrong whilst building the page.</p>
      <p>
        The could have happened because of an issue with the remote Markdown content, or something
        internal. To help fix this problem, you can{' '}
        <Link href={properties.debugUrl}>
          <a>debug</a>
        </Link>{' '}
        this page or{' '}
        <ExternalLink href="https://github.com/invertase/docs.page/issues">
          report an issue
        </ExternalLink>
        .
      </p>
    </>
  );
}

export function NotFound({ properties, errorType, domain }: IRenderError): JSX.Element {
  if (errorType === ErrorType.repositoryNotFound) {
    return (
      <>
        <p>
          The GitHub repository{' '}
          <ExternalLink href={properties.githubUrl}>
            {properties.owner}/{properties.repository}
          </ExternalLink>{' '}
          was not found.
        </p>
        <p>
          To get started, create a new repository on{' '}
          <ExternalLink href="https://github.com/new">GitHub</ExternalLink>. If you were expecting a
          If you were expecting a page to be here, you can{' '}
          <Link href={properties.debugUrl}>
            <a>debug</a>
          </Link>{' '}
          this page or{' '}
          <ExternalLink href="https://github.com/invertase/docs.page/issues">
            report an issue
          </ExternalLink>
          .
        </p>
      </>
    );
  }

  if (errorType === ErrorType.pageNotFound) {
    return (
      <>
        <p>
          No valid file matching the path <code>/{properties.path}</code> could be found.
        </p>
        <p>
          To get started, create a new <code>.mdx</code> file on{' '}
          <ExternalLink href={properties.createUrl}>GitHub</ExternalLink>. If you were expecting a
          page to be here, you can{' '}
          <Link href={properties.debugUrl}>
            <a>debug</a>
          </Link>{' '}
          this page or{' '}
          <ExternalLink href="https://github.com/invertase/docs.page/issues">
            report an issue
          </ExternalLink>
          .
        </p>
      </>
    );
  }

  return null;
}
