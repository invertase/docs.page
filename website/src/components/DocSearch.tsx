import docsearch from "@docsearch/js";
import Head from "next/head";
import { useEffect, useImperativeHandle, useRef } from "react";
import "@docsearch/css/dist/style.css";

export type DocSearchProps = {
  appId: string;
  indexName: string;
  apiKey: string;
  forwardedRef?: React.ForwardedRef<DocSearchHandle>;
};

export type DocSearchHandle = {
  trigger(): void;
};

export default function DocSearch(props: DocSearchProps) {
  const { appId, indexName, apiKey, forwardedRef } = props;
  const container = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement | null>(null);

  useImperativeHandle(forwardedRef, () => ({
    trigger() {
      if (button.current) {
        button.current.click();
      }
    },
  }));

  useEffect(() => {
    if (!container.current) return;

    docsearch({
      container: container.current,
      appId,
      indexName,
      apiKey,
    });

    const mounted = container.current.firstElementChild;
    if (mounted) {
      button.current = mounted as HTMLButtonElement;
    }
  }, [apiKey, appId, indexName]);

  return (
    <>
      <Head>
        <link
          rel="preconnect"
          crossOrigin="anonymous"
          href={`https://${appId}-dsn.algolia.net`}
        />
      </Head>
      <div ref={container} className="hidden" />
    </>
  );
}
