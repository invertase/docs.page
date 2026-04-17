import { AgentPanel, useAgentPanel } from "./agent-panel";
import { Header } from "./header";
import { Navigation } from "./navigation";
import { Prose } from "./prose";
import { TableOfContents } from "./table-of-contents";

export function Docs() {
  const { open, setOpen } = useAgentPanel();

  return (
    <div className="flex w-full flex-1 flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <div className="relative mx-auto flex min-h-0 w-full max-w-8xl flex-1 flex-row">
          <Navigation />
          <div className="min-w-0 flex-1 flex @container">
            <div className="min-w-0 flex-1 pt-8 ps-4 pe-4 lg:ps-8 lg:pe-8 xl:ps-16 xl:pe-16">
              <Prose />
            </div>
            <div className="relative shrink-0 overflow-x-clip opacity-0 w-0 @3xl:w-68 @3xl:opacity-100 transition-[width,opacity] duration-200 ease-out">
              <div className="w-68 h-full">
                <TableOfContents />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AgentPanel open={open} onOpenChange={setOpen} />
    </div>
  );
}
