import {
  RiArrowDownSLine,
  RiArrowRightUpLine,
  RiCheckLine,
  RiClaudeLine,
  RiCloudFill,
  RiCodeAiLine,
  RiCursorAiLine,
  RiFileCopyLine,
  RiMarkdownLine,
} from "@remixicon/react";
import { useCallback, useState } from "react";
import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { Button } from "./ui/button";
import { ButtonGroup } from "./ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function ActionMenu() {
  const { bundle, route } = useDocPageContext();
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    setCopied(true);
    navigator.clipboard.writeText(bundle.markdown);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [bundle.markdown]);

  return (
    <ButtonGroup className="h-8 w-fit">
      <Button
        variant="outline"
        className="gap-2 font-light"
        onClick={handleCopy}
      >
        {copied ? <RiCheckLine /> : <RiFileCopyLine />}
        <span>Copy page</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="pl-2! font-light">
            <RiArrowDownSLine />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-72">
          <DropdownMenuGroup className="space-y-2">
            <DropdownMenuItem className="gap-4" onClick={handleCopy}>
              <MenuItem
                icon={<RiFileCopyLine />}
                title="Copy page"
                description="Copy page as Markdown"
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-4"
              onClick={() => {
                const pathname = `${window.location.pathname}.md`;
                const url = new URL(pathname, window.location.origin);
                window.open(url.toString(), "_blank");
              }}
            >
              <MenuItem
                icon={<RiMarkdownLine />}
                title="View markdown"
                description="Open this page as Markdown"
                external
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-4"
              onClick={() => {
                alert("TODO: Not implemented");
              }}
            >
              <MenuItem
                icon={<RiCloudFill />}
                title="Install with MCP"
                description="Install MCP server for these docs"
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-4"
              onClick={() => {
                const url = `https://claude.ai/new?q=${encodeURIComponent(`Read page ${location.href} and answer any questions I have`)}`;
                window.open(url.toString(), "_blank");
              }}
            >
              <MenuItem
                icon={<RiClaudeLine />}
                title="Open in Claude"
                description="Chat about this page with Claude"
                external
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-4"
              onClick={() => {
                const config = {
                  name:
                    bundle.config.name?.trim() ||
                    `${route.owner}/${route.repository}`,
                  url: getMcpEndpointUrl(route),
                };
                const url = new URL(
                  `vscode:mcp/install?${encodeURIComponent(JSON.stringify(config))}`,
                );
                window.open(url.toString(), "_blank");
              }}
            >
              <MenuItem
                icon={<RiCodeAiLine />}
                title="Connect to VSCode"
                description="Install MCP server in VSCode"
                external
              />
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-4"
              onClick={() => {
                const config = {
                  url: getMcpEndpointUrl(route),
                };
                const encodedConfig = btoa(JSON.stringify(config));
                const serverName =
                  bundle.config.name?.trim() ||
                  `${route.owner}/${route.repository}`;
                const url = new URL(
                  "cursor://anysphere.cursor-deeplink/mcp/install",
                );
                url.searchParams.set("name", serverName);
                url.searchParams.set("config", encodedConfig);
                window.open(url.toString(), "_blank");
              }}
            >
              <MenuItem
                icon={<RiCursorAiLine />}
                title="Connect to Cursor"
                description="Install MCP server in Cursor"
                external
              />
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  );
}

function getMcpEndpointUrl(
  route: ReturnType<typeof useDocPageContext>["route"],
) {
  const encodedRef = route.ref ? `~${encodeURIComponent(route.ref)}` : "";
  let pathname = "";

  if (route.requestMode === "custom-domain") {
    pathname = route.ref ? `/${encodedRef}/mcp` : "/mcp";
  } else if (route.requestMode === "vanity") {
    pathname = `/${route.repository}${encodedRef}/mcp`;
  } else {
    pathname = `/${route.owner}/${route.repository}${encodedRef}/mcp`;
  }

  return new URL(pathname, window.location.origin).toString();
}

function MenuItem(props: {
  icon: React.ReactNode;
  title: string;
  description: string;
  external?: boolean;
}) {
  return (
    <>
      {props.icon}
      <div>
        <div className="flex items-center gap-1 font-normal">
          <span>{props.title}</span>
          {props.external && (
            <RiArrowRightUpLine className="text-muted-foreground" />
          )}
        </div>
        <p className="text-xs text-muted-foreground opacity-80 group-focus/dropdown-menu-item:opacity-100 group-data-[highlighted]/dropdown-menu-item:opacity-100">
          {props.description}
        </p>
      </div>
    </>
  );
}
