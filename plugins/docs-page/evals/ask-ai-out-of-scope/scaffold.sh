#!/usr/bin/env bash
# Minimal docs.page project in the run's empty workspace. Runs only with --scaffold.
set -euo pipefail
mkdir -p docs
cat > docs.json <<'JSON'
{
  "$schema": "https://docs.page/schema.json",
  "name": "Acme SDK",
  "description": "Docs for the Acme SDK.",
  "sidebar": [
    {
      "group": "Getting started",
      "pages": [
        { "title": "Introduction", "href": "/" }
      ]
    }
  ]
}
JSON
cat > docs/index.mdx <<'MDX'
---
title: Introduction
description: What the Acme SDK does and how to install it.
---

The Acme SDK lets you talk to the Acme API from Node.js.

## Installation

```bash
npm install @acme/sdk
```

## Usage

Create a client and call `ping()` to check your connection.
MDX
