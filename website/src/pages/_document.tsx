import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0B0D0E" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=auto"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap"
          rel="stylesheet"
        />
        <link href="/_docs.page/fa/fontawesome.min.css" rel="stylesheet" />
        <link href="/_docs.page/fa/brands.min.css" rel="stylesheet" />
        <link href="/_docs.page/fa/solid.min.css" rel="stylesheet" />
      </Head>
      <body
        className="antialiased bg-background text-gray-900 dark:text-gray-200"
        style={{
          textRendering: "optimizeLegibility",
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
