import { MetaFunction, LinksFunction, useCatch } from 'remix';
import { detect } from 'detect-browser';

import { Footer } from '~/components/Footer';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';
import { ThrownBundleError } from '../loaders/documentation.server';
import { BadRequest, PreviewNotFound, ServerError } from '~/components/Errors';
import { GitHub } from '~/components/Icons';
import {
  PreviewModeContext,
  useDirectorySelector,
  usePollLocalDocs,
} from '~/utils/local-preview-mode';
import removeBackTicks from '../styles/remove-backticks.css';
import codeblocks from '../styles/codeblocks.css';

import Documentation from '~/components/Documentation';

export function headers(): Record<string, string> {
  return {
    'docs-page-preview': 'true',
  };
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: codeHikeStyles },
    { rel: 'stylesheet', href: removeBackTicks },
    { rel: 'stylesheet', href: codeblocks },
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css' },
  ];
};

export const meta: MetaFunction = () => {
  return {
    title: 'docs.page Local Preview Mode' ?? '',
    description: '',
  };
};

export default function LocalPreview(): JSX.Element {
  const { select, handles, configHandle, pending, error: directoryError } = useDirectorySelector();
  const [data, urls, pollErrorCode] = usePollLocalDocs(handles, configHandle, 500);
  if (directoryError) {
    return <PreviewNotFound error="" />;
  }
  if (pending || !handles || !data || !data.code) {
    return <LandingPage onSelect={select} />;
  }
  // TODO handle 400 errors
  if (pollErrorCode) {
    return <PreviewNotFound error="" />;
  }

  return (
    <PreviewModeContext.Provider value={{ enabled: true, onSelect: select, imageUrls: urls }}>
      <Documentation data={data!} />
    </PreviewModeContext.Provider>
  );
}

function LandingPage({ onSelect }: { onSelect: () => void }): JSX.Element {
  const browser = detect();

  return (
    <div className="dark:text-white">
      <section className="items-center py-16 px-4 text-center lg:py-32 lg:text-left">
        <div className="mx-auto max-w-6xl tracking-wider">
          <div className="mb-4 flex items-center justify-center space-x-4 lg:justify-between">
            <div className="flex items-center justify-start space-x-4">
              <h3 className="font-anton text-4xl">docs.page</h3>
              <a
                href="https://github.com/invertase/docs.page"
                className="text-gray-700 transition-colors duration-100 hover:text-black dark:text-gray-300 dark:hover:text-white"
              >
                <GitHub size={40} />
              </a>
              <h3 className="italic">Local Preview Mode (Beta)</h3>
            </div>
          </div>
          <h1 className=" font-anton mt-40 mb-4 bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-center text-2xl text-transparent dark:from-gray-100 dark:via-gray-300 dark:to-gray-200 lg:text-5xl">
            Preview from your machine, with{' '}
            <span className="bg-gradient-to-br from-red-600 to-black bg-clip-text text-transparent dark:from-yellow-200 dark:to-red-400">
              hot reload.
            </span>{' '}
            <span className="bg-gradient-to-br from-red-800 to-violet-500 bg-clip-text text-transparent"></span>
          </h1>
          {browser?.name === 'chrome' ? (
            <>
              <p suppressHydrationWarning className="pt-20 text-center">
                To get started, simply select the local directory containing your docs.json config
                file:
              </p>
              <div className="w-100% content-center items-center justify-center pt-8 text-center">
                <button
                  className="text-s cursor-pointer whitespace-nowrap rounded-lg bg-green-600 px-3 py-2 text-white shadow transition-colors hover:bg-green-500"
                  onClick={onSelect}
                >
                  Select Directory!
                </button>
              </div>
            </>
          ) : (
            <p suppressHydrationWarning className="pt-20 text-center">
              Local Preview Mode is only available on Chrome at the moment, sorry :(
            </p>
          )}
        </div>
        <PreviewModeContext.Provider value={{ enabled: true, onSelect: () => null, imageUrls: {} }}>
          <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0">
            <Footer />
          </div>
        </PreviewModeContext.Provider>
      </section>
    </div>
  );
}

// TODO handle me
export function CatchBoundary(): JSX.Element {
  const e = useCatch<any>();
  console.error(e);

  let child: JSX.Element;

  if (e.status === 404) {
    child = <PreviewNotFound error={''} />;
  } else if (e.status === 500) {
    child = <ServerError title="Internal server error" />;
  } else if (e.status === 400) {
    child = <BadRequest error={e as ThrownBundleError} />;
  } else {
    child = <ServerError title="Something went wrong" />;
  }

  return (
    <div data-testid={'error-container'}>
      {child!}
      <Footer />
    </div>
  );
}

export function ErrorBoundary(): JSX.Element {
  return <ServerError title="An uncaught error was thrown" />;
}
