# scaffold-docs

A skill for writing technical documentation for human readers, iteratively, with author reviews at each step.

## Principles

1. **Write for a specific audience.** You write documentation *for* someone. A primary audience governs every choice: narrative selection, scaffolding, benefit framing, what to explain, what to skip. Secondary audiences are kept in mind, but they never outrank the primary.
2. **Build a mental model.** The job of documentation written for humans is to establish a mental model that allows for reasoning about a library. Exhaustive details are for the agents.
3. **Scaffold information.** Organize the documentation by what the primary audience is trying to do and in a manner that helps them incrementally build a mental model. Source-code directory structure is rarely the right structure for the docs.
4. **Communicate intent.** Design decisions help support mental models by explaining why something works the way it does. The agent should use code comments, naming choices, and code smells as evidence of intent.
5. **Quality writing matters.** Prose quality is part of the deliverable. This skill helps, but humans discernment and style is needed (*especially* in the “Getting Started” section).
6. **The author remains in the loop.** Agents still struggle with structure, empathy, and quality writing. This process is designed for user guidance at critical moments.

## What it does

`scaffold-docs` guides an agent through producing a three-tier documentation set for a code library:

- **Getting Started:** a narrative tutorial covering a single representative use case
- **Diving Deeper:** one file per topic, organized around intent and design decisions
- **Reference:** per-module API spec, lookup-oriented

Each section is built in passes: structure first, then headers and topic sentences, then full prose. The agent pauses for your review between passes and does not advance until you approve.

Key principles baked in: write for a specific audience, build the reader's mental model before enumerating API surface, explain *why* over *what*, and apply Strunk & White prose standards throughout.

You will spend most of *your* time working on **Getting Started**. That's where agents need the most help.

## Installation

Copy or symlink this folder into your Claude Code skills directory:

```
~/.claude/skills/scaffold-docs/
```

## Usage

Most usage will invoke the skill directly, beginning the process with a clean context:

```
/scaffold-docs
```
