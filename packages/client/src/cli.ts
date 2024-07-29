#!/usr/bin/env node

import path from "node:path";
import { program } from "commander";
import { check } from "./check";

// Setup the program
program.name("docs.page").version("0.1.0").description("docs.page CLI");

// Add the check command
program
	.command("check")
	.description("Check the validity of the docs")
	// Path to the directory to check, defaults to current directory
	.argument(
		"[path]",
		"Path to the relative directory to check. Defaults to the current directory.",
	)
	.action((input: unknown, o) => {
		const relativePath = String(input || ".");
		const absolutePath = path.resolve(relativePath);

		for (const result of check(absolutePath)) {
			console.log(result);
		}
	});

program.parse(process.argv);
