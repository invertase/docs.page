import { useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_CONFIG,
  type PreviewConfig,
  safeParse,
} from "./config";
import { PreviewFrame } from "./PreviewFrame";
import { RepoFrame } from "./RepoFrame";
import { INITIAL_REPO_FILES, type RepoFileKey } from "./repoFileExamples";

const PARSE_DEBOUNCE_MS = 120;

export function HeroPreview() {
  const [repoFiles, setRepoFiles] =
    useState<Record<RepoFileKey, string>>(INITIAL_REPO_FILES);
  const [activeRepoFile, setActiveRepoFile] = useState<RepoFileKey>("docs.json");
  const [parsedConfig, setParsedConfig] = useState<PreviewConfig>(() => {
    const initial = safeParse(INITIAL_REPO_FILES["docs.json"]);
    return initial.config ?? DEFAULT_CONFIG;
  });
  const [parseError, setParseError] = useState<string | null>(null);
  const [activePagePath, setActivePagePath] = useState("/");

  const configSource = repoFiles["docs.json"];
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      const result = safeParse(configSource);
      if (result.config) {
        setParsedConfig(result.config);
      }
      setParseError(result.error);
    }, PARSE_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [configSource]);

  const knownHrefs = useMemo(
    () => new Set(parsedConfig.sidebar.flatMap((g) => g.pages.map((p) => p.href))),
    [parsedConfig],
  );

  useEffect(() => {
    if (knownHrefs.size === 0) return;
    if (!knownHrefs.has(activePagePath)) {
      const first = parsedConfig.sidebar[0]?.pages[0]?.href;
      if (first) setActivePagePath(first);
    }
  }, [knownHrefs, activePagePath, parsedConfig]);

  return (
    <section
      aria-label="Interactive docs.page preview"
      className="overflow-hidden rounded-md border border-border bg-card shadow-sm dark:bg-marketing-platform-inner-dark"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="h-[420px] min-h-0 sm:h-[460px] lg:h-[520px]">
          <RepoFrame
            activeFile={activeRepoFile}
            onSelectFile={setActiveRepoFile}
            content={repoFiles[activeRepoFile]}
            onContentChange={(value) => {
              setRepoFiles((prev) => ({ ...prev, [activeRepoFile]: value }));
            }}
            parseError={activeRepoFile === "docs.json" ? parseError : null}
          />
        </div>
        <div className="h-[420px] min-h-0 border-t border-border sm:h-[460px] lg:h-[520px] lg:border-l lg:border-t-0">
          <PreviewFrame
            config={parsedConfig}
            activePagePath={activePagePath}
            onActivatePage={setActivePagePath}
          />
        </div>
      </div>
    </section>
  );
}
