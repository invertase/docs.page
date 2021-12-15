export const fixtures = {
  '200': {
    code: 'var Component=(()=>{var l=Object.create;var o=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,p=Object.prototype.hasOwnProperty;var a=e=>o(e,"__esModule",{value:!0});var x=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),j=(e,t)=>{a(e);for(var r in t)o(e,r,{get:t[r],enumerable:!0})},u=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of h(t))!p.call(e,s)&&s!=="default"&&o(e,s,{get:()=>t[s],enumerable:!(r=d(t,s))||r.enumerable});return e},_=e=>u(a(o(e!=null?l(m(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var i=x((w,c)=>{c.exports=_jsx_runtime});var M={};j(M,{default:()=>f});var n=_(i());function g(e={}){let{wrapper:t}=e.components||{};return t?(0,n.jsx)(t,Object.assign({},e,{children:(0,n.jsx)(r,{})})):r();function r(){let s=Object.assign({h1:"h1",p:"p"},e.components);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"hello-world",children:"Hello World"}),`\n`,(0,n.jsx)(s.p,{children:"This is a test page for docs.page"})]})}}var f=g;return M;})();\n;return Component;',
    frontmatter: {},
    headings: null,
    config: {
      name: 'docs.page',
      theme: '#36B9B9',
      twitter: 'invertaseio',
      sidebar: [
        ['Overview', '/'],
        ['Getting Started', '/getting-started'],
        ['Configuration', '/configuration'],
        ['Previews', '/previews'],
        ['Custom Domains', '/custom-domains'],
        ['Components', '/components'],
        ['Frontmatter', '/frontmatter'],
        ['GitHub Bot', '/github-bot'],
        ['Search', '/search'],
        ['Debugging', '/debugging'],
        ['Pre-rendering', '/pre-rendering'],
        ['Advanced', '/advanced'],
        ['Contributing', '/contributing'],
      ],
      docsearch: {
        apiKey: '9b58d13ee3195094105d528fc6161a01',
        indexName: 'use_docs_page',
      },
      googleTagManager: 'GTM-W89J6BX',
    },
  },
  '400': {
    errors: [
      {
        detail: {
          name: '1:1',
          message: 'Expected a closing tag for `<>` (6:1-6:3)',
          reason: 'Expected a closing tag for `<>` (6:1-6:3)',
          line: null,
          column: null,
          source: 'mdast-util-mdx-jsx',
          ruleId: 'end-tag-mismatch',
          position: {
            start: {
              line: null,
              column: null,
            },
            end: {
              line: null,
              column: null,
            },
          },
          fatal: true,
        },
        location: {
          column: 0,
          file: '_mdx_bundler_entry_point-8f56ef28-4185-44ee-a89a-334825838d17.mdx',
          length: 0,
          line: 0,
          lineText: '# Hello World',
          namespace: 'file',
          suggestion: '',
        },
        notes: [],
        pluginName: 'esbuild-xdm',
        text: 'Expected a closing tag for `<>` (6:1-6:3)',
      },
    ],
    warnings: [],
  },
  '404': {
    code: null,
    frontmatter: {},
    headings: [],
    config: null,
  },
  '500': {},
};
