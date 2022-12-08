import { MetaFunction, useLoaderData, LinksFunction, useCatch } from 'remix';

import { Footer } from '~/components/Footer';

import extraStyles from '../styles/extra-styles.css';
import codeblocks from '../styles/codeblocks.css';
import {
  docsLoader,
  DocumentationLoader,
  ThrownBundleError,
  ThrownError,
  ThrownNotFoundError,
} from '../loaders/documentation.server';
import docsearch from '../styles/docsearch.css';
import reactMediumImage from 'react-medium-image-zoom/dist/styles.css';
import { BadRequest, NotFound, ServerError } from '~/components/Errors';
import Documentation from '~/components/Documentation';
import { Head } from '~/components/Head';
import { getSocialImage } from '~/utils';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';
import { DocumentationProvider, DomainProvider } from '~/context';

//@ts-ignore
export function headers({ loaderHeaders }) {
  return {
    'cache-control': loaderHeaders.get('cache-control'),
  };
}

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@docsearch/css@alpha' },
    { rel: 'stylesheet', href: codeHikeStyles },
    { rel: 'stylesheet', href: docsearch },
    { rel: 'stylesheet', href: codeblocks },
    { rel: 'stylesheet', href: extraStyles },
    { rel: 'stylesheet', href: reactMediumImage },
  ];
};

export const loader = docsLoader;

export const meta: MetaFunction = (props: { data?: DocumentationLoader }) => {
  // https://github.com/remix-run/remix/issues/1054
  if (!props.data) {
    return {
      title: '',
      description: '',
    };
  }

  const socialPreviewImage = getSocialImage(props.data);
  const title =
    props.data.frontmatter?.title || props.data?.config?.name || props.data.repo || 'docs.page';

  return {
    'twitter:card': 'summary_large_image',
    'twitter:image': socialPreviewImage,
    'og:image': socialPreviewImage,
    'twiter:image:alt': props.data?.config?.name ?? '',
    'og:url': `https://docs.page/${props.data.owner}/${props.data.repo}${
      props.data.path ? `/${props.data.path}` : ''
    }`,
    'og:site_name': 'docs.page',
    'og:title': title,
    'theme-color': props.data.config?.theme ?? '',
    title,
    description: props.data.frontmatter?.description ?? '',
    'og:description': props.data.frontmatter?.description ?? '',
    'twitter:description': props.data.frontmatter?.description ?? '',
    'twitter:title': title,
    'twitter:text:title': title,
  };
};

export default function Page() {
  const data = useLoaderData<DocumentationLoader>();
  return (
    <>
      <DomainProvider data={data}>
        <DocumentationProvider data={data}>
          <Head data={data} />
          <Documentation data={data} />
        </DocumentationProvider>
      </DomainProvider>
    </>
  );
}

// handling errors
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

  return (
    <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0" data-testid={'error-container'}>
      {child!}
      <Footer generic={true} />
    </div>
  );
}

export function ErrorBoundary() {
  return (
    <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0" data-testid={'error-container'}>
      <ServerError title="An uncaught error was thrown" />
      <Footer generic={true} />
    </div>
  );
}
