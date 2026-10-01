---
# docs/index.mdx must not use <Heading>: it is not in the renderer's component map and renders a red error box.
type: regex
target: { source: file, path: docs/index.mdx }
pattern: '<Heading\b'
match: not_contains
weight: 2
---
