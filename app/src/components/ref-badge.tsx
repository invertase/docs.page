import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { useRefUrl } from "@/hooks/use-ref-url";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { RiGitBranchLine } from "@remixicon/react";

export function RefBadge() {
  const ctx = useDocPageContext();
  const url = useRefUrl();

  // If we're in preview mode or the page doesn't have a ref, don't show the badge.
  if (ctx.route.requestMode === "preview" || !ctx.route.ref) {
    return null;
  }

  const source = ctx.bundle.source;
  const ref = ctx.route.ref;

  return (
    <Badge variant="outline" asChild className="px-3 py-2 hover:bg-background">
      <a target="_blank" rel="noopener noreferrer" href={url}>
        <RiGitBranchLine />
        {source.type === "branch" && `${ref}`}
        {source.type === "commit" && ref.substring(0, 7)}
        {source.type === "PR" && `PR #${ref}`}
      </a>
    </Badge>
  );
}
