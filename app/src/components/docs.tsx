import { AgentPanel } from "@/components/agent/panel";
import { AgentPanelProvider } from "@/components/agent/provider";
import { cn } from "@/lib/utils";
import { DocsStickyMetrics } from "./docs-sticky-metrics";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { PageMetadata } from "./page-metadata";
import { Prose } from "./prose";
import { TableOfContents } from "./table-of-contents";
import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

export function Docs() {
  return (
    <AgentPanelProvider>
      <div className="flex w-full min-w-0 max-w-full flex-1 flex-row">
        <ResizablePanelGroup
          orientation="horizontal"
          // Library injects `overflow: hidden` / `overflow: auto` inline, which
          // traps scroll in the panel and breaks `position: sticky` on the
          // nav. Override so the main column scrolls with the document.
          className="overflow-visible!"
          style={{ overflow: "visible" }}
        >
          <ResizablePanel
            id="docs-content-panel"
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-visible!"
            style={{ overflow: "visible" }}
          >
            <Header />
            <DocsStickyMetrics />
            <div className="relative mx-auto flex min-h-0 w-full min-w-0 max-w-8xl flex-1 flex-row items-start">
              <Navigation />
              <div className="min-w-0 flex-1 flex @container">
                <div
                  className={cn(
                    "min-w-0 flex-1 ps-6 pe-6 @3xl:ps-14 @3xl:pe-14 @5xl:ps-16 @5xl:pe-16",
                  )}
                >
                  <div>
                    <div className="space-y-6">
                      <PageMetadata />
                      <Prose />
                    </div>
                    <footer className="mt-12 py-12">
                      docs.page by invertase.io
                    </footer>
                  </div>
                </div>
                <div className="relative shrink-0 overflow-x-clip opacity-0 w-0 @3xl:overflow-x-visible @3xl:w-68 @3xl:opacity-100 transition-[width,opacity] duration-200 ease-out">
                  <div className="w-68 h-full">
                    <TableOfContents />
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
          <AgentPanel />
        </ResizablePanelGroup>
      </div>
    </AgentPanelProvider>
  );
}
