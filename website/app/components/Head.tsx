import { Helmet } from 'react-helmet';
import { DocumentationLoader } from '~/loaders/documentation.server';
import codeHikeStyles from '@code-hike/mdx/dist/index.css';

export const Head = ({ data }: { data: DocumentationLoader }) => {
  const favicon = getFavicon({ data });
  return (
    <Helmet>
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
