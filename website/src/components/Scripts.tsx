import Script from "next/script";
import { usePageContext } from "~/context";
import { getEnvironment } from "~/env";

export function Scripts() {
  const ctx = usePageContext();
  const scripts = usePageContext().bundle.config.scripts;

  // We don't want to load the scripts in preview mode or in preview environments.
  if (ctx.preview) {
    return null;
  }

  return (
    <>
      {!!scripts?.googleTagManager && (
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${scripts.googleTagManager}`}
        />
      )}
      {!!scripts?.googleAnalytics && (
        <Script
          async
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date()); gtag('config', '${scripts.googleAnalytics}');
          `,
          }}
        />
      )}
      {"domain" in ctx && !!ctx.domain && !!scripts?.plausible && (
        <Script
          async
          defer
          data-domain={ctx.domain}
          src={
            typeof scripts.plausible === "boolean"
              ? "https://plausible.io/js/plausible.js"
              : scripts.plausible
          }
        />
      )}
    </>
  );
}
