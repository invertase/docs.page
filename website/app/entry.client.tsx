import { RemixBrowser } from "@remix-run/react";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
// import type { DocsPageContext } from "~/context";

// declare global {
//   interface Window {
//     __docsPage?: DocsPageContext;
//   }
// }

// // A list of base domains which can run this app in production.
// const DOMAINS = ["docs.page", "staging.docs.page"];

// if (window.__docsPage) {
//   const hostname = window.location.hostname;

//   // Check if the current hostname is a vanity domain (e.g. `:org.docs.page`).
//   const isVanityDomain =
//     hostname.includes(".docs.page") && !DOMAINS.includes(hostname);

//   // It's a custom domain if it's not a vanity domain and it's not one of the base domains.
//   const isCustomDomain = !isVanityDomain && !DOMAINS.includes(hostname);

//   const { owner, repository } = window.__docsPage;

//   // A vanity domain is a rewrite request.
//   if (isVanityDomain) {
//     const basename = `/${owner}`;

//     window.__remixContext.basename = basename;

//     // Remove the owner from the URL (since it's now part of the hostname).
//     window.__remixContext.url = window.__remixContext.url.replace(
//       `/${owner}`,
//       ""
//     );

//     console.log("Rewriting context for vanity domain: ", {
//       basename: window.__remixContext.basename,
//       url: window.__remixContext.url,
//     });
//   }
//   // A custom domain is a proxy request.
//   else if (isCustomDomain) {
//     console.log("Custom domain detected: ", { hostname, owner, repository });
//     const basename = `/${owner}/${repository}`;

//     // Set the base name to the owner and repository (e.g. `/invertase/docs.page`).
//     // window.__remixContext.basename = '';

//     // // Replace the URL which includes the repository with the correct URL.
//     // // For example: `/invertase/docs.page/configuration` -> `/configuration`.
//     // window.__remixContext.url = '/invertase/docs.page/configuration';

//     console.log("Rewriting context for custom domain: ", {
//       basename: window.__remixContext.basename,
//       url: window.__remixContext.url,
//     });
//   }
// }

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
