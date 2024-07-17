import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useFetchers,
  useNavigation,
  useRouteError,
} from "@remix-run/react";

import { useEffect, useMemo, type ReactElement } from "react";
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css?url";
import zoomStyles from "react-medium-image-zoom/dist/styles.css?url";
import { ErrorLayout } from "./ErrorLayout";
import type { BundleErrorResponse } from "./api";
import styles from "./styles.css?url";

NProgress.configure({ showSpinner: false });

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  {
    rel: "stylesheet",
    href: zoomStyles,
  },
  {
    rel: "stylesheet",
    href: nProgressStyles,
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B0D0E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=auto"
        />
        <link href="/_docs.page/fa/fontawesome.min.css" rel="stylesheet" />
        <link href="/_docs.page/fa/brands.min.css" rel="stylesheet" />
        <link href="/_docs.page/fa/solid.min.css" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body
        className="antialiased bg-background text-gray-900 dark:text-gray-200"
        style={{
          textRendering: "optimizeLegibility",
        }}
      >
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const navigation = useNavigation();
  const fetchers = useFetchers();

  /**
   * This gets the state of every fetcher active on the app and combine it with
   * the state of the global transition (Link and Form), then use them to
   * determine if the app is idle or if it's loading.
   * Here we consider both loading and submitting as loading.
   * https://sergiodxa.com/tutorials/use-nprogress-in-a-remix-app
   */
  const state = useMemo<"idle" | "loading">(
    function getGlobalState() {
      const states = [
        navigation.state,
        ...fetchers.map((fetcher) => fetcher.state),
      ];
      if (states.every((state) => state === "idle")) return "idle";
      return "loading";
    },
    [navigation.state, fetchers]
  );

  useEffect(() => {
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    if (state === "loading") NProgress.start();
    // when the state is idle then we can to complete the progress bar
    if (state === "idle") NProgress.done();
  }, [state]);

  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  let title = "Something went wrong";
  let description = "An unexpected error occurred.";

  const body = (children: ReactElement) => (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
              if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.setAttribute('data-theme', 'dark');
              }`,
        }}
      />
      {children}
    </>
  );

  if (isRouteErrorResponse(error)) {
    const isBundleError = error.data !== null && typeof error.data === "object";

    if (isBundleError) {
      return body(<ErrorLayout error={error.data as BundleErrorResponse} />);
    }

    if (error.status === 404) {
      title = "Page not found";
      description = "The page you were looking for could not be found.";
    }
  }

  return body(<ErrorLayout title={title} description={description} />);
}
