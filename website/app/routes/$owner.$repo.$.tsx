import { useHydratedMdx } from '@docs.page/client';
import { MetaFunction, useLoaderData, LinksFunction, useCatch } from 'remix';
import cx from 'classnames';

import { Banner } from '~/components/Banner';
import { Footer } from '~/components/Footer';
import { Header } from '~/components/Header';
import { YouTube } from '~/components/mdx';
import { Sidebar } from '~/components/Sidebar';
import { Theme } from '~/components/Theme';
import { DocumentationProvider } from '~/context';

import components from '~/components/mdx';
import { docsLoader, DocumentationLoader, ThrownBundleError } from '../loaders/documentation.server';
import docsearch from '../styles/docsearch.css';

export const loader = docsLoader;

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha' },
    { rel: 'stylesheet', href: docsearch },
  ];
};

export const meta: MetaFunction = ({ data }: { data?: DocumentationLoader }) => {
  if (!data)
    return {
      title: '',
      description: '',
    };

  return {
    title: data.bundle.frontmatter.title || 'docs.page',
    description:
      data.bundle.frontmatter.description || 'Instant Open Source docs with zero configuration',
  };
};

export default function Page() {
  const data = useLoaderData<DocumentationLoader>();
  const Component = useHydratedMdx({ code: data.bundle.code });

  return (
    <DocumentationProvider data={data}>
      <Theme />
      <Header />
      <div className="max-w-8xl mx-auto">
        <div className="fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-45rem))] w-64">
          <Sidebar />
        </div>
        <div className="pt-10 pl-72">
          <div
            className={cx({
              'mr-52 pr-16': true,
            })}
          >
            <main className="prose max-w-none">
              <Component components={components} />
            </main>
            <Footer />
          </div>
          {/* {bundle.headings.length > 0 && (
            <aside className="pt-10 px-8 fixed top-14 bottom-0 w-52 overflow-y-auto right-[max(0px,calc(50%-45rem))]">
              <ul className="text-sm space-y-4">
                {bundle.headings.map(heading => (
                  <li
                    className={cx({
                      'font-semibold': false,
                    })}
                  >
                    <a href={`#${heading.id}`}>{heading.title}</a>
                  </li>
                ))}
              </ul>
            </aside>
          )} */}
        </div>
      </div>
    </DocumentationProvider>
  );
}

// TODO handle me
export function CatchBoundary() {
  const e = useCatch<ThrownBundleError>();

  let title;
  if (e.status === 404) {
    title = 'Page not found';
  } else if (e.status === 500) {
    title = 'Internal server error';
  } else if (e.status === 400) {
    title = 'Bad request';
  } else {
    title = 'Something went wrong.';
  }

  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
}

export function ErrorBoundary() {
  return <div>Error</div>;
}
