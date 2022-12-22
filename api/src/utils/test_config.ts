export default `{
  "name": "docs.page",
  "logo": "https://static.invertase.io/assets/docs.page/docs-page-logo.png",  
  "theme": "#36B9B9",
  "twitter": "invertaseio",
  "automaticallyDisplayName": false,
  "anchors": [{ "title": "Homepage", "icon": "house", "link": "https://docs.page" }],
  "sidebar": {
    "default": [
      ["Overview", "/"]
    ],
    "fr": [
      ["French", "/"]
    ],
    "en": [
      [
        "Getting Started",
        [
          ["Overview", "/"],
          ["Getting Started", "/getting-started"],
          ["Configuration", "/configuration"]
        ]
      ],
      [
        "Components",
        [
          ["Accordion", "/components/accordion"],
          ["Code Blocks", "/components/code-blocks"],
          ["Callouts", "/components/callouts"],
          ["Headings", "/components/headings"],
          ["Tweet", "/components/tweet"],
          ["Tabs", "/components/tabs"],
          ["Images", "/components/images"],
          ["YouTube", "/components/youtube"],
          ["Vimeo", "/components/vimeo"],
          ["Zapp!", "/components/zapp"]
        ]
      ],
      [
        "Advanced",
        [
          ["Assets", "/assets"],
          ["Frontmatter", "/frontmatter"],
          ["Previews", "/previews"],
          ["Search", "/search"],
          ["Custom Domains", "/custom-domains"],
          ["Locales", "/locales"],
          ["GitHub Bot", "/github-bot"]
        ]
      ],
      [
        "Misc.",
        [
          ["Contributing", "/contributing"]
        ]
      ]    
    ]
  },
  "docsearch": {
    "apiKey": "9b58d13ee3195094105d528fc6161a01",
    "appId": "BH4D9OD16A",
    "indexName": "use_docs_page"
  },
  "googleTagManager": "GTM-W89J6BX"
}
`;
