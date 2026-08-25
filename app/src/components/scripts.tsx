import Script from "next/script";
import { useDocPageContext } from "@/hooks/use-doc-page-context";

export function Scripts() {
  const ctx = useDocPageContext();
  const scripts = ctx.bundle.config.scripts;

  // We don't want to load the scripts in preview mode or in preview environments.
  if (ctx.route.requestMode === "preview") {
    return null;
  }

  // `googleTagManager` accepts either a bare container ID or an object which
  // also carries a site verification token, so read the ID out of both shapes.
  const googleTagManager = scripts?.googleTagManager;
  const googleTagManagerId =
    typeof googleTagManager === "string"
      ? googleTagManager
      : googleTagManager?.id;

  return (
    <>
      {/* Google Tag Manager */}
      {!!googleTagManagerId && (
        <>
          <Script
            id="gtm-script"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${googleTagManagerId}');
              `,
            }}
          />
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* Google Analytics - Only load directly if not using GTM */}
      {!!scripts?.googleAnalytics && !googleTagManagerId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${scripts.googleAnalytics}`}
          />
          <Script
            id="ga-script"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${scripts.googleAnalytics}');
              `,
            }}
          />
        </>
      )}

      {"domain" in ctx && !!ctx.domain && !!scripts?.plausible && (
        <Script
          async
          defer
          data-domain={ctx.domain}
          src={
            typeof scripts.plausible === "boolean"
              ? "https://plausible.io/js/script.js"
              : scripts.plausible
          }
        />
      )}
    </>
  );
}
