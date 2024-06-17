import { usePageContext } from '~/context';

export function Scripts() {
  const ctx = usePageContext();
  const scripts = usePageContext().bundle.config.scripts;

  if (!scripts) {
    return null;
  }

  return (
    <>
      {scripts.googleTagManager && (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${scripts.googleTagManager}`}
        />
      )}
      {scripts.googleAnalytics && (
        <script
          async
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments)}
            gtag('js', new Date()); gtag('config', '${scripts.googleAnalytics}');
          `,
          }}
        />
      )}
      {'domain' in ctx && !!ctx.domain && !!scripts.plausible && (
        <script
          async
          defer
          data-domain={ctx.domain}
          src={
            typeof scripts.plausible === 'boolean'
              ? 'https://plausible.io/js/plausible.js'
              : scripts.plausible
          }
        />
      )}
    </>
  );
}
