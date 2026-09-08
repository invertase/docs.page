#!/usr/bin/env python3
"""Build evals/workers.json: one gold page per scan (hit, plus skip when Skip if exists)."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CHECKS = ROOT.parent / "checks"
OUT = ROOT / "workers.json"


def page(title: str, description: str, body: str) -> str:
    fm = f"---\ntitle: {title}\n"
    if description != "":
        fm += f"description: {description}\n"
    return fm + f"---\n\n{body.strip()}\n"


# How-to whose title/description already names what you do — skips who-you-is.
HOWTO = ("Preview locally", "Run a local preview of your docs.")
CONCEPT = ("Architecture", "How docs.page serves a GitHub repository.")
GET_STARTED = ("Get started", "Introduction to the product.")


def hit(check: str, scan: str, body: str, evidence: str, title=None, desc=None) -> dict:
    t = HOWTO[0] if title is None else title
    d = HOWTO[1] if desc is None else desc
    return {
        "id": f"{check}.{scan}.hit",
        "check": check,
        "scan": scan,
        "expect": "hit",
        "evidence_contains": evidence,
        "page": page(t, d, body),
    }


def skip(check: str, scan: str, body: str, title=None, desc=None) -> dict:
    t = HOWTO[0] if title is None else title
    d = HOWTO[1] if desc is None else desc
    return {
        "id": f"{check}.{scan}.skip",
        "check": check,
        "scan": scan,
        "expect": "skip",
        "page": page(t, d, body),
    }


def cases() -> list[dict]:
    t, d = HOWTO
    c_t, c_d = CONCEPT
    g_t, g_d = GET_STARTED
    out: list[dict] = []

    # --- person-and-voice ---
    out += [
        hit("person-and-voice", "we-lets-i", "Let's add a repository.", "Let's add"),
        skip("person-and-voice", "we-lets-i", "Support hours: we reply within one business day."),
        hit(
            "person-and-voice",
            "mixed-person",
            "Teams who host docs can connect a repo.\n\nUse your own GitHub token in that same paragraph? Teams who host docs use your own token.",
            "your own",
        ),
        skip("person-and-voice", "mixed-person", "docs.page serves the markdown you push."),
        hit(
            "person-and-voice",
            "active-voice",
            "An acknowledgment is sent after you save.",
            "is sent",
        ),
        skip("person-and-voice", "active-voice", "The file is saved."),
        hit(
            "person-and-voice",
            "who-you-is",
            "Click **Connect** to continue.",
            "Click",
            title=g_t,
            desc=g_d,
        ),
        skip(
            "person-and-voice",
            "who-you-is",
            "docs.page maps a GitHub tree to a site.",
            title=c_t,
            desc=c_d,
        ),
    ]

    # --- procedures ---
    unnumbered = """Install the CLI.

Create a `docs.json` file.

Push the branch."""
    out += [
        hit("procedures", "unnumbered-sequence", unnumbered, "Install the CLI"),
        skip(
            "procedures",
            "unnumbered-sequence",
            "<Steps>\n<Step title=\"Install\">Run the CLI.</Step>\n<Step title=\"Preview\">Open the URL.</Step>\n</Steps>",
        ),
        hit(
            "procedures",
            "lettered-substeps",
            "1. Open settings.\n   a. Choose a theme.\n   b. Save.",
            "a.",
        ),
        hit(
            "procedures",
            "procedure-intro",
            "To customize the buttons:\n\n1. Open **Settings**.\n2. Choose a theme.",
            "To customize the buttons:",
        ),
        skip(
            "procedures",
            "procedure-intro",
            "Customize the buttons:\n\n1. Open **Settings**.\n2. Choose a theme.",
        ),
        hit(
            "procedures",
            "one-action",
            "1. Install the CLI and open the preview URL.",
            "Install the CLI and open",
        ),
        skip(
            "procedures",
            "one-action",
            "1. Choose **File > New**.",
        ),
        hit(
            "procedures",
            "one-step-list",
            "1. Click **Save**.",
            "Click **Save**",
        ),
        skip(
            "procedures",
            "one-step-list",
            "Click **Save**.",
        ),
        hit(
            "procedures",
            "optional-label",
            "1. Install the CLI.\n2. (Optional) Pin the version.",
            "(Optional)",
        ),
        skip(
            "procedures",
            "optional-label",
            "1. Install the CLI.\n2. Optional: Pin the version.",
        ),
        hit(
            "procedures",
            "parallel-verbs",
            "1. Install the CLI.\n2. Configuring the preview.",
            "Configuring",
        ),
        skip(
            "procedures",
            "parallel-verbs",
            "1. Install the CLI.",
        ),
        hit(
            "procedures",
            "step-order",
            "1. In the dashboard, click **New**.",
            "In the dashboard, click",
        ),
        skip(
            "procedures",
            "step-order",
            "1. Click **New**.",
        ),
    ]

    # --- headings ---
    out += [
        hit(
            "headings",
            "frontmatter",
            "Body copy here.",
            "description",
            title="Preview locally",
            desc="",
        ),
        skip("headings", "frontmatter", "Body copy here."),
        hit(
            "headings",
            "hash-title",
            "# Preview locally\n\nBody copy.",
            "# Preview locally",
        ),
        skip("headings", "hash-title", "## Install the CLI\n\nBody copy."),
        hit(
            "headings",
            "links-in-headings",
            "## See the [CLI](/cli)\n\nBody copy.",
            "[CLI](/cli)",
        ),
        hit(
            "headings",
            "heading-levels",
            "## Install\n\n#### Nested too far\n\nBody.",
            "#### Nested too far",
        ),
        skip(
            "headings",
            "heading-levels",
            "## Install\n\n### Flags\n\nBody.",
        ),
        hit(
            "headings",
            "sentence-case",
            "## Install The CLI\n\nBody copy.",
            "Install The CLI",
        ),
        skip("headings", "sentence-case", "## Install the CLI\n\nBody copy."),
        hit(
            "headings",
            "task-ing",
            "## Creating a preview\n\nBody copy.",
            "Creating a preview",
        ),
        skip("headings", "task-ing", "## Create a preview\n\nBody copy."),
        hit(
            "headings",
            "code-in-heading",
            "## `docs.json`\n\nBody copy.",
            "`docs.json`",
        ),
        skip(
            "headings",
            "code-in-heading",
            "## The `docs.json` file\n\nBody copy.",
        ),
        hit(
            "headings",
            "optional-heading",
            "## Pin the version (optional)\n\nBody.",
            "(optional)",
        ),
        skip(
            "headings",
            "optional-heading",
            "## Optional: Pin the version\n\nBody.",
        ),
        hit(
            "headings",
            "following-sections",
            "The following sections explain install and preview.\n\n## Install\n\n## Preview",
            "The following sections",
        ),
        skip(
            "headings",
            "following-sections",
            "## Install\n\nThis section covers flags only.",
        ),
        hit(
            "headings",
            "markdown-over-heading-tag",
            '<Heading as="h2">Install the CLI</Heading>\n\nBody.',
            "<Heading",
        ),
        skip(
            "headings",
            "markdown-over-heading-tag",
            "<Accordion title=\"Flags\">\n<Heading as=\"h3\">Hidden</Heading>\n</Accordion>",
        ),
    ]

    # --- inline-formatting ---
    out += [
        hit("inline-formatting", "code-font", "Open docs.json in your editor.", "docs.json"),
        skip("inline-formatting", "code-font", "Open the `docs.json` file in your editor."),
        hit("inline-formatting", "ui-bold", "Click Save to continue.", "Save"),
        skip("inline-formatting", "ui-bold", "Click **Save** to continue."),
        hit("inline-formatting", "ui-and-code", "Set **debug** to true.", "debug"),
        skip("inline-formatting", "ui-and-code", "Set **`debug`** to true."),
        hit("inline-formatting", "sequential-menus", "Open File then New.", "File then New"),
        skip("inline-formatting", "sequential-menus", "Choose **File > New**."),
        hit("inline-formatting", "list-of-one", "- Only one item", "Only one item"),
        skip("inline-formatting", "list-of-one", "Click **Save**."),
        hit(
            "inline-formatting",
            "list-parallel",
            "- Installing the CLI.\n- preview URL",
            "preview URL",
        ),
        skip(
            "inline-formatting",
            "list-parallel",
            "- Install the CLI.\n- Open the preview URL.",
        ),
    ]

    # --- links ---
    out += [
        hit("links", "link-text", "Please [click here](https://example.com/docs).", "click here"),
        skip("links", "link-text", "See the [quickstart](https://example.com/docs)."),
        hit(
            "links",
            "duplicate-destination",
            "See the [quickstart](https://example.com/docs).\n\nAlso open the [guide](https://example.com/docs).",
            "https://example.com/docs",
        ),
        skip(
            "links",
            "duplicate-destination",
            "See the [quickstart](https://example.com/docs).",
        ),
        hit(
            "links",
            "in-site-url",
            "Read [Components](https://docs.page/invertase/docs.page/components).",
            "https://docs.page/invertase/docs.page/components",
        ),
        skip(
            "links",
            "in-site-url",
            "The product site is [docs.page](https://docs.page).",
        ),
        hit(
            "links",
            "hyphenated-compound",
            "Use the [pre](/pre)-release channel.",
            "[pre](/pre)-release",
        ),
        hit(
            "links",
            "punctuation-outside",
            "See [the quickstart.](https://example.com/docs)",
            "the quickstart.",
        ),
        skip(
            "links",
            "punctuation-outside",
            "See [the quickstart](https://example.com/docs).",
        ),
        hit(
            "links",
            "see-cross-ref",
            "See the quickstart on [this page](/quickstart).",
            "on [this page]",
        ),
        skip(
            "links",
            "see-cross-ref",
            "For more information, see [the quickstart](/quickstart).",
        ),
    ]

    # --- tone ---
    out += [
        hit("tone", "idioms-slang", "docs.page ships without the infrastructure tax.", "infrastructure tax"),
        skip("tone", "idioms-slang", "docs.page serves markdown from GitHub."),
        hit("tone", "padding", "Please note that the CLI watches the branch.", "Please note"),
        hit("tone", "pre-announcement", "The new preview is coming soon.", "coming soon"),
        skip(
            "tone",
            "pre-announcement",
            "Version 2.1 (2026-09-01) adds a new preview flag.",
        ),
        hit(
            "tone",
            "repeated-opener",
            "You can install the CLI. You can preview locally. You can push a branch.",
            "You can",
        ),
        skip(
            "tone",
            "repeated-opener",
            "1. Install the CLI.\n2. Preview locally.\n3. Push a branch.",
        ),
    ]

    # --- general-principles ---
    out += [
        hit("general-principles", "unverifiable-claims", "The live site refreshes instantly.", "instantly"),
        skip(
            "general-principles",
            "unverifiable-claims",
            "The API never returns a body on `204`.",
        ),
        hit("general-principles", "should", "The value should be true.", "should"),
        skip("general-principles", "should", 'The RFC says "implementations should retry."'),
        hit("general-principles", "jargon", "Shift left on your docs pipeline.", "Shift left"),
        skip(
            "general-principles",
            "jargon",
            "Shift left (find issues earlier in the workflow) on your docs pipeline.",
        ),
        hit("general-principles", "inclusive", "Run a sanity-check on the config.", "sanity-check"),
        skip(
            "general-principles",
            "inclusive",
            "The API returns `dummy` (`placeholder value`).",
        ),
        hit(
            "general-principles",
            "third-party",
            "Unlike that other docs host, we are not terrible.",
            "not terrible",
        ),
        skip(
            "general-principles",
            "third-party",
            "GitHub serves the git objects; docs.page renders the markdown.",
        ),
    ]

    # --- language ---
    out += [
        hit("language", "acronyms", "Enable RBAC before you invite users.", "RBAC"),
        skip("language", "acronyms", "Install the CLI, then preview."),
        hit("language", "anthropomorphism", "The CLI wants a token.", "wants"),
        skip("language", "anthropomorphism", "The CLI prompts you for a token."),
        hit("language", "articles", "", "Create VM", title="Create VM", desc="How to create a virtual machine."),
        skip("language", "articles", "", title="Create a VM", desc="How to create a virtual machine."),
        hit("language", "present-tense", "The server will send an acknowledgment.", "will send"),
        skip("language", "present-tense", "After you click **Save**, the server will show a URL."),
        hit("language", "pronouns", "Do this. This is required.", "This is required"),
        skip("language", "pronouns", "Save the file. This file is required."),
        hit("language", "code-possessive", "Edit `settings.h`'s timeout.", "`settings.h`'s"),
        skip("language", "code-possessive", "Edit the `settings.h` file timeout."),
        hit("language", "invented-contractions", "You mightn't've saved.", "mightn't've"),
        skip("language", "invented-contractions", "You don't have to save."),
        hit(
            "language",
            "reference-voice",
            '<Property name="id" type="string">Create a task id.</Property>',
            "Create a task id",
            title="API reference",
            desc="Task properties.",
        ),
        skip(
            "language",
            "reference-voice",
            "Create a task in the dashboard.",
        ),
    ]

    # --- sentence-structure ---
    out += [
        hit("sentence-structure", "condition-first", "Click **Delete** if you want to delete.", "Click **Delete** if"),
        skip(
            "sentence-structure",
            "condition-first",
            "docs.page maps a GitHub tree to a site.",
            title=c_t,
            desc=c_d,
        ),
        hit(
            "sentence-structure",
            "svo",
            "After the GitHub App has been installed on the organization that owns the repository, an acknowledgment is available.",
            "After the GitHub App",
        ),
        skip("sentence-structure", "svo", "The server sends an acknowledgment."),
    ]

    # --- punctuation ---
    out += [
        hit("punctuation", "list-colon", "Themes:\n\n- Light\n- Dark", "Themes:"),
        skip("punctuation", "list-colon", "The CLI supports two themes:\n\n- Light\n- Dark"),
        hit("punctuation", "serial-comma", "The preview flow is red, green and blue.", "red, green and blue"),
        skip("punctuation", "serial-comma", "The preview flow is red and blue."),
        hit("punctuation", "fake-em-dash", "Use a long aside -- like this -- between clauses.", "-- like this --"),
        skip("punctuation", "fake-em-dash", "Pass `--watch` to the CLI."),
        hit("punctuation", "commas", "If you already pushed a branch click **Preview**.", "If you already pushed"),
        skip("punctuation", "commas", "If you already pushed a branch, click **Preview**."),
        hit("punctuation", "ellipsis", "The CLI prints…", "prints…"),
        skip("punctuation", "ellipsis", "The sample omits extra fields."),
        hit("punctuation", "slashes", "Use npm and/or bun.", "and/or"),
        skip("punctuation", "slashes", "Set `Content-Type` to `application/json`."),
    ]

    # --- text-formatting ---
    out += [
        hit("text-formatting", "bold", "docs.page is a **docs-as-code platform**.", "**docs-as-code platform**"),
        skip("text-formatting", "bold", "Click **Save**."),
        hit("text-formatting", "italics", "You *must* click save. You *really* should. You *cannot* skip it.", "*must*"),
        skip("text-formatting", "italics", "A *repository* is a GitHub project."),
        hit("text-formatting", "ampersand", "Install Node & Bun.", "& Bun"),
        skip("text-formatting", "ampersand", "Click **Save & exit**."),
        hit("text-formatting", "all-caps-prose", "DO NOT skip this step.", "DO NOT"),
        skip("text-formatting", "all-caps-prose", "Set `PROJECT_ID` in the sample."),
    ]

    # --- formatting ---
    out += [
        hit(
            "formatting",
            "callout-type",
            "<Info>\nYou must set a token or the CLI exits.\n</Info>",
            "<Info>",
        ),
        skip(
            "formatting",
            "callout-type",
            "<Info>\nThe preview watches the branch you already pushed.\n</Info>",
        ),
        hit(
            "formatting",
            "stacked-callouts",
            "<Info>First note.</Info>\n\n<Warning>Second note.</Warning>",
            "<Warning>",
        ),
        skip("formatting", "stacked-callouts", "<Info>The preview watches the branch.</Info>"),
        hit("formatting", "dates-times", "Ship by 08/26/26.", "08/26/26"),
        skip("formatting", "dates-times", "Ship by 2026-08-26."),
        hit("formatting", "numbers-units", "Wait 5 minutes. The cache is 10GB.", "10GB"),
        skip("formatting", "numbers-units", "Wait five minutes. The cache is 10 GB."),
        hit(
            "formatting",
            "tables",
            "| Flag | Meaning |\n| --- | --- |\n| `--watch` | Reload |",
            "| Flag | Meaning |",
        ),
        skip(
            "formatting",
            "tables",
            "The CLI flags are:\n\n| Flag | Meaning |\n| --- | --- |\n| `--watch` | Reload |",
        ),
        hit(
            "formatting",
            "figures",
            "![terminal](https://cdn.example.com/shot.png)",
            "https://cdn.example.com/shot.png",
        ),
        skip("formatting", "figures", "![Docs.page logo](/assets/logo.svg)"),
        hit("formatting", "footnotes-math-video", "See the note.[^1]\n\n[^1]: Hidden.", "[^1]"),
        skip("formatting", "footnotes-math-video", "<YouTube id=\"abc\" />"),
    ]

    # --- computer-interfaces ---
    out += [
        hit("computer-interfaces", "language-tag", "```\nnpx docs.page\n```", "npx docs.page"),
        skip("computer-interfaces", "language-tag", "```bash\nnpx docs.page\n```"),
        hit("computer-interfaces", "fence-intro", "```bash\nnpx docs.page\n```", "npx docs.page"),
        skip(
            "computer-interfaces",
            "fence-intro",
            "Run the docs.page CLI.\n\n```bash\nnpx docs.page\n```",
        ),
        hit("computer-interfaces", "placeholders", "```bash\ncurl https://foo.example/xxx\n```", "foo"),
        skip(
            "computer-interfaces",
            "placeholders",
            "Clone `{owner}/{repo}` and set `EMAIL_ADDRESS`.",
        ),
        hit("computer-interfaces", "run-the-following", "Run the following command.\n\n```bash\nnpx docs.page\n```", "Run the following command"),
        skip(
            "computer-interfaces",
            "run-the-following",
            "Start a local preview.\n\n```bash\nnpx docs.page\n```",
        ),
        hit(
            "computer-interfaces",
            "omit-in-fence",
            "```js\nexport default {\n  name: 'acme',\n  ...\n}\n```",
            "...",
        ),
        skip(
            "computer-interfaces",
            "omit-in-fence",
            "```js\nexport default { name: 'acme' }\n```",
        ),
        hit("computer-interfaces", "click-enter-select", "Click the **Name** field.", "Click the **Name** field"),
        skip("computer-interfaces", "click-enter-select", "Click **Save**."),
    ]

    # --- names ---
    out += [
        hit("names", "product-spelling", "DocsPage serves markdown.", "DocsPage"),
        skip("names", "product-spelling", "docs.page serves markdown."),
        hit("names", "filenames", "Edit `docs.json`.", "`docs.json`"),
        skip("names", "filenames", "Edit the `docs.json` file."),
        hit("names", "example-hosts", "Email ada@gmail.com for access.", "ada@gmail.com"),
        skip("names", "example-hosts", "Set `EMAIL_ADDRESS` in the sample."),
    ]

    # --- word-list ---
    out += [
        hit("word-list", "padding-words", "Please utilize the CLI.", "utilize"),
        skip("word-list", "padding-words", "Use the CLI."),
        hit("word-list", "position-and-time", "Once you push, the site updates.", "Once you push"),
        skip("word-list", "position-and-time", "For more information, see [the CLI](/cli)."),
        hit("word-list", "slang", "tl;dr: push a branch.", "tl;dr"),
        skip("word-list", "slang", "The UI label is `tl;dr`."),
    ]

    # --- accessibility-and-global ---
    out += [
        hit("accessibility-and-global", "alt", "![screenshot](/assets/shot.png)", "screenshot"),
        skip("accessibility-and-global", "alt", '<Icon name="github" />'),
        hit("accessibility-and-global", "position-words", "The table below lists flags.", "below"),
        skip("accessibility-and-global", "position-words", "Click **Left** in the sidebar."),
        hit(
            "accessibility-and-global",
            "sentence-length",
            "After you have installed the GitHub App on the organization that owns the repository you want to publish and you have confirmed the webhook arrived you can open the preview URL in a browser window.",
            "After you have installed",
        ),
        skip("accessibility-and-global", "sentence-length", "Open the preview URL."),
        hit("accessibility-and-global", "uncommon-words", "Use a bespoke token.", "bespoke"),
        skip("accessibility-and-global", "uncommon-words", "Use a token."),
        hit(
            "accessibility-and-global",
            "walls-of-text",
            "One.\n\nTwo.\n\nThree.\n\nFour.\n\nFive paragraphs with no heading.",
            "Five paragraphs",
        ),
        skip(
            "accessibility-and-global",
            "walls-of-text",
            "<Accordion title=\"Flags\">\nOne.\n\nTwo.\n\nThree.\n\nFour.\n\nFive.\n</Accordion>",
        ),
        hit("accessibility-and-global", "global", "Ship before Christmas.", "Christmas"),
        skip(
            "accessibility-and-global",
            "global",
            "Released 2026-12-25.",
        ),
    ]

    return out


def scan_ids_from_checks() -> dict[str, list[str]]:
    found: dict[str, list[str]] = {}
    for p in sorted(CHECKS.glob("*.md")):
        text = p.read_text()
        found[p.stem] = re.findall(r"^### ([a-z0-9-]+)", text, re.M)
    return found


def main() -> None:
    data = {
        "skill_name": "check-docs",
        "kind": "worker",
        "prompt": (
            "You are check-docs worker `{check}`.\n"
            "Read the page and skills/check-docs/checks/{check}.md.\n"
            "Do not edit. Do not read other checks. Do not write the log.\n"
            "Finish every Scan on the whole page. Classify each instance: violation, skip, or clean.\n"
            "Return JSON only with check, scans, and findings."
        ),
        "evals": cases(),
    }
    expected = scan_ids_from_checks()
    covered: dict[str, set[str]] = {k: set() for k in expected}
    for ev in data["evals"]:
        covered[ev["check"]].add(ev["scan"])
    missing = []
    for check, scans in expected.items():
        for scan in scans:
            if scan not in covered.get(check, set()):
                missing.append(f"{check}.{scan}")
    if missing:
        raise SystemExit(f"workers.json missing scans: {missing}")
    OUT.write_text(json.dumps(data, indent=2) + "\n")
    hits = sum(1 for e in data["evals"] if e["expect"] == "hit")
    skips = sum(1 for e in data["evals"] if e["expect"] == "skip")
    print(f"Wrote {OUT} ({len(data['evals'])} cases: {hits} hit, {skips} skip; {sum(len(v) for v in expected.values())} scans covered)")


if __name__ == "__main__":
    main()
