import docsearch from "@docsearch/js";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

type Props = {
  appId: string;
  indexName: string;
  apiKey: string;
};

export type DocSearchHandle = {
  trigger(): void;
};

// This is a wrapper around the DocSearch library that allows us to trigger the search programmatically,
// without rendering the styled input the library provides.
const DocSearch = forwardRef<DocSearchHandle, Props>(
  ({ appId, indexName, apiKey }, ref) => {
    // A ref for the parent container where DocSearch will be mounted.
    const container = useRef<HTMLDivElement>(null);
    const button = useRef<HTMLButtonElement | null>(null);

    // Enable the parent component to trigger the search programmatically.
    useImperativeHandle(
      ref,
      () => {
        return {
          trigger() {
            if (button.current) {
              button.current.click();
            }
          },
        };
      },
      [],
    );

    useEffect(() => {
      if (!container.current) return;

      // Apply the DocSearch logic to the hidden element.
      docsearch({
        container: container.current,
        appId,
        indexName,
        apiKey,
      });

      // Get the direct child (button) of the container.
      const mounted = container.current.firstElementChild;

      // Store the button element in the ref.
      if (mounted) {
        button.current = mounted as HTMLButtonElement;
      }
    }, [apiKey, appId, indexName]);

    // Hide the element so we can trigger the search programmatically.
    return <div ref={container} className="hidden" />;
  },
);

export default DocSearch;
