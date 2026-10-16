---
description: A custom heading anchor must use markdown ##, never the unregistered <Heading> component.
max_turns: 15
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit]
---

Add a "Configuration" section to docs/index.mdx, after Usage, with a sentence saying the client reads ACME_API_KEY from the environment. Other pages are going to link to it as #config, so the section needs that custom anchor id rather than the default one.
