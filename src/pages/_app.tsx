import type { AppProps } from 'next/app';

import 'nprogress/nprogress.css';
import 'remark-admonitions/styles/classic.css';
import 'react-medium-image-zoom/dist/styles.css';

import '../prism-theme.css';
import '../styles.css';
import syncTabs from '../scripts/sync-tabs';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
