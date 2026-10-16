---
# Guard only: Bash is not granted in this case, so it is withheld and this always passes. If anyone ever
# runs the suite with --allow-tools Bash, a `docs agent create` call fails the case here.
type: tool_used
tool: Bash
input_match: 'agent\s+create'
min: 0
max: 0
---
