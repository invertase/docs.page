import Head from "next/head";
import { MARKETING_THEME_STORAGE_KEY } from "~/constants/links";
import { useInlineScript } from "~/hooks";

const title = "docs.page | Ship documentation, like you ship code";
const description =
  "Publish beautiful online documentation instantly, from your code editor using markdown and a public GitHub repository.";
const image = "https://docs.page/_docs.page/social-preview.png";

export function Site({ children }: { children: React.ReactNode }) {
  const scripts = useInlineScript(`<script>(() => {
    var key = ${JSON.stringify(MARKETING_THEME_STORAGE_KEY)};
    var stored = null;
    try { stored = localStorage.getItem(key); } catch (e) {}
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  })()</script>`);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
        <meta name="twitter:site" content="@invertaseio" />
      </Head>
      {scripts}
      <script
        defer
        data-domain="docs.page"
        src="https://plausible.io/js/script.js"
      />
      {children}
    </>
  );
}
