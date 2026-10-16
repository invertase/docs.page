---
# docs.json has "logo" as an object that references /logo.svg.
type: regex
target: { source: file, path: docs.json }
pattern: '"logo"\s*:\s*\{[^}]*"/logo\.svg"'
weight: 2
---
