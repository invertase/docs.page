---
title: Frontmatter
description: Learn about the options available via page Frontmatter.
---

# Frontmatter

Frontmatter is a way to customize metadata of a page directly within your Markdown files. The metadata properties can
be added to Markdown pages by adding frontmatter blocks to the top of any page.

```text title=Example Frontmatter
---
title: Welcome to Awesome Project
---

# Welcome!
```

## title

Sets the metadata title of the document and is also used on any social Open Graph & Twitter tags.

| Key     | Type     | Default |
| ------- | -------- | ------- |
| `title` | `string` |         |

```text
---
title: Awesome Project
---
```

## description

Sets the metadata description of the document and is also used on any social Open Graph & Twitter tags.

| Key           | Type     | Default |
| ------------- | -------- | ------- |
| `description` | `string` |         |

```text
---
description: An awesome description about my Awesome Project.
---
```

## image

A URL which points to an image used as the social preview. Fallback to the `config.socialPreview` (if one is set).

| Key     | Type     | Default |
| ------- | -------- | ------- |
| `image` | `string` |         |

```text
---
image: https://mycdn.com/foo.png
---
```

## tableOfContents

Whether the table of contents for this page will be shown alongside the content.

| Key               | Type      | Default |
| ----------------- | --------- | ------- |
| `tableOfContents` | `boolean` | `true`  |

```text
---
tableOfContents: false
---
```

## layout

The layout type this page will be rendered with, can be one of `default`, `wide` or `full`.

| Key      | Type     | Default     |
| -------- | -------- | ----------- |
| `layout` | `Layout` | `'default'` |

| Layout    | Width   |
| --------- | ------- |
| `default` | `72rem` |
| `wide`    | `80rem` |
| `full`    | `100%`  |

```text
---
layout: full
---
```

## sidebar

Whether the sidebar (if provided in your `docs.json`) will show for this page.

| Key       | Type      | Default |
| --------- | --------- | ------- |
| `sidebar` | `boolean` | `true`  |

```text
---
sidebar: false
---
```

## redirect

A path which if set, will instantly redirect the user. If set, none of the other frontmatter or Markdown on the page will be shown/processed.

Can be a internal path or external URL.

| Key        | Type     | Default |
| ---------- | -------- | ------- |
| `redirect` | `string` |         |

```text title=index.md
---
redirect: /getting-started
redirect: https://github.com/acme/awesome-project
---
```
