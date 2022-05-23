import { Helmet } from 'react-helmet';
import { DocumentationLoader } from '~/loaders/documentation.server';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';

export const Head = ({ data }: { data: DocumentationLoader }) => {
  const favicon = getFavicon({ data });

  return (
    <Helmet>
      {data.config.googleAnalytics && (
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${data.config.googleAnalytics}`}
        ></script>
      )}
      {data.config.googleAnalytics && (
        <script type="text/javascript">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', '${data.config.googleAnalytics}');
            `}
        </script>
      )}
      {data.config.googleTagManager && (
        <script type="text/javascript">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${data.config.googleTagManager}');
          `}
        </script>
      )}
      <link rel="icon" href={favicon} />
      {data.config.experimentalMath && (
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.15.0/dist/katex.min.css"
        />
      )}
      {data.config.experimentalCodehike && (
        <link data-testid="codehike-styles" rel="stylesheet" href={codeHikeStyles} />
      )}
    </Helmet>
  );
};

const getFavicon = ({ data }: { data: DocumentationLoader }) => {
  let favicon = new URL('https://docs.page/favicon.ico?v=2');

  const logoConfig = data.config.logo || data.config.logoDark;
  const ref = encodeURIComponent(data.source.ref);

  if (logoConfig) {
    if (logoConfig.startsWith('http')) {
      favicon = new URL(logoConfig);
    } else if (logoConfig.startsWith('/')) {
      favicon = new URL(
        `https://raw.githubusercontent.com/${data.owner}/${data.repo}/${ref}/docs${logoConfig}`,
      );
    }
  }

  return favicon.href;
};
