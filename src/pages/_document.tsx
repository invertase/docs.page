import Document, { Html, Head, Main, NextScript } from 'next/document';

import darkMode from '../scripts/dark-mode';

export default class CustomDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="en">
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: darkMode }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
