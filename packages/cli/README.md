# @docs.page/cli

Command-line tool for [docs.page](https://docs.page) — initialize projects, validate documentation, preview locally, and manage documentation agents.

## Installation

Run without installing:

```bash
npx @docs.page/cli <command>
```

Or install globally:

```bash
npm install -g @docs.page/cli
```

The `docs` and `docs.page` binaries are both available after install.

## Commands

### `init`

Scaffold a new docs.page project with `docs.json` and starter MDX files.

```bash
docs init
docs init ./my-project --name "My Project"
docs init --no-docs          # docs.json only
docs init --overwrite        # replace existing docs.page files
```

### `check`

Lint your documentation for broken links, missing assets, render errors, and metadata issues. Exits with code `1` when errors are found, so it works in CI.

```bash
docs check
docs check ./my-project
docs check --external-links warn --internal-links error --assets error
docs check --render error --metadata warn
```

Severity levels for checks: `off`, `warn`, `error`.

### `preview`

Start a local live-reloading preview of your documentation site. Watches `docs.json` and `docs/**/*.mdx`, then streams rendered content to the docs.page preview UI in your browser.

```bash
docs preview
docs preview --port 4000
docs preview --no-browser
```

Requires a valid `docs.json` (or `docs.yaml`) and at least one `.mdx` file under `docs/`.

### `agent`

Manage docs.page documentation agents for a GitHub repository.

```bash
docs agent create --repo org/repo --provider openai --apikey sk-...
docs agent delete --repo org/repo
```

Supported providers: `openai`, `anthropic`, `google`, `xai`.

## Global options

```bash
docs --api-url https://your-api.example.com <command>
```

Defaults to the `DOCS_PAGE_API_BASE` environment variable, or the production docs.page API.

## Documentation

Learn more at [docs.page](https://use.docs.page/cli).
