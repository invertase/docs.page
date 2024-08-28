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

startTransition(() => {
  if (import.meta.env.PROD) {
    const hostname = window.location.hostname;

    // If we're not on one of the domains above, then we need to modify remix context so
    // that the app is aware of the correct base URL.
    if (
      (!DOMAINS.includes(hostname) || hostname.includes(".docs.page")) &&
      window.__docsPage
    ) {
      const { owner, repository } = window.__docsPage;
      const basename = `/${owner}/${repository}`;

      // Set the base name to the owner and repository (e.g. `/invertase/docs.page`).
      window.__remixContext.basename = basename;

      // Replace the URL which includes the repository with the correct URL.
      // For example: `/invertase/docs.page/configuration` -> `/configuration`.
      window.__remixContext.url = window.__remixContext.url.replace(
        basename,
        ""
      );
    }
  }

  hydrateRoot(
    document,
    <StrictMode>
      <RemixBrowser />
    </StrictMode>
  );
});
