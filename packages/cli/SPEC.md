This document outlines the spec for the CLI.

## Requirements

1. [Commander](https://github.com/tj/commander.js/) - for the base CLI interface
2. [Clack](https://www.npmjs.com/package/@clack/prompts) - for interactive CLI
3. Node compatible - even though the workspace is in Bun, the CLI should be Node compatible (no `Bun` global or imports)
4. Interactive & Programatic by design - interactive by default (for humans), override with `--` options (for CI / Agents (bash))
5. Installed via `@docs.page/cli`, invoked via `docs` alias

## Commands

For reference:

Arguments = positional values passed after the base command
Options = additional configuration for the user to pass. If not provided via a `--` flag, the user is prompted via Clack.

### Global Options

1. `--api-url <url>` - defines the default base API URL to use, defaults to `process.env.DOCS_PAGE_API_BASE?.trim() || "https://docspage-production.up.railway.app",`.

### `init`

Initalizes the current project with a base docs setup:

```bash
docs init
```

Arguments:

1. `[path]` - optional, defaults to current working directory.

Options:

1. `--name` (string) - project name. If not provided, infer from (if exists), package.json, pubspec.yaml (and any others which make sense), and fallback to the project working directory name. This should be provided as a "default" in the prompting, but the user can override.
2. `--docs` (bool = true) - whether to add default `docs/` files to the project. If they already exist, check `--overwrite` / prompt.
3. `--overwrite` (bool = false) - whether to overwrite any existing `docs.json` or `docs/` files. 

The default contents should pull from a local `templates/init/{docs.json,docs/index.mdx,etc}` directory, using [handlebars](https://handlebarsjs.com/) to overwrite any values provided from the CLI.

See the existing init.ts file for content to use.

### `check`

Runs a check of the users documentation.

```bash
docs check
```

Arguments:

1. `[path]` - optional, defaults to current working directory.

Options:

1. `--external-links` (flag (error) - `off`, `warn`, `error`) - specifies whether to check external markdown links resolve.
2. `--internal-links` (flag (error) - `off`, `warn`, `error`) - specifies whether to check internal links resolve to another markdown file.
3. `--assets` (flag (error) - `off`, `warn`, `error`) - specifies whether to check any referenced links (e.g. in images) resolve to a local asset if they are relative.

Much like running a linter tool such as Biome/ESLint etc, the check flow should:

- Validate a docs.json (or docs.yaml) file exists in the working directory, and that it is parsable as JSON.
- Collate all `docs/**/*.mdx` files.
- Build a URL/path tree of those MDX files (e.g. `/docs/foo.mdx` -> `/foo`, `/docs/foo/index.mdx` -> `/foo`).
- For each MDX file, use remark/parsing to:
 1. Find all anchor nodes (external + internal links)
 2. Find all image nodes, both `![..](..)` and `<Image ... src="...">` (assets)
 3. Find any frontmatter with: `redirect`, `next` and/or `previous`
- If the link source is:
 1. Internal = ensure that the URL -> mdx file mapping exists so there would be no 404s.
 2. External = validate the URL exists (follow redirects.. should be 1xx-2xx range (I think?))

The check should stream report these back based on the correct error flag. Any errors should return a `1` exit code (for CI/CD etc).

### `agent`

A command which enables users to define agents for their repositories. An example implementation is already within the src.

Subcommands:

#### `create`

Creates a new agent configuration for the users documentation.

```bash
docs agent create
```

Options:

1. `--repo` (string, required) - The GitHub repository to add an agent for. Must be in the format `<org>/<repo>` (e.g. invertase/docs.page).
2. `--provider` (string, required) - The provider to use, one of:
 - xai
 - openai
 - anthropic
 - google
3. `--apikey` (string, required) - the API key to use for the chosen provider.
4. `--gh-auth` (string, optional) - the github auth token used to validate the user (see below).
5. `--force` (bool = false) - if the configuration for this repo is already provided, whether to force overwrite. If false, throw an error.

The `gh-token` is used on the server to validate that the user has admin permissions on the `repo` specified. If they do not, they can't add an agent. This token should by default attempt to resolve from the `gh` cli locally. See `resolveGitHubToken` in CLI currently for implementation.

Upon success from the API, a `token` is returned. This should show the user a message on how to use it, something like:

````
Your documentation agent is ready to use. Add the following configuration to your docs.json file in the <org>/<repo> repository:

```json
"agent": {
  "key": "<token>",
},
```

To learn more, view the documentation at `https://use.docs.page/agent`.
````

#### `delete`

Deletes an agent

```
docs agent delete
```

Options:

1. `--repo` (string, required) - The GitHub repository to delete an agent for. Must be in the format `<org>/<repo>` (e.g. invertase/docs.page).
2. `--gh-auth` (string, optional) - the github auth token used to validate the user (see below).

The `gh-token` is used on the server to validate that the user has admin permissions on the `repo` specified. If they do not, they can't add an agent. This token should by default attempt to resolve from the `gh` cli locally. See `resolveGitHubToken` in CLI currently for implementation.

