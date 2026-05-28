import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { prepareFileTreeInput } from "@pierre/trees";
import {
  FileTree,
  useFileTree,
  useFileTreeSelection,
} from "@pierre/trees/react";
import { File, Virtualizer } from "@pierre/diffs/react";
import { PaperCorner, paperCornerClipPath } from "./paper-corner";
import { Button } from "@/components/ui/button";
import sourcePaths from "./source-files.json";

const preparedSourceInput = prepareFileTreeInput(sourcePaths, {
  sort: "default",
});

const sourcePathSet = new Set<string>(sourcePaths);

export function Preview() {
  const [tab, setTab] = useState<"embedded" | "source">("embedded");
  const [client, setClient] = useState<boolean>(false);

  useEffect(() => {
    setClient(true);
  }, []);

  return (
    <div
      className="relative overflow-visible border-x border-border bg-transparent -mt-22 pb-32"
      style={{ clipPath: paperCornerClipPath("top-left") }}
    >
      <PaperCorner corner="top-left" />
      <div className="mx-auto flex max-w-8xl flex-col items-center justify-center py-16 space-y-8">
        <div className="border rounded-md p-px bg-periwinkle-950 flex items-center gap-1">
          <Button
            variant={tab === "embedded" ? "default" : "ghost"}
            onClick={() => setTab("embedded")}
            size="lg"
          >
            Documentation
          </Button>
          <Button
            variant={tab === "source" ? "default" : "ghost"}
            onClick={() => setTab("source")}
            size="lg"
          >
            Source Code
          </Button>
        </div>
        <div className="px-8 w-full">
          <div style={{ display: tab === "embedded" ? undefined : "none" }}>
            <Embedded />
          </div>
          <div style={{ display: tab === "source" ? undefined : "none" }}>
            {client && <Source />}
          </div>
        </div>
   
      </div>
      <div>
        <h2 className="text-center text-xl font-light">
          Trusted by more than 75,000{" "}
          <span className="text-primary">open-source</span> developers
        </h2>
      </div>
    </div>
  );
}

function Embedded() {
  return (
    <div className="h-[800px] bg-neutral-950 rounded-md overflow-hidden border">
      <iframe
        title="docs.page"
        src="https://use.docs.page"
        className="w-full h-full"
      />
    </div>
  );
}

const DEFAULT_FILE = "docs.json";

function resolveOpenPath(selectedPaths: readonly string[]): string {
  for (let index = selectedPaths.length - 1; index >= 0; index -= 1) {
    const path = selectedPaths[index];
    if (path && sourcePathSet.has(path)) {
      return path;
    }
  }

  return DEFAULT_FILE;
}

function resetScrollTop(element: HTMLElement) {
  element.scrollTop = 0;
}

function SourceFilePanel({
  path,
  contents,
}: {
  path: string;
  contents: string;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scroller = panelRef.current?.firstElementChild;
    if (!(scroller instanceof HTMLElement)) {
      return;
    }

    resetScrollTop(scroller);

    let frame = 0;
    let rafId = 0;

    const scheduleReset = () => {
      rafId = requestAnimationFrame(() => {
        resetScrollTop(scroller);
        frame += 1;

        if (frame < 4) {
          scheduleReset();
        }
      });
    };

    scheduleReset();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const scroller = panelRef.current?.firstElementChild;
    if (!(scroller instanceof HTMLElement)) {
      return;
    }

    resetScrollTop(scroller);

    const timeoutIds = [0, 50].map((delay) =>
      window.setTimeout(() => {
        resetScrollTop(scroller);
      }, delay),
    );

    return () => {
      for (const timeoutId of timeoutIds) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <div ref={panelRef} className="h-full min-h-0">
      <Virtualizer className="h-full min-h-0 overflow-y-auto">
        <File
          file={{
            name: path,
            contents,
          }}
          className="bg-transparent"
        />
      </Virtualizer>
    </div>
  );
}

function Source() {
  const [fileContent, setFileContent] = useState<{
    path: string;
    contents: string;
  } | null>(null);
  const cache = useRef<Record<string, string>>({});

  const { model } = useFileTree({
    flattenEmptyDirectories: true,
    preparedInput: preparedSourceInput,
    search: true,
    initialExpandedPaths: ["docs"],
    initialSelectedPaths: [DEFAULT_FILE],
  });

  const selectedPaths = useFileTreeSelection(model);
  const openPath = resolveOpenPath(selectedPaths);

  useEffect(() => {
    const cached = cache.current[openPath];

    if (cached) {
      setFileContent({ path: openPath, contents: cached });
      return;
    }

    setFileContent(null);

    const controller = new AbortController();

    fetch(`https://cdn.jsdelivr.net/gh/invertase/docs.page@HEAD/${openPath}`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load ${openPath}`);
        }

        return res.text();
      })
      .then((text) => {
        cache.current[openPath] = text;
        setFileContent({ path: openPath, contents: text });
      })
      .catch((error) => {
        if (controller.signal.aborted) {
          return;
        }

        const contents = `// Failed to load ${openPath}\n`;
        cache.current[openPath] = contents;
        setFileContent({ path: openPath, contents });
        console.error(error);
      });

    return () => {
      controller.abort();
    };
  }, [openPath]);

  return (
    <div className="h-[800px] overflow-hidden bg-neutral-950 p-2 grid grid-cols-[300px_minmax(0,1fr)] gap-2 border rounded-lg">
      <FileTree
        model={model}
        className="min-h-0 h-full overflow-hidden rounded-lg border py-2"
      />
      <div className="min-h-0 h-full overflow-hidden rounded-lg border">
        {fileContent && (
          <SourceFilePanel
            key={fileContent.path}
            path={fileContent.path}
            contents={fileContent.contents}
          />
        )}
      </div>
    </div>
  );
}
