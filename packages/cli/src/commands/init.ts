import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { confirm } from "@inquirer/prompts";
import type { Command } from "commander";

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("Initializes new docs.page files")
    .argument("[path]", "Path to the relative directory to initilize in.")
    .action(async (input: unknown, o) => {
      const relativePath = String(input || ".");
      const absolutePath = path.resolve(relativePath);

      const confirmSetup = await confirm({
        message: `Are you sure you want to setup and install docs.page in ${chalk.yellow(
          absolutePath
        )}?`,
        default: true,
      });

      if (!confirmSetup) {
        console.log(chalk.red("Initialization cancelled."));
        process.exit(1);
      }

      let confirmOverwrite = false;

      if (fs.existsSync(absolutePath)) {
        confirmOverwrite = await confirm({
          message: `Directory "${chalk.yellow(
            absolutePath
          )}" already exists. Do you want to overwrite any existing files?`,
          default: true,
        });
      }

      // Create the directory if it doesn't exist.
      if (!fs.existsSync) {
        fs.mkdirSync(absolutePath, { recursive: true });
      }

      const configurationFilePath = path.join(absolutePath, "docs.json");
      const documentationPath = path.join(absolutePath, "docs");
      const docsDirectoryExists = fs.existsSync(documentationPath);

      if (fs.existsSync(configurationFilePath) && !confirmOverwrite) {
        console.log(
          chalk.red("Configuration file 'docs.json' already exists.")
        );
        process.exit(1);
      }

      if (docsDirectoryExists && !confirmOverwrite) {
        console.log(
          chalk.red("Documentation directory 'docs/' already exists.")
        );
        process.exit(1);
      }

      // Create the directory if it doesn't exist.
      if (!docsDirectoryExists) {
        fs.mkdirSync(documentationPath, { recursive: true });
      }

      const createdFiles = [
        ` - ${chalk.green(
          "docs.json"
        )}: Configuration file for your documentation site`,
      ];

      // Write the configuration file
      fs.writeFileSync(
        configurationFilePath,
        jsonConfiguration({
          sidebar: true,
        })
      );

      fs.writeFileSync(path.join(documentationPath, "index.mdx"), indexPage);
      fs.writeFileSync(
        path.join(documentationPath, "next-steps.mdx"),
        nextStepsPage
      );

      createdFiles.push(
        ` - ${chalk.green(
          "docs/index.mdx"
        )}: The home page of your documentation site`
      );

      createdFiles.push(
        ` - ${chalk.green(
          "docs/next-steps.mdx"
        )}: A page to help you get started with docs.page`
      );

      console.log(chalk.green("Files created:"));
      console.log(createdFiles.join("\n"));
      console.log("\n");

      console.log(
        chalk.green("Initialization complete."),
        "To preview your documentation site, vist https://docs.page/preview in your browser."
      );
    });
}

const jsonConfigurationSidebar = `[
  {
    "group": "Getting Started",
    "pages": [
      {
        "title": "Getting to know docs.page",
        "href": "/",
        "icon": "rocket"
      },
      {
        "title": "Next Steps",
        "href": "/next-steps",
        "icon": "arrow-right"
      }
    ]
  }
]`;

function jsonConfiguration({ sidebar }: { sidebar: boolean }) {
  return `{
  "name": "My Docs",
  "description": "My documentation site",
  "sidebar": ${sidebar ? jsonConfigurationSidebar : "[]"}
}`;
}

const indexPage = `---
title: Welcome to docs.page!
description: Get started with docs.page
---

Welcome to docs.page! The init command you just ran has created a basic file struture in your project to help you get started.

## Walkthrough

### Configuration

In the root of your directory a new \`docs.json\` file has been created. This file is used to configure your documentation site. You can customize the name, description, and sidebar, theme, logos and more using this file.

Here's a basic example of what the file looks like:

\`\`\`
${jsonConfiguration({ sidebar: true })}
\`\`\`

To learn more about the advanced configuration options, check out the [docs](https://use.docs.page/configuration).

### Content

docs.page uses the \`docs\` directory to store your documentation pages. Two pages have been created for you:

- \`index.mdx\` - The home page of your documentation site, resolves to the root URL.
- \`next-steps.mdx\` - A page to help you get started with docs.page, resolves to \`/next-steps\`.

Documentation can be written using the standard [GitHub Flavored Markdown Spec](https://github.github.com/gfm/) and also supports the use of [MDX](https://mdxjs.com/), 
with the ability to render custom [components](https://use.docs.page/components) for more advanced use cases.

## Preview

To preview your documentation site, head over to [https://docs.page/preview](https://docs.page/preview) in your browser and open this directory.

Previewing your documentation site will allow you to see the changes you make in real-time before you publish to the world.
`;

const nextStepsPage = `---
title: Next Steps
description: What to do next
---

Now that you have initialized your docs.page project, here are some next steps to get you started:

- [Configuring Your Site](https://use.docs.page/configuration): Learn how to configure your documentation site using the \`docs.json\` file.
- [Writing Content](https://use.docs.page/writing-content): Learn how to write content using Markdown in your documentation site.
- [Components](https://use.docs.page/components): Use built in components to improve the readability of your documentation.
- [Publishing your site](https://use.docs.page/publishing): Publish your docs to a GitHub repository for instant access to your documentation.

There's a lot more to discover with docs.page - head over to the [docs](https://use.docs.page) to learn more.
`;
