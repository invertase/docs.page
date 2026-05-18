import dynamic from "next/dynamic";
import { AgentPanel } from "@/components/agent/panel";
import { AgentPanelProvider } from "@/components/agent/provider";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { Prose } from "./prose";
import { TableOfContents } from "./table-of-contents";
import { ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { PageMetadata } from "./page-metadata";
import { Footer } from "./footer";
import { Metadata } from "./metadata";
import { Scripts } from "./scripts";

const NProgress = dynamic(() => import("@/components/nprogress"), {
  ssr: false,
});

export function Docs() {
  return (
    <>
      <NProgress />
      <Metadata />
      <Scripts />
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
                  <div className="min-w-0 flex-1 pt-8 ps-6 pe-6 @3xl:ps-14 @3xl:pe-14 @5xl:ps-16 @5xl:pe-16">
                    <div className="space-y-12">
                      <PageMetadata />
                      <Prose />
                      <Footer />
                    </div>
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
    </>
  );
}
