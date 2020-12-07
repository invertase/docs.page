import React, { ReactChild } from 'react';
import NextHead from 'next/head';

import { ErrorType, IRenderError } from '../../error';

import { SlugProperties } from '../../properties';
import { QuickLinks } from './QuickLinks';

export * from './ErrorBoundary';

const ERROR_TYPES = {
  repo: { title: '404', subtitle: 'Repository Not Found' },
  document: { title: '404', subtitle: 'Document Not Found' },
  page: { title: '404', subtitle: 'Page Not Found' },
  server: { title: '500', subtitle: 'Whoops! Something Went Wrong' },
};

export function Error({ statusCode, errorType, properties }: IRenderError) {
  let child: React.ReactElement;

  if (errorType === ErrorType.repositoryNotFound) {
    child = <RepositoryNotFound properties={properties} />;
  } else if (errorType === ErrorType.pageNotFound) {
    child = <DocumentNotFound properties={properties} />;
  } else if (statusCode == 404) {
    child = <PageNotFound />;
  } else {
    child = <ServerError properties={properties} />;
  }

  return (
    <>
      <NextHead>
        <meta key="noindex" name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" />
      </NextHead>
      {child}
    </>
  );
}

export function RepositoryNotFound({ properties }: { properties: SlugProperties }) {
  const { owner, repository } = properties;

  return (
    <ErrorPage code="repo">
      <>
        The GitHub repository{' '}
        <a
          className="font-mono underline hover:opacity-75"
          target="_blank"
          href={`https://github.com/${owner}/${repository}`}
        >
          {owner}/{repository}
        </a>{' '}
        was not found. To get started, create a new repository on{' '}
        <a className="font-mono underline hover:opacity-75" href="https://github.com/new">
          GitHub
        </a>
        .
      </>
    </ErrorPage>
  );
}

export function DocumentNotFound({ properties }: { properties: SlugProperties }) {
  const { owner, repository, path } = properties;

  return (
    <ErrorPage code="document">
      <>
        The page,{' '}
        <a
          className="font-mono underline hover:opacity-75"
          target="_blank"
          href={`https://github.com/${owner}/${repository}/${path}`}
        >
          {path}
        </a>{' '}
        was not found in the{' '}
        <a
          className="font-mono underline hover:opacity-75"
          target="_blank"
          href={`https://github.com/${owner}/${repository}`}
        >
          {owner}/{repository}
        </a>{' '}
        repository. To get started, create a file called {path} on the{' '}
        <a
          className="font-mono underline hover:opacity-75"
          href="https://github.com/greghesp/testing/new/main"
        >
          GitHub Repo
        </a>
        .
      </>
    </ErrorPage>
  );
}

export function ServerError({ properties }: { properties?: SlugProperties }) {
  return (
    <ErrorPage code="server">
      <>
        Oh dear, looks like our cogs stopped working.
        {properties?.owner && properties?.repository && (
          <>
            <br />
            <br />
            It seems your documents failed to build. Try using our{' '}
            <a
              className="font-mono underline hover:opacity-75"
              target="_blank"
              href={`https://docs.page/_debug/${properties?.owner}/${properties?.repository}/${properties?.path}`}
            >
              debug tool
            </a>{' '}
            to identify the issue
          </>
        )}
        {!properties?.owner && !properties?.repository && (
          <>
            <br />
            <br />
            If you don't think this should have happened, you can always{' '}
            <a
              className="font-mono underline hover:opacity-75"
              target="_blank"
              href={`https://github.com/invertase/docs.page/issues`}
            >
              report an issue
            </a>
          </>
        )}
      </>
    </ErrorPage>
  );
}

export function PageNotFound() {
  return (
    <ErrorPage code="page">
      <>
        This is not the page you're looking for. Think there should be a page here?{' '}
        <a
          className="font-mono underline hover:opacity-75"
          target="_blank"
          href={`https://github.com/invertase/docs.page/issues`}
        >
          Report an issue
        </a>
      </>
    </ErrorPage>
  );
}

function ErrorPage({ children, code }: { code: String; children: ReactChild }) {
  return (
    <>
      <section className="py-16 lg:py-32 text-center lg:text-left space-y-32">
        <div className="max-w-5xl mx-auto tracking-wider">
          <h1 className="font-anton mb-4 text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-gray-100 via-gray-300  to-gray-200">
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
              {ERROR_TYPES[`${code}`].title}
            </span>
            <br />
            {ERROR_TYPES[`${code}`].subtitle}
          </h1>
        </div>
        <div className="px-4 lg:px-0 max-w-5xl mx-auto">
          <div className="mt-16 lg:flex items-center border rounded-lg p-12">
            <div className="flex-1 dark:text-white">
              <p className="text-lg font-thin px-3 ">{children}</p>
            </div>
          </div>
        </div>
        <div className="px-4 lg:px-0 max-w-5xl mx-auto">
          <QuickLinks />
        </div>
      </section>
    </>
  );
}
