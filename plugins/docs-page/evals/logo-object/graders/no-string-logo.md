---
# docs.json never has "logo" as a plain string.
type: regex
target: { source: file, path: docs.json }
pattern: '"logo"\s*:\s*"'
match: not_contains
---
