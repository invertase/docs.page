import { useCallback, useMemo, useRef } from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { DocsIrRenderer } from "@/components/docs-ir-renderer";
import { TabsProvider } from "./mdx/tabs";

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
        <div className="space-y-4 text-secondary-foreground [&>p]:leading-7 [&>p]:opacity-90">
          <DocsIrRenderer
            root={bundle.docIr}
            takeNextHeadingId={takeNextHeadingId}
          />
        </div>
      </TabsProvider>
    </main>
  );
}
