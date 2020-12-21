import type { AppProps } from 'next/app';

import 'nprogress/nprogress.css';
import 'react-medium-image-zoom/dist/styles.css';

import '../styles.css';

export default function CustomApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
