import { useEffect, useState } from "react";

const scripts: Record<string, Promise<void>> = {};

function loadScript(src: string): Promise<void> {
  if (!scripts[src]) {
    scripts[src] = new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        resolve();
        return;
      }

      const range = document.createRange();
      range.selectNode(document.head);

      const script = document.createElement("script");
      script.src = src;
      script.async = true;

      script.addEventListener("load", () => resolve());
      script.addEventListener("error", () =>
        reject(new Error(`Failed to load script: ${src}`)),
      );

      range.insertNode(script);
    });
  }

  return scripts[src];
}

export function useExternalScript(src: string): boolean {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadScript(src)
      .then(() => setLoaded(true))
      .catch(console.error);
  }, [src]);

  return loaded;
}
