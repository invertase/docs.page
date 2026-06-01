import { DocsIrRenderer } from "@/components/docs-ir-renderer";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useSourceUrl } from "@/hooks/use-source-url";
import { RiGithubFill } from "@remixicon/react";
import { useCallback, useMemo, useRef } from "react";
import { CodeGroupProvider } from "./mdx/code-group";
import { TabsProvider } from "./mdx/tabs";
import { Button } from "./ui/button";

export function Prose() {
  const { bundle } = useDocPageContext();
  const headingIds = useMemo(
    () => bundle.headings.map((heading) => heading.id),
    [bundle.headings],
  );
  const headingIndexRef = useRef(0);

  headingIndexRef.current = 0;

  const takeNextHeadingId = useCallback(() => {
    const id = headingIds[headingIndexRef.current];
    headingIndexRef.current += 1;
    return id;
  }, [headingIds]);

  return (
    <main className="max-w-none">
      <TabsProvider>
        <CodeGroupProvider>
          <div className="space-y-4 text-foreground/90 [&>p]:leading-7 [&>p]:opacity-90">
            <DocsIrRenderer
              root={bundle.docIr}
              takeNextHeadingId={takeNextHeadingId}
            />
          </div>
        </CodeGroupProvider>
      </TabsProvider>
    </main>
  );
}
