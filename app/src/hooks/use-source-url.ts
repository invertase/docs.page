import { useDocPageContext } from "./use-doc-page-context";

export function useSourceUrl() {
  const ctx = useDocPageContext();

  if (ctx.route.requestMode === "preview") {
    return "#";
  }

  const source = ctx.bundle.source;
  const editRef =
    (source.type === "branch" || source.type === "PR") &&
    source.ref &&
    source.ref !== "HEAD"
      ? source.ref
      : ctx.bundle.baseBranch;

  return [
    "https://github.com/",
    ctx.bundle.source.owner,
    "/",
    ctx.bundle.source.repository,
    "/edit/",
    editRef,
    "/docs/",
    ctx.bundle.path,
    ".mdx",
  ].join("");
}
