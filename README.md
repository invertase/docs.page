## General

- [ ] Tailwind purging - breaks some dark mode things, such as hover on sidebar

## Homepage

- [ ] Regex needs doing to extract the owner/repo from the URL (`Checkout` component) & redirect the user
- [ ] Add minimal footer to homepage (just a few links, keep it clean)

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
  - Use Rehype plugin during server rendering? https://github.com/mapbox/rehype-prism
  - Client needs to pull in styles
- [ ] Line highlighting in code - plugin?
- [x] Assets (img component) - can we somehow link to the raw file on git? Easier way?
- [x] Link component not handling default branch?
- [x] Sidebar nested items need testing - toggle not working yet
- [ ] Enable navbar dropdown somehow?
- Table of contents
  - [ ] No underlines (only on hover)
  - [ ]Hide the h1 tags (see `rehypePlugins` options; thought I handled this)
  - [ ] Bold lines with children (might be doable via tailwind.config.js)

## pages/_debug/[...slug].tsx

- [ ] Needs overall implementation. Pull data/responses from everywhere and show output on the page.
- [ ] Ensure it has a `noindex` metatag
- [ ] Not working with 404 repos/errors (/_debug/ehesp/testingh)
- [ ] Display list of generated meta tags (`getHeadTags`)

# Error Page

- [x] "The page, index was not found in the ehesp/testingh repository. " doesn't make sense - the repo isn't there so the page will never exist, still says "Document not found"
- [ ] Add minimal footer (same as homepage)
- [x] Can we somehow make it look a bit better? "404" text above the box, a bigger, colored?
