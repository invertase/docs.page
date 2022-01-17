import { MetaFunction, useLoaderData, LinksFunction, useCatch } from 'remix';

import { Footer } from '~/components/Footer';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';
import removeBackTicks from '../styles/remove-backticks.css';
import codeblocks from '../styles/codeblocks.css';
import {
  docsLoader,
  DocumentationLoader,
  ThrownBundleError,
  ThrownError,
  ThrownNotFoundError,
} from '../loaders/documentation.server';
import docsearch from '../styles/docsearch.css';
import { BadRequest, NotFound, ServerError } from '~/components/Errors';
import Documentation from '~/components/Documentation';

//@ts-ignore
export function headers({ loaderHeaders }) {
  return {
    'cache-control': loaderHeaders.get('cache-control'),
  };
}

export const loader = docsLoader;

export let links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha' },
    { rel: 'stylesheet', href: docsearch },
    { rel: 'stylesheet', href: codeblocks },
    { rel: 'stylesheet', href: codeHikeStyles },
    { rel: 'stylesheet', href: removeBackTicks },
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
  console.log(props.data);

  return {
    title: props.data.frontmatter?.title ?? '',
    description: props.data.frontmatter?.description ?? '',
  };
};

export default function Page() {
  const data = useLoaderData<DocumentationLoader>();
  // return <p>{data.code}</p>
  return <Documentation data={data} />;
}

// handling errors
export function CatchBoundary() {
  const e = useCatch<ThrownError>();
  console.log(e);

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

  return (
    <div data-testid={'error-container'}>
      {child!}
      <Footer />
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError title="An uncaught error was thrown" />;
}
