---
title: Getting Started
description: Get started with docs.page on your repository.
---

# Getting Started

The docs.page project reads files directly from your GitHub repository. To get started:

1. Add a `docs` directory to any **public** GitHub repository.
2. Create a `index.md` file.
3. Add some Markdown content.
4. View your documentation.

The documentation is available by providing the repositories owner and name after the domain:

```
// https://github.com/acme/awesome-project
https://docs.page/acme/awesome-project
```

## Working with Markdown

The project supports rendering all [GitHub-flavored Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

Under the hood, [MDX](https://github.com/mdx-js/mdx) is enabled which allows the use of [Custom Components](/components).

