import { code } from "@streamdown/code";
import { Streamdown, defaultRemarkPlugins } from "streamdown";
import { useCallback, useMemo, useRef } from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import {
  DOC_STREAMDOWN_ALLOWED_TAGS,
} from "@/lib/streamdown/allowed-tags";
import { createDocsPageRehypePlugins } from "@/lib/streamdown/rehype-docs-page";
import {
  createStreamdownComponents,
} from "@/components/streamdown/streamdown-components";
import { TabsProvider } from "./mdx/tabs";

type MarkdownBlockProps = {
  markdown: string;
  takeNextHeadingId: () => string | undefined;
};

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
        <MarkdownBlock
          markdown={bundle.markdown}
          takeNextHeadingId={takeNextHeadingId}
        />
      </TabsProvider>
    </main>
  );
}

function MarkdownBlock({ markdown, takeNextHeadingId }: MarkdownBlockProps) {
  const remarkPlugins = useMemo(() => Object.values(defaultRemarkPlugins), []);
  const rehypePlugins = useMemo(
    () => createDocsPageRehypePlugins(DOC_STREAMDOWN_ALLOWED_TAGS),
    [],
  );

  const streamdownComponents = useMemo(
    () =>
      createStreamdownComponents({
        takeNextHeadingId,
        renderMarkdownBlock: (md) => (
          <MarkdownBlock markdown={md} takeNextHeadingId={takeNextHeadingId} />
        ),
      }),
    [takeNextHeadingId],
  );

  return (
    <Streamdown
      mode="static"
      allowedTags={DOC_STREAMDOWN_ALLOWED_TAGS}
      plugins={{ code }}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      components={streamdownComponents}
      linkSafety={{ enabled: false }}
      controls={{
        code: {
          download: false,
        },
      }}
      className="space-y-4 text-secondary-foreground [&>p]:leading-7 [&>p]:opacity-90"
    >
      {markdown}
    </Streamdown>
  );
}
