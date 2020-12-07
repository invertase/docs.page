## General

- [ ] Tailwind purging - breaks some dark mode things, such as hover on sidebar
- [ ] docs.page documentation

## Homepage

- [x] Regex needs doing to extract the owner/repo from the URL (`Checkout` component) & redirect the user
- [x] Add minimal footer to homepage (just a few links, keep it clean)

## pages/[...slug].tsx

- [x] `.html` files should not go through MDX render, otherwise they need to be JSX.
- [ ] Handle custom domains. Figure out what data is needed in order for the `Link` component to work correctly.
- Custom components:
  - [x] Tabs / TabItem
- [x] Code block titles
  - https://github.com/mottox2/remark-code-titles
- [x] Code block live
  - https://github.com/FormidableLabs/react-live
  - [x] Use webpack alias for smaller bundle? Load on Client only?
  - [x] Use fork of buble? https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-live-codeblock/src/index.js#L24
- [x] Syntax highlighting
  - Use Rehype plugin duricompng server rendering? https://github.com/mapbox/rehype-prism
  - Client needs to pull in styles
- [ ] Line highlighting in code - plugin?
- [x] Assets (img component) - can we somehow link to the raw file on git? Easier way?
- [x] Link component not handling default branch?
- [x] Sidebar nested items need testing - toggle not working yet
- [x] Enable navbar dropdown somehow?
- Table of contents
  - [ ] No underlines (only on hover)
  - [ ] Hide the h1 tags (see `rehypePlugins` options; thought I handled this)
  - [ ] Bold lines with children (might be doable via tailwind.config.js)
- [ ] Render assumes repo exists if a branch/pr exists, causing incorrect error pages
  - `/invertase/mellos~docs-testing` causes a document not found error rather than repo not found


## pages/_debug/[...slug].tsx

- [ ] Needs overall implementation. Pull data/responses from everywhere and show output on the page.
- [x] Ensure it has a `noindex` metatag
- [x] Not working with 404 repos/errors (/_debug/ehesp/testingh)
- [x] Display list of generated meta tags (`getHeadTags`)
- [ ] Render assumes repo exists if a branch/pr exists, causing server errors (Temp workaround in place)

# Error Page

- [x] "The page, index was not found in the ehesp/testingh repository. " doesn't make sense - the repo isn't there so the page will never exist, still says "Document not found"
- [x] Add minimal footer (same as homepage)
- [ ] Configure footer links
- [x] Can we somehow make it look a bit better? "404" text above the box, a bigger, colored?
