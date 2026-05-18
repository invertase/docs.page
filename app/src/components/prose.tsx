import { useCallback, useMemo, useRef } from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { DocsIrRenderer } from "@/components/docs-ir-renderer";
import { CodeGroupProvider } from "./mdx/code-group";
import { TabsProvider } from "./mdx/tabs";
import { useSourceUrl } from "@/hooks/use-source-url";
import { Button } from "./ui/button";
import { RiGithubFill } from "@remixicon/react";

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
          <div className="space-y-4 text-secondary-foreground [&>p]:leading-7 [&>p]:opacity-90">
            <DocsIrRenderer
              root={bundle.docIr}
              takeNextHeadingId={takeNextHeadingId}
            />
          </div>
        </CodeGroupProvider>
      </TabsProvider>
      <Actions />
    </main>
  );
}

function Actions() {
  const source = useSourceUrl();

  return (
    <div className="flex justify-end gap-2 mb-2 mt-4">
      {source ? (
        <Button variant="ghost" asChild>
          <a href={source} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <RiGithubFill />
            <span>Edit this page</span>
          </a>
        </Button>
      ) : null}
    </div>
  );
}
