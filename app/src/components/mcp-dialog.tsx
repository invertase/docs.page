import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { getMcpEndpointUrl } from "@/lib/docs-paths";

export function useMcpDialog() {
  const ctx = useContext(Context);

  if (!ctx) {
    throw new Error("useMcpDialog must be used within an McpDialogProvider");
  }

  return ctx;
}

export function McpDialog(props: PropsWithChildren) {
  const ctx = useDocPageContext();
  const { open, setOpen } = useMcpDialog();

  const serverName = useMemo(() => {
    return `${ctx.route.owner}-${ctx.route.repository}`.toLowerCase();
  }, [ctx.route.owner, ctx.route.repository]);

  const mcpEndpointUrl = useMemo(
    () => getMcpEndpointUrl(ctx.route, ctx.meta.requestOrigin),
    [ctx.route, ctx.meta.requestOrigin],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Install MCP</DialogTitle>
          <DialogDescription>
            Install MCP server this documentation.
          </DialogDescription>
          <Tabs>
            <TabsList className="mt-2">
              <TabsTrigger value="cursor">Cursor</TabsTrigger>
              <TabsTrigger value="claude">Claude Code</TabsTrigger>
              <TabsTrigger value="vscode">VSCode</TabsTrigger>
              <TabsTrigger value="antigravity">Antigravity</TabsTrigger>
            </TabsList>
            <TabsContent value="cursor" className="mt-2 px-1 text-sm space-y-4">
              <p>
                Create a <code>.cursor/mcp.json</code> file with the following
                entry:
              </p>
              <Code>{`{
  "mcpServers": {
    "${serverName}": {
      "url": "${mcpEndpointUrl}",
    }
  }
}`}</Code>
            </TabsContent>
            <TabsContent value="claude" className="mt-2 px-1 text-sm space-y-4">
              <p>
                Use the <code>claude mcp</code> command to authenticate and add
                the following entry:
              </p>
              <Code>{`claude mcp add --transport http \\
${mcpEndpointUrl}`}</Code>
            </TabsContent>
            <TabsContent value="vscode" className="mt-2 px-1 text-sm space-y-4">
              <ul className="list-disc list-inside">
                <li>
                  Open the Command Palette (Cmd+Shift+P) and type “MCP: Add
                  Server”.
                </li>
                <li>
                  Select “Add MCP Server”.
                </li>
                <li>
                  Select HTTP to add a remote MCP server.
                </li>
                <li>
                  Enter the MCP URL, {mcpEndpointUrl}.
                </li>
                <li>
                  Set the name to “${serverName}” and confirm.
                </li>
              </ul>
              <Code>{`{
  "servers": {
    "${serverName}": {
      "url": "${mcpEndpointUrl}",
      "type": "http"
    }
  }
}`}</Code>
            </TabsContent>
            <TabsContent value="antigravity" className="mt-2 px-1 text-sm space-y-4">
              <p>
                In the Agent Panel, click the three dots in the top right and
                select MCP Servers. Click, Manage MCP Servers. Select “View raw
                config” and add the following entry:
              </p>
              <Code>{`{
  "mcpServers": {
    "${serverName}": {
      "serverUrl": "${mcpEndpointUrl}"
    }
  }
}`}</Code>
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function Code(props: { children: string }) {
  return (
    <pre className="bg-muted p-4 rounded-md overflow-x-auto">
      <code>{props.children}</code>
    </pre>
  );
}

const Context = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

export function McpDialogProvider(props: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <Context.Provider value={value}>
      {props.children}
      <McpDialog />
    </Context.Provider>
  );
}
