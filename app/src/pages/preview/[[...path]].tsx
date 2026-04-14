import type { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { PreviewClient } from "@/components/preview-client";

type PageProps = {
  docPath: string;
  rawUrl?: string;
};

export const getServerSideProps = (async ({ params, query }) => {
  const raw = params?.path;
  const chunks = raw
    ? Array.isArray(raw)
      ? raw
      : [raw]
    : [];
  const rawUrl = typeof query.url === "string" ? query.url.trim() : undefined;

  return {
    props: {
      docPath: chunks.join("/"),
      rawUrl: rawUrl || undefined,
    } satisfies PageProps,
  };
}) satisfies GetServerSideProps<PageProps>;

export default function PreviewPage(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return <PreviewClient docPath={props.docPath} rawUrl={props.rawUrl} />;
}
