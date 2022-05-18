export const fixtures = {
  '200': {
    code: 'var Component=(()=>{var h=Object.create;var o=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var p=Object.getOwnPropertyNames;var u=Object.getPrototypeOf,m=Object.prototype.hasOwnProperty;var g=(i,n)=>()=>(n||i((n={exports:{}}).exports,n),n.exports),f=(i,n)=>{for(var r in n)o(i,r,{get:n[r],enumerable:!0})},s=(i,n,r,t)=>{if(n&&typeof n=="object"||typeof n=="function")for(let l of p(n))!m.call(i,l)&&l!==r&&o(i,l,{get:()=>n[l],enumerable:!(t=d(n,l))||t.enumerable});return i};var b=(i,n,r)=>(r=i!=null?h(u(i)):{},s(n||!i||!i.__esModule?o(r,"default",{value:i,enumerable:!0}):r,i)),k=i=>s(o({},"__esModule",{value:!0}),i);var c=g((F,a)=>{a.exports=_jsx_runtime});var x={};f(x,{default:()=>v,frontmatter:()=>w});var e=b(c()),w={description:"A tool for managing Dart projects with multiple packages."};function _(i={}){let{wrapper:n}=i.components||{};return n?(0,e.jsx)(n,Object.assign({},i,{children:(0,e.jsx)(r,{})})):r();function r(){let t=Object.assign({section:"section",h2:"h2",p:"p",a:"a",ul:"ul",li:"li",blockquote:"blockquote"},i.components),{Image:l}=t;return l||y("Image",!0),(0,e.jsxs)(e.Fragment,{children:[(0,e.jsxs)(t.section,{children:[`\n`,(0,e.jsx)(l,{src:"https://static.invertase.io/assets/melos-logo.png",alt:"Melos",zoom:!1,caption:"A tool for managing Dart projects with multiple packages."}),`\n`]}),(0,e.jsxs)(t.section,{id:"about",children:[(0,e.jsx)(t.h2,{id:"about",children:"About"}),`\n`,(0,e.jsxs)(t.p,{children:["Melos is a ",(0,e.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Command-line_interface",children:"CLI"})," tool used to help manage Dart projects with multiple packages (also known as mono-repos). It is currently still in active development however is in use on projects such as ",(0,e.jsx)(t.a,{href:"https://github.com/FirebaseExtended/flutterfire",children:"FlutterFire"}),"."]}),`\n`,(0,e.jsx)(t.p,{children:"Splitting up large code bases into separate independently versioned packages is extremely useful for code sharing. However, making changes across many repositories is messy and difficult to track, and testing across repositories gets complicated. Melos helps solve these issues by allowing multiple packages to work together within one repository, whilst being totally independent of each other. Features include:"}),`\n`,(0,e.jsxs)(t.ul,{children:[`\n`,(0,e.jsx)(t.li,{children:"Automatic versioning & changelog generation."}),`\n`,(0,e.jsx)(t.li,{children:"Automated publishing of packages to pub.dev."}),`\n`,(0,e.jsx)(t.li,{children:"Local package linking and installation."}),`\n`,(0,e.jsx)(t.li,{children:"Executing simultaneous commands across packages."}),`\n`,(0,e.jsx)(t.li,{children:"Listing of local packages & their dependencies."}),`\n`]}),`\n`,(0,e.jsx)(t.p,{children:"Melos also works great on CI/CD environments to help automate complex tasks and challenges."}),`\n`]}),(0,e.jsxs)(t.section,{id:"projects-using-melos",children:[(0,e.jsx)(t.h2,{id:"projects-using-melos",children:"Projects using Melos"}),`\n`,(0,e.jsx)(t.p,{children:"The following projects are using Melos:"}),`\n`,(0,e.jsxs)(t.ul,{children:[`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/FirebaseExtended/flutterfire",children:"FirebaseExtended/flutterfire"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/flame-engine/flame",children:"Flame-Engine/Flame"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/aws-amplify/amplify-flutter",children:"aws-amplify/amplify-flutter"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/fluttercommunity/plus_plugins",children:"fluttercommunity/plus_plugins"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/GetStream/stream-chat-flutter",children:"GetStream/stream-chat-flutter"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/4itworks/opensource_qwkin_dart",children:"4itworks/opensource_qwkin_dart"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/gql-dart/ferry",children:"gql-dart/ferry"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/cbl-dart/cbl-dart",children:"cbl-dart/cbl-dart"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/ema987/paddinger",children:"ema987/paddinger"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/flutter-stripe/flutter_stripe",children:"flutter-stripe/flutter_stripe"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/danvick/flutter_form_builder",children:"danvick/flutter_form_builder"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/kmartins/groveman",children:"kmartins/groveman"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/ApptiveGrid/apptive_grid_flutter",children:"ApptiveGrid/apptive_grid_flutter"})}),`\n`,(0,e.jsx)(t.li,{children:(0,e.jsx)(t.a,{href:"https://github.com/flutternetwork/WiFiFlutter",children:"flutternetwork/WiFiFlutter"})}),`\n`]}),`\n`,(0,e.jsxs)(t.blockquote,{children:[`\n`,(0,e.jsxs)(t.p,{children:[`Submit a PR if you\'d like to add your project to the list.\nUpdate the\n`,(0,e.jsx)(t.a,{href:"https://github.com/invertase/melos/edit/main/docs/index.mdx",children:"docs"}),"."]}),`\n`]}),`\n`]}),(0,e.jsxs)(t.section,{id:"license",children:[(0,e.jsx)(t.h2,{id:"license",children:"License"}),`\n`,(0,e.jsxs)(t.p,{children:["See ",(0,e.jsx)(t.a,{href:"https://github.com/invertase/melos/blob/main/LICENSE",children:"LICENSE"})," for more information."]})]})]})}}var v=_;function y(i,n){throw new Error("Expected "+(n?"component":"object")+" `"+i+"` to be defined: you likely forgot to import, pass, or provide it.")}return k(x);})();\n;return Component;',
    frontmatter: {
      description: 'A tool for managing Dart projects with multiple packages.',
    },
    headings: [
      {
        id: 'about',
        title: 'About',
        rank: 2,
      },
      {
        id: 'projects-using-melos',
        title: 'Projects using Melos',
        rank: 2,
      },
      {
        id: 'license',
        title: 'License',
        rank: 2,
      },
    ],
    config: {
      name: 'Melos',
      logo: '/assets/logo.png',
      logoDark: '/assets/logo-dark.png',
      twitter: 'invertaseio',
      theme: '#FFA03F',
      googleAnalytics: 'G-Q7ME6WLFEJ',
      sidebar: [
        ['Overview', '/'],
        ['Getting Started', '/getting-started'],
        ['Filters', '/filters'],
        [
          'Configuration',
          [
            ['Overview', '/configuration/overview'],
            ['Scripts', '/configuration/scripts'],
          ],
        ],
        [
          'Commands',
          [
            ['bootstrap', '/commands/bootstrap'],
            ['clean', '/commands/clean'],
            ['exec', '/commands/exec'],
            ['list', '/commands/list'],
            ['publish', '/commands/publish'],
            ['run', '/commands/run'],
            ['version', '/commands/version'],
          ],
        ],
        ['Environment Variables', '/environment-variables'],
        ['IDE Support', '/ide-support'],
        [
          'Guides',
          [
            [
              'Manage multi-package Flutter projects',
              'https://sagarsuri56.medium.com/managing-multi-package-flutter-projects-with-melos-c8ce96fa7c82',
            ],
            ['Automated Releases', '/guides/automated-releases'],
          ],
        ],
      ],
    },
    baseBranch: 'main',
    path: 'index',
    repositoryFound: true,
    source: {
      type: 'branch',
      owner: 'invertase',
      repository: 'melos',
      ref: 'main',
    },
    ref: 'main',
  },
  '400': {
    statusCode: 500,
    reason: 'BUNDLE_ERROR',
    message: 'Error bundling markdown',
  },
  '404': {
    statusCode: 404,
    reason: 'REPO_NOT_FOUND',
    message: "Couldn't find github contents",
  },
  '500': {},
};
