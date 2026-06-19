import { useDocPageContext } from "./use-doc-page-context";

export function useSourceUrl() {
  const ctx = useDocPageContext();

  if (ctx.route.requestMode === "preview") {
    return "#";
  }

  const source = ctx.bundle.source;

  return [
    "https://github.com/",
    ctx.bundle.source.owner,
    "/",
    ctx.bundle.source.repository,
    "/edit/",
    source.type === "branch" && source.ref !== "HEAD"
      ? source.ref
      : ctx.bundle.baseBranch,
    "/docs/",
    ctx.bundle.path,
    ".mdx",
  ].join("");
}
