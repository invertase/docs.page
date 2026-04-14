import { PreviewClient } from "./preview-client";

type PageProps = {
  params: Promise<{
    path?: string[];
  }>;
  searchParams: Promise<{
    url?: string;
  }>;
};

export default async function PreviewDocPage({
  params,
  searchParams,
}: PageProps) {
  const [{ path }, query] = await Promise.all([params, searchParams]);
  const docPath = path?.join("/") ?? "";
  const url = query.url?.trim();

  return <PreviewClient docPath={docPath} rawUrl={url} />;
}
