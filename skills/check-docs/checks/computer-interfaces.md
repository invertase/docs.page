# computer-interfaces

Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.

### language-tag

- **Scan:** every fence
- **Finding if:** no language tag
- **Skip if:** fences inside `<CodeGroup>` (not unlabeled duplicates); do not ask for copy hints or line numbers

### fence-intro

- **Scan:** the line immediately before each fence
- **Finding if:** the intro is missing or is not a complete sentence
- **Skip if:** the fence is a child of `<CodeGroup>` whose intro is on the group

### placeholders

- **Scan:** `foo`, `xxx`, and untyped dummy values in commands; placeholder style in samples
- **Finding if:** `foo` / `xxx` (except HTTP `2xx`); or a replaceable value is not `ALL_CAPS_WITH_UNDERSCORES`
- **Skip if:** `{owner}/{repo}` and `{{ variable }}` product syntax — not `ALL_CAPS` placeholders

### run-the-following

- **Scan:** `run the following command` and similar
- **Finding if:** the intro names the ritual instead of what the command does
- **Skip if:** the sentence already says what the command does

### omit-in-fence

- **Scan:** `...` / `…` inside fences; very long unwrapped command lines
- **Finding if:** omitted lines use a prose ellipsis instead of a comment in that language; or a line is unreadably long with no wrap
- **Skip if:** a real shell line that must stay together

### click-enter-select

- **Scan:** `click`, `enter`, `select`, `press` for UI
- **Finding if:** the verb does not match the control (click a field, enter a button); or the same control uses two verbs on one page
- **Skip if:** none
