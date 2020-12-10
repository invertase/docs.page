import Document, { Html, Head, Main, NextScript } from 'next/document';

import noflash from '../scripts/noflash';
import syncTabs from '../scripts/sync-tabs';

export default class CustomDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: noflash }} />
          <Main />
          <NextScript />
          <script
            dangerouslySetInnerHTML={{
              __html: syncTabs,
            }}
          />
        </body>
      </Html>
    );
  }
}
