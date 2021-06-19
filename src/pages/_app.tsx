import type { AppProps } from 'next/app';

import 'nprogress/nprogress.css';
import 'react-medium-image-zoom/dist/styles.css';
import 'highlight.js/styles/a11y-dark.css';

import '@docsearch/css/dist/style.css';
import '../styles.css';

export default function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  return <Component {...pageProps} />;
}
