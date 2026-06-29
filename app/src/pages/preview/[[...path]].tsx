import dynamic from "next/dynamic";

const PreviewClient = dynamic(
  () => import("@/components/preview-client").then((mod) => mod.PreviewClient),
  {
    ssr: false,
  },
);

export default function PreviewPage() {
  return <PreviewClient />;
}
