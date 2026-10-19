# Agent skills

Repository-wide agent skills live here — one folder per skill with a `SKILL.md` entry point.

To add a skill: create `skills/{skill-name}/SKILL.md` and mention it in [AGENTS.md](../AGENTS.md) if it should be discoverable by default.

## Install from skills.sh

These skills are installable with the [skills](https://skills.sh) CLI (no separate registry submit — public GitHub + `npx skills add` is the publish path):

```bash
# First-time docs.page setup (Quickstart only)
npx skills add invertase/docs.page --skill install-docs-page

# List skills in this repo without installing
npx skills add invertase/docs.page --list
```

- Skill page: [skills.sh/invertase/docs.page/install-docs-page](https://skills.sh/invertase/docs.page/install-docs-page)
- Repo page: [skills.sh/invertase/docs.page](https://skills.sh/invertase/docs.page)

## Skills

- [review-doc](review-doc/) — review a `docs/*.mdx` page against writing checks, apply unmuted findings by default, and loop until failing is 0.
- [install-docs-page](install-docs-page/) — first-time docs.page install via Quickstart only. Listed on [skills.sh](https://skills.sh/invertase/docs.page/install-docs-page).
