import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

import { renderDoc } from "@docs.page/mdx-bundler";
import chalk from "chalk";
import chokidar from "chokidar";
import type { Command } from "commander";
import { type WebSocket, WebSocketServer } from "ws";

import { getApiBase } from "../lib/api";
import { getGlobalOptions } from "../lib/command";
import {
  type DocsConfigSource,
  isRecord,
  resolveHeaderDepth,
  resolveVariables,
} from "../lib/docs-config";
import { CliError } from "../lib/errors";

type PreviewOptions = {
  port?: number;
  browser: boolean;
};

type SerializedPreviewError = {
  name: string;
  message: string;
  stack: string | null;
  raw: string | null;
};

type PreviewBundle = {
  markdown: string;
  docIr: Awaited<ReturnType<typeof renderDoc>>["docIr"];
  frontmatter: Record<string, unknown>;
  headings: Awaited<ReturnType<typeof renderDoc>>["headings"];
};

type PreviewResponseEvent = {
  type: "response";
  revision: number;
  pathname: string;
  filePath: string | null;
  changedPaths?: string[];
  config: DocsConfigSource;
  markdown: string | null;
  bundle: PreviewBundle | null;
  candidates: string[];
  error: string | null;
  errorDetails: SerializedPreviewError | null;
  rootDir: string;
  at: string;
};

type PreviewSnapshot = {
  docPath: string;
  filePath: string | null;
  config: DocsConfigSource;
  markdown: string | null;
  candidates: string[];
  error: string | null;
};

type PreviewSocket = WebSocket & { docPath: string };

const WATCH_DEBOUNCE_MS = 250;

export function registerPreviewCommand(program: Command) {
  program
    .command("preview")
    .description("Preview your documentation site locally")
    .option(
      "--port <number>",
      "Port to bind the local preview server to",
      parsePort,
    )
    .option("--no-browser", "Do not open the preview page automatically")
    .action(async (options: PreviewOptions, command: Command) => {
      const globalOptions = getGlobalOptions(command);
      const apiBase = getApiBase(globalOptions.apiUrl);
      const rootDir = process.cwd();

      validateProject(rootDir);

      const localServer = await startPreviewServer({
        rootDir,
        requestedPort: options.port,
      });

      const socketUrl = `ws://localhost:${localServer.port}`;
      const browserUrl = new URL("/preview", `${apiBase}/`);
      browserUrl.searchParams.set("url", socketUrl);

      console.log(
        chalk.green("Local preview server started."),
        `Watching ${chalk.yellow(rootDir)}`,
      );
      console.log(`WebSocket server: ${chalk.cyan(socketUrl)}`);
      console.log(`Preview URL: ${chalk.cyan(browserUrl.toString())}`);

      if (options.browser) {
        await openBrowser(browserUrl.toString()).catch(() => {
          console.log(
            chalk.yellow("Unable to open your browser automatically."),
            `Open ${chalk.cyan(browserUrl.toString())} manually.`,
          );
        });
      }

      const shutdown = async () => {
        await localServer.stop();
        process.exit(0);
      };

      process.once("SIGINT", () => void shutdown());
      process.once("SIGTERM", () => void shutdown());
    });
}

function validateProject(rootDir: string) {
  const hasJsonConfig = fs.existsSync(path.join(rootDir, "docs.json"));
  const hasYamlConfig = fs.existsSync(path.join(rootDir, "docs.yaml"));

  if (!hasJsonConfig && !hasYamlConfig) {
    throw new CliError(
      "No docs.json or docs.yaml file was found in the current directory.",
    );
  }

  const docsDir = path.join(rootDir, "docs");

  if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) {
    throw new CliError(
      "No docs/ directory was found in the current directory.",
    );
  }

  if (!hasMdxFile(docsDir)) {
    throw new CliError("No .mdx files were found in the docs/ directory.");
  }
}

function hasMdxFile(directory: string): boolean {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (hasMdxFile(path.join(directory, entry.name))) {
        return true;
      }
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".mdx")) {
      return true;
    }
  }

  return false;
}

async function startPreviewServer({
  rootDir,
  requestedPort,
}: {
  rootDir: string;
  requestedPort?: number;
}) {
  let revision = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  const pendingPaths = new Set<string>();
  const clients = new Set<PreviewSocket>();

  async function sendResponse(socket: PreviewSocket, changedPaths?: string[]) {
    const snapshot = readPreviewSnapshot(rootDir, socket.docPath);
    const pathname = toPathname(snapshot.docPath);
    let bundle: PreviewBundle | null = null;
    let markdown = snapshot.markdown;
    let error = snapshot.error;
    let errorDetails: SerializedPreviewError | null = error
      ? { name: "PreviewError", message: error, stack: null, raw: null }
      : null;

    if (!error && snapshot.markdown !== null) {
      const startedAt = Date.now();
      logStatus(
        "bundling",
        `${pathname}${snapshot.filePath ? ` (${snapshot.filePath})` : ""}`,
      );

      try {
        const result = await renderDoc(snapshot.markdown, {
          variables: resolveVariables(snapshot.config),
          headerDepth: resolveHeaderDepth(snapshot.config),
        });
        bundle = {
          markdown: result.markdown,
          docIr: result.docIr,
          frontmatter: result.frontmatter,
          headings: result.headings,
        };
        markdown = result.markdown;
        logStatus("bundled", pathname, "success", Date.now() - startedAt);
      } catch (bundleError) {
        errorDetails = serializeError(bundleError);
        error = errorDetails.message;
        logStatus("bundle error", `${pathname}: ${error}`, "error");
      }
    } else if (error) {
      logStatus("error", `${pathname}: ${error}`, "error");
    }

    revision += 1;

    const event: PreviewResponseEvent = {
      type: "response",
      revision,
      pathname,
      filePath: snapshot.filePath,
      changedPaths,
      config: snapshot.config,
      markdown,
      bundle,
      candidates: snapshot.candidates,
      error,
      errorDetails,
      rootDir,
      at: new Date().toISOString(),
    };

    socket.send(JSON.stringify(event));
  }

  function broadcast(changedPaths?: string[]) {
    for (const socket of clients) {
      void sendResponse(socket, changedPaths);
    }
  }

  function flushPendingChanges() {
    if (pendingPaths.size === 0) {
      return;
    }

    const changedPaths = Array.from(pendingPaths).sort();
    pendingPaths.clear();
    broadcast(changedPaths);
  }

  const watcher = chokidar.watch(["docs.json", "docs.yaml", "docs"], {
    cwd: rootDir,
    ignoreInitial: true,
  });

  watcher.on("all", (eventName, changedPath) => {
    if (!isWatchedPath(changedPath)) {
      return;
    }

    const normalizedPath = changedPath.split(path.sep).join("/");
    pendingPaths.add(`${eventName}:${normalizedPath}`);
    logStatus("change", `${eventName}:${normalizedPath}`);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(flushPendingChanges, WATCH_DEBOUNCE_MS);
  });

  const httpServer = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");

    if (request.url?.startsWith("/?") || request.url === "/") {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ ok: true, revision, rootDir }));
      return;
    }

    response.statusCode = 404;
    response.end("Not found.");
  });

  const wss = new WebSocketServer({ server: httpServer });

  wss.on("connection", (socket: WebSocket, request) => {
    const previewSocket = socket as PreviewSocket;
    const url = new URL(request.url ?? "/", "http://localhost");
    previewSocket.docPath = normalizePathname(url.searchParams.get("path"));
    clients.add(previewSocket);

    socket.on("message", (raw) => {
      let payload: unknown;

      try {
        payload = JSON.parse(raw.toString());
      } catch {
        return;
      }

      if (isPingMessage(payload)) {
        previewSocket.docPath = normalizePathname(payload.path);
        void sendResponse(previewSocket);
      }
    });

    socket.on("close", () => {
      clients.delete(previewSocket);
    });

    void sendResponse(previewSocket);
  });

  const port = await new Promise<number>((resolve, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(requestedPort ?? 0, "localhost", () => {
      const address = httpServer.address();
      if (address && typeof address === "object") {
        resolve(address.port);
      } else {
        reject(new CliError("Unable to determine the preview server port."));
      }
    });
  });

  return {
    port,
    async stop() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      await watcher.close();
      wss.close();
      await new Promise<void>((resolve) => httpServer.close(() => resolve()));
    },
  };
}

function readPreviewSnapshot(
  rootDir: string,
  requestedPath: string,
): PreviewSnapshot {
  const docPath = normalizeDocPath(requestedPath);
  const candidates = getDocCandidates(docPath);
  const filePath =
    candidates.find((candidate) =>
      fs.existsSync(path.join(rootDir, candidate)),
    ) ?? null;

  const jsonConfigPath = path.join(rootDir, "docs.json");
  const yamlConfigPath = path.join(rootDir, "docs.yaml");
  const config: DocsConfigSource = {
    json: fs.existsSync(jsonConfigPath)
      ? fs.readFileSync(jsonConfigPath, "utf8")
      : null,
    yaml: fs.existsSync(yamlConfigPath)
      ? fs.readFileSync(yamlConfigPath, "utf8")
      : null,
  };

  const markdown = filePath
    ? fs.readFileSync(path.join(rootDir, filePath), "utf8")
    : null;

  const error =
    markdown === null
      ? `No document was found for "${docPath || "index"}".`
      : null;

  return { docPath, filePath, config, markdown, candidates, error };
}

function getDocCandidates(docPath: string) {
  if (!docPath || docPath === "index") {
    return ["docs/index.mdx"];
  }

  return [`docs/${docPath}.mdx`, `docs/${docPath}/index.mdx`];
}

function normalizeDocPath(requestedPath: string | null) {
  const trimmed = requestedPath?.trim().replace(/^\/+|\/+$/g, "") ?? "";
  return trimmed === "index" ? "" : trimmed;
}

function normalizePathname(input: string | null | undefined) {
  const raw = input?.trim() ?? "";
  const [pathname] = raw.split(/[?#]/, 1);
  return normalizeDocPath(pathname || "/");
}

function toPathname(docPath: string) {
  return docPath ? `/${docPath}` : "/";
}

function isWatchedPath(changedPath: string) {
  const normalized = changedPath.split(path.sep).join("/");
  return (
    normalized === "docs.json" ||
    normalized === "docs.yaml" ||
    normalized.endsWith(".mdx") ||
    normalized.endsWith(".md")
  );
}

function isPingMessage(
  value: unknown,
): value is { type: "ping"; path?: string | null } {
  if (!isRecord(value) || value.type !== "ping") {
    return false;
  }

  return (
    value.path === undefined ||
    value.path === null ||
    typeof value.path === "string"
  );
}

function parsePort(value: string) {
  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new CliError("`--port` must be a valid TCP port.");
  }

  return port;
}

function serializeError(error: unknown): SerializedPreviewError {
  if (error instanceof Error) {
    return {
      name: error.name || "Error",
      message: error.message || "An unknown error occurred.",
      stack: error.stack ?? null,
      raw: null,
    };
  }

  const raw = typeof error === "string" ? error : safeJsonStringify(error);

  return {
    name: "Error",
    message: raw || "An unknown error occurred.",
    stack: null,
    raw: raw || null,
  };
}

function safeJsonStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function openBrowser(url: string) {
  return new Promise<void>((resolve, reject) => {
    const [command, ...args] =
      process.platform === "darwin"
        ? (["open", url] as const)
        : process.platform === "win32"
          ? (["cmd", "/c", "start", "", url] as const)
          : (["xdg-open", url] as const);

    const child = spawn(command, args, { stdio: "ignore", detached: true });

    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

function logStatus(
  label: string,
  detail: string,
  tone: "info" | "success" | "error" = "info",
  elapsedMs?: number,
) {
  const prefix =
    tone === "success"
      ? chalk.green("[preview]")
      : tone === "error"
        ? chalk.red("[preview]")
        : chalk.cyan("[preview]");
  const timing = elapsedMs === undefined ? "" : chalk.dim(`(${elapsedMs}ms)`);

  console.log(prefix, chalk.bold(label), timing, chalk.dim(detail));
}
