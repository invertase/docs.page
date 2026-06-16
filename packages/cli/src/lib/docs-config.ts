import { readFile } from "node:fs/promises";
import path from "node:path";

import { load as parseYaml } from "js-yaml";

import { isNodeError } from "./errors";

export type DocsConfigSource = {
  json: string | null;
  yaml: string | null;
};

export async function loadDocsConfig(
  rootDir: string,
): Promise<DocsConfigSource> {
  const [json, yaml] = await Promise.all([
    readOptionalFile(path.join(rootDir, "docs.json")),
    readOptionalFile(path.join(rootDir, "docs.yaml")),
  ]);

  return { json, yaml };
}

export function parseConfigObject(
  config: DocsConfigSource,
): Record<string, unknown> {
  try {
    if (config.json) {
      const parsed = JSON.parse(config.json) as unknown;
      return isRecord(parsed) ? parsed : {};
    }

    if (config.yaml) {
      const parsed = parseYaml(config.yaml);
      return isRecord(parsed) ? parsed : {};
    }
  } catch {
    return {};
  }

  return {};
}

export function resolveVariables(
  config: DocsConfigSource,
): Record<string, unknown> {
  const parsed = parseConfigObject(config);
  return isRecord(parsed.variables) ? parsed.variables : {};
}

export function resolveHeaderDepth(config: DocsConfigSource): number {
  const parsed = parseConfigObject(config);
  const content = isRecord(parsed.content) ? parsed.content : undefined;
  const headerDepth = content?.headerDepth ?? parsed.headerDepth;

  return typeof headerDepth === "number" && Number.isInteger(headerDepth)
    ? headerDepth
    : 3;
}

export function usesAutoOgImage(
  config: Record<string, unknown>,
  frontmatter: Record<string, unknown> = {},
) {
  if (frontmatter.image) {
    return false;
  }

  const socialPreview = config.socialPreview;

  return (
    socialPreview !== false &&
    !(typeof socialPreview === "string" && socialPreview.length > 0)
  );
}

export function hasNonLatin1(value: string) {
  return Array.from(value).some((character) => character.codePointAt(0)! > 255);
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function readOptionalFile(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return null;
    }

    throw error;
  }
}
