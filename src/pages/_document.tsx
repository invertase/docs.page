import Document, { Html, Head, Main, NextScript } from "next/document";

import noflash from "../noflash";
import syncTabs from "../sync-tabs";

class MyDocument extends Document {
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

export default MyDocument;
