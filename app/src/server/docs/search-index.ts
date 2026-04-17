import frontmatter from "gray-matter";

import { getGitHubFileSourcesBatch } from "@/server/github/contents";
import { listGitHubDocFiles } from "@/server/github/tree";
import type { GitHubDocFileList } from "@/server/github/tree";

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

function titleFromMatterAndBody(
  data: Record<string, unknown>,
  body: string,
  fallback: string,
): string {
  if (typeof data.title === "string" && data.title.trim()) {
    return data.title.trim();
  }

  const heading = body.match(/^#\s+(.+)$/m);

  return heading ? heading[1].trim() : fallback;
}

function stripMarkdown(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^>\s?/gm, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, "$1")
    .replace(/\s+/g, " ")
    .trim();
}

async function buildFlexSearchPayload(
  docList: GitHubDocFileList,
): Promise<DocsFlexSearchJson> {
  const { owner, repository, ref } = docList.source;
  const resolvedRef = ref ?? docList.resolvedRef;

  const paths = docList.files.map((f) => f.sourcePath);
  const blobs = await getGitHubFileSourcesBatch({
    owner,
    repository,
    ref: resolvedRef,
    paths,
  });

  const documents: DocsFlexSearchDoc[] = [];

  for (const file of docList.files) {
    const raw = blobs.get(file.sourcePath);
    if (raw == null) {
      continue;
    }

    const { path } = file;
    const parsed = frontmatter(raw);
    const title = titleFromMatterAndBody(parsed.data, parsed.content, path);
    const content = stripMarkdown(parsed.content.replace(/\r\n/g, "\n"));

    documents.push({ path, title, content });
  }

  return {
    version: 4,
    documents,
    meta: {
      resolvedRef: docList.resolvedRef,
      resolvedSha: docList.resolvedSha,
      truncated: docList.truncated,
      fileCount: docList.files.length,
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

async function buildFlexSearchIndexForResolvedSha(
  owner: string,
  repository: string,
  resolvedSha: string,
): Promise<DocsFlexSearchJson> {
  const docList = await listGitHubDocFiles({
    owner,
    repository,
    ref: resolvedSha,
  });

  if (!docList || docList.files.length === 0) {
    return {
      version: 4,
      documents: [],
      meta: {
        resolvedRef: docList?.resolvedRef ?? "",
        resolvedSha: docList?.resolvedSha ?? resolvedSha,
        truncated: docList?.truncated ?? false,
        fileCount: 0,
      },
    };
  }

  return buildFlexSearchPayload(docList);
}

export async function buildDocsFlexSearchIndex(
  owner: string,
  repository: string,
  resolvedSha: string,
): Promise<DocsFlexSearchJson> {
  return buildFlexSearchIndexForResolvedSha(owner, repository, resolvedSha);
}
