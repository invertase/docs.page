# @docs.page/cli

The docs.page CLI provides useful commands for managing your documentation via [https://docs.page](https://docs.page).

## Commands

### `init`

Initializes a new documentation project in the current directory. This command creates a `docs.json` file and a `docs` folder in the root of the project.

```sh
npx @docs.page/cli init new-project
```

### `check`

Checks the documentation for issues, such as invalid links.

```sh
npx @docs.page/cli check
```