import type { GitHubDocFileList } from "@/server/github/tree";
import { buildDocsSourceDataset } from "@/server/docs/source-dataset";

export type DocsFlexSearchDoc = {
  path: string;
  title: string;
  content: string;
};

export type DocsFlexSearchJson = {
  version: 4;
  documents: DocsFlexSearchDoc[];
  meta: {
    resolvedRef: string;
    resolvedSha: string;
    truncated: boolean;
    fileCount: number;
  };
};

async function buildFlexSearchPayload(
  docList: GitHubDocFileList,
): Promise<DocsFlexSearchJson> {
  const dataset = await buildDocsSourceDataset(docList);
  const documents: DocsFlexSearchDoc[] = dataset.documents.map((document) => ({
    path: document.path,
    title: document.title,
    content: document.searchContent,
  }));

  return {
    version: 4,
    documents,
    meta: {
      resolvedRef: dataset.meta.resolvedRef,
      resolvedSha: dataset.meta.resolvedSha,
      truncated: dataset.meta.truncated,
      fileCount: dataset.meta.fileCount,
    },
  };
}

export function emptyDocsFlexSearchPayload(
  docList: GitHubDocFileList,
): DocsFlexSearchJson {
  return {
    version: 4,
    documents: [],
    meta: {
      resolvedRef: docList.resolvedRef,
      resolvedSha: docList.resolvedSha,
      truncated: docList.truncated,
      fileCount: 0,
    },
  };
}

export async function buildDocsFlexSearchIndex(
  docList: GitHubDocFileList,
): Promise<DocsFlexSearchJson> {
  return buildFlexSearchPayload(docList);
}
