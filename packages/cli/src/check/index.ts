import fs from "node:fs";
import path from "node:path";
import { checkConfiguration } from "./configuration";
import { checkRelativeLinks } from "./relative-links";
import type { CheckResult, Route } from "./types";
export type * from "./types";

export async function* check(
	// A set of files in the directory to check.
	files: Set<string>,
	// Callback to get the content of a file (e.g. from fs, or a virtual file system).
	getFile: (path: string) => Promise<string>,
): AsyncGenerator<CheckResult> {
	// There must be a docs.json (or deprecated docs.yaml) file in the directory.
	if (!files.has("docs.json") && !files.has("docs.yaml")) {
		yield {
			type: "error",
			message:
				"Directory is missing a configuration file. Expected a `docs.json` file in the root of the directory.",
		};
	}

	const routes = new Map<string, Route>();

	// Extract the routes from the files
	for (const filePath of files) {
		// We only care about files within the /docs/** directory
		if (!filePath.startsWith("docs/")) {
			continue;
		}

		// Remove the docs/ prefix from the file path
		let normalizedFilePath = filePath.replace(/^docs\//, "");

		// File paths can either be /hello/world.mdx, so convert it to /hello/world
		normalizedFilePath = normalizedFilePath.replace(/\.(mdx)$/i, "");

		// If ending with index
		normalizedFilePath = normalizedFilePath.replace(/\/index$/i, "");

		// If the normalized path is index, it means the file is the index file.
		if (normalizedFilePath === "index") {
			normalizedFilePath = "";
		}

		// If the normalized path is empty, it means the file is the index file.
		normalizedFilePath = normalizedFilePath ? `/${normalizedFilePath}` : "/";

		// If there is a clash of routes (e.g. /hello/world.mdx and /hello/world/index.mdx),
		// throw an error.
		if (routes.has(normalizedFilePath)) {
			yield {
				type: "error",
				message: `There are multiple files which resolve to the same route "${normalizedFilePath}".`,
				filePath,
				line: 0,
				column: 0,
			};
		}

		// Store the file as a route.
		routes.set(normalizedFilePath, {
			filePath,
			// Don't bother reading none .mdx files, since we don't care about their content.
			content: filePath.endsWith(".mdx") ? await getFile(filePath) : "",
		});
	}

	try {
		const configFile = await getFile(
			files.has("docs.json") ? "docs.json" : "docs.yaml",
		);

		yield* checkConfiguration(routes, JSON.parse(configFile!));
	} catch {
		yield {
			type: "error",
			message: "Failed to parse the configuration file.",
			filePath: files.has("docs.json") ? "docs.json" : "docs.yaml",
			line: 0,
			column: 0,
		};
	}

	yield* checkRelativeLinks(routes);
}
