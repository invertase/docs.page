import { AgentPanel, AgentPanelProvider } from "./agent-panel";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { Prose } from "./prose";
import { TableOfContents } from "./table-of-contents";
import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";

export function Docs() {
  return (
    <AgentPanelProvider>
      <div className="flex w-full flex-1 flex-row">
        <ResizablePanelGroup
          orientation="horizontal"
          className="overflow-visible!"
        >
          <ResizablePanel
            id="docs-content-panel"
            className="flex min-w-0 flex-1 flex-col overflow-visible!"
          >
            <Header />
            <div className="relative mx-auto flex min-h-0 w-full max-w-8xl flex-1 flex-row">
              <Navigation />
              <div className="min-w-0 flex-1 flex @container">
                <div className="min-w-0 flex-1 pt-8 ps-4 pe-4 @3xl:ps-8 @3xl:pe-8 @5xl:ps-16 @5xl:pe-16">
                  <Prose />
                </div>
                <div className="relative shrink-0 overflow-x-clip opacity-0 w-0 @3xl:w-68 @3xl:opacity-100 transition-[width,opacity] duration-200 ease-out">
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
