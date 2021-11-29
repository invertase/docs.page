import React from 'react';
import NextHead from 'next/head';

import { ErrorType, IRenderError } from '../../utils/error';
import { Footer } from '../homepage/Footer';

import { Title } from './Title';
import { ExternalLink } from '../../components/Link';
import { QuickLinks } from '../error/QuickLinks';

export * from '../error/ErrorBoundary';

export function Error(error: IRenderError): JSX.Element {
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
        <Title statusCode={error.statusCode} />
        <div className="my-16 prose dark:prose-dark max-w-none">
          {error.statusCode === 500 && <ServerError {...error} />}
          {error.statusCode !== 500 && <NotFound {...error} />}
        </div>
        <QuickLinks />
        <Footer />
      </section>
    </>
  );
}

export function ServerError({ properties }: IRenderError): JSX.Element {
  return (
    <>
      <p>Something went wrong whilst building your preview.</p>
      {!!properties && (
        <p>
          The could have happened because of an issue with your local Markdown content, or something
          internal. If you think that it is not a problem with your markdown, feel free to{' '}
          <ExternalLink href="https://github.com/invertase/docs.page/issues">
            report an issue
          </ExternalLink>
          .
        </p>
      )}
    </>
  );
}

export function NotFound({ properties, errorType }: IRenderError): JSX.Element {
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
          <ExternalLink href="https://github.com/new">GitHub</ExternalLink>.
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
      </>
    );
  }

  return null;
}
