import { readFile, stat } from "node:fs/promises";
import path from "node:path";

import { renderDoc } from "@docs.page/mdx-bundler";
import chalk from "chalk";
import type { Command } from "commander";
import { Option } from "commander";
import fg from "fast-glob";
import matter from "gray-matter";
import { load as parseYaml } from "js-yaml";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

import {
  type DocsConfigSource,
  hasNonLatin1,
  loadDocsConfig,
  parseConfigObject,
  resolveHeaderDepth,
  resolveVariables,
  usesAutoOgImage,
} from "../lib/docs-config";
import { isNodeError } from "../lib/errors";

const SEVERITIES = ["off", "warn", "error"] as const;
const FRONTMATTER_LINK_FIELDS = ["redirect", "next", "previous"] as const;
const EXTERNAL_LINK_TIMEOUT_MS = 10_000;
const EXTERNAL_LINK_CONCURRENCY = 8;
const RENDER_CONCURRENCY = 4;

type Severity = (typeof SEVERITIES)[number];
type ReportableSeverity = Exclude<Severity, "off">;

type CheckOptions = {
  externalLinks: Severity;
  internalLinks: Severity;
  assets: Severity;
  render: Severity;
  metadata: Severity;
};

type CheckIssue = {
  severity: ReportableSeverity;
  file?: string;
  line?: number;
  message: string;
  target?: string;
};

type ReferenceKind = "link" | "image" | "frontmatter";

type Reference = {
  kind: ReferenceKind;
  file: string;
  target: string;
  line?: number;
  field?: string;
};

type MarkdownNode = {
  type?: unknown;
  url?: unknown;
  name?: unknown;
  attributes?: unknown;
  children?: unknown;
  position?: unknown;
};

type MdxAttribute = {
  type?: unknown;
  name?: unknown;
  value?: unknown;
};

type DocsMaps = {
  routes: Map<string, string>;
  files: Map<string, string>;
};

type Target =
  | { kind: "external"; url: string }
  | { kind: "internal"; path: string }
  | { kind: "ignored" };

export function registerCheckCommand(program: Command) {
  program
    .command("check")
    .description("Check docs.page files for broken links and missing assets")
    .argument("[path]", "Project directory to check", ".")
    .addOption(
      createSeverityOption("--external-links <level>", "Check external links"),
    )
    .addOption(
      createSeverityOption("--internal-links <level>", "Check internal links"),
    )
    .addOption(
      createSeverityOption("--assets <level>", "Check local image assets"),
    )
    .addOption(
      createSeverityOption("--render <level>", "Check MDX renders correctly"),
    )
    .addOption(
      createSeverityOption("--metadata <level>", "Check page metadata"),
    )
    .action(async (inputPath: string, options: CheckOptions) => {
      const exitCode = await runCheck(path.resolve(inputPath), options);

      if (exitCode !== 0) {
        process.exitCode = exitCode;
      }
    });
}

async function runCheck(rootDir: string, options: CheckOptions) {
  const reporter = createReporter();
  const mdxFiles = await findMdxFiles(rootDir);
  const configSource = await loadDocsConfig(rootDir);
  const parsedConfig = parseConfigObject(configSource);

  console.log(chalk.cyan("Checking docs.page project:"), rootDir);

  const configIssue = await validateDocsConfig(rootDir);

  if (configIssue) {
    reporter.report(configIssue);
  }

  if (mdxFiles.length === 0) {
    reporter.report({
      severity: "error",
      message: "No docs/**/*.mdx files were found.",
    });
  }

  const maps = buildDocsMaps(mdxFiles);
  const externalReferences: Reference[] = [];
  const externalCheckCache = new Map<string, Promise<string | undefined>>();

  reportProjectMetadataIssues({
    config: parsedConfig,
    configSource,
    severity: options.metadata,
    reporter,
  });

  for (const file of mdxFiles) {
    const references = await readReferences(rootDir, file, reporter.report);

    await reportPageMetadataIssues({
      rootDir,
      file,
      config: parsedConfig,
      severity: options.metadata,
      reporter,
    });

    for (const reference of references) {
      const target = classifyTarget(reference.target);

      if (target.kind === "ignored") {
        continue;
      }

      if (reference.kind === "image") {
        await reportMissingAsset({
          rootDir,
          reference,
          target,
          severity: options.assets,
          reporter,
        });
        continue;
      }

      if (target.kind === "external") {
        externalReferences.push(reference);
        continue;
      }

      reportBrokenInternalLink({
        reference,
        maps,
        severity: options.internalLinks,
        reporter,
      });
    }
  }

  await reportRenderIssues({
    rootDir,
    files: mdxFiles,
    configSource,
    severity: options.render,
    reporter,
  });

  const externalSeverity =
    options.externalLinks === "off" ? undefined : options.externalLinks;

  if (externalSeverity) {
    await runLimited(
      externalReferences,
      EXTERNAL_LINK_CONCURRENCY,
      async (reference) => {
        const target = classifyTarget(reference.target);

        if (target.kind !== "external") {
          return;
        }

        const result = await getCachedExternalCheck(
          externalCheckCache,
          target.url,
        );

        if (result) {
          reporter.report({
            severity: externalSeverity,
            file: reference.file,
            line: reference.line,
            message: result,
            target: reference.target,
          });
        }
      },
    );
  }

  reporter.summary();

  return reporter.hasErrors() ? 1 : 0;
}

function createSeverityOption(flags: string, description: string) {
  return new Option(flags, `${description}: ${SEVERITIES.join(", ")}`)
    .choices(SEVERITIES)
    .default("error");
}

async function validateDocsConfig(
  rootDir: string,
): Promise<CheckIssue | undefined> {
  const jsonPath = path.join(rootDir, "docs.json");
  const yamlPath = path.join(rootDir, "docs.yaml");

  if (await pathExists(jsonPath)) {
    try {
      JSON.parse(await readFile(jsonPath, "utf8"));
      return undefined;
    } catch (error) {
      return {
        severity: "error",
        file: "docs.json",
        message: `docs.json is not valid JSON: ${getErrorMessage(error)}`,
      };
    }
  }

  if (await pathExists(yamlPath)) {
    try {
      parseYaml(await readFile(yamlPath, "utf8"));
      return undefined;
    } catch (error) {
      return {
        severity: "error",
        file: "docs.yaml",
        message: `docs.yaml is not valid YAML: ${getErrorMessage(error)}`,
      };
    }
  }

  return {
    severity: "error",
    message: "No docs.json or docs.yaml file was found.",
  };
}

async function findMdxFiles(rootDir: string) {
  const files = await fg("docs/**/*.mdx", {
    cwd: rootDir,
    onlyFiles: true,
    dot: false,
  });

  return files.map(normalizeFilePath).sort();
}

function buildDocsMaps(files: string[]): DocsMaps {
  const routes = new Map<string, string>();
  const fileMap = new Map<string, string>();

  for (const file of files) {
    const normalizedFile = normalizeFilePath(file);
    const route = routeFromMdxFile(normalizedFile);

    routes.set(route, normalizedFile);
    fileMap.set(normalizedFile, route);
  }

  return {
    routes,
    files: fileMap,
  };
}

async function readReferences(
  rootDir: string,
  file: string,
  report: (issue: CheckIssue) => void,
) {
  const filePath = path.join(rootDir, file);
  const markdown = await readFile(filePath, "utf8");
  const references: Reference[] = [];

  try {
    references.push(...extractMarkdownReferences(file, markdown));
  } catch (error) {
    report({
      severity: "error",
      file,
      message: `Unable to parse MDX: ${getErrorMessage(error)}`,
    });
  }

  try {
    references.push(...extractFrontmatterReferences(file, markdown));
  } catch (error) {
    report({
      severity: "error",
      file,
      message: `Invalid frontmatter YAML: ${getErrorMessage(error)}`,
    });
  }

  return references;
}

function extractMarkdownReferences(file: string, markdown: string) {
  const tree = unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(remarkFrontmatter, ["yaml"])
    .parse(markdown) as MarkdownNode;
  const references: Reference[] = [];

  // Walking the parsed tree lets us support Markdown and MDX JSX without
  // relying on regexes that would miss common syntax variants.
  walkMarkdownTree(tree, (node) => {
    if (node.type === "link" && typeof node.url === "string") {
      references.push({
        kind: "link",
        file,
        target: node.url,
        line: getNodeLine(node),
      });
      return;
    }

    if (node.type === "image" && typeof node.url === "string") {
      references.push({
        kind: "image",
        file,
        target: node.url,
        line: getNodeLine(node),
      });
      return;
    }

    const isJsxElement =
      node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement";

    if (isJsxElement && (node.name === "Image" || node.name === "img")) {
      const src = getMdxStringAttribute(node, "src");

      if (src) {
        references.push({
          kind: "image",
          file,
          target: src,
          line: getNodeLine(node),
        });
      }
    }
  });

  return references;
}

function extractFrontmatterReferences(file: string, markdown: string) {
  const parsed = matter(markdown);
  const references: Reference[] = [];

  for (const field of FRONTMATTER_LINK_FIELDS) {
    for (const target of collectFrontmatterTargets(parsed.data[field])) {
      references.push({
        kind: "frontmatter",
        file,
        target,
        field,
      });
    }
  }

  return references;
}

async function reportRenderIssues({
  rootDir,
  files,
  configSource,
  severity,
  reporter,
}: {
  rootDir: string;
  files: string[];
  configSource: DocsConfigSource;
  severity: Severity;
  reporter: ReturnType<typeof createReporter>;
}) {
  if (severity === "off") {
    return;
  }

  const variables = resolveVariables(configSource);
  const headerDepth = resolveHeaderDepth(configSource);

  await runLimited(files, RENDER_CONCURRENCY, async (file) => {
    const markdown = await readFile(path.join(rootDir, file), "utf8");

    try {
      await renderDoc(markdown, { variables, headerDepth });
    } catch (error) {
      reporter.report({
        severity,
        file,
        message: `MDX failed to render: ${getErrorMessage(error)}`,
      });
    }
  });
}

function reportProjectMetadataIssues({
  config,
  configSource,
  severity,
  reporter,
}: {
  config: Record<string, unknown>;
  configSource: DocsConfigSource;
  severity: Severity;
  reporter: ReturnType<typeof createReporter>;
}) {
  if (severity === "off" || !usesAutoOgImage(config)) {
    return;
  }

  const file = getConfigFile(configSource);

  reportMetadataFieldIssue({
    value: config.name,
    field: "name",
    source: "config",
    severity,
    reporter,
    file,
  });
  reportMetadataFieldIssue({
    value: config.description,
    field: "description",
    source: "config",
    severity,
    reporter,
    file,
  });
}

async function reportPageMetadataIssues({
  rootDir,
  file,
  config,
  severity,
  reporter,
}: {
  rootDir: string;
  file: string;
  config: Record<string, unknown>;
  severity: Severity;
  reporter: ReturnType<typeof createReporter>;
}) {
  if (severity === "off") {
    return;
  }

  const markdown = await readFile(path.join(rootDir, file), "utf8");
  let frontmatter: Record<string, unknown>;

  try {
    frontmatter = matter(markdown).data;
  } catch {
    return;
  }

  if (!usesAutoOgImage(config, frontmatter)) {
    return;
  }

  reportMetadataFieldIssue({
    value: frontmatter.title,
    field: "title",
    source: "frontmatter",
    severity,
    reporter,
    file,
    line: getFrontmatterFieldLine(markdown, "title"),
  });
  reportMetadataFieldIssue({
    value: frontmatter.description,
    field: "description",
    source: "frontmatter",
    severity,
    reporter,
    file,
    line: getFrontmatterFieldLine(markdown, "description"),
  });
}

function reportMetadataFieldIssue({
  value,
  field,
  source,
  severity,
  reporter,
  file,
  line,
}: {
  value: unknown;
  field: string;
  source: "config" | "frontmatter";
  severity: Severity;
  reporter: ReturnType<typeof createReporter>;
  file?: string;
  line?: number;
}) {
  if (severity === "off") {
    return;
  }

  if (value === undefined || value === null) {
    return;
  }

  if (typeof value !== "string") {
    reporter.report({
      severity,
      file,
      line,
      message: `Metadata field "${field}" must be a string.`,
      target: source,
    });
    return;
  }

  if (!hasNonLatin1(value)) {
    return;
  }

  reporter.report({
    severity,
    file,
    line,
    message: `Metadata field "${field}" contains non-Latin-1 characters that can break client-side social image generation. Use ASCII text or set socialPreview/frontmatter image.`,
    target: source,
  });
}

function getConfigFile(configSource: DocsConfigSource) {
  if (configSource.json !== null) {
    return "docs.json";
  }

  if (configSource.yaml !== null) {
    return "docs.yaml";
  }

  return undefined;
}

function getFrontmatterFieldLine(markdown: string, field: string) {
  const lines = markdown.split(/\r?\n/);

  if (lines[0] !== "---") {
    return undefined;
  }

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];

    if (line === "---" || line === "...") {
      return undefined;
    }

    if (line?.match(new RegExp(`^\\s*${escapeRegExp(field)}\\s*:`))) {
      return index + 1;
    }
  }

  return undefined;
}

function reportBrokenInternalLink({
  reference,
  maps,
  severity,
  reporter,
}: {
  reference: Reference;
  maps: DocsMaps;
  severity: Severity;
  reporter: ReturnType<typeof createReporter>;
}) {
  if (severity === "off") {
    return;
  }

  if (internalTargetExists(reference, maps)) {
    return;
  }

  reporter.report({
    severity,
    file: reference.file,
    line: reference.line,
    message: getInternalLinkMessage(reference),
    target: reference.target,
  });
}

async function reportMissingAsset({
  rootDir,
  reference,
  target,
  severity,
  reporter,
}: {
  rootDir: string;
  reference: Reference;
  target: Target;
  severity: Severity;
  reporter: ReturnType<typeof createReporter>;
}) {
  if (severity === "off" || target.kind !== "internal") {
    return;
  }

  const assetPath = await resolveAssetPath(
    rootDir,
    reference.file,
    target.path,
  );

  if (assetPath) {
    return;
  }

  reporter.report({
    severity,
    file: reference.file,
    line: reference.line,
    message: "Referenced asset does not exist.",
    target: reference.target,
  });
}

function internalTargetExists(reference: Reference, maps: DocsMaps) {
  const target = classifyTarget(reference.target);

  if (target.kind !== "internal" || !target.path) {
    return true;
  }

  if (target.path.startsWith("/")) {
    return maps.routes.has(normalizeRoutePath(target.path));
  }

  for (const candidate of getRelativeFileCandidates(
    reference.file,
    target.path,
  )) {
    if (maps.files.has(candidate)) {
      return true;
    }
  }

  const currentRoute = maps.files.get(reference.file) ?? "/";
  const route = normalizeRoutePath(
    path.posix.join(path.posix.dirname(currentRoute), target.path),
  );

  return maps.routes.has(route);
}

async function resolveAssetPath(
  rootDir: string,
  file: string,
  targetPath: string,
) {
  if (!targetPath) {
    return undefined;
  }

  const candidates = targetPath.startsWith("/")
    ? [
        path.join(rootDir, "docs", targetPath.slice(1)),
        path.join(rootDir, targetPath.slice(1)),
      ]
    : [path.resolve(rootDir, path.posix.dirname(file), targetPath)];

  for (const candidate of candidates) {
    if (await fileExists(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

function classifyTarget(rawTarget: string): Target {
  const target = rawTarget.trim();

  if (!target || target.startsWith("#")) {
    return { kind: "ignored" };
  }

  if (target.startsWith("//")) {
    return { kind: "external", url: `https:${target}` };
  }

  const scheme = target.match(/^([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();

  if (scheme) {
    return scheme === "http" || scheme === "https"
      ? { kind: "external", url: target }
      : { kind: "ignored" };
  }

  return {
    kind: "internal",
    path: stripQueryAndHash(target),
  };
}

async function getCachedExternalCheck(
  cache: Map<string, Promise<string | undefined>>,
  url: string,
) {
  let check = cache.get(url);

  if (!check) {
    check = checkExternalUrl(url);
    cache.set(url, check);
  }

  return check;
}

async function checkExternalUrl(url: string) {
  const headResult = await requestExternalUrl(url, "HEAD");

  if (headResult.ok) {
    return undefined;
  }

  const getResult = await requestExternalUrl(url, "GET");

  if (getResult.ok) {
    return undefined;
  }

  return (
    getResult.message || headResult.message || "External link did not resolve."
  );
}

async function requestExternalUrl(url: string, method: "GET" | "HEAD") {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    EXTERNAL_LINK_TIMEOUT_MS,
  );

  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "docs.page-cli",
      },
    });
    const ok = response.status >= 100 && response.status < 300;

    await response.body?.cancel().catch(() => undefined);

    return {
      ok,
      message: ok
        ? undefined
        : `External link returned ${response.status} ${response.statusText}.`,
    };
  } catch (error) {
    return {
      ok: false,
      message: `Unable to reach external link: ${getErrorMessage(error)}`,
    };
  } finally {
    clearTimeout(timeout);
  }
}

function getInternalLinkMessage(reference: Reference) {
  if (reference.kind === "frontmatter" && reference.field) {
    return `Frontmatter field "${reference.field}" points to a missing docs page.`;
  }

  return "Internal link points to a missing docs page.";
}

function routeFromMdxFile(file: string) {
  const withoutDocsPrefix = file.replace(/^docs\//, "");
  const withoutExtension = withoutDocsPrefix.replace(/\.mdx$/, "");
  const withoutIndex = withoutExtension.replace(/(^|\/)index$/, "$1");

  return normalizeRoutePath(`/${withoutIndex}`);
}

function normalizeRoutePath(routePath: string) {
  let route = decodePath(routePath);

  if (!route.startsWith("/")) {
    route = `/${route}`;
  }

  route = path.posix.normalize(route);
  route = route.replace(/\/index\.mdx?$/, "/");
  route = route.replace(/\.mdx?$/, "");
  route = route.replace(/\/index$/, "/");

  if (route !== "/") {
    route = route.replace(/\/+$/, "");
  }

  return route === "/." || !route ? "/" : route;
}

function getRelativeFileCandidates(currentFile: string, targetPath: string) {
  const currentDirectory = path.posix.dirname(currentFile);
  const joined = normalizeFilePath(
    path.posix.join(currentDirectory, targetPath),
  );
  const candidates = [joined];

  if (!path.posix.extname(joined)) {
    candidates.push(`${joined}.mdx`);
    candidates.push(`${joined}.md`);
    candidates.push(path.posix.join(joined, "index.mdx"));
    candidates.push(path.posix.join(joined, "index.md"));
  }

  return candidates.map(normalizeFilePath);
}

function stripQueryAndHash(target: string) {
  const queryIndex = target.indexOf("?");
  const hashIndex = target.indexOf("#");
  const indexes = [queryIndex, hashIndex].filter((index) => index >= 0);
  const endIndex = indexes.length > 0 ? Math.min(...indexes) : target.length;

  return decodePath(target.slice(0, endIndex));
}

function collectFrontmatterTargets(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectFrontmatterTargets);
  }

  if (typeof value !== "object" || value === null) {
    return [];
  }

  const record = value as Record<string, unknown>;
  const directTarget = ["href", "url", "path", "to"]
    .map((key) => record[key])
    .find((candidate): candidate is string => typeof candidate === "string");

  return directTarget ? [directTarget] : [];
}

function walkMarkdownTree(
  node: MarkdownNode,
  visit: (node: MarkdownNode) => void,
) {
  visit(node);

  if (!Array.isArray(node.children)) {
    return;
  }

  for (const child of node.children) {
    if (typeof child === "object" && child !== null) {
      walkMarkdownTree(child as MarkdownNode, visit);
    }
  }
}

function getMdxStringAttribute(node: MarkdownNode, attributeName: string) {
  if (!Array.isArray(node.attributes)) {
    return undefined;
  }

  for (const attribute of node.attributes) {
    const candidate = attribute as MdxAttribute;

    if (
      candidate.type === "mdxJsxAttribute" &&
      candidate.name === attributeName &&
      typeof candidate.value === "string"
    ) {
      return candidate.value;
    }
  }

  return undefined;
}

function getNodeLine(node: MarkdownNode) {
  const position = node.position as { start?: { line?: unknown } } | undefined;

  return typeof position?.start?.line === "number"
    ? position.start.line
    : undefined;
}

function createReporter() {
  const issues: CheckIssue[] = [];

  return {
    report(issue: CheckIssue) {
      issues.push(issue);
      console.log(formatIssue(issue));
    },
    hasErrors() {
      return issues.some((issue) => issue.severity === "error");
    },
    summary() {
      const errors = issues.filter(
        (issue) => issue.severity === "error",
      ).length;
      const warnings = issues.filter(
        (issue) => issue.severity === "warn",
      ).length;

      if (errors === 0 && warnings === 0) {
        console.log(chalk.green("No documentation issues found."));
        return;
      }

      console.log(
        `${chalk.red(`${errors} error${errors === 1 ? "" : "s"}`)}, ${chalk.yellow(
          `${warnings} warning${warnings === 1 ? "" : "s"}`,
        )}`,
      );
    },
  };
}

function formatIssue(issue: CheckIssue) {
  const label =
    issue.severity === "error" ? chalk.red("error") : chalk.yellow("warn");
  const location = issue.file
    ? `${issue.file}${issue.line ? `:${issue.line}` : ""}`
    : "project";
  const target = issue.target ? ` ${chalk.dim(issue.target)}` : "";

  return `${label} ${chalk.dim(location)} ${issue.message}${target}`;
}

async function runLimited<T>(
  items: T[],
  concurrency: number,
  worker: (item: T) => Promise<void>,
) {
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const item = items[nextIndex];
        nextIndex += 1;

        if (item !== undefined) {
          await worker(item);
        }
      }
    },
  );

  await Promise.all(workers);
}

function normalizeFilePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}

function decodePath(value: string) {
  try {
    return decodeURI(value);
  } catch {
    return value;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unknown error";
}

function pathExists(filePath: string) {
  return stat(filePath)
    .then(() => true)
    .catch((error: unknown) => {
      if (isNodeError(error) && error.code === "ENOENT") {
        return false;
      }

      throw error;
    });
}

function fileExists(filePath: string) {
  return stat(filePath)
    .then((entry) => entry.isFile())
    .catch((error: unknown) => {
      if (isNodeError(error) && error.code === "ENOENT") {
        return false;
      }

      throw error;
    });
}
