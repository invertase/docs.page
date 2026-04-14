import { Index, type IndexOptions } from "flexsearch";
import frontmatter from "gray-matter";

import { getGitHubFileSourcesBatch } from "@/server/github/contents";
import { listGitHubDocFiles } from "@/server/github/tree";
import type { GitHubDocFileList } from "@/server/github/tree";

export const DOCS_FLEXSEARCH_INDEX_OPTIONS: IndexOptions = {
  tokenize: "forward",
  encoder: "Normalize",
};

export type DocsFlexSearchJson = {
  version: 2;
  indexOptions: typeof DOCS_FLEXSEARCH_INDEX_OPTIONS;
  /** FlexSearch `export()` chunks (e.g. `1.reg`, `1.map`), not user-facing doc ids. */
  index: Record<string, string>;
  /** Doc id → display fields (`Index.search` returns ids matching these keys). */
  documents: Record<string, { path: string; title: string }>;
  meta: {
    resolvedRef: string;
    resolvedSha: string;
    truncated: boolean;
    fileCount: number;
  };
};

function titleFromMatterAndBody(data: Record<string, unknown>, body: string, fallback: string): string {
  if (typeof data.title === "string" && data.title.trim()) {
    return data.title.trim();
  }

  const heading = body.match(/^#\s+(.+)$/m);

  return heading ? heading[1].trim() : fallback;
}

async function buildFlexSearchPayload(docList: GitHubDocFileList): Promise<DocsFlexSearchJson> {
  const { owner, repository, ref } = docList.source;
  const resolvedRef = ref ?? docList.resolvedRef;

  const searchIndex = new Index(DOCS_FLEXSEARCH_INDEX_OPTIONS);
  const documents: Record<string, { path: string; title: string }> = {};

  const paths = docList.files.map((f) => f.sourcePath);
  const blobs = await getGitHubFileSourcesBatch({
    owner,
    repository,
    ref: resolvedRef,
    paths,
  });

  for (const file of docList.files) {
    const content = blobs.get(file.sourcePath);
    if (content == null) {
      continue;
    }

    const { path } = file;
    const parsed = frontmatter(content);
    const title = titleFromMatterAndBody(parsed.data, parsed.content, path);
    const text = parsed.content.replace(/\r\n/g, "\n");
    const combined = `${title}\n\n${text}`;

    searchIndex.add(path, combined);
    documents[path] = { path, title };
  }

  const exportIndex: Record<string, string> = {};

  searchIndex.export((key, data) => {
    exportIndex[key] = data;
  });

  return {
    version: 2,
    indexOptions: DOCS_FLEXSEARCH_INDEX_OPTIONS,
    index: exportIndex,
    documents,
    meta: {
      resolvedRef: docList.resolvedRef,
      resolvedSha: docList.resolvedSha,
      truncated: docList.truncated,
      fileCount: docList.files.length,
    },
  };
}

export function emptyDocsFlexSearchPayload(docList: GitHubDocFileList): DocsFlexSearchJson {
  return {
    version: 2,
    indexOptions: DOCS_FLEXSEARCH_INDEX_OPTIONS,
    index: {},
    documents: {},
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
      version: 2,
      indexOptions: DOCS_FLEXSEARCH_INDEX_OPTIONS,
      index: {},
      documents: {},
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
