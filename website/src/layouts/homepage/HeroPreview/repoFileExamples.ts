import { INITIAL_DOCS_JSON } from "./config";

export const REPO_FILE_KEYS = [
  "docs.json",
  "docs/install/web.mdx",
  "docs/index.mdx",
  "README.md",
] as const;

export type RepoFileKey = (typeof REPO_FILE_KEYS)[number];

export function tabTitleForFile(path: RepoFileKey): string {
  return path.split("/").pop() ?? path;
}

export function tabTagForFile(path: RepoFileKey): "JSON" | "MDX" | "MD" {
  if (path === "docs.json") return "JSON";
  if (path.endsWith(".mdx")) return "MDX";
  return "MD";
}

export function editorLanguageForFile(path: RepoFileKey): "json" | "markdown" {
  return path === "docs.json" ? "json" : "markdown";
}

export const INITIAL_REPO_FILES: Record<RepoFileKey, string> = {
  "docs.json": INITIAL_DOCS_JSON,
  "docs/install/web.mdx": `import { Callout } from "components/Callout"

# Web install

Run the CLI in your project root, then add pages under <code>docs/</code> and point your sidebar at them in <code>docs.json</code>.

<Callout type="tip">Change <code>theme.primary</code> in <code>docs.json</code> to match your brand; the live preview on the right updates in real time.</Callout>
`,
  "docs/index.mdx": `# foo

This is the overview page. Your sidebar, title, and theme all come from **docs.json** in the panel beside this file.
`,
  "README.md": `# foo

> Agent-friendly documentation, generated from this repo and published to **docs.page**.

- Edit Markdown and MDX under \`docs/\`
- Configure navigation in \`docs.json\` (this demo reads that file live in the split preview)
`,
};