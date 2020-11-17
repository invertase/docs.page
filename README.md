## Homepage

- [ ] Regex needs doing to extract the owner/repo from the URL (`Checkout` component) & redirect the user

## pages/[...slug].tsx

- [ ] `.html` files should not go through MDX render, otherwise they need to be JSX.
- [ ] Handle custom domains. Figure out what data is needed in order for the `Link` component to work correctly.
- Custom components:
  - [x] Tabs / TabItem
- [ ] Code block titles
 - https://github.com/mottox2/remark-code-titles
- [ ] Code block live
 - https://github.com/FormidableLabs/react-live
 - [ ] Use webpack alias for smaller bundle? Load on Client only?
 - [ ] Use fork of buble? https://github.com/facebook/docusaurus/blob/master/packages/docusaurus-theme-live-codeblock/src/index.js#L24
- [ ] Syntax highlighting
 - Use Rehype plugin during server rendering? https://github.com/mapbox/rehype-prism
 - Client needs to pull in styles
- [ ] Assets (img component) - can we somehow link to the raw file on git? Easier way?
- [ ] Link component not handling default branch?
- [ ] Sidebar nested items need testing - toggle not working yet
- [ ] Enable navbar dropdown somehow?

## pages/_debug/[...slug].tsx

- [ ] Needs overall implementation. Pull data/responses from everywhere and show output on the page.

## pages/_error.tsx

- [ ] Needs overall implementation:
  - Currently a custom error is thrown within `getStaticProps` which should be passed along to this component, where the details can be extracted.