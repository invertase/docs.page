import frontmatter from "gray-matter";

import { type Config, defaultConfig, parseConfig } from "@/server/config";
import { getGitHubFileSourcesBatch } from "@/server/github/contents";
import type { GitHubDocFileList } from "@/server/github/tree";

export type DocsSourceDatasetDocument = {
  path: string;
  pathSegments: string[] | undefined;
  sourcePath: string;
  title: string;
  description: string;
  sourceContent: string;
  content: string;
  searchContent: string;
};

export type DocsSourceDataset = {
  documents: DocsSourceDatasetDocument[];
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

function collapseWhitespace(text: string) {
  const singleLine = text.replace(/\s+/g, " ").trim();
  return singleLine.length > 240
    ? `${singleLine.slice(0, 237)}...`
    : singleLine;
}

function pageDescriptionFromMatterAndBody(
  data: Record<string, unknown>,
  body: string,
): string {
  if (typeof data.description === "string" && data.description.trim()) {
    return collapseWhitespace(data.description.trim());
  }

  const text = body.replace(/\r\n/g, "\n").replace(/^#.*$/gm, "").trim();
  const firstBlock = text
    .split(/\n\n+/)
    .find((block) => block.trim().length > 0);
  if (!firstBlock) {
    return "";
  }

  const singleLine = firstBlock.replace(/\s+/g, " ").trim();
  return singleLine.length > 240
    ? `${singleLine.slice(0, 237)}...`
    : singleLine;
}

function docPathToSegments(path: string): string[] {
  if (!path || path === "index") {
    return [];
  }

  return path.split("/").filter(Boolean);
}

function compareStructuredDocPath(aPath: string, bPath: string): number {
  const segsA = docPathToSegments(aPath);
  const segsB = docPathToSegments(bPath);

  if (segsA.length !== segsB.length) {
    return segsA.length - segsB.length;
  }

  for (let i = 0; i < segsA.length; i++) {
    const cmp = segsA[i].localeCompare(segsB[i], undefined, {
      numeric: true,
      sensitivity: "base",
    });
    if (cmp !== 0) {
      return cmp;
    }
  }

  return 0;
}

function getDocPathSegments(path: string): string[] | undefined {
  if (!path || path === "index") {
    return undefined;
  }

  return path.split("/").filter(Boolean);
}

export function emptyDocsSourceDataset(
  docList: GitHubDocFileList,
): DocsSourceDataset {
  return {
    documents: [],
    meta: {
      resolvedRef: docList.resolvedRef,
      resolvedSha: docList.resolvedSha,
      truncated: docList.truncated,
      fileCount: 0,
    },
  };
}

export async function buildDocsSourceDataset(
  docList: GitHubDocFileList,
): Promise<DocsSourceDataset> {
  const paths = docList.files.map((file) => file.sourcePath);
  const blobs = await getGitHubFileSourcesBatch({
    owner: docList.source.owner,
    repository: docList.source.repository,
    ref: docList.resolvedSha,
    paths,
  });

  const documents: DocsSourceDatasetDocument[] = [];
  const sortedFiles = [...docList.files].sort((a, b) =>
    compareStructuredDocPath(a.path, b.path),
  );

  for (const file of sortedFiles) {
    const sourceContent = blobs.get(file.sourcePath);
    if (sourceContent == null) {
      continue;
    }

    const parsed = frontmatter(sourceContent);
    const content = parsed.content.replace(/\r\n/g, "\n");
    const trimmedContent = content.trim();
    const searchContent = stripMarkdown(content);

    if (!trimmedContent || !searchContent) {
      continue;
    }

    documents.push({
      path: file.path,
      pathSegments: getDocPathSegments(file.path),
      sourcePath: file.sourcePath,
      title: titleFromMatterAndBody(parsed.data, parsed.content, file.path),
      description: pageDescriptionFromMatterAndBody(
        parsed.data,
        parsed.content,
      ),
      sourceContent,
      content,
      searchContent,
    });
  }

  return {
    documents,
    meta: {
      resolvedRef: docList.resolvedRef,
      resolvedSha: docList.resolvedSha,
      truncated: docList.truncated,
      fileCount: documents.length,
    },
  };
}

export async function loadDocsConfigForResolvedSha(args: {
  owner: string;
  repository: string;
  resolvedSha: string;
}): Promise<Config> {
  const blobs = await getGitHubFileSourcesBatch({
    owner: args.owner,
    repository: args.repository,
    ref: args.resolvedSha,
    paths: ["docs.json", "docs.yaml"],
  });

  try {
    return parseConfig({
      json: blobs.get("docs.json"),
      yaml: blobs.get("docs.yaml"),
    });
  } catch {
    return defaultConfig;
  }
}
