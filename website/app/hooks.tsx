import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

const scripts: Record<string, Promise<void>> = {};

function loadScript(src: string): Promise<void> {
  if (!scripts[src]) {
    scripts[src] = new Promise<void>((resolve, reject) => {
      // Check if the script is already in the document
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      // Create a range to insert the script
      const range = document.createRange();
      range.selectNode(document.head);

      // Create script element
      const script = document.createElement("script");
      script.src = src;
      script.async = true;

      // Event handlers
      script.addEventListener("load", () => resolve());
      script.addEventListener("error", () =>
        reject(new Error(`Failed to load script: ${src}`))
      );

      // Insert the script into the document head using the range
      range.insertNode(script);
    });
  }

  return scripts[src];
}

// Hook to load an external script if it hasn't been loaded yet.
export function useExternalScript(src: string): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadScript(src)
      .then(() => setLoaded(true))
      .catch(console.error);
  }, [src]);

  return loaded;
}

export function useInlineScript(script: string) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = "";
      const range = document.createRange();
      range.selectNode(ref.current);
      const fragment = range.createContextualFragment(script);
      ref.current!.appendChild(fragment);
    }
  }, [script]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: script }} />;
}
