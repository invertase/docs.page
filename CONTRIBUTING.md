# Contributing

This repository uses [Bun](https://bun.sh/) for workspace and dependency management. To get started, run the following commands:

```bash
bun install
```

The repository is structured as follows:

- `app`: The Next.js application running the docs.page website.
- `packages/cli`: A CLI for running various commands and scripts for initialization, checking etc. Used locally and on CI environments.

## Running docs.page

Generally, you'll want to interface with the website and api. To run these concurrently, you can use the following command:

```bash
cd app && bun dev
```

This will start the website on `http://localhost:3000`. 

> The API requires a `GITHUB_APP_ID` and `GITHUB_APP_PRIVATE_KEY` to be set in your environment. These are used to authenticate with the GitHub API. You can create a GitHub App in your GitHub account settings.