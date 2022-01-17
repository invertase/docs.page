import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from 'remix';
import type { LinksFunction } from 'remix';

import tailwind from './styles/tailwind.css';
import { STORAGE_KEY } from './components/DarkModeToggle';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import nProgressStyles from 'nprogress/nprogress.css';
import { useTransition } from 'remix';
import { useEffect } from 'react';

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Anton&display=block' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=block',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=block',
    },
    { rel: 'stylesheet', href: nProgressStyles },
    { rel: 'stylesheet', href: tailwind },
  ];
};

export function loader() {
  return {
    ENV: {
      MSW_ENABLED: process.env.MSW_ENABLED,
    },
  };
}
NProgress.configure({ showSpinner: false });

export default function App(): JSX.Element {
  const data = useLoaderData();

  const transition = useTransition();
  useEffect(() => {
    // when the state is idle then we can to complete the progress bar
    if (transition.state === 'idle') NProgress.done();
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else NProgress.start();
  }, [transition.state]);

  return (
    <Document>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
        }}
      />
      <Outlet />
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  console.error(error);
  return (
    <Document title="Error!">
      <div>
        <h1>There was an error</h1>
        <p>{error.message}</p>
        <hr />
        <p>Hey, developer, you should replace this with what you want your users to see.</p>
      </div>
    </Document>
  );
}

export function CatchBoundary(): JSX.Element {
  const caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = <p>Oops! Looks like you tried to visit a page that you do not have access to.</p>;
      break;
    case 404:
      message = <p>Oops! Looks like you tried to visit a page that does not exist.</p>;
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <h1>
        {caught.status}: {caught.statusText}
      </h1>
      {message}
    </Document>
  );
}

function Document({ children, title }: { children: React.ReactNode; title?: string }) {
  const location = useLocation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body className="overflow-y-scroll font-inter dark:bg-zinc-900 dark:text-white">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (localStorage["${STORAGE_KEY}"] === 'dark' || (!("${STORAGE_KEY}" in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.setProperty('color-scheme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.setProperty('color-scheme', 'light');
              }
            `,
          }}
        />
        {children}
        {location.pathname !== '/preview' && <ScrollRestoration />}
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
