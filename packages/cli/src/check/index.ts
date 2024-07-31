import fs from "node:fs";
import path from "node:path";
import { checkConfiguration } from "./configuration";
import { checkRelativeLinks } from "./relative-links";
import type { CheckResult, Route } from "./types";
export type * from "./types";

// Returns all relevant files in the directory.
function getFiles(absolutePath: string): Set<string> {
	const exists = fs.existsSync(absolutePath);

	if (!exists) {
		throw new Error(`The path "${absolutePath}" does not exist.`);
	}

	const files = new Set<string>();

	const nodes = fs.readdirSync(absolutePath, {
		withFileTypes: true,
		recursive: true,
	});

	for (const file of nodes) {
		if (
			file.isFile() &&
			(["docs.json", "docs.yaml"].includes(file.name) ||
				file.name.startsWith("docs/"))
		) {
			files.add(file.name);
		}
	}

	return files;
}

export function* check(absolutePath: string): Generator<CheckResult> {
	// Get all the files in the directory.
	const files = getFiles(absolutePath);

	// There must be a docs.json (or deprecated docs.yaml) file in the directory.
	if (!files.has("docs.json") && !files.has("docs.yaml")) {
		yield {
			type: "error",
			message:
				"Directory is missing a configuration file. Expected a `docs.json` file in the root of the directory.",
			filePath: absolutePath,
			line: 0,
			column: 0,
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
			content: filePath.endsWith(".mdx")
				? fs.readFileSync(path.join(absolutePath, filePath), "utf-8")
				: "",
		});
	}

	try {
		let configFile: string | undefined;

		// Get the configuration file
		if (files.has("docs.json")) {
			configFile = fs.readFileSync(
				path.join(absolutePath, "docs.json"),
				"utf-8",
			)!;
		} else if (files.has("docs.yaml")) {
			configFile = fs.readFileSync(
				path.join(absolutePath, "docs.yaml"),
				"utf-8",
			)!;
		}

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
