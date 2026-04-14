import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

import type { Command } from "commander";
import chokidar from "chokidar";
import chalk from "chalk";

type PreviewOptions = {
  port?: number;
  browser: boolean;
};

type GlobalCliOptions = {
  apiUrl?: string;
};

type PreviewEvent = {
  type: "snapshot" | "error";
  revision: number;
  path: string;
  filePath?: string | null;
  paths?: string[];
  config?: {
    json: string | null;
    yaml: string | null;
  };
  markdown?: string | null;
  candidates?: string[];
  error?: string;
  rootDir: string;
  at: string;
};

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
      try {
        const globalOptions = command.optsWithGlobals() as GlobalCliOptions;
        const apiBase = getApiBase(globalOptions.apiUrl);
        const rootDir = process.cwd();
        const localServer = startPreviewServer({
          rootDir,
          requestedPort: options.port,
        });
        const localUrl = `http://localhost:${localServer.port}`;
        const browserUrl = new URL("/preview", `${apiBase}/`);
        browserUrl.searchParams.set("url", localUrl);

        console.log(
          chalk.green("Local preview server started."),
          `Watching ${chalk.yellow(rootDir)}`,
        );
        console.log(`Local server: ${chalk.cyan(localUrl)}`);
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

        process.once("SIGINT", () => {
          void shutdown();
        });
        process.once("SIGTERM", () => {
          void shutdown();
        });
      } catch (error) {
        console.error(chalk.red(getErrorMessage(error)));
        process.exit(1);
      }
    });
}

function startPreviewServer({
  rootDir,
  requestedPort,
}: {
  rootDir: string;
  requestedPort?: number;
}) {
  let currentPath = "";
  let revision = 0;
  let debounceTimer: ReturnType<typeof setTimeout> | undefined;
  const pendingPaths = new Set<string>();
  const encoder = new TextEncoder();
  const clients = new Set<ReadableStreamDefaultController<Uint8Array>>();

  function send(controller: ReadableStreamDefaultController<Uint8Array>, event: PreviewEvent) {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
  }

  function broadcast(event: PreviewEvent) {
    for (const controller of clients) {
      send(controller, event);
    }
  }

  function getSnapshot(changedPaths?: string[]): PreviewEvent {
    const snapshot = readPreviewSnapshot(rootDir, currentPath);

    revision += 1;

    if (!snapshot.ok) {
      return {
        type: "error",
        revision,
        path: snapshot.docPath || "index",
        filePath: null,
        paths: changedPaths,
        error: snapshot.error,
        candidates: snapshot.candidates,
        rootDir,
        at: new Date().toISOString(),
      };
    }

    return {
      type: "snapshot",
      revision,
      path: snapshot.docPath || "index",
      filePath: snapshot.filePath,
      paths: changedPaths,
      config: snapshot.config,
      markdown: snapshot.markdown,
      candidates: snapshot.candidates,
      rootDir,
      at: new Date().toISOString(),
    };
  }

  function flushPendingChanges() {
    if (pendingPaths.size === 0) {
      return;
    }

    broadcast(getSnapshot(Array.from(pendingPaths).sort()));

    pendingPaths.clear();
  }

  const watcher = chokidar.watch(["docs.json", "docs"], {
    cwd: rootDir,
    ignoreInitial: true,
  });

  watcher.on("all", (eventName, changedPath) => {
    pendingPaths.add(`${eventName}:${normalizeFilePath(changedPath)}`);

    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      flushPendingChanges();
    }, 500);
  });

  const server = Bun.serve({
    hostname: "localhost",
    port: requestedPort ?? 0,
    idleTimeout: 0,
    fetch(request) {
      const url = new URL(request.url);

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: createCorsHeaders(),
        });
      }

      if (url.pathname === "/events") {
        return new Response(
          new ReadableStream({
            start(controller) {
              clients.add(controller);

              send(controller, getSnapshot());

              const keepAlive = setInterval(() => {
                controller.enqueue(encoder.encode(": keep-alive\n\n"));
              }, 15000);

              const close = () => {
                clearInterval(keepAlive);
                clients.delete(controller);
              };

              request.signal.addEventListener("abort", close);
            },
            cancel() {
              // The abort handler removes the controller from the active set.
            },
          }),
          {
            headers: {
              ...createCorsHeaders(),
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
              Connection: "keep-alive",
            },
          },
        );
      }

      if (url.pathname === "/path" && request.method === "POST") {
        return request
          .json()
          .then((body: unknown) => {
            const payload =
              typeof body === "object" && body !== null
                ? (body as { path?: unknown })
                : {};
            const requestedPath =
              typeof payload.path === "string" ? payload.path : undefined;
            currentPath = normalizeDocPath(requestedPath ?? null);

            const event = getSnapshot();
            broadcast(event);

            return json({
              ok: event.type === "snapshot",
              path: currentPath || "index",
              revision,
            });
          })
          .catch(() => json({ error: "Request body must be valid JSON." }, 400));
      }

      if (url.pathname === "/") {
        const snapshot = readPreviewSnapshot(rootDir, currentPath);
        return json({
          ok: snapshot.ok,
          revision,
          rootDir,
          path: currentPath || "index",
          filePath: snapshot.ok ? snapshot.filePath : null,
          candidates: snapshot.candidates,
          error: snapshot.ok ? null : snapshot.error,
        });
      }

      return json({ error: "Not found." }, 404);
    },
  });

  return {
    port: server.port,
    async stop() {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      await watcher.close();
      server.stop(true);
    },
  };
}

function readPreviewSnapshot(rootDir: string, requestedPath: string) {
  const configPath = path.join(rootDir, "docs.json");
  const yamlConfigPath = path.join(rootDir, "docs.yaml");
  const docsDir = path.join(rootDir, "docs");

  if (!fs.existsSync(configPath)) {
    return {
      ok: false,
      docPath: requestedPath,
      error: `No docs.json file was found in ${rootDir}.`,
      candidates: [] as string[],
    };
  }

  if (!fs.existsSync(docsDir) || !fs.statSync(docsDir).isDirectory()) {
    return {
      ok: false,
      docPath: requestedPath,
      error: `No docs directory was found in ${rootDir}.`,
      candidates: [] as string[],
    };
  }

  const docPath = normalizeDocPath(requestedPath);
  const candidates = getDocCandidates(docPath);
  const filePath = candidates.find((candidate) =>
    fs.existsSync(path.join(rootDir, candidate)),
  );

  if (!filePath) {
    return {
      ok: false,
      docPath,
      error: `No document was found for "${docPath || "index"}".`,
      candidates,
    };
  }

  return {
    ok: true,
    docPath,
    filePath,
    config: {
      json: fs.readFileSync(configPath, "utf8"),
      yaml: fs.existsSync(yamlConfigPath)
        ? fs.readFileSync(yamlConfigPath, "utf8")
        : null,
    },
    markdown: fs.readFileSync(path.join(rootDir, filePath), "utf8"),
    candidates,
  };
}

function getDocCandidates(docPath: string) {
  if (!docPath || docPath === "index") {
    return ["docs/index.mdx"];
  }

  return [`docs/${docPath}.mdx`, `docs/${docPath}/index.mdx`];
}

function normalizeDocPath(requestedPath: string | null) {
  const trimmedPath = requestedPath?.trim().replace(/^\/+|\/+$/g, "") ?? "";
  return trimmedPath === "index" ? "" : trimmedPath;
}

function normalizeFilePath(filePath: string) {
  return filePath.split(path.sep).join("/");
}

function createCorsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Private-Network": "true",
  };
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...createCorsHeaders(),
      "Content-Type": "application/json",
    },
  });
}

function parsePort(value: string) {
  const port = Number.parseInt(value, 10);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("`--port` must be a valid TCP port.");
  }

  return port;
}

function getApiBase(apiUrl?: string) {
  const configuredBase = apiUrl?.trim();

  if (!configuredBase) {
    throw new Error("`apiUrl` was not provided.");
  }

  return configuredBase.replace(/\/+$/, "");
}

function openBrowser(url: string) {
  return new Promise<void>((resolve, reject) => {
    const [command, ...args] =
      process.platform === "darwin"
        ? (["open", url] as const)
        : process.platform === "win32"
          ? (["cmd", "/c", "start", "", url] as const)
          : (["xdg-open", url] as const);

    const child = spawn(command, args, {
      stdio: "ignore",
      detached: true,
    });

    child.once("error", reject);
    child.once("spawn", () => {
      child.unref();
      resolve();
    });
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "An unknown error occurred.";
}
