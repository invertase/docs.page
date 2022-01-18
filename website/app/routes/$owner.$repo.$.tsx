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
    { rel: 'stylesheet', href: removeBackTicks }
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
    "twitter:card": "summary_large_image",
    "twiter:image:alt": props.data?.config?.name ?? '',
    "og:url": `https://docs.page/${props.data.owner}/${props.data.repo}${props.data.path ? `/${props.data.path}` : ''}`,
    "og:site_name": "docs.page",
    "og:title": props.data.frontmatter?.title ?? props.data?.config?.name ?? props.data.repo ?? 'docs.page',
    "theme-color": props.data.config?.theme ?? '',
    title: props.data.frontmatter?.title ?? props.data?.config?.name ?? props.data?.repo ?? 'docs.page',
    description: props.data.frontmatter?.description ?? '',
    "og:description": props.data.frontmatter?.description ?? '',
    "twitter:description": props.data.frontmatter?.description ?? '',
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
  return <div className="mt-32 max-w-5xl mx-auto px-4 lg:px-0" data-testid={'error-container'}>
    <ServerError title="An uncaught error was thrown" />;
    <Footer generic={true} />
  </div>
}
