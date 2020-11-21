import type { AppProps } from "next/app";

import "nprogress/nprogress.css";
import "remark-admonitions/styles/classic.css";
import "../prism-theme.css";
import "../styles.css";

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
