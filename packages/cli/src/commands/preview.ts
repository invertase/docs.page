// import fs from "node:fs";
// import path from "node:path";
// import { spawn } from "node:child_process";
// import frontmatter from "gray-matter";

// import type { ServerWebSocket } from "bun";
// import type { Command } from "commander";
// import chokidar from "chokidar";
// import chalk from "chalk";
// import yaml from "js-yaml";

// type PreviewOptions = {
//   port?: number;
//   browser: boolean;
// };

// type GlobalCliOptions = {
//   apiUrl?: string;
// };

// type PreviewConfig = {
//   json: string | null;
//   yaml: string | null;
// };

// type PreviewResponseEvent = {
//   type: "response";
//   revision: number;
//   pathname: string;
//   filePath: string | null;
//   changedPaths?: string[];
//   config: PreviewConfig;
//   markdown: string | null;
//   bundle: PreviewBundle | null;
//   candidates: string[];
//   error: string | null;
//   errorDetails: SerializedPreviewError | null;
//   rootDir: string;
//   at: string;
// };

// type SerializedPreviewError = {
//   name: string;
//   message: string;
//   stack: string | null;
//   raw: string | null;
// };

// type PreviewBundle = {
//   markdown: string;
//   frontmatter: Record<string, unknown>;
//   headings: HeadingNode[];
// };

// type PreviewPingMessage = {
//   type: "ping";
//   path?: string | null;
// };

// type PreviewSocketData = {
//   docPath: string;
// };

// type PreviewSnapshot = {
//   docPath: string;
//   filePath: string | null;
//   config: PreviewConfig;
//   markdown: string | null;
//   candidates: string[];
//   error: string | null;
// };

// export function registerPreviewCommand(program: Command) {
//   program
//     .command("preview")
//     .description("Preview your documentation site locally")
//     .option(
//       "--port <number>",
//       "Port to bind the local preview server to",
//       parsePort,
//     )
//     .option("--no-browser", "Do not open the preview page automatically")
//     .action(async (options: PreviewOptions, command: Command) => {
//       try {
//         const globalOptions = command.optsWithGlobals() as GlobalCliOptions;
//         const apiBase = getApiBase(globalOptions.apiUrl);
//         const rootDir = process.cwd();
//         const localServer = startPreviewServer({
//           rootDir,
//           requestedPort: options.port,
//         });
//         const localUrl = `http://localhost:${localServer.port}`;
//         const socketUrl = new URL(localUrl);
//         socketUrl.protocol = "ws:";
//         const browserUrl = new URL("/preview", `${apiBase}/`);
//         browserUrl.searchParams.set("url", socketUrl.toString());

//         console.log(
//           chalk.green("Local preview server started."),
//           `Watching ${chalk.yellow(rootDir)}`,
//         );
//         console.log(`Local server: ${chalk.cyan(localUrl)}`);
//         console.log(`WebSocket server: ${chalk.cyan(socketUrl.toString())}`);
//         console.log(`Preview URL: ${chalk.cyan(browserUrl.toString())}`);

//         if (options.browser) {
//           await openBrowser(browserUrl.toString()).catch(() => {
//             console.log(
//               chalk.yellow("Unable to open your browser automatically."),
//               `Open ${chalk.cyan(browserUrl.toString())} manually.`,
//             );
//           });
//         }

//         const shutdown = async () => {
//           await localServer.stop();
//           process.exit(0);
//         };

//         process.once("SIGINT", () => {
//           void shutdown();
//         });
//         process.once("SIGTERM", () => {
//           void shutdown();
//         });
//       } catch (error) {
//         console.error(chalk.red(getErrorMessage(error)));
//         process.exit(1);
//       }
//     });
// }

// function startPreviewServer({
//   rootDir,
//   requestedPort,
// }: {
//   rootDir: string;
//   requestedPort?: number;
// }) {
//   let currentPath = "";
//   let revision = 0;
//   let debounceTimer: ReturnType<typeof setTimeout> | undefined;
//   const pendingPaths = new Set<string>();
//   const clients = new Set<ServerWebSocket<PreviewSocketData>>();

//   async function sendResponse(
//     socket: ServerWebSocket<PreviewSocketData>,
//     changedPaths?: string[],
//   ) {
//     const snapshot = readPreviewSnapshot(rootDir, socket.data.docPath);
//     const previewPathname = toPathname(snapshot.docPath);
//     let bundle: PreviewBundle | null = null;
//     let markdown = snapshot.markdown;
//     let error = snapshot.error;
//     let errorDetails: SerializedPreviewError | null = error
//       ? {
//           name: "PreviewError",
//           message: error,
//           stack: null,
//           raw: null,
//         }
//       : null;

//     if (!error && snapshot.markdown) {
//       const startedAt = Date.now();

//       logPreviewStatus(
//         "bundling",
//         `${previewPathname}${snapshot.filePath ? ` from ${snapshot.filePath}` : ""}`,
//       );

//       try {
//         bundle = buildPreviewBundle(snapshot.markdown, snapshot.config);
//         markdown = bundle.markdown;
//         logPreviewStatus(
//           "bundled",
//           previewPathname,
//           "success",
//           Date.now() - startedAt,
//         );
//       } catch (bundleError) {
//         errorDetails = serializePreviewError(bundleError);
//         error = errorDetails.message;
//         logPreviewStatus(
//           "bundle error",
//           `${previewPathname}: ${error}`,
//           "error",
//           Date.now() - startedAt,
//         );
//       }
//     } else if (error) {
//       logPreviewStatus("preview error", `${previewPathname}: ${error}`, "error");
//     }

//     revision += 1;

//     const event: PreviewResponseEvent = {
//       type: "response",
//       revision,
//       pathname: toPathname(snapshot.docPath),
//       filePath: snapshot.filePath,
//       changedPaths,
//       config: snapshot.config,
//       markdown,
//       bundle,
//       candidates: snapshot.candidates,
//       error,
//       errorDetails,
//       rootDir,
//       at: new Date().toISOString(),
//     };

//     socket.send(JSON.stringify(event));
//   }

//   function broadcastResponses(changedPaths?: string[]) {
//     for (const socket of clients) {
//       void sendResponse(socket, changedPaths);
//     }
//   }

//   function flushPendingChanges() {
//     if (pendingPaths.size === 0) {
//       return;
//     }

//     broadcastResponses(Array.from(pendingPaths).sort());

//     pendingPaths.clear();
//   }

//   const watcher = chokidar.watch(["docs.json", "docs.yaml", "docs/**/*.mdx"], {
//     cwd: rootDir,
//     ignoreInitial: true,
//   });

//   watcher.on("all", (eventName, changedPath) => {
//     const normalizedPath = normalizeFilePath(changedPath);
//     pendingPaths.add(`${eventName}:${normalizedPath}`);
//     logPreviewStatus("change detected", `${eventName}:${normalizedPath}`);

//     if (debounceTimer) {
//       clearTimeout(debounceTimer);
//     }

//     debounceTimer = setTimeout(() => {
//       flushPendingChanges();
//     }, 500);
//   });

//   const server = Bun.serve({
//     hostname: "localhost",
//     port: requestedPort ?? 0,
//     idleTimeout: 0,
//     fetch(request) {
//       const url = new URL(request.url);

//       if (request.method === "OPTIONS") {
//         return new Response(null, {
//           status: 204,
//           headers: createCorsHeaders(),
//         });
//       }

//       if (request.headers.get("upgrade")?.toLowerCase() === "websocket") {
//         const initialPath = normalizePathname(url.searchParams.get("path"));
//         currentPath = initialPath;

//         const upgraded = server.upgrade(request, {
//           data: {
//             docPath: initialPath,
//           },
//         });

//         if (upgraded) {
//           return undefined;
//         }

//         return json({ error: "Unable to establish WebSocket connection." }, 400);
//       }

//       if (url.pathname === "/") {
//         const snapshot = readPreviewSnapshot(rootDir, currentPath);
//         return json({
//           ok: snapshot.error === null,
//           revision,
//           rootDir,
//           pathname: toPathname(snapshot.docPath),
//           filePath: snapshot.filePath,
//           candidates: snapshot.candidates,
//           error: snapshot.error,
//         });
//       }

//       return json({ error: "Not found." }, 404);
//     },
//     websocket: {
//       data: {} as PreviewSocketData,
//       open(socket) {
//         clients.add(socket);
//         void sendResponse(socket);
//       },
//       message(socket, rawMessage) {
//         const text =
//           typeof rawMessage === "string"
//             ? rawMessage
//             : Buffer.from(rawMessage).toString("utf8");

//         let payload: unknown;

//         try {
//           payload = JSON.parse(text);
//         } catch {
//           socket.send(JSON.stringify(createSocketErrorEvent({
//             revision: revision + 1,
//             docPath: socket.data.docPath,
//             rootDir,
//             error: "WebSocket message must be valid JSON.",
//           })));
//           revision += 1;
//           return;
//         }

//         if (!isPreviewPingMessage(payload)) {
//           socket.send(JSON.stringify(createSocketErrorEvent({
//             revision: revision + 1,
//             docPath: socket.data.docPath,
//             rootDir,
//             error: 'WebSocket message must be `{ "type": "ping", "path": "/..." }`.',
//           })));
//           revision += 1;
//           return;
//         }

//         const nextPath = normalizePathname(payload.path);
//         currentPath = nextPath;
//         socket.data.docPath = nextPath;
//         void sendResponse(socket);
//       },
//       close(socket) {
//         clients.delete(socket);
//       },
//     },
//   });

//   return {
//     port: server.port,
//     async stop() {
//       if (debounceTimer) {
//         clearTimeout(debounceTimer);
//       }

//       await watcher.close();
//       server.stop(true);
//     },
//   };
// }

// function readPreviewSnapshot(rootDir: string, requestedPath: string): PreviewSnapshot {
//   const configPath = path.join(rootDir, "docs.json");
//   const yamlConfigPath = path.join(rootDir, "docs.yaml");
//   const docsDir = path.join(rootDir, "docs");

//   const docPath = normalizeDocPath(requestedPath);
//   const candidates = getDocCandidates(docPath);
//   const hasDocsDir = fs.existsSync(docsDir) && fs.statSync(docsDir).isDirectory();
//   const filePath = hasDocsDir
//     ? (candidates.find((candidate) => fs.existsSync(path.join(rootDir, candidate))) ??
//       null)
//     : null;
//   const jsonConfigExists = fs.existsSync(configPath);
//   const yamlConfigExists = fs.existsSync(yamlConfigPath);
//   const config = {
//     json: jsonConfigExists ? fs.readFileSync(configPath, "utf8") : null,
//     yaml: yamlConfigExists ? fs.readFileSync(yamlConfigPath, "utf8") : null,
//   };
//   const markdown = filePath
//     ? fs.readFileSync(path.join(rootDir, filePath), "utf8")
//     : null;
//   const error = getSnapshotError({
//     rootDir,
//     docPath,
//     hasDocsDir,
//     hasJsonConfig: jsonConfigExists,
//     hasYamlConfig: yamlConfigExists,
//     hasMarkdown: markdown !== null,
//   });

//   return {
//     docPath,
//     filePath,
//     config,
//     markdown,
//     candidates,
//     error,
//   };
// }

// function getDocCandidates(docPath: string) {
//   if (!docPath || docPath === "index") {
//     return ["docs/index.mdx"];
//   }

//   return [`docs/${docPath}.mdx`, `docs/${docPath}/index.mdx`];
// }

// function normalizeDocPath(requestedPath: string | null) {
//   const trimmedPath = requestedPath?.trim().replace(/^\/+|\/+$/g, "") ?? "";
//   return trimmedPath === "index" ? "" : trimmedPath;
// }

// function normalizePathname(input: string | null | undefined) {
//   const rawPath = input?.trim() ?? "";
//   const [pathname] = rawPath.split(/[?#]/, 1);
//   return normalizeDocPath(pathname || "/");
// }

// function toPathname(docPath: string) {
//   return docPath ? `/${docPath}` : "/";
// }

// function normalizeFilePath(filePath: string) {
//   return filePath.split(path.sep).join("/");
// }

// function createCorsHeaders() {
//   return {
//     "Access-Control-Allow-Origin": "*",
//     "Access-Control-Allow-Headers": "Content-Type",
//     "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
//     "Access-Control-Allow-Private-Network": "true",
//   };
// }

// function json(data: unknown, status = 200) {
//   return new Response(JSON.stringify(data), {
//     status,
//     headers: {
//       ...createCorsHeaders(),
//       "Content-Type": "application/json",
//     },
//   });
// }

// function parsePort(value: string) {
//   const port = Number.parseInt(value, 10);

//   if (!Number.isInteger(port) || port <= 0 || port > 65535) {
//     throw new Error("`--port` must be a valid TCP port.");
//   }

//   return port;
// }

// function getApiBase(apiUrl?: string) {
//   const configuredBase = apiUrl?.trim();

//   if (!configuredBase) {
//     throw new Error("`apiUrl` was not provided.");
//   }

//   return configuredBase.replace(/\/+$/, "");
// }

// function isPreviewPingMessage(value: unknown): value is PreviewPingMessage {
//   if (typeof value !== "object" || value === null) {
//     return false;
//   }

//   const candidate = value as { type?: unknown; path?: unknown };

//   if (candidate.type !== "ping") {
//     return false;
//   }

//   return (
//     candidate.path === undefined ||
//     candidate.path === null ||
//     typeof candidate.path === "string"
//   );
// }

// function getSnapshotError({
//   rootDir,
//   docPath,
//   hasDocsDir,
//   hasJsonConfig,
//   hasYamlConfig,
//   hasMarkdown,
// }: {
//   rootDir: string;
//   docPath: string;
//   hasDocsDir: boolean;
//   hasJsonConfig: boolean;
//   hasYamlConfig: boolean;
//   hasMarkdown: boolean;
// }) {
//   if (!hasJsonConfig && !hasYamlConfig) {
//     return `No docs.json or docs.yaml file was found in ${rootDir}.`;
//   }

//   if (!hasDocsDir) {
//     return `No docs directory was found in ${rootDir}.`;
//   }

//   if (!hasMarkdown) {
//     return `No document was found for "${docPath || "index"}".`;
//   }

//   return null;
// }

// function resolveHeaderDepth(config: { json: string | null; yaml: string | null }) {
//   const parsedConfig = parsePreviewConfigObject(config);

//   if (
//     typeof parsedConfig === "object" &&
//     parsedConfig !== null &&
//     "content" in parsedConfig &&
//     typeof parsedConfig.content === "object" &&
//     parsedConfig.content !== null &&
//     "headerDepth" in parsedConfig.content
//   ) {
//     const headerDepth = parsedConfig.content.headerDepth;

//     if (
//       typeof headerDepth === "number" &&
//       Number.isInteger(headerDepth) &&
//       headerDepth >= 0
//     ) {
//       return headerDepth;
//     }
//   }

//   return 3;
// }

// function buildPreviewBundle(
//   rawMarkdown: string,
//   config: PreviewConfig,
// ): PreviewBundle {
//   const { markdown, rawMarkdownWithFrontmatter } = preparePreviewMarkdown(
//     rawMarkdown,
//     config,
//   );
//   const { data } = frontmatter(rawMarkdownWithFrontmatter);

//   return {
//     markdown,
//     frontmatter: data,
//   };
// }

// function preparePreviewMarkdown(
//   rawMarkdown: string,
//   config: PreviewConfig,
// ) {
//   const { frontmatterBlock, content } = splitMarkdownFrontmatter(rawMarkdown);
//   const markdown = replaceMoustacheVariables(resolvePreviewVariables(config), content);

//   return {
//     markdown,
//     rawMarkdownWithFrontmatter: frontmatterBlock
//       ? `${frontmatterBlock}${markdown}`
//       : markdown,
//   };
// }

// function resolvePreviewVariables(config: PreviewConfig) {
//   const parsedConfig = parsePreviewConfigObject(config);

//   if (
//     typeof parsedConfig === "object" &&
//     parsedConfig !== null &&
//     "variables" in parsedConfig &&
//     typeof parsedConfig.variables === "object" &&
//     parsedConfig.variables !== null
//   ) {
//     return parsedConfig.variables as Record<string, unknown>;
//   }

//   return {};
// }

// function parsePreviewConfigObject(config: PreviewConfig) {
//   if (config.json) {
//     return JSON.parse(config.json) as unknown;
//   }

//   if (config.yaml) {
//     return yaml.load(config.yaml);
//   }

//   return {};
// }

// function splitMarkdownFrontmatter(rawMarkdown: string) {
//   const match = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n)?/.exec(rawMarkdown);

//   if (!match) {
//     return {
//       frontmatterBlock: "",
//       content: rawMarkdown,
//     };
//   }

//   return {
//     frontmatterBlock: match[0],
//     content: rawMarkdown.slice(match[0].length),
//   };
// }

// function createSocketErrorEvent({
//   revision,
//   docPath,
//   rootDir,
//   error,
// }: {
//   revision: number;
//   docPath: string;
//   rootDir: string;
//   error: string;
// }): PreviewResponseEvent {
//   return {
//     type: "response",
//     revision,
//     pathname: toPathname(docPath),
//     filePath: null,
//     config: {
//       json: null,
//       yaml: null,
//     },
//     markdown: null,
//     bundle: null,
//     candidates: [],
//     error,
//     errorDetails: null,
//     rootDir,
//     at: new Date().toISOString(),
//   };
// }

// function openBrowser(url: string) {
//   return new Promise<void>((resolve, reject) => {
//     const [command, ...args] =
//       process.platform === "darwin"
//         ? (["open", url] as const)
//         : process.platform === "win32"
//           ? (["cmd", "/c", "start", "", url] as const)
//           : (["xdg-open", url] as const);

//     const child = spawn(command, args, {
//       stdio: "ignore",
//       detached: true,
//     });

//     child.once("error", reject);
//     child.once("spawn", () => {
//       child.unref();
//       resolve();
//     });
//   });
// }

// function getErrorMessage(error: unknown) {
//   if (error instanceof Error && error.message) {
//     return error.message;
//   }

//   return "An unknown error occurred.";
// }

// function serializePreviewError(error: unknown): SerializedPreviewError {
//   if (error instanceof Error) {
//     return {
//       name: error.name || "Error",
//       message: error.message || "An unknown error occurred.",
//       stack: error.stack ?? null,
//       raw: null,
//     };
//   }

//   const raw = typeof error === "string" ? error : safeJsonStringify(error);

//   return {
//     name: "Error",
//     message: raw || "An unknown error occurred.",
//     stack: null,
//     raw: raw || null,
//   };
// }

// function safeJsonStringify(value: unknown) {
//   try {
//     return JSON.stringify(value, null, 2);
//   } catch {
//     return String(value);
//   }
// }

// function logPreviewStatus(
//   label: string,
//   detail: string,
//   tone: "info" | "success" | "error" = "info",
//   elapsedMs?: number,
// ) {
//   const prefix =
//     tone === "success"
//       ? chalk.green("[preview]")
//       : tone === "error"
//         ? chalk.red("[preview]")
//         : chalk.cyan("[preview]");
//   const timing = elapsedMs === undefined ? "" : chalk.dim(`(${elapsedMs}ms)`);

//   console.log(prefix, chalk.bold(label), timing, chalk.dim(detail));
// }
