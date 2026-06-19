import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import type { Command } from "commander";
import Handlebars from "handlebars";
import { load as parseYaml } from "js-yaml";

import { wasOptionProvided } from "../lib/command";
import { CliError, isNodeError } from "../lib/errors";
import { canPrompt, promptConfirm, promptText } from "../lib/prompts";

type InitOptions = {
  name?: string;
  docs?: boolean;
  overwrite?: boolean;
};

type TemplateFile = {
  templatePath: string;
  relativeOutputPath: string;
};

type InitTemplateData = {
  name: string;
  description: string;
  configurationExample: string;
};

export function registerInitCommand(program: Command) {
  program
    .command("init")
    .description("Initialize docs.page files in a project")
    .argument("[path]", "Project directory to initialize", ".")
    .option("--name <name>", "Project name to write into docs.json")
    .option("--docs", "Create starter docs/ MDX files")
    .option("--no-docs", "Skip starter docs/ MDX files")
    .option("--overwrite", "Overwrite files created by docs.page init")
    .action(
      async (inputPath: string, options: InitOptions, command: Command) => {
        await runInit(inputPath, options, command);
      },
    );
}

async function runInit(
  inputPath: string,
  options: InitOptions,
  command: Command,
) {
  const rootDir = path.resolve(inputPath);
  const inferredName = await inferProjectName(rootDir);
  const name = await resolveProjectName(options, command, inferredName);
  const includeDocs = await resolveIncludeDocs(options, command);
  const templateFiles = await getTemplateFiles(includeDocs);
  const plan = await resolveInitPlan(rootDir, templateFiles, options, command);
  const templateData = createTemplateData(name);

  await writeTemplateFiles(rootDir, plan.writeFiles, templateData);

  if (plan.writeFiles.length > 0) {
    console.log(chalk.green("Initialized docs.page files in:"), rootDir);
    for (const file of plan.writeFiles) {
      console.log(`  ${chalk.green("+")} ${file.relativeOutputPath}`);
    }
  } else {
    console.log(chalk.yellow("No docs.page files were changed."));
  }

  if (plan.skipped.length > 0) {
    console.log(chalk.yellow("Skipped existing files:"));
    for (const skipped of plan.skipped) {
      console.log(`  ${chalk.yellow("-")} ${skipped}`);
    }
  }
}

async function resolveProjectName(
  options: InitOptions,
  command: Command,
  inferredName: string,
) {
  const providedName = options.name?.trim();

  if (providedName) {
    return providedName;
  }

  if (!wasOptionProvided(command, "name") && canPrompt()) {
    return promptText({
      message: "What is your project name?",
      flag: "--name",
      initialValue: inferredName,
      validate: (value) =>
        (value ?? "").trim().length > 0
          ? undefined
          : "Project name is required.",
    });
  }

  return inferredName;
}

async function resolveIncludeDocs(options: InitOptions, command: Command) {
  if (typeof options.docs === "boolean") {
    return options.docs;
  }

  if (!wasOptionProvided(command, "docs") && canPrompt()) {
    return promptConfirm({
      message: "Create starter docs/ files?",
      flag: "--docs or --no-docs",
      initialValue: true,
    });
  }

  return true;
}

async function resolveInitPlan(
  rootDir: string,
  templateFiles: TemplateFile[],
  options: InitOptions,
  command: Command,
) {
  const writeFiles: TemplateFile[] = [];
  const skipped: string[] = [];

  if (options.overwrite) {
    return {
      writeFiles: templateFiles,
      skipped,
    };
  }

  const configFile = templateFiles.find(
    (file) => file.relativeOutputPath === "docs.json",
  );
  const docsFiles = templateFiles.filter((file) =>
    file.relativeOutputPath.startsWith("docs/"),
  );
  const otherFiles = templateFiles.filter(
    (file) => file !== configFile && !docsFiles.includes(file),
  );

  writeFiles.push(...otherFiles);

  if (configFile) {
    if (await pathExists(path.join(rootDir, configFile.relativeOutputPath))) {
      const shouldOverwriteConfig = await resolveConfigOverwrite(command);

      if (shouldOverwriteConfig) {
        writeFiles.push(configFile);
      } else {
        skipped.push(configFile.relativeOutputPath);
      }
    } else {
      writeFiles.push(configFile);
    }
  }

  if (docsFiles.length > 0) {
    const docsDirectoryExists = await pathExists(path.join(rootDir, "docs"));
    const docsConflicts = await getConflictingOutputs(rootDir, docsFiles);

    if (!docsDirectoryExists && docsConflicts.length === 0) {
      writeFiles.push(...docsFiles);
    } else {
      const shouldWriteDocs = await resolveDocsOverwrite(
        command,
        docsConflicts,
      );

      if (shouldWriteDocs) {
        writeFiles.push(...docsFiles);
      } else {
        skipped.push("docs/");
      }
    }
  }

  return {
    writeFiles,
    skipped,
  };
}

async function resolveConfigOverwrite(command: Command) {
  if (!wasOptionProvided(command, "overwrite") && canPrompt()) {
    return promptConfirm({
      message: "docs.json already exists. Overwrite it?",
      flag: "--overwrite",
      initialValue: false,
    });
  }

  throw new CliError(
    "docs.json already exists. Re-run with --overwrite to replace it.",
  );
}

async function resolveDocsOverwrite(command: Command, docsConflicts: string[]) {
  if (!wasOptionProvided(command, "overwrite") && canPrompt()) {
    const message =
      docsConflicts.length > 0
        ? `docs/ already exists. Existing starter files: ${docsConflicts.join(", ")}. Overwrite starter docs files?`
        : "docs/ already exists. Add starter docs files?";

    return promptConfirm({
      message,
      flag: "--overwrite or --no-docs",
      initialValue: docsConflicts.length === 0,
    });
  }

  const conflictSummary =
    docsConflicts.length > 0
      ? ` Existing files: ${docsConflicts.join(", ")}.`
      : "";

  throw new CliError(
    `docs/ already exists.${conflictSummary} Re-run with --overwrite to write starter docs files, or --no-docs to skip them.`,
  );
}

async function inferProjectName(rootDir: string) {
  const packageName = await readPackageName(rootDir);

  if (packageName) {
    return packageName;
  }

  const pubspecName = await readPubspecName(rootDir);

  if (pubspecName) {
    return pubspecName;
  }

  return path.basename(rootDir) || "My Docs";
}

async function readPackageName(rootDir: string) {
  const packageJson = await readJson(path.join(rootDir, "package.json"));
  const name = getStringProperty(packageJson, "name");

  return name ? name.trim() : undefined;
}

async function readPubspecName(rootDir: string) {
  const yaml = await readText(path.join(rootDir, "pubspec.yaml"));

  if (!yaml) {
    return undefined;
  }

  const parsed = parseYaml(yaml) as unknown;
  const name = getStringProperty(parsed, "name");

  return name ? name.trim() : undefined;
}

async function getTemplateFiles(includeDocs: boolean) {
  const templateRoot = await resolveTemplateRoot();
  const files = await collectTemplateFiles(templateRoot);

  return files.filter(
    (file) => includeDocs || !file.relativeOutputPath.startsWith("docs/"),
  );
}

async function resolveTemplateRoot() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(currentDir, "../../templates/init"),
    path.resolve(currentDir, "../templates/init"),
  ];

  for (const candidate of candidates) {
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  throw new CliError("Unable to find docs.page init templates.");
}

async function collectTemplateFiles(templateRoot: string) {
  const files: TemplateFile[] = [];

  async function visitDirectory(directory: string) {
    const entries = await readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const templatePath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        await visitDirectory(templatePath);
        continue;
      }

      if (!entry.isFile() || !entry.name.endsWith(".hbs")) {
        continue;
      }

      const relativeTemplatePath = path.relative(templateRoot, templatePath);
      const relativeOutputPath = relativeTemplatePath.replace(/\.hbs$/, "");

      files.push({
        templatePath,
        relativeOutputPath: normalizePath(relativeOutputPath),
      });
    }
  }

  await visitDirectory(templateRoot);

  return files.sort((left, right) =>
    left.relativeOutputPath.localeCompare(right.relativeOutputPath),
  );
}

async function getConflictingOutputs(
  rootDir: string,
  templateFiles: TemplateFile[],
) {
  const conflicts: string[] = [];

  for (const file of templateFiles) {
    if (await pathExists(path.join(rootDir, file.relativeOutputPath))) {
      conflicts.push(file.relativeOutputPath);
    }
  }

  return conflicts;
}

function createTemplateData(name: string): InitTemplateData {
  const description = `${name} documentation`;
  const configurationExample = JSON.stringify(
    {
      $schema: "https://docs.page/schema.json",
      name,
      description,
      sidebar: [
        {
          group: "Getting Started",
          pages: [
            {
              title: "Getting to know docs.page",
              href: "/",
              icon: "rocket",
            },
            {
              title: "Next Steps",
              href: "/next-steps",
              icon: "arrow-right",
            },
          ],
        },
      ],
    },
    null,
    2,
  );

  return {
    name,
    description,
    configurationExample,
  };
}

async function writeTemplateFiles(
  rootDir: string,
  templateFiles: TemplateFile[],
  templateData: InitTemplateData,
) {
  const handlebars = Handlebars.create();

  handlebars.registerHelper("json", (value: unknown) =>
    JSON.stringify(value ?? ""),
  );

  for (const file of templateFiles) {
    const template = handlebars.compile(
      await readFile(file.templatePath, "utf8"),
    );
    const outputPath = path.join(rootDir, file.relativeOutputPath);

    await mkdir(path.dirname(outputPath), { recursive: true });
    await writeFile(outputPath, template(templateData));
  }
}

async function readJson(filePath: string) {
  const text = await readText(filePath);

  if (!text) {
    return undefined;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}

async function readText(filePath: string) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return undefined;
    }

    throw error;
  }
}

async function pathExists(filePath: string) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return false;
    }

    throw error;
  }
}

function getStringProperty(value: unknown, key: string) {
  if (typeof value !== "object" || value === null || !(key in value)) {
    return undefined;
  }

  const record = value as Record<string, unknown>;

  return typeof record[key] === "string" ? record[key] : undefined;
}

function normalizePath(filePath: string) {
  return filePath.split(path.sep).join(path.posix.sep);
}
