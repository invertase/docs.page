#!/usr/bin/env node

const fs = require("node:fs");

const configString = `{
    "name": "docs.page",
    "theme": "#36B9B9",
    "sidebar": [
      ["Home", "/"],
      ["Another Page", "/another-page"]
    ]
  }`;

try {
	fs.mkdir("./docs", { recursive: true }, (err: Error) => {
		if (err) throw err;
		fs.writeFile("./docs/index.mdx", "# Example Docs!", (err: Error) => {
			if (err) throw err;
		});
		fs.writeFile("./docs/another-page.mdx", "# Another Page", (err: Error) => {
			if (err) throw err;
		});
	});
	fs.writeFile("./docs.json", configString, (err: Error) => {
		if (err) throw err;
	});
} catch (err) {
	console.log("Error", err);
}
