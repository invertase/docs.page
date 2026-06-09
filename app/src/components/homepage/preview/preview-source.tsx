import { File, Virtualizer } from "@pierre/diffs/react";
import { prepareFileTreeInput } from "@pierre/trees";
import {
  FileTree,
  useFileTree,
  useFileTreeSelection,
} from "@pierre/trees/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import sourcePaths from "../source-files.json";

type MobileView = "tree" | "file";

const preparedSourceInput = prepareFileTreeInput(sourcePaths, {
  sort: "default",
});

const sourcePathSet = new Set<string>(sourcePaths);

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

function MobileViewTabs({
  view,
  onViewChange,
}: {
  view: MobileView;
  onViewChange: (view: MobileView) => void;
}) {
  const activeTabClass =
    "border-primary bg-transparent text-primary hover:bg-primary/10 hover:text-primary aria-expanded:bg-primary/10 aria-expanded:text-primary dark:border-primary dark:bg-transparent dark:hover:bg-primary/10";

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={view === "tree" ? "outline" : "ghost"}
        size="sm"
        onClick={() => onViewChange("tree")}
        className={cn("rounded-full font-light", view === "tree" && activeTabClass)}
      >
        Tree
      </Button>
      <Button
        type="button"
        variant={view === "file" ? "outline" : "ghost"}
        size="sm"
        onClick={() => onViewChange("file")}
        className={cn("rounded-full font-light", view === "file" && activeTabClass)}
      >
        Files
      </Button>
    </div>
  );
}

export function PreviewSource() {
  const isMobile = useIsMobile();
  const [mobileView, setMobileView] = useState<MobileView>("file");
  const previousOpenPathRef = useRef<string | null>(null);
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
    if (
      previousOpenPathRef.current !== null &&
      previousOpenPathRef.current !== openPath
    ) {
      setMobileView("file");
    }
    previousOpenPathRef.current = openPath;
  }, [openPath]);

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

  const showTree = !isMobile || mobileView === "tree";
  const showFile = !isMobile || mobileView === "file";

  return (
    <div
      className="flex h-[min(680px,75dvh)] flex-col overflow-hidden rounded-2xl border bg-black p-1.5 sm:h-[800px] sm:rounded-3xl sm:p-2 md:grid md:grid-cols-[minmax(0,300px)_minmax(0,1fr)] md:gap-2"
    >
      <div className="shrink-0 border-b px-2 py-1.5 md:hidden">
        <MobileViewTabs view={mobileView} onViewChange={setMobileView} />
      </div>
      {showTree && (
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border md:h-full md:flex-none">
          <FileTree
            model={model}
            className="min-h-0 h-full overflow-hidden py-2"
          />
        </div>
      )}
      {showFile && (
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border md:h-full">
          {fileContent && (
            <SourceFilePanel
              key={fileContent.path}
              path={fileContent.path}
              contents={fileContent.contents}
            />
          )}
        </div>
      )}
    </div>
  );
}