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
import { useEffect, useState } from 'react';
import { PageNotFound, ServerError } from './components/Errors';
import { Footer } from './components/Footer';
import { DarkModeContext } from './context';

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
      NODE_ENV: process.env.NODE_ENV,
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

  const [darkMode, setDarkMode] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setDarkMode('dark');
    }
  }, []);

  return (
    <Document>
      <script
        dangerouslySetInnerHTML={{
          __html: `window.ENV = ${JSON.stringify(data?.ENV)}`,
        }}
      />
      <script async src="https://platform.twitter.com/widgets.js"></script>
      <DarkModeContext.Provider value={{ darkModeValue: darkMode, setDarkModeValue: setDarkMode }}>
        <Outlet />
      </DarkModeContext.Provider>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }): JSX.Element {
  console.error(error);
  return (
    <Document title="Error!">
      <ServerError title="Internal Server Error" />
    </Document>
  );
}

export function CatchBoundary(): JSX.Element {
  const e = useCatch();
  let child: JSX.Element;
  if (e.status === 404) {
    child = <PageNotFound />;
  } else {
    child = <ServerError title="Internal server error" />;
  }

  return (
    <Document title={`${e.status} ${e.statusText}`}>
      <div className="mx-auto mt-32 max-w-5xl px-4 lg:px-0" data-testid={'error-container'}>
        {child!}
        <Footer generic={true} />
      </div>
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
      <body className="font-inter overflow-x-hidden overflow-y-scroll dark:bg-zinc-900 dark:text-white">
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
