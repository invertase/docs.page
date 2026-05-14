import { useDocPageContext } from "./use-doc-page-context";

export function useRefUrl() {
  const ctx = useDocPageContext();

  // TODO: Preview mode
  if (
    // ctx.preview ||
    !ctx.route.ref
  ) {
    return "#";
  }

  const source = ctx.bundle.source;
  const base = `https://github.com/${ctx.bundle.source.owner}/${ctx.bundle.source.repository}`;

  if (source.ref === "HEAD") return base;
  if (source.type === "branch") return `${base}/tree/${source.ref}`;
  if (source.type === "commit") return `${base}/commit/${source.ref}`;
  if (source.type === "PR") return `${base}/pull/${source.ref}`;

  return "#";
}
