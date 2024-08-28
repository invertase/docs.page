import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import type { DocsPageContext } from "~/context";

declare global {
  interface Window {
    __docsPage?: DocsPageContext;
  }
}

// A list of base domains which can run this app in production.
const DOMAINS = ["docs.page", "staging.docs.page"];

if (import.meta.env.PROD && window.__docsPage) {
  const hostname = window.location.hostname;

  // // Check if the current hostname is a vanity domain (e.g. `:org.docs.page`).
  // const isVanityDomain = hostname.includes(".docs.page") && !DOMAINS.includes(hostname);

  // // It's a custom domain if it's not a vanity domain and it's not one of the base domains.
  // const isCustomDomain = !isVanityDomain && !DOMAINS.includes(hostname);

  // const { owner, repository } = window.__docsPage;

  // if (isVanityDomain) {
  //   console.log("Vanity domain detected: ", hostname);
  //   window.__remixContext.basename = "/";
  //   let url = `/${repository}`;

  // }

  if (hostname === "invertase.docs.page") {
    console.log('VANITY DOMAIN', window.__remixContext);
    // window.__remixContext.basename = "/";
    // window.__remixContext.url = "/supabase-js~docs-test/memes";
    // console.log('TESTING DONE', window.__remixContext);
  }

  // If we're not on one of the domains above, then we need to modify remix context so
  // that the app is aware of the correct base URL.
  else if (
    (!DOMAINS.includes(hostname) || hostname.includes(".docs.page")) &&
    window.__docsPage
  ) {
    const { owner, repository } = window.__docsPage;
    const basename = `/${owner}/${repository}`;

    console.log("Remix Context", window.__remixContext);

    // Set the base name to the owner and repository (e.g. `/invertase/docs.page`).
    window.__remixContext.basename = basename;

    // Replace the URL which includes the repository with the correct URL.
    // For example: `/invertase/docs.page/configuration` -> `/configuration`.
    window.__remixContext.url = window.__remixContext.url.replace(basename, "");

    console.log("Rewriting remix context for custom domain: ", {
      hostname,
      basename,
      url: window.__remixContext.url,
    });
  }
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
