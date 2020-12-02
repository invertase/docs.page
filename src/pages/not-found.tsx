import React, { ReactChild } from 'react';
import { QuickLinks } from '../templates/error/QuickLinks';

function PageNotFound() {
  return (
    <ErrorPage title="404?" subtitle="Document Not Found">
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

export default PageNotFound;

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
          <h1 className="text-7xl font-semibold text-center opacity-50">{title}</h1>
          {subtitle && <h2 className="text-3xl font-semibold mb-6 text-center">{subtitle}</h2>}
          <p className="dark:text-gray-200">{children}</p>
        </div>
      </div>
      <QuickLinks />
    </>
  );
}
