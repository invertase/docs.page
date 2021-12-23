import { useHydratedMdx } from '@docs.page/client';
import { MetaFunction, useLoaderData, LinksFunction, useCatch } from 'remix';
import cx from 'classnames';

import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';
import components from '~/components/mdx';
import { DocumentationProvider } from '~/context';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';
import {
  docsLoader,
  DocumentationLoader,
  ThrownBundleError,
  ThrownError,
  ThrownNotFoundError,
} from '../loaders/documentation.server';
import docsearch from '../styles/docsearch.css';
import { ScrollSpy } from '~/components/ScrollSpy';
import { BadRequest, NotFound, ServerError } from '~/components/Errors';

export const loader = docsLoader;

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha' },
    { rel: 'stylesheet', href: docsearch },
    { rel: 'stylesheet', href: codeHikeStyles }
  ];
};

export const meta: MetaFunction = (props: { data?: DocumentationLoader }) => {
  // https://github.com/remix-run/remix/issues/1054
  if (!props.data) {
    return {
      title: '',
      description: '',
    };
  }

  return {
    title: props.data.frontmatter?.title ?? '',
    description: props.data.frontmatter?.description ?? '',
  };
};

export default function Page() {
  const data = useLoaderData<DocumentationLoader>();
  const MDX = useHydratedMdx({ code: data.code});
  console.log(data.code);

  return (
    <DocumentationProvider data={data}>
      <Theme />
      <Header />
      <div data-test-id={'documentation-provider'} className="max-w-8xl mx-auto">
        <div className="fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-45rem))] w-64">
          <Sidebar />
        </div>
        <div className="pt-10 pl-72">
          <div
            className={cx({
              'mr-52 pr-16': true,
            })}
          >
            <main
              className="prose dark:prose-invert max-w-none
              prose-code:font-fira prose-code:font-medium
            "
            >
              <MDX components={components} />
            </main>
            <Footer />
          </div>
          {!!data.headings && (
            <aside className="pt-10 px-8 fixed top-14 bottom-0 w-52 overflow-y-auto right-[max(0px,calc(50%-45rem))]">
              <ScrollSpy />
            </aside>
          )}
        </div>
      </div>
    </DocumentationProvider>
  );
}

// TODO handle me
export function CatchBoundary() {
  const e = useCatch<ThrownError>();
  let child: JSX.Element;

  if (e.status === 404) {
    child = <NotFound error={e as ThrownNotFoundError} />;
  } else if (e.status === 500) {
    child = <ServerError title="Internal server error" />;
  } else if (e.status === 400) {
    child = <BadRequest error={e as ThrownBundleError} />;
  } else {
    child = <ServerError title="Something went wrong" />;
  }

  return <div data-testid={'error-container'}>{child!}</div>;
}

export function ErrorBoundary() {
  
  return <ServerError title="An uncaught error was thrown" />
}
