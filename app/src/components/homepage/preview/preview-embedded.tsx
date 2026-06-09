export function PreviewEmbedded() {
  const isLocal = window.location.hostname === "localhost";
  const src = isLocal
    ? "http://localhost:3000/invertase/docs.page~ai"
    : "https://use.docs.page/~ai";

  return <iframe title="docs.page" src={src} className="w-full h-full" />;
}
