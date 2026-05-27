import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#040406" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lexend:wght@100..900&family=Outfit:wght@100..900&family=Roboto+Slab:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link href="/_docs.page/fa/fontawesome.min.css" rel="stylesheet" />
        <link href="/_docs.page/fa/brands.min.css" rel="stylesheet" />
        <link href="/_docs.page/fa/solid.min.css" rel="stylesheet" />
      </Head>
      <body
        className="min-h-screen bg-background font-sans text-foreground antialiased"
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
