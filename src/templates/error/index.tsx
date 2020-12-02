import React, { ReactChild } from 'react';

import { SlugProperties } from '../../properties';
import { QuickLinks } from './QuickLinks';

export function RepositoryNotFound({ properties }: { properties: SlugProperties }) {
  const { owner, repository } = properties;

  return (
    <ErrorPage title="404?" subtitle="Repository Not Found">
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
    <ErrorPage title="404?" subtitle="Document Not Found">
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
    <ErrorPage title="500" subtitle="Whoops! Something went wrong">
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
    <ErrorPage title="404" subtitle="Page Not Found">
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

function ErrorPage({
  title,
  subtitle,
  children,
}: {
  title: String;
  subtitle?: String;
  children: ReactChild;
}) {
  return (
    <>
      <div className="p-6 max-w-2xl mx-auto my-24 border border-gray-700 rounded dark:text-white">
        <div>
          <h1 className="text-7xl font-semibold text-center leading-none opacity-50">{title}</h1>
          {subtitle && <h2 className="text-3xl font-semibold mb-6 text-center">{subtitle}</h2>}
          <p className="dark:text-gray-200">{children}</p>
        </div>
      </div>
      <QuickLinks />
    </>
  );
}
