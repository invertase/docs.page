import Document, { Html, Head, Main, NextScript } from 'next/document';

import noflash from '../scripts/noflash';
import syncTabs from '../scripts/sync-tabs';

class _Document extends Document {
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

export default _Document;
