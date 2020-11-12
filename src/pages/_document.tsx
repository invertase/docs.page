import Document, { Html, Head, Main, NextScript } from "next/document";

import noflash from "../noflash";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <script dangerouslySetInnerHTML={{ __html: noflash }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
