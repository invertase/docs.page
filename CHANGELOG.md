# Changelog

Platform changes to docs.page. Release notes: [2.0.0](./docs/releases/v2.0.0.mdx) · [1.0.0](./docs/releases/v1.0.0.mdx).

## [2.0.0] - 03-07-2026

### Removed

- **Breaking:** remove standalone `website/` and `api/` deployables ([#470](https://github.com/invertase/docs.page/pull/470))
- Remove Algolia DocSearch integration — built-in FlexSearch `search.json` replaces optional third-party search ([`76eaf1a`](https://github.com/invertase/docs.page/commit/76eaf1a))
- Remove Redis-backed bundle cache in favour of surrogate cache control ([`0228337`](https://github.com/invertase/docs.page/commit/0228337))

### Added

- Add unified Next.js application for hosting, bundling, and API routes ([`a546632`](https://github.com/invertase/docs.page/commit/a546632))
- Add shared `packages/mdx-bundler` document IR pipeline ([`be18d1d`](https://github.com/invertase/docs.page/commit/be18d1d))
- Add MCP server endpoint, skills resources, and installation dialog per repository ([`75c1ab2`](https://github.com/invertase/docs.page/commit/75c1ab2), [`d1728bf`](https://github.com/invertase/docs.page/commit/d1728bf))
- Add page action menu: copy Markdown, view `.md`, Open in Claude, and MCP deeplinks ([`354770c`](https://github.com/invertase/docs.page/commit/354770c))
- Add `llms.txt` and `llms-full.txt` endpoints ([`d88f7c4`](https://github.com/invertase/docs.page/commit/d88f7c4))
- Add Ask AI agent panel and configurable agent questions in `docs.json` ([`4cac172`](https://github.com/invertase/docs.page/commit/4cac172), [`8dc1819`](https://github.com/invertase/docs.page/commit/8dc1819))
- Add Ask AI backend providers for OpenAI, Anthropic, Google, and xAI ([#490](https://github.com/invertase/docs.page/pull/490))
- Add command palette with tab navigation, Ask AI, and MCP shortcuts ([`964f566`](https://github.com/invertase/docs.page/commit/964f566), [`12148bc`](https://github.com/invertase/docs.page/commit/12148bc))
- Add in-page FlexSearch with title-only mode ([`964f566`](https://github.com/invertase/docs.page/commit/964f566))
- Add FlexSearch-backed `search.json` per repository ([`76eaf1a`](https://github.com/invertase/docs.page/commit/76eaf1a))
- Add `sitemap.xml` and `robots.txt` routes per repository ([`02fa436`](https://github.com/invertase/docs.page/commit/02fa436), [`65f5d45`](https://github.com/invertase/docs.page/commit/65f5d45))
- Add Mermaid diagram rendering in MDX ([`de3b9e3`](https://github.com/invertase/docs.page/commit/de3b9e3))
- Add GitHub alert blockquote syntax for callouts ([#405](https://github.com/invertase/docs.page/issues/405))
- Add optional site banner in `docs.json` ([`54479dd`](https://github.com/invertase/docs.page/commit/54479dd))
- Add shadcn/ui preset themes and reworked documentation chrome ([`0cb7003`](https://github.com/invertase/docs.page/commit/0cb7003), [`f7b97d7`](https://github.com/invertase/docs.page/commit/f7b97d7))
- Add CLI `preview` and `agent` commands sharing the production bundler ([#472](https://github.com/invertase/docs.page/pull/472), [#470](https://github.com/invertase/docs.page/pull/470))
- Add configurable agent rate limiting ([`cf39bb3`](https://github.com/invertase/docs.page/commit/cf39bb3))
- Add config-driven page redirects via frontmatter `redirect` ([#503](https://github.com/invertase/docs.page/pull/503))
- Add Privacy Policy and Terms of Service pages ([#506](https://github.com/invertase/docs.page/pull/506))
- Add server-side PostHog analytics for platform telemetry ([#492](https://github.com/invertase/docs.page/pull/492))

### Changed

- **Breaking:** move local development to Bun workspace (`cd app && bun dev`)
- Rework `@docs.page/cli` on Bun with shared validation and rendering checks ([#470](https://github.com/invertase/docs.page/pull/470))
- Serve `docs.json` schema from the Next.js app ([`88dec3a`](https://github.com/invertase/docs.page/commit/88dec3a))
- Port MDX components to shared IR renderer ([`be18d1d`](https://github.com/invertase/docs.page/commit/be18d1d), [`f938182`](https://github.com/invertase/docs.page/commit/f938182))
- Improve GitHub file resolution via jsDelivr ([`16405d3`](https://github.com/invertase/docs.page/commit/16405d3))
- Maintain v1 `docs.json` compatibility during migration ([`94fd1f8`](https://github.com/invertase/docs.page/commit/94fd1f8))
- Relocate GitHub webhook handling into `app/` ([`aa5a7aa`](https://github.com/invertase/docs.page/commit/aa5a7aa))
- Rework Open Graph image generation ([`a6e43d6`](https://github.com/invertase/docs.page/commit/a6e43d6))
- Extend CLI `check` with rendering validation ([`3faf391`](https://github.com/invertase/docs.page/commit/3faf391))
- Rewrite public product documentation ([#504](https://github.com/invertase/docs.page/pull/504))
- Add Privacy and Terms links to site footers ([#510](https://github.com/invertase/docs.page/pull/510))

### Fixed

- Fix global variable substitution inside MDX components and fenced code blocks ([#324](https://github.com/invertase/docs.page/issues/324), [#436](https://github.com/invertase/docs.page/issues/436))
- Fix sidebar disappearing when `logo` is a plain string in `docs.json` ([#394](https://github.com/invertase/docs.page/issues/394))
- Fix locale switcher replacing the locale segment in URLs ([#370](https://github.com/invertase/docs.page/issues/370))
- Fix sidebar item selection under tabbed navigation ([#414](https://github.com/invertase/docs.page/issues/414))
- Fix sidebar tabs not updating after in-site redirect navigation ([#462](https://github.com/invertase/docs.page/issues/462), [`978f318`](https://github.com/invertase/docs.page/commit/978f318))
- Fix GFM tables inside `Steps` components ([#484](https://github.com/invertase/docs.page/issues/484))
- Fix extra line breaks when copying a partial code block selection ([#487](https://github.com/invertase/docs.page/issues/487), [`0a2ba19`](https://github.com/invertase/docs.page/commit/0a2ba19))
- Register GitHub webhook listener once per process ([#475](https://github.com/invertase/docs.page/issues/475), [`5340652`](https://github.com/invertase/docs.page/commit/5340652))
- Serve correct `search.json`, sitemap, and `llms.txt` URLs on custom domains ([`5593ebb`](https://github.com/invertase/docs.page/commit/5593ebb), [`25e3b7a`](https://github.com/invertase/docs.page/commit/25e3b7a))
- Add canonical URLs and Open Graph metadata for documentation pages ([`c06728d`](https://github.com/invertase/docs.page/commit/c06728d))
- Fix MCP endpoint URL and copy actions ([`5fc5e5e`](https://github.com/invertase/docs.page/commit/5fc5e5e))
- Respect `showPageImage` and frontmatter edge cases ([#420](https://github.com/invertase/docs.page/issues/420), [#396](https://github.com/invertase/docs.page/issues/396))
- Fix client navigation hydration handling ([#419](https://github.com/invertase/docs.page/issues/419))
- Prevent internal sidebar links from opening in a new tab ([#417](https://github.com/invertase/docs.page/pull/417))
- Improve grouped sidebar collapse, text wrapping, and mobile menu behaviour ([#399](https://github.com/invertase/docs.page/issues/399), [`d21f8ad`](https://github.com/invertase/docs.page/commit/d21f8ad))
- Fix sidebar tab highlighting with multiple navigation tabs ([#411](https://github.com/invertase/docs.page/issues/411))
- Hide page title when `showPageTitle` is disabled ([#428](https://github.com/invertase/docs.page/issues/428))
- Post GitHub App PR preview comments only when documentation files change ([#287](https://github.com/invertase/docs.page/issues/287), [#491](https://github.com/invertase/docs.page/pull/491))
- Align code fence and fenced block styling ([`ffb7a1a`](https://github.com/invertase/docs.page/commit/ffb7a1a))
- Make headings clickable and improve card link affordance ([`f8692c1`](https://github.com/invertase/docs.page/commit/f8692c1), [`fb4a1f0`](https://github.com/invertase/docs.page/commit/fb4a1f0))
- Fix steps component spacing and nested children ([`abf12a3`](https://github.com/invertase/docs.page/commit/abf12a3), [`aa8bfbc`](https://github.com/invertase/docs.page/commit/aa8bfbc))
- Fix CLI local preview rendering ([#472](https://github.com/invertase/docs.page/pull/472), [#429](https://github.com/invertase/docs.page/issues/429), [#433](https://github.com/invertase/docs.page/issues/433), [`5bcc76b`](https://github.com/invertase/docs.page/commit/5bcc76b))
- Fix preview page WebSocket client and doc rendering ([`402d187`](https://github.com/invertase/docs.page/commit/402d187))
- Skip analytics scripts in local preview mode ([`c8d885f`](https://github.com/invertase/docs.page/commit/c8d885f))
- Hide ref badge in local preview mode ([`e26ea34`](https://github.com/invertase/docs.page/commit/e26ea34))
- Improve markdown parsing for preview and production parity ([`202ab7e`](https://github.com/invertase/docs.page/commit/202ab7e))
- Fix raw Markdown (`.md`) URL in the page action menu on custom domains and vanity subdomains ([`38bcb19`](https://github.com/invertase/docs.page/commit/38bcb19))
- Fix Font Awesome icons rendering oversized in markdown headings ([`ba2808b`](https://github.com/invertase/docs.page/commit/ba2808b))
- Fix images inside HTML tables using the shared markdown and image pipeline ([`aa8813c`](https://github.com/invertase/docs.page/commit/aa8813c))
- Allow code group titles to scroll horizontally without clipping ([`24f0318`](https://github.com/invertase/docs.page/commit/24f0318))
- Include `$schema` in CLI `init` scaffold output ([`de6ccff`](https://github.com/invertase/docs.page/commit/de6ccff))

[2.0.0]: https://github.com/invertase/docs.page/releases/tag/cli-v2.0.0

## [1.0.0] - 29-08-2024

### Added

- Publish documentation from public GitHub repositories with zero custom site setup ([#359](https://github.com/invertase/docs.page/pull/359))
- Support `docs.json` for name, description, logo, favicon, theme, header, sidebar, tabs, anchors, and SEO
- Support third-party analytics via `docs.json` scripts (Google Tag Manager, Google Analytics, Plausible) ([#211](https://github.com/invertase/docs.page/pull/211), [#233](https://github.com/invertase/docs.page/pull/233))
- Render MDX with built-in components: tabs, steps, callouts, code blocks, code groups, cards, accordion, property, and headings
- Add embed components for YouTube, Vimeo, embedded Tweets, and HTML5 video ([#180](https://github.com/invertase/docs.page/pull/180), [#194](https://github.com/invertase/docs.page/pull/194))
- Provide live previews for branches, pull requests, and commits with hydration reload ([#340](https://github.com/invertase/docs.page/pull/340))
- Install GitHub App webhooks for automatic pull request preview URLs
- Support custom and vanity domains ([#271](https://github.com/invertase/docs.page/pull/271))
- Support optional Algolia DocSearch integration
- Generate Open Graph images for documentation pages ([`150d6da`](https://github.com/invertase/docs.page/commit/150d6da))
- Support global variable injection, per-page frontmatter, redirects, and previous/next controls ([#216](https://github.com/invertase/docs.page/pull/216))
- Support dark and light mode with syntax-highlighted code blocks
- Expose `docs.json` JSON Schema at `/schema.json`
- Bundle markdown through Express API with remark/rehype validation plugins ([`6126288`](https://github.com/invertase/docs.page/commit/6126288))
- Support HTML comments and math in MDX ([#205](https://github.com/invertase/docs.page/pull/205))
- Support platform-managed custom domain routing ([`46ec893`](https://github.com/invertase/docs.page/commit/46ec893))
- Add middleware block list for unwanted request paths ([`ff9ecef`](https://github.com/invertase/docs.page/commit/ff9ecef))
- Support sidebar group heading icons and external link icons ([`5d80271`](https://github.com/invertase/docs.page/commit/5d80271), [`ebc272c`](https://github.com/invertase/docs.page/commit/ebc272c))
- Upgrade FontAwesome icons to 6.7.2 ([`304b62f`](https://github.com/invertase/docs.page/commit/304b62f))
- Add `@docs.page/cli` with `init` and `check` commands ([#359](https://github.com/invertase/docs.page/pull/359))

### Changed

- Rework platform UI and architecture in the 2024 refresh ([#359](https://github.com/invertase/docs.page/pull/359))
- Split rendering (`website/`) and bundling (`api/`) into separate deployables ([`f862c15`](https://github.com/invertase/docs.page/commit/f862c15))
- Move Open Graph image generation into the main website application ([`a275ff9`](https://github.com/invertase/docs.page/commit/a275ff9))
- Initialize Google Tag Manager and Google Analytics after page load ([`9a05df6`](https://github.com/invertase/docs.page/commit/9a05df6))
- Improve error pages and API error handling ([#336](https://github.com/invertase/docs.page/pull/336))

### Fixed

- Respect `showPageImage` when rendering pages ([#420](https://github.com/invertase/docs.page/issues/420))
- Fix hydration state handling on client-side navigation ([#419](https://github.com/invertase/docs.page/issues/419))
- Prevent non-external sidebar links from opening in a new tab ([#417](https://github.com/invertase/docs.page/pull/417))
- Improve collapsing behaviour of grouped sidebar items ([#399](https://github.com/invertase/docs.page/issues/399))
- Treat frontmatter `false` as false instead of falling back to defaults ([#396](https://github.com/invertase/docs.page/issues/396))
- Handle vanity domain redirects ([#363](https://github.com/invertase/docs.page/pull/363))
- Handle redirect paths and prioritise domain URLs correctly ([`390da36`](https://github.com/invertase/docs.page/commit/390da36), [`159ec2b`](https://github.com/invertase/docs.page/commit/159ec2b))
- Encode non-Latin characters in URLs ([`17d9197`](https://github.com/invertase/docs.page/commit/17d9197))
- Truncate long sidebar titles with an ellipsis ([`de11419`](https://github.com/invertase/docs.page/commit/de11419))
- Ensure image zoom (RMIZ) styles are bundled ([#379](https://github.com/invertase/docs.page/issues/379))
- Fix Shiki CSS variable theming for code blocks ([#338](https://github.com/invertase/docs.page/pull/338))
- Improve back navigation and error page messaging ([#337](https://github.com/invertase/docs.page/pull/337))
- Fix component navigation links ([#346](https://github.com/invertase/docs.page/pull/346))
- Hide SVG title elements in rendered output ([`02bf3f1`](https://github.com/invertase/docs.page/commit/02bf3f1))
- Improve mobile header and layout styling ([`14ccd40`](https://github.com/invertase/docs.page/commit/14ccd40))
- Fix spelling in documentation ([#416](https://github.com/invertase/docs.page/pull/416))

[1.0.0]: https://github.com/invertase/docs.page/releases
