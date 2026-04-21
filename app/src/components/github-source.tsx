import { useDocPageContext } from "@/hooks/use-doc-page-context";
import { Button } from "./ui/button";
import { GitBranchIcon, StarIcon } from "lucide-react";

export function GithubSource() {
  const { bundle, route } = useDocPageContext();
  const gh = bundle.source;

  if (route.requestMode === "preview") {
    return (
      <div className="rounded-md border px-3 py-2.5 text-sm">
        <div className="min-w-0 truncate font-medium">{gh.owner}/{gh.repository}</div>
        <div className="text-muted-foreground mt-1">Local preview</div>
      </div>
    );
  }

  return (
    <Button
      asChild
      type="button"
      variant="outline"
      className="h-auto w-full min-w-0 flex-col items-stretch justify-start gap-1.5 whitespace-normal px-3 py-2.5 text-left"
    >
      <a
        href={`https://github.com/${gh.owner}/${gh.repository}`}
        target="_blank"
        rel="noreferrer"
      >
        <div className="min-w-0 truncate text-sm leading-snug font-medium">
          {gh.owner}/{gh.repository}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <StarIcon className="size-4" />
            <span>{bundle.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <GitBranchIcon className="size-4" />
            <span>{bundle.forks.toLocaleString()}</span>
          </div>
        </div>
      </a>
    </Button>
  );
}
