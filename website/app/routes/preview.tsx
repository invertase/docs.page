import { MetaFunction, LinksFunction, useCatch, ThrownResponse } from 'remix';
import { Footer } from '~/components/Footer';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';
import { ThrownBundleError } from '../loaders/documentation.server';
import { BadRequest, PreviewNotFound, ServerError } from '~/components/Errors';
import { PreviewModeContext } from '~/utils/preview';
import { usePollLocalDocs } from '~/utils/preview/local-preview-mode';
import { useDirectorySelector } from '~/utils/preview/directory-selector';
import extraStyles from '../styles/extra-styles.css';
import { LandingPage } from '../components/PreviewLandingPage';
import Documentation from '~/components/Documentation';

export function headers(): Record<string, string> {
  return {
    'docs-page-preview': 'true',
  };
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: codeHikeStyles },
    { rel: 'stylesheet', href: extraStyles },
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
  const dir = useDirectorySelector();
  const localDocs = usePollLocalDocs(dir.fileHandles, dir.configHandle, 500);

  if (dir.error || localDocs.error) {
    return <PreviewNotFound />;
  }
  if (dir.pending || !dir.fileHandles || !localDocs.data || !localDocs.data.code) {
    return <LandingPage onSelect={dir.select} />;
  }

  return (
    <PreviewModeContext.Provider
      value={{ enabled: true, onSelect: dir.select, imageUrls: localDocs.urls || {} }}
    >
      <Documentation data={localDocs.data!} />
    </PreviewModeContext.Provider>
  );
}

export function CatchBoundary(): JSX.Element {
  const e = useCatch<ThrownResponse<number>>();
  console.error(e);

  let child: JSX.Element;

  if (e.status === 404) {
    child = <PreviewNotFound />;
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
