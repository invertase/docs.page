import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0B0D0E" />
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
