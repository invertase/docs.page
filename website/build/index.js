var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// ../node_modules/@remix-run/dev/compiler/shims/react.ts
var React;
var init_react = __esm({
  "../node_modules/@remix-run/dev/compiler/shims/react.ts"() {
    React = __toModule(require("react"));
  }
});

// ../node_modules/remix/client.js
var require_client = __commonJS({
  "../node_modules/remix/client.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var react = require("@remix-run/react");
    Object.defineProperty(exports, "Form", {
      enumerable: true,
      get: function() {
        return react.Form;
      }
    });
    Object.defineProperty(exports, "Link", {
      enumerable: true,
      get: function() {
        return react.Link;
      }
    });
    Object.defineProperty(exports, "Links", {
      enumerable: true,
      get: function() {
        return react.Links;
      }
    });
    Object.defineProperty(exports, "LiveReload", {
      enumerable: true,
      get: function() {
        return react.LiveReload;
      }
    });
    Object.defineProperty(exports, "Meta", {
      enumerable: true,
      get: function() {
        return react.Meta;
      }
    });
    Object.defineProperty(exports, "NavLink", {
      enumerable: true,
      get: function() {
        return react.NavLink;
      }
    });
    Object.defineProperty(exports, "Outlet", {
      enumerable: true,
      get: function() {
        return react.Outlet;
      }
    });
    Object.defineProperty(exports, "PrefetchPageLinks", {
      enumerable: true,
      get: function() {
        return react.PrefetchPageLinks;
      }
    });
    Object.defineProperty(exports, "RemixBrowser", {
      enumerable: true,
      get: function() {
        return react.RemixBrowser;
      }
    });
    Object.defineProperty(exports, "RemixServer", {
      enumerable: true,
      get: function() {
        return react.RemixServer;
      }
    });
    Object.defineProperty(exports, "Scripts", {
      enumerable: true,
      get: function() {
        return react.Scripts;
      }
    });
    Object.defineProperty(exports, "ScrollRestoration", {
      enumerable: true,
      get: function() {
        return react.ScrollRestoration;
      }
    });
    Object.defineProperty(exports, "useActionData", {
      enumerable: true,
      get: function() {
        return react.useActionData;
      }
    });
    Object.defineProperty(exports, "useBeforeUnload", {
      enumerable: true,
      get: function() {
        return react.useBeforeUnload;
      }
    });
    Object.defineProperty(exports, "useCatch", {
      enumerable: true,
      get: function() {
        return react.useCatch;
      }
    });
    Object.defineProperty(exports, "useFetcher", {
      enumerable: true,
      get: function() {
        return react.useFetcher;
      }
    });
    Object.defineProperty(exports, "useFetchers", {
      enumerable: true,
      get: function() {
        return react.useFetchers;
      }
    });
    Object.defineProperty(exports, "useFormAction", {
      enumerable: true,
      get: function() {
        return react.useFormAction;
      }
    });
    Object.defineProperty(exports, "useHref", {
      enumerable: true,
      get: function() {
        return react.useHref;
      }
    });
    Object.defineProperty(exports, "useLoaderData", {
      enumerable: true,
      get: function() {
        return react.useLoaderData;
      }
    });
    Object.defineProperty(exports, "useLocation", {
      enumerable: true,
      get: function() {
        return react.useLocation;
      }
    });
    Object.defineProperty(exports, "useMatches", {
      enumerable: true,
      get: function() {
        return react.useMatches;
      }
    });
    Object.defineProperty(exports, "useNavigate", {
      enumerable: true,
      get: function() {
        return react.useNavigate;
      }
    });
    Object.defineProperty(exports, "useNavigationType", {
      enumerable: true,
      get: function() {
        return react.useNavigationType;
      }
    });
    Object.defineProperty(exports, "useOutlet", {
      enumerable: true,
      get: function() {
        return react.useOutlet;
      }
    });
    Object.defineProperty(exports, "useOutletContext", {
      enumerable: true,
      get: function() {
        return react.useOutletContext;
      }
    });
    Object.defineProperty(exports, "useParams", {
      enumerable: true,
      get: function() {
        return react.useParams;
      }
    });
    Object.defineProperty(exports, "useResolvedPath", {
      enumerable: true,
      get: function() {
        return react.useResolvedPath;
      }
    });
    Object.defineProperty(exports, "useSearchParams", {
      enumerable: true,
      get: function() {
        return react.useSearchParams;
      }
    });
    Object.defineProperty(exports, "useSubmit", {
      enumerable: true,
      get: function() {
        return react.useSubmit;
      }
    });
    Object.defineProperty(exports, "useTransition", {
      enumerable: true,
      get: function() {
        return react.useTransition;
      }
    });
  }
});

// ../node_modules/remix/server.js
var require_server = __commonJS({
  "../node_modules/remix/server.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var serverRuntime = require("@remix-run/server-runtime");
    Object.defineProperty(exports, "createCookie", {
      enumerable: true,
      get: function() {
        return serverRuntime.createCookie;
      }
    });
    Object.defineProperty(exports, "createCookieSessionStorage", {
      enumerable: true,
      get: function() {
        return serverRuntime.createCookieSessionStorage;
      }
    });
    Object.defineProperty(exports, "createMemorySessionStorage", {
      enumerable: true,
      get: function() {
        return serverRuntime.createMemorySessionStorage;
      }
    });
    Object.defineProperty(exports, "createSession", {
      enumerable: true,
      get: function() {
        return serverRuntime.createSession;
      }
    });
    Object.defineProperty(exports, "createSessionStorage", {
      enumerable: true,
      get: function() {
        return serverRuntime.createSessionStorage;
      }
    });
    Object.defineProperty(exports, "isCookie", {
      enumerable: true,
      get: function() {
        return serverRuntime.isCookie;
      }
    });
    Object.defineProperty(exports, "isSession", {
      enumerable: true,
      get: function() {
        return serverRuntime.isSession;
      }
    });
    Object.defineProperty(exports, "json", {
      enumerable: true,
      get: function() {
        return serverRuntime.json;
      }
    });
    Object.defineProperty(exports, "redirect", {
      enumerable: true,
      get: function() {
        return serverRuntime.redirect;
      }
    });
  }
});

// ../node_modules/remix/platform.js
var require_platform = __commonJS({
  "../node_modules/remix/platform.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var node = require("@remix-run/node");
    Object.defineProperty(exports, "createFileSessionStorage", {
      enumerable: true,
      get: function() {
        return node.createFileSessionStorage;
      }
    });
    Object.defineProperty(exports, "unstable_createFileUploadHandler", {
      enumerable: true,
      get: function() {
        return node.unstable_createFileUploadHandler;
      }
    });
    Object.defineProperty(exports, "unstable_createMemoryUploadHandler", {
      enumerable: true,
      get: function() {
        return node.unstable_createMemoryUploadHandler;
      }
    });
    Object.defineProperty(exports, "unstable_parseMultipartFormData", {
      enumerable: true,
      get: function() {
        return node.unstable_parseMultipartFormData;
      }
    });
  }
});

// ../node_modules/remix/index.js
var require_remix = __commonJS({
  "../node_modules/remix/index.js"(exports) {
    init_react();
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var client = require_client();
    var server2 = require_server();
    var platform = require_platform();
    Object.keys(client).forEach(function(k) {
      if (k !== "default" && !exports.hasOwnProperty(k))
        Object.defineProperty(exports, k, {
          enumerable: true,
          get: function() {
            return client[k];
          }
        });
    });
    Object.keys(server2).forEach(function(k) {
      if (k !== "default" && !exports.hasOwnProperty(k))
        Object.defineProperty(exports, k, {
          enumerable: true,
          get: function() {
            return server2[k];
          }
        });
    });
    Object.keys(platform).forEach(function(k) {
      if (k !== "default" && !exports.hasOwnProperty(k))
        Object.defineProperty(exports, k, {
          enumerable: true,
          get: function() {
            return platform[k];
          }
        });
    });
  }
});

// tests/mocks/fixtures.ts
var fixtures;
var init_fixtures = __esm({
  "tests/mocks/fixtures.ts"() {
    init_react();
    fixtures = {
      "200": {
        code: 'var Component=(()=>{var l=Object.create;var o=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var h=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,p=Object.prototype.hasOwnProperty;var a=e=>o(e,"__esModule",{value:!0});var x=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),j=(e,t)=>{a(e);for(var r in t)o(e,r,{get:t[r],enumerable:!0})},u=(e,t,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of h(t))!p.call(e,s)&&s!=="default"&&o(e,s,{get:()=>t[s],enumerable:!(r=d(t,s))||r.enumerable});return e},_=e=>u(a(o(e!=null?l(m(e)):{},"default",e&&e.__esModule&&"default"in e?{get:()=>e.default,enumerable:!0}:{value:e,enumerable:!0})),e);var i=x((w,c)=>{c.exports=_jsx_runtime});var M={};j(M,{default:()=>f});var n=_(i());function g(e={}){let{wrapper:t}=e.components||{};return t?(0,n.jsx)(t,Object.assign({},e,{children:(0,n.jsx)(r,{})})):r();function r(){let s=Object.assign({h1:"h1",p:"p"},e.components);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.h1,{id:"hello-world",children:"Hello World"}),`\n`,(0,n.jsx)(s.p,{children:"This is a test page for docs.page"})]})}}var f=g;return M;})();\n;return Component;',
        frontmatter: {},
        headings: null,
        config: {
          name: "docs.page",
          theme: "#36B9B9",
          twitter: "invertaseio",
          sidebar: [
            ["Overview", "/"],
            ["Getting Started", "/getting-started"],
            ["Configuration", "/configuration"],
            ["Previews", "/previews"],
            ["Custom Domains", "/custom-domains"],
            ["Components", "/components"],
            ["Frontmatter", "/frontmatter"],
            ["GitHub Bot", "/github-bot"],
            ["Search", "/search"],
            ["Debugging", "/debugging"],
            ["Pre-rendering", "/pre-rendering"],
            ["Advanced", "/advanced"],
            ["Contributing", "/contributing"]
          ],
          docsearch: {
            apiKey: "9b58d13ee3195094105d528fc6161a01",
            indexName: "use_docs_page"
          },
          googleTagManager: "GTM-W89J6BX"
        }
      },
      "400": {
        errors: [
          {
            detail: {
              name: "1:1",
              message: "Expected a closing tag for `<>` (6:1-6:3)",
              reason: "Expected a closing tag for `<>` (6:1-6:3)",
              line: null,
              column: null,
              source: "mdast-util-mdx-jsx",
              ruleId: "end-tag-mismatch",
              position: {
                start: {
                  line: null,
                  column: null
                },
                end: {
                  line: null,
                  column: null
                }
              },
              fatal: true
            },
            location: {
              column: 0,
              file: "_mdx_bundler_entry_point-8f56ef28-4185-44ee-a89a-334825838d17.mdx",
              length: 0,
              line: 0,
              lineText: "# Hello World",
              namespace: "file",
              suggestion: ""
            },
            notes: [],
            pluginName: "esbuild-xdm",
            text: "Expected a closing tag for `<>` (6:1-6:3)"
          }
        ],
        warnings: []
      },
      "404": {
        code: null,
        frontmatter: {},
        headings: [],
        config: null
      },
      "500": {}
    };
  }
});

// tests/mocks/handlers.ts
var import_msw, handlers;
var init_handlers = __esm({
  "tests/mocks/handlers.ts"() {
    init_react();
    import_msw = __toModule(require("msw"));
    init_fixtures();
    handlers = [
      import_msw.rest.get("http://localhost:8000/bundle", (req, res, ctx) => {
        const owner = req.url.searchParams.get("owner");
        if (owner === "_test") {
          const repository = req.url.searchParams.get("repository");
          return res(ctx.status(parseInt(repository)), ctx.json(fixtures[repository]));
        }
      })
    ];
  }
});

// tests/mocks/server.ts
var server_exports = {};
__export(server_exports, {
  server: () => server
});
var import_node, server;
var init_server = __esm({
  "tests/mocks/server.ts"() {
    init_react();
    init_handlers();
    import_node = __toModule(require("msw/node"));
    server = (0, import_node.setupServer)(...handlers);
  }
});

// tests/mocks/browser.ts
var browser_exports = {};
__export(browser_exports, {
  worker: () => worker
});
var import_msw2, worker;
var init_browser = __esm({
  "tests/mocks/browser.ts"() {
    init_react();
    import_msw2 = __toModule(require("msw"));
    init_handlers();
    worker = (0, import_msw2.setupWorker)(...handlers);
  }
});

// tests/mocks/index.ts
var require_mocks = __commonJS({
  "tests/mocks/index.ts"() {
    init_react();
    if (typeof window === "undefined") {
      const { server: server2 } = (init_server(), server_exports);
      server2.listen();
      console.log("server mock listening");
    } else {
      const { worker: worker2 } = (init_browser(), browser_exports);
      worker2.start();
      console.log("worker mock started");
    }
  }
});

// <stdin>
__export(exports, {
  assets: () => import_assets.default,
  entry: () => entry,
  routes: () => routes
});
init_react();

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
init_react();
var import_server = __toModule(require("react-dom/server"));
var import_remix = __toModule(require_remix());
if (process.env.MSW_ENABLED === "1") {
  require_mocks();
}
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  let markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_remix.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route-module:/Users/jacobcable/docs.page/website/app/root.tsx
var root_exports = {};
__export(root_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links,
  loader: () => loader
});
init_react();
var import_remix2 = __toModule(require_remix());

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-C5YPLE64.css";

// app/components/DarkModeToggle.tsx
init_react();
var import_react2 = __toModule(require("react"));

// app/hooks.ts
init_react();
var import_react = __toModule(require("react"));
function useNoSSR() {
  const [ready, setReady] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => setReady(true), []);
  return ready;
}

// app/components/DarkModeToggle.tsx
var import_solid = __toModule(require("@heroicons/react/solid"));
var STORAGE_KEY = "docs.page:dark-mode";
function useDarkMode() {
  return {
    enable() {
      localStorage.setItem(STORAGE_KEY, "dark");
      document.documentElement.classList.add("dark");
      document.documentElement.style.setProperty("color-scheme", "dark");
    },
    disable() {
      localStorage.setItem(STORAGE_KEY, "light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.setProperty("color-scheme", "light");
    },
    auto() {
      localStorage.removeItem(STORAGE_KEY);
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
        document.documentElement.style.setProperty("color-scheme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.setProperty("color-scheme", "light");
      }
    }
  };
}
function DarkModeToggle() {
  const ready = useNoSSR();
  const darkMode = useDarkMode();
  const [mode, setMode] = (0, import_react2.useState)(null);
  const container = (children) => /* @__PURE__ */ import_react2.default.createElement("div", {
    className: "relative w-28 px-2 h-8 flex items-center dark:text-white bg-[#fbfbfb] hover:bg-transparent dark:bg-transparent border hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600 rounded focus:outline-none"
  }, children);
  function getSelectOption() {
    return !!mode ? mode : localStorage[STORAGE_KEY] ? localStorage[STORAGE_KEY] === "dark" ? "dark" : "light" : "system";
  }
  if (!ready) {
    return container();
  }
  const option = getSelectOption();
  return container(/* @__PURE__ */ import_react2.default.createElement(import_react2.default.Fragment, null, /* @__PURE__ */ import_react2.default.createElement("div", {
    className: "flex-1"
  }, option === "dark" && /* @__PURE__ */ import_react2.default.createElement(import_solid.MoonIcon, {
    width: 14
  }), option === "light" && /* @__PURE__ */ import_react2.default.createElement(import_solid.SunIcon, {
    width: 14
  }), option === "system" && /* @__PURE__ */ import_react2.default.createElement(import_solid.DesktopComputerIcon, {
    width: 14
  })), /* @__PURE__ */ import_react2.default.createElement("select", {
    role: "button",
    className: "absolute inset-0 appearance-none w-full flex items-center font-medium bg-transparent focus:outline-none pl-8 text-gray-600 hover:text-black dark:text-gray-300 dark:hover:text-white text-xs pr-3",
    value: option,
    onChange: (e) => {
      const value = e.target.value;
      setMode(value);
      if (value === "dark") {
        darkMode.enable();
      } else if (value === "light") {
        darkMode.disable();
      } else {
        darkMode.auto();
      }
    }
  }, /* @__PURE__ */ import_react2.default.createElement("option", {
    value: "dark"
  }, "Dark"), /* @__PURE__ */ import_react2.default.createElement("option", {
    value: "light"
  }, "Light"), /* @__PURE__ */ import_react2.default.createElement("option", {
    value: "system"
  }, "System")), /* @__PURE__ */ import_react2.default.createElement("div", null, /* @__PURE__ */ import_react2.default.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "16",
    height: "16",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none",
    shapeRendering: "geometricPrecision"
  }, /* @__PURE__ */ import_react2.default.createElement("path", {
    d: "M17 8.517L12 3 7 8.517M7 15.48l5 5.517 5-5.517"
  })))));
}

// route-module:/Users/jacobcable/docs.page/website/app/root.tsx
var import_react_router_dom = __toModule(require("react-router-dom"));
var links = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&display=block" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Fira+Code:wght@500&display=block"
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=block"
    },
    { rel: "stylesheet", href: tailwind_default }
  ];
};
function loader() {
  return {
    ENV: {
      MSW_ENABLED: process.env.MSW_ENABLED
    }
  };
}
function App() {
  const data = (0, import_remix2.useLoaderData)();
  return /* @__PURE__ */ React.createElement(Document, null, /* @__PURE__ */ React.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `window.ENV = ${JSON.stringify(data.ENV)}`
    }
  }), /* @__PURE__ */ React.createElement(import_remix2.Outlet, null));
}
function ErrorBoundary({ error }) {
  console.error(error);
  return /* @__PURE__ */ React.createElement(Document, {
    title: "Error!"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h1", null, "There was an error"), /* @__PURE__ */ React.createElement("p", null, error.message), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("p", null, "Hey, developer, you should replace this with what you want your users to see.")));
}
function CatchBoundary() {
  let caught = (0, import_remix2.useCatch)();
  let message;
  switch (caught.status) {
    case 401:
      message = /* @__PURE__ */ React.createElement("p", null, "Oops! Looks like you tried to visit a page that you do not have access to.");
      break;
    case 404:
      message = /* @__PURE__ */ React.createElement("p", null, "Oops! Looks like you tried to visit a page that does not exist.");
      break;
    default:
      throw new Error(caught.data || caught.statusText);
  }
  return /* @__PURE__ */ React.createElement(Document, {
    title: `${caught.status} ${caught.statusText}`
  }, /* @__PURE__ */ React.createElement("h1", null, caught.status, ": ", caught.statusText), message);
}
function Document({ children, title }) {
  const location2 = (0, import_react_router_dom.useLocation)();
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ React.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1"
  }), title ? /* @__PURE__ */ React.createElement("title", null, title) : null, /* @__PURE__ */ React.createElement(import_remix2.Meta, null), /* @__PURE__ */ React.createElement(import_remix2.Links, null)), /* @__PURE__ */ React.createElement("body", {
    className: "font-inter dark:bg-zinc-900 dark:text-white"
  }, /* @__PURE__ */ React.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
              if (localStorage["${STORAGE_KEY}"] === 'dark' || (!("${STORAGE_KEY}" in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                document.documentElement.style.setProperty('color-scheme', 'dark');
              } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.style.setProperty('color-scheme', 'light');
              }
            `
    }
  }), children, location2.pathname !== "/preview" && /* @__PURE__ */ React.createElement(import_remix2.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_remix2.Scripts, null), /* @__PURE__ */ React.createElement(import_remix2.LiveReload, null)));
}

// route-module:/Users/jacobcable/docs.page/website/app/routes/$owner.$repo.$.tsx
var owner_repo_exports = {};
__export(owner_repo_exports, {
  CatchBoundary: () => CatchBoundary2,
  ErrorBoundary: () => ErrorBoundary2,
  default: () => Page,
  headers: () => headers,
  links: () => links2,
  loader: () => loader2,
  meta: () => meta
});
init_react();
var import_remix6 = __toModule(require_remix());

// app/components/Footer.tsx
init_react();
var import_remix3 = __toModule(require_remix());

// app/context.tsx
init_react();
var import_react4 = __toModule(require("react"));

// app/utils/index.ts
init_react();

// app/utils/get.ts
init_react();
var import_lodash = __toModule(require("lodash.get"));
var getValue = import_lodash.default;
function getString(json2, key, defaultValue) {
  const value = (0, import_lodash.default)(json2, key, defaultValue);
  if (typeof value !== "string") {
    return defaultValue;
  }
  return value;
}
function getNumber(json2, key, defaultValue) {
  const value = (0, import_lodash.default)(json2, key, defaultValue);
  if (typeof value !== "number") {
    return defaultValue;
  }
  return value;
}
function getBoolean(json2, key, defaultValue) {
  const value = (0, import_lodash.default)(json2, key, defaultValue);
  if (typeof value === "string") {
    if (value === "false")
      return false;
    if (value === "true")
      return true;
    return defaultValue;
  }
  if (typeof value !== "boolean") {
    return defaultValue;
  }
  return value;
}

// app/utils/index.ts
function ensureLeadingSlash(path) {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path;
}
var VARIABLE_REGEX = /{{\s([a-zA-Z0-9_.]*)\s}}/gm;
function replaceVariables(variables, value) {
  let output = value;
  let m;
  while ((m = VARIABLE_REGEX.exec(value)) !== null) {
    if (m.index === VARIABLE_REGEX.lastIndex) {
      VARIABLE_REGEX.lastIndex++;
    }
    output = output.replace(m[0], getValue(variables, m[1], ""));
  }
  return output;
}
function hash(value) {
  let hash2 = 0, i, chr;
  for (i = 0; i < value.length; i++) {
    chr = value.charCodeAt(i);
    hash2 = (hash2 << 5) - hash2 + chr;
    hash2 |= 0;
  }
  return hash2.toString();
}

// app/utils/local-preview-mode.ts
init_react();
var import_react3 = __toModule(require("react"));

// app/utils/config.ts
init_react();
var import_lodash2 = __toModule(require("lodash.get"));
function mergeSidebarConfig(json2) {
  const sidebar = (0, import_lodash2.default)(json2, "sidebar", defaultConfig.sidebar);
  if (!Array.isArray(sidebar)) {
    return defaultConfig.sidebar;
  }
  function iterate(sidebar2) {
    return sidebar2.map((item) => {
      if (!Array.isArray(item))
        return null;
      const [label, urlOrChildren] = item;
      if (typeof label !== "string")
        return null;
      if (typeof urlOrChildren === "string")
        return [label, urlOrChildren];
      if (!Array.isArray(urlOrChildren))
        return null;
      const children = urlOrChildren.map(([nestedLabel, nestedUrl]) => {
        if (typeof nestedLabel !== "string" || typeof nestedUrl !== "string")
          return null;
        return [nestedLabel, nestedUrl];
      }).filter(Boolean);
      return [label, children];
    }).filter(Boolean);
  }
  return iterate(sidebar);
}
var defaultConfig = {
  name: "",
  logo: "",
  logoDark: "",
  favicon: "",
  socialPreview: "",
  twitter: "",
  noindex: false,
  theme: "#00bcd4",
  sidebar: [],
  headerDepth: 3,
  variables: {},
  googleTagManager: "",
  zoomImages: false
};
function mergeConfig(json2) {
  return {
    name: getString(json2, "name", defaultConfig.name),
    logo: getString(json2, "logo", defaultConfig.logo),
    logoDark: getString(json2, "logoDark", defaultConfig.logoDark),
    favicon: getString(json2, "favicon", defaultConfig.favicon),
    socialPreview: getString(json2, "socialPreview", defaultConfig.socialPreview),
    twitter: getString(json2, "twitter", defaultConfig.twitter),
    noindex: getBoolean(json2, "noindex", defaultConfig.noindex),
    theme: getString(json2, "theme", defaultConfig.theme),
    docsearch: getValue(json2, "docsearch") ? {
      appId: getString(json2, "docsearch.appId", ""),
      apiKey: getString(json2, "docsearch.apiKey", ""),
      indexName: getString(json2, "docsearch.indexName", "")
    } : defaultConfig.docsearch,
    sidebar: mergeSidebarConfig(json2),
    headerDepth: getNumber(json2, "headerDepth", defaultConfig.headerDepth),
    variables: getValue(json2, "variables", defaultConfig.variables),
    googleTagManager: getString(json2, "googleTagManager", defaultConfig.googleTagManager),
    zoomImages: getBoolean(json2, "zoomImages", defaultConfig.zoomImages)
  };
}

// app/utils/local-preview-mode.ts
var PreviewModeContext = (0, import_react3.createContext)({
  enabled: false,
  onSelect: () => {
    return;
  },
  imageUrls: {}
});
function usePreviewMode() {
  return (0, import_react3.useContext)(PreviewModeContext);
}
async function extractContents(handle, configHandle, imageHandles) {
  let config = mergeConfig({});
  let text = "";
  let imageUrls;
  const errors = [];
  try {
    const configFile = await configHandle.getFile();
    try {
      config = await mergeConfig(JSON.parse(await configFile.text()));
    } catch (e) {
      console.error("Problems with docs.json format");
    }
  } catch (e) {
    console.error("Unable to getFile config");
  }
  try {
    const file = await handle.getFile();
    try {
      text = await file.text();
    } catch (e) {
      console.error("unable to extract text from file.");
      errors.push(e);
    }
  } catch (e) {
    console.error("unable to getFile page");
    errors.push(e);
  }
  try {
    imageUrls = Object.fromEntries(await Promise.all(Object.entries(imageHandles).map(async ([key, handle2]) => {
      const url = URL.createObjectURL(await handle2.getFile());
      return [key, url];
    })));
  } catch (_) {
  }
  return [text, JSON.stringify(config), imageUrls, errors];
}
async function iterateDirectory(directory, relativePath, other) {
  let handles = __spreadValues({}, other);
  for await (const entry2 of directory.values()) {
    if (entry2.kind === "file") {
      if (entry2.name.endsWith(".mdx")) {
        handles[`${relativePath ?? ""}/${entry2.name.replace(".mdx", "")}`] = entry2;
      }
      if ([".png", ".gif", ".jpeg", ".jpg"].filter((ext) => entry2.name.endsWith(ext))) {
        handles[`${relativePath ?? ""}/${entry2.name}`] = entry2;
      }
    }
    if (entry2.kind === "directory") {
      handles = __spreadValues(__spreadValues({}, handles), await iterateDirectory(entry2, `${relativePath ?? ""}/${entry2.name}`, handles));
    }
  }
  return handles;
}
function useHashChange() {
  const [hash2, setHash] = (0, import_react3.useState)("");
  function onHashChange() {
    const newHash = window.location.hash.replace("#", "") === "/" ? "/index" : window.location.hash.replace("#", "");
    return setHash(newHash);
  }
  (0, import_react3.useEffect)(() => {
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
  return hash2;
}
function useDirectorySelector() {
  const [error, setError] = (0, import_react3.useState)(null);
  const [pending, setPending] = (0, import_react3.useState)(false);
  const [handles, setHandles] = (0, import_react3.useState)(null);
  const [configHandle, setConfigHandle] = (0, import_react3.useState)(null);
  const select = (0, import_react3.useCallback)(async () => {
    setPending(true);
    try {
      const handle = await window.showDirectoryPicker() || null;
      let docs = null;
      for await (const entry2 of handle.values()) {
        if (entry2.kind === "file" && entry2.name === "docs.json") {
          setConfigHandle(entry2);
        }
        if (entry2.kind === "directory" && entry2.name === "docs") {
          docs = entry2;
        }
      }
      if (!docs) {
        throw new Error("No docs directory found");
      }
      const docsHandles = await iterateDirectory(docs);
      setHandles(docsHandles);
    } catch (e) {
      setError(e);
    } finally {
      setPending(false);
    }
  }, []);
  return { select, handles, error, pending, configHandle };
}
var cache = {
  text: "",
  config: {},
  props: null,
  urls: {}
};
function usePollLocalDocs(handles, configHandle, ms = 500) {
  const [updating, setUpdating] = (0, import_react3.useState)(0);
  const [pageProps, setPageProps] = (0, import_react3.useState)(null);
  const hash2 = useHashChange();
  const [errorCode, setErrorCode] = (0, import_react3.useState)(null);
  (0, import_react3.useEffect)(() => {
    if (!handles) {
      return;
    }
    ;
    const imageHandles = Object.keys(handles).filter((key) => [".png", ".jpg", ".gif", ".jpeg"].some((ext) => key.endsWith(ext))).reduce((obj, key) => {
      obj[key] = handles[key];
      return obj;
    }, {});
    const handle = hash2 ? handles[hash2] : handles[`/index.mdx`];
    const interval = setInterval(() => extractContents(handle, configHandle, imageHandles).then(([text, config, urls]) => {
      if (text !== cache.text || config !== cache.config || urls !== cache.urls) {
        cache.urls = urls;
        cache.text = text;
        cache.config = config;
        setUpdating(updating + 1);
      }
    }).catch(() => {
      setErrorCode(404);
    }), ms);
    return () => clearInterval(interval);
  }, [hash2, handles, updating]);
  (0, import_react3.useEffect)(() => {
    console.log("%c File change detected, hot update! \u{1F525}", "color: #8b0000;");
    buildPreviewProps({ hash: hash2, config: cache.config, text: cache.text, urls: cache.urls }).then((previewProps) => {
      setPageProps(previewProps);
    });
  }, [cache.text, cache.config]);
  return [pageProps, cache.urls, errorCode];
}
var rawEndpoint = `http://localhost:8000/raw`;
var buildPreviewProps = async (params) => {
  const config = JSON.parse(params.config);
  const md = params.text;
  let code = null;
  let frontmatter = null;
  let headings = null;
  const body = {
    md,
    config,
    baseBranch: "main"
  };
  if (md) {
    try {
      const bundle = await fetch(`${rawEndpoint}`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
      }).then((r) => r.json());
      code = bundle.code;
      frontmatter = bundle.frontmatter;
      headings = bundle.headings;
    } catch (e) {
      throw new Error("error bundling");
    }
  }
  return {
    owner: "preview",
    repo: "docs",
    path: "",
    ref: "HEAD",
    baseBranch: "main",
    source: { type: "branch", owner: "preview", repository: "docs", ref: "ref" },
    code: code || "",
    headings,
    config: mergeConfig(config),
    frontmatter: frontmatter || {}
  };
};

// app/context.tsx
var DocumentationContext = (0, import_react4.createContext)({});
function DocumentationProvider({ data, children }) {
  return /* @__PURE__ */ import_react4.default.createElement(DocumentationContext.Provider, {
    value: data
  }, children);
}
function useDocumentationContext() {
  return import_react4.default.useContext(DocumentationContext);
}
function useBaseUrl() {
  const { owner, repo, ref } = import_react4.default.useContext(DocumentationContext);
  let url = `/${owner}/${repo}`;
  if (ref) {
    url += `~${ref}`;
  }
  return url;
}
function useImagePath(src) {
  if (src.startsWith("http")) {
    return src;
  }
  const previewMode = usePreviewMode();
  if ((previewMode == null ? void 0 : previewMode.enabled) && previewMode.imageUrls) {
    return (previewMode == null ? void 0 : previewMode.imageUrls[src]) || "";
  }
  const blob = useRawBlob(src);
  return blob;
}
function useRawBlob(path) {
  const { source, baseBranch } = import_react4.default.useContext(DocumentationContext);
  const { owner, repository: repo, ref } = source;
  if (source.type === "branch") {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref ?? baseBranch}/docs${ensureLeadingSlash(path)}`;
  }
  if (source.type === "PR") {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${ref ?? baseBranch}/docs${ensureLeadingSlash(path)}`;
  }
  return `https://raw.githubusercontent.com/${owner}/${repo}/main/docs${ensureLeadingSlash(path)}`;
}

// app/components/Footer.tsx
function Footer() {
  const { owner, repo, ref, path } = useDocumentationContext();
  const editUrl = `https://github.com/${owner}/${repo}/edit${ref}/${path}`;
  return /* @__PURE__ */ React.createElement("footer", {
    className: "mt-16 py-8 px-4 lg:px-8 border-t border-gray-900/10"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex text-sm font-medium text-gray-500 dark:text-gray-300"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-grow"
  }, "Powered by", " ", /* @__PURE__ */ React.createElement(import_remix3.Link, {
    to: "/",
    className: "hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
  }, "docs.page")), /* @__PURE__ */ React.createElement("div", {
    className: "flex-shrink-0"
  }, /* @__PURE__ */ React.createElement("a", {
    href: editUrl,
    target: "_blank",
    rel: "noopener",
    className: "hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
  }, "Edit this page"))));
}

// ../node_modules/@code-hike/mdx/dist/index.css
var dist_default = "/build/_assets/index-VGPBBVC4.css";

// app/styles/codeblocks.css
var codeblocks_default = "/build/_assets/codeblocks-47ZPRMBH.css";

// app/loaders/documentation.server.ts
init_react();
var import_server2 = __toModule(require("@docs.page/server"));
var import_remix4 = __toModule(require_remix());
function isBundleError(bundle) {
  return bundle.errors !== void 0;
}
var docsLoader = async ({ params }) => {
  const owner = params.owner;
  let repo = params.repo;
  const path = params["*"];
  let ref;
  if (repo.includes("~")) {
    [repo, ref] = repo.split("~");
  }
  let bundle;
  try {
    bundle = await (0, import_server2.fetchBundle)({ owner, repository: repo, path, ref });
  } catch (error) {
    console.log(error);
    throw (0, import_remix4.json)(null, 500);
  }
  if (isBundleError(bundle)) {
    throw (0, import_remix4.json)(bundle, 400);
  }
  if (bundle.config === null || bundle.code === null) {
    throw (0, import_remix4.json)({
      owner,
      repo,
      path,
      repositoryFound: bundle.repositoryFound
    }, 404);
  }
  if (bundle.frontmatter.redirect) {
    return (0, import_remix4.redirect)(bundle.frontmatter.redirect);
  }
  const config = mergeConfig(bundle.config);
  const code = replaceVariables(config.variables, bundle.code);
  console.log(bundle.source);
  return (0, import_remix4.json)({
    owner,
    repo,
    path,
    ref,
    source: bundle.source,
    code,
    headings: bundle.headings,
    config: mergeConfig(bundle.config),
    frontmatter: bundle.frontmatter,
    baseBranch: bundle.baseBranch ?? "main"
  }, {
    headers: {
      "cache-control": "max-age=30, stale-while-revalidate=31560000, s-maxage=300"
    }
  });
};

// app/styles/docsearch.css
var docsearch_default = "/build/_assets/docsearch-TXUQZNSA.css";

// app/components/Errors.tsx
init_react();

// app/components/DocsLink.tsx
init_react();
var import_react_router_dom2 = __toModule(require("react-router-dom"));
function DocsLink(_a) {
  var props = __objRest(_a, []);
  const { owner, repo, ref } = useDocumentationContext();
  const previewMode = usePreviewMode();
  if (typeof props.to === "string" && isExternalLink(props.to)) {
    return /* @__PURE__ */ React.createElement("a", {
      target: "_blank",
      rel: "noopener nofollow",
      href: props.to,
      className: typeof props.className === "function" ? props.className({ isActive: false }) : props.className
    }, props.children);
  }
  let to = `/${owner}/${repo}`;
  if (ref && ref !== "HEAD") {
    to += `~${ref}`;
  }
  if (previewMode.enabled) {
    return /* @__PURE__ */ React.createElement("a", {
      className: typeof props.className === "function" ? props.className({ isActive: false }) : props.className,
      href: `#${props.to}`
    }, props.children);
  }
  return /* @__PURE__ */ React.createElement(import_react_router_dom2.NavLink, __spreadProps(__spreadValues({}, props), {
    to: removeTrailingSlash(`${to}${props.to}`)
  }));
}
function removeTrailingSlash(path) {
  return path.replace(/\/$/, "");
}
function isExternalLink(to) {
  return to.startsWith("http");
}

// app/components/Quicklinks.tsx
init_react();
var import_react5 = __toModule(require("react"));

// app/components/Icons.tsx
init_react();
function Adjustments({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
  }));
}
function PullRequest({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    viewBox: "0 0 16 16"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
  }));
}
function Branch({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    viewBox: "0 0 16 16"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"
  }));
}
function Commit({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    viewBox: "0 0 16 16"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"
  }));
}
function Template({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
  }));
}
function GlobeAlt({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
  }));
}
function Annotation({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
  }));
}
function GitHub({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    className,
    style
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
  }));
}
function Issue({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    viewBox: "0 0 16 16"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm9 3a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z"
  }));
}
function SearchCircle({ size, className, style }) {
  return /* @__PURE__ */ React.createElement("svg", {
    width: size,
    height: size,
    className,
    style,
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 2,
    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  }));
}

// app/components/Quicklinks.tsx
var defaultIconSize = 30;
var documentationLocation = "https://use.docs.page/search";
var linkData = [
  {
    href: "https://github.com/invertase/docs.page",
    children: "Contribute",
    icon: /* @__PURE__ */ import_react5.default.createElement(GitHub, {
      size: defaultIconSize
    })
  },
  {
    href: "https://github.com/invertase/docs.page/issues",
    children: "Report an issue",
    icon: /* @__PURE__ */ import_react5.default.createElement(Issue, {
      size: defaultIconSize
    })
  },
  {
    href: `${documentationLocation}/configuration`,
    children: "Configuration",
    icon: /* @__PURE__ */ import_react5.default.createElement(Adjustments, {
      size: defaultIconSize
    })
  },
  {
    href: `${documentationLocation}/previews`,
    children: "Previews",
    icon: /* @__PURE__ */ import_react5.default.createElement(PullRequest, {
      size: defaultIconSize
    })
  },
  {
    href: `${documentationLocation}/components`,
    children: "Components",
    icon: /* @__PURE__ */ import_react5.default.createElement(Template, {
      size: defaultIconSize
    })
  },
  {
    href: `${documentationLocation}/custom-domains`,
    children: "Custom Domains",
    icon: /* @__PURE__ */ import_react5.default.createElement(GlobeAlt, {
      size: defaultIconSize
    })
  },
  {
    href: `${documentationLocation}/github-bot`,
    children: "GitHub Bot",
    icon: /* @__PURE__ */ import_react5.default.createElement(Annotation, {
      size: defaultIconSize
    })
  },
  {
    href: `${documentationLocation}/search`,
    children: "Search",
    icon: /* @__PURE__ */ import_react5.default.createElement(SearchCircle, {
      size: defaultIconSize
    })
  }
];
function QuickLinks() {
  return /* @__PURE__ */ import_react5.default.createElement("div", {
    className: "dark:text-white mb-12 mt-10"
  }, /* @__PURE__ */ import_react5.default.createElement("h2", {
    className: "text-xl font-semibold mb-4"
  }, "Quick Links"), /* @__PURE__ */ import_react5.default.createElement("div", {
    className: "lg:flex flex-wrap"
  }, linkData.map((link, i) => /* @__PURE__ */ import_react5.default.createElement(QuickLink, {
    key: i,
    href: link.href,
    icon: link.icon
  }, link.children))));
}
function QuickLink({ href, icon, children }) {
  return /* @__PURE__ */ import_react5.default.createElement("div", {
    className: "mt-2 flex lg:w-1/2 "
  }, /* @__PURE__ */ import_react5.default.createElement("a", {
    className: "flex items-center space-x-4 w-full mx-2 p-4 rounded hover:bg-gray-400/10",
    href
  }, icon, /* @__PURE__ */ import_react5.default.createElement("span", null, children)));
}

// app/components/Errors.tsx
function PreviewNotFound({ error }) {
  const configFound = true;
  return /* @__PURE__ */ React.createElement(ErrorContainer, {
    title: "This page could not be found",
    code: 404
  }, configFound ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "We couldn't find your docs in this directory. Make sure you select a directory with a ", /* @__PURE__ */ React.createElement("code", null, "docs.json"), " file, and a ", /* @__PURE__ */ React.createElement("code", null, "docs/index.mdx"), " file."), /* @__PURE__ */ React.createElement("div", null, "If you think something else is up, please let us know by filing an ", /* @__PURE__ */ React.createElement("a", {
    className: "text-blue-600",
    href: "https://github.com/invertase/docs.page/issues"
  }, "issue"), "."), /* @__PURE__ */ React.createElement("div", {
    className: "mt-10"
  }, "Return to ", " ", /* @__PURE__ */ React.createElement("a", {
    className: "text-blue-600",
    href: "/preview"
  }, " Preview Mode"))) : /* @__PURE__ */ React.createElement("div", null, "docs.json not found"));
}
function NotFound({ error }) {
  const { owner, repo, path, repositoryFound } = error.data;
  return /* @__PURE__ */ React.createElement(ErrorContainer, {
    title: "This page could not be found",
    code: error.status
  }, repositoryFound ? /* @__PURE__ */ React.createElement(FileNotFound, {
    owner,
    repo,
    path
  }) : /* @__PURE__ */ React.createElement(RepoNotFound, {
    owner,
    repo
  }));
}
function BadRequest({ error }) {
  return /* @__PURE__ */ React.createElement(ErrorContainer, {
    title: "This page could not be generated",
    code: error.status
  }, /* @__PURE__ */ React.createElement("div", null, "This may be due to an error in your mdx."));
}
function ServerError({ title }) {
  return /* @__PURE__ */ React.createElement(ErrorContainer, {
    title,
    code: 500
  }, /* @__PURE__ */ React.createElement("div", null, "Something went wrong. Try again later or report an issue with us using the link below."));
}
function ErrorContainer({ title, code, children }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "mt-20 max-w-lg mx-auto"
  }, /* @__PURE__ */ React.createElement(Title, {
    statusCode: code,
    title
  }), /* @__PURE__ */ React.createElement("div", {
    className: "mt-10 flex-col"
  }, children), /* @__PURE__ */ React.createElement(QuickLinks, null));
}
function Title({ statusCode, title }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: "font-anton mb-4 text-center lg:text-left"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-7xl lg:text-9xl"
  }, /* @__PURE__ */ React.createElement("span", {
    "data-testid": "error-status-code",
    className: "bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
  }, statusCode)), /* @__PURE__ */ React.createElement("h2", {
    "data-testid": "error-title",
    className: "text-5xl lg:text-4xl text-gray-900 dark:text-white"
  }, title)));
}
var RepoNotFound = ({ owner, repo }) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The GitHub repository", " ", /* @__PURE__ */ React.createElement(DocsLink, {
  className: "text-blue-600",
  to: `https://github.com/${owner}/${repo}`
}, owner, "/", repo), " ", "was not found."), /* @__PURE__ */ React.createElement("p", null, "To get started, create a new repository on", " ", /* @__PURE__ */ React.createElement(DocsLink, {
  className: "text-blue-600",
  to: "https://github.com/new"
}, "GitHub"), "."));
var FileNotFound = ({ owner, repo, path }) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "The file ", " ", /* @__PURE__ */ React.createElement(DocsLink, {
  className: "text-blue-600",
  to: `https://github.com/${owner}/${repo}/blob/main/${path}.mdx`
}, path, ".mdx"), " ", "was not found."), /* @__PURE__ */ React.createElement("p", null, "This could be because of a typo in your sidebar config, or you've not made a file at this path."));

// app/components/Documentation.tsx
init_react();
var import_client = __toModule(require("@docs.page/client"));
var import_classnames7 = __toModule(require("classnames"));

// app/components/Header.tsx
init_react();
var import_remix5 = __toModule(require_remix());
var import_classnames = __toModule(require("classnames"));
var import_react6 = __toModule(require("@docsearch/react"));
function Header() {
  const { owner, repo, config, ref, source } = useDocumentationContext();
  const base = useBaseUrl();
  const logoLight = useImagePath(config.logo);
  const logoDark = useImagePath(config.logoDark);
  const previewMode = usePreviewMode();
  return /* @__PURE__ */ React.createElement("header", {
    className: "sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-gray-900/10 dark:lg:border-gray-400/10 bg-white/60 dark:bg-zinc-900/60"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "max-w-8xl mx-auto flex items-center h-14 px-4 lg:px-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-shrink-0"
  }, /* @__PURE__ */ React.createElement(import_remix5.Link, {
    to: base,
    className: "flex items-center font-bold"
  }, !!config.logo && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("img", {
    className: (0, import_classnames.default)("w-6 h-6 mr-3 inline-block dark:hidden", {
      "dark:hidden": !!config.logoDark
    }),
    src: logoLight,
    alt: "Logo"
  })), !!config.logoDark && /* @__PURE__ */ React.createElement("img", {
    className: "w-6 h-6 mr-3 hidden dark:inline-block",
    src: logoDark,
    alt: "Logo"
  }), /* @__PURE__ */ React.createElement("span", null, config.name || `${owner}/${repo}`))), previewMode.enabled && /* @__PURE__ */ React.createElement("span", {
    className: "ml-4 px-4 py-2 dark:text-black text-white italic text-xs rounded-lg bg-gradient-to-br from-red-600 to-black dark:from-yellow-200 dark:to-red-400"
  }, "preview mode"), /* @__PURE__ */ React.createElement("div", {
    className: "flex-grow flex justify-end"
  }, /* @__PURE__ */ React.createElement("ul", {
    className: "flex space-x-4"
  }, !!config.twitter && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    href: `https://github.com/${owner}/${repo}`,
    className: "text-blue-500 hover:text-blue-400 transition-colors duration-100"
  }, /* @__PURE__ */ React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    className: "h-8 w-8",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    d: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
  })))), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", {
    href: `https://github.com/${owner}/${repo}`,
    className: "text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-100"
  }, /* @__PURE__ */ React.createElement("svg", {
    className: "h-8 w-8",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    clipRule: "evenodd"
  })))), previewMode.enabled && /* @__PURE__ */ React.createElement("button", {
    onClick: previewMode.onSelect,
    className: "mr-4 flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap bg-green-600 hover:bg-green-500"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "text-white"
  }, "Change directory")), !!ref && source.type !== "branch" && source.ref !== "HEAD" && !previewMode.enabled && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(RefLink, {
    pointer: ref,
    owner,
    repo,
    source
  })), !!config.docsearch && !previewMode.enabled && /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(import_react6.DocSearch, {
    appId: config.docsearch.appId,
    apiKey: config.docsearch.apiKey,
    indexName: config.docsearch.indexName
  })), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(DarkModeToggle, null))))));
}
function RefLink({ pointer, owner, repo, source }) {
  const defaultIconSize2 = 16;
  const linkData2 = {
    branch: {
      href: `https://github.com/${owner}/${repo}/tree/${pointer}`,
      icon: /* @__PURE__ */ React.createElement(Branch, {
        size: defaultIconSize2
      }),
      className: "bg-green-600 hover:bg-green-500 "
    },
    PR: {
      href: `https://github.com/${owner}/${repo}/pull/${pointer}`,
      icon: /* @__PURE__ */ React.createElement(PullRequest, {
        size: defaultIconSize2
      }),
      className: "bg-blue-600 hover:bg-blue-500 "
    },
    commit: {
      href: `https://github.com/${owner}/${repo}/tree/${pointer}`,
      icon: /* @__PURE__ */ React.createElement(Commit, {
        size: defaultIconSize2
      }),
      className: "bg-pink-600 hover:bg-pink-500 "
    }
  };
  const { href, icon, className } = linkData2[(source == null ? void 0 : source.type) ?? "branch"];
  return /* @__PURE__ */ React.createElement("a", {
    href
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames.default)("flex px-3 py-2 text-xs rounded-lg shadow text-white transition-colors whitespace-nowrap", `${className}`)
  }, icon, /* @__PURE__ */ React.createElement("div", {
    className: "pl-1"
  }, pointer)));
}

// app/components/Sidebar.tsx
init_react();
var import_classnames2 = __toModule(require("classnames"));
function Sidebar() {
  const { sidebar } = useDocumentationContext().config;
  return /* @__PURE__ */ React.createElement("nav", null, /* @__PURE__ */ React.createElement("ul", {
    className: "text-sm text-gray-600 dark:text-gray-300"
  }, sidebar.map(([title, urlOrChildren]) => {
    if (typeof urlOrChildren === "string") {
      return /* @__PURE__ */ React.createElement("li", {
        key: urlOrChildren
      }, /* @__PURE__ */ React.createElement(DocsLink, {
        end: urlOrChildren === "/",
        to: urlOrChildren,
        className: ({ isActive }) => (0, import_classnames2.default)("block my-2", {
          "hover:text-gray-800 dark:hover:text-gray-100": !isActive,
          "text-docs-theme font-medium border-docs-theme": isActive
        })
      }, title));
    }
    return /* @__PURE__ */ React.createElement("li", {
      key: title,
      className: "mt-4 first:mt-0 mb-4"
    }, /* @__PURE__ */ React.createElement("h5", {
      className: "text-gray-900 dark:text-gray-200 font-semibold tracking-wide pb-3"
    }, title), /* @__PURE__ */ React.createElement("ul", {
      className: "border-l border-gray-100 dark:border-gray-700 space-y-2"
    }, urlOrChildren.map(([title2, url]) => /* @__PURE__ */ React.createElement("li", {
      key: url
    }, /* @__PURE__ */ React.createElement(DocsLink, {
      end: url === "/",
      to: url,
      className: ({ isActive }) => (0, import_classnames2.default)("block pl-4 -ml-px border-l border-transparent", {
        "hover:border-gray-400 hover:text-gray-800 dark:hover:text-gray-100": !isActive,
        "text-docs-theme font-medium !border-docs-theme": isActive
      })
    }, title2)))));
  })));
}

// app/components/Theme.tsx
init_react();
var import_color = __toModule(require("color"));
function Theme() {
  const theme = useDocumentationContext().config.theme;
  let color;
  try {
    color = (0, import_color.default)(theme);
  } catch {
    color = (0, import_color.default)(defaultConfig.theme);
  }
  const variants = {
    base: color.hex().toString(),
    dark: color.darken(0.2).hex().toString(),
    light: color.lighten(0.2).hex().toString()
  };
  return /* @__PURE__ */ React.createElement("script", {
    dangerouslySetInnerHTML: {
      __html: `
          const root = document.documentElement;
          root.style.setProperty('--theme-color', '${variants.base}');
          root.style.setProperty('--theme-color-dark', '${variants.dark}');
          root.style.setProperty('--theme-color-light', '${variants.light}');
          root.style.setProperty('--docsearch-primary-color', '--var(--theme-color)');
      `
    }
  });
}

// app/components/mdx/index.tsx
init_react();
var import_react10 = __toModule(require("react"));
var import_classnames5 = __toModule(require("classnames"));

// app/components/mdx/YouTube.tsx
init_react();
function YouTube({ id }) {
  if (!id) {
    return /* @__PURE__ */ React.createElement("div", null);
  }
  return /* @__PURE__ */ React.createElement("iframe", {
    className: "w-full aspect-video rounded overflow-hidden",
    src: `https://www.youtube.com/embed/${id}`,
    allowFullScreen: true,
    allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
  });
}

// app/components/mdx/Image.tsx
init_react();
var import_react7 = __toModule(require("react"));
var import_react_medium_image_zoom = __toModule(require("react-medium-image-zoom"));
function Image(_a) {
  var _b = _a, { zoom, caption } = _b, props = __objRest(_b, ["zoom", "caption"]);
  const src = useImagePath(props.src || "");
  const zoomEnabled = zoom;
  const wrapper = (child) => props.href ? withHref(withFigure(zoomEnabled ? withZoom(child) : child, caption), props.href) : withFigure(zoomEnabled ? withZoom(child) : child, caption);
  const style = {
    height: props.height ? parseInt(`${props.height}`) : "inherit",
    width: props.width ? parseInt(`${props.width}`) : "inherit"
  };
  return wrapper(/* @__PURE__ */ React.createElement("img", __spreadProps(__spreadValues({
    className: "mx-auto"
  }, props), {
    style,
    src,
    alt: props.alt ?? "",
    loading: "lazy"
  })));
}
function withHref(child, href) {
  return /* @__PURE__ */ React.createElement(DocsLink, {
    to: href
  }, child);
}
function withFigure(child, caption) {
  return /* @__PURE__ */ React.createElement("figure", null, child, !!caption && /* @__PURE__ */ React.createElement("figcaption", {
    className: "text-center text-sm italic my-3 dark:text-white"
  }, caption));
}
function withZoom(child) {
  const [isZoomed, setIsZoomed] = (0, import_react7.useState)(false);
  const handleZoomChange = (0, import_react7.useCallback)((shouldZoom) => {
    setIsZoomed(shouldZoom);
  }, []);
  return /* @__PURE__ */ React.createElement(import_react_medium_image_zoom.Controlled, {
    wrapStyle: isZoomed ? { width: "100%", height: "auto", transition: "height ease-out  0.5s" } : { transition: "height ease-out  0.5s" },
    isZoomed,
    onZoomChange: handleZoomChange
  }, child);
}

// app/components/mdx/Table.tsx
init_react();
function Table(props) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "overflow-scroll sm:overflow-visible"
  }, /* @__PURE__ */ React.createElement("table", __spreadValues({}, props)));
}

// app/components/mdx/Pre.tsx
init_react();
var import_react8 = __toModule(require("react"));
var import_classnames3 = __toModule(require("classnames"));
var import_react_copy_to_clipboard = __toModule(require("react-copy-to-clipboard"));
function Pre(props) {
  const [copied, setCopied] = (0, import_react8.useState)(false);
  let timeout;
  (0, import_react8.useEffect)(() => {
    if (copied) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setCopied(false);
      }, 2e3);
    }
  }, [copied]);
  const title = props.title;
  const raw = decodeURIComponent(encodeURIComponent(props.raw));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, !!title && /* @__PURE__ */ React.createElement("div", {
    className: "rounded-tr rounded-tl font-mono font-bold text-gray-300 text-sm px-4 py-2 border-b border-gray-700 bg-[#24292e]"
  }, title), /* @__PURE__ */ React.createElement("div", {
    className: "relative group"
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames3.default)("shiki-parent", {
      "shiki-parent-title": !!title
    }),
    dangerouslySetInnerHTML: { __html: props.html }
  }), /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames3.default)("opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 mr-2 mt-2", {
      "opacity-100": copied
    })
  }, /* @__PURE__ */ React.createElement(import_react_copy_to_clipboard.default, {
    text: raw,
    onCopy: () => setCopied(true)
  }, /* @__PURE__ */ React.createElement("button", {
    className: "text-white text-xs font-mono bg-black hover:bg-black/40 transition-colors px-3 py-2 rounded-lg"
  }, copied ? "Copied" : "Copy")))));
}

// app/components/mdx/Tabs.tsx
init_react();
var import_react9 = __toModule(require("react"));
var import_classnames4 = __toModule(require("classnames"));
var PREFIX = "docs.page:tabs";
var Context = (0, import_react9.createContext)({
  tabs: {},
  updateTab: () => {
    return;
  },
  hash: ""
});
function TabsContext({
  children,
  hash: hash2
}) {
  const [tabs, setTabs] = (0, import_react9.useState)({});
  const updateTab = (0, import_react9.useCallback)((key, value) => {
    if (value) {
      setTabs(($) => __spreadProps(__spreadValues({}, $), {
        [key]: value
      }));
    }
  }, []);
  return /* @__PURE__ */ import_react9.default.createElement(Context.Provider, {
    value: {
      tabs,
      updateTab,
      hash: hash2
    }
  }, children);
}
function useTabSynchronization(groupId, setState) {
  const { tabs, updateTab, hash: hash2 } = (0, import_react9.useContext)(Context);
  const key = `${PREFIX}:${hash2}:${groupId}`;
  const value = tabs[key];
  const synchronize = (0, import_react9.useCallback)((tab) => {
    localStorage.setItem(key, tab);
    updateTab(key, tab);
  }, [key, groupId]);
  (0, import_react9.useEffect)(() => {
    const initialValue = localStorage.getItem(key);
    updateTab(key, initialValue);
  }, [groupId]);
  (0, import_react9.useEffect)(() => {
    if (groupId && value) {
      setState(value);
    }
  }, [groupId, value]);
  return synchronize;
}
function extractTabItems(children) {
  let items = [];
  import_react9.default.Children.forEach(children, (child) => {
    if (import_react9.default.isValidElement(child)) {
      if (child.props.children) {
        items = [...items, ...extractTabItems(child.props.children)];
      }
      const name = child.type.name;
      if (name === "TabItem") {
        items = [...items, child];
      }
    }
  });
  return items;
}
function Tabs(props) {
  var _a;
  if (!((_a = props.values) == null ? void 0 : _a.length)) {
    console.warn("<Tabs />: Expected a `values` array.");
    return /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null);
  }
  const tabs = extractTabItems(props.children);
  const [selected, setSelected] = (0, import_react9.useState)(() => {
    if (props.groupId)
      return null;
    return props.defaultValue || props.values[0].value;
  });
  const sync = useTabSynchronization(props.groupId ?? "", setSelected);
  return /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "mb-6 border dark:border-gray-700 rounded"
  }, /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "flex p-2"
  }, props.values.map(({ label, value }) => /* @__PURE__ */ import_react9.default.createElement("div", {
    role: "button",
    key: value,
    className: (0, import_classnames4.default)("px-6 py-5 flex items-center border-b-2 font-bold hover:bg-gray-500 hover:bg-opacity-10 rounded", {
      "border-docs-theme": value === selected,
      "border-transparent": value !== selected
    }),
    onClick: () => {
      setSelected(value);
      if (props.groupId) {
        sync(value);
      }
    }
  }, label))), /* @__PURE__ */ import_react9.default.createElement("div", {
    className: "p-6"
  }, /* @__PURE__ */ import_react9.default.createElement("style", null, `
          div.tab[data-active='true'] {
            display: block;
          }
        `), tabs.map((child) => {
    const tab = props.values.find((v) => v.value === child.props.value);
    if (!tab) {
      return null;
    }
    return /* @__PURE__ */ import_react9.default.createElement("div", {
      className: "tab hidden",
      key: tab.value,
      "data-tab": tab.value,
      "data-active": (selected === tab.value).toString()
    }, child);
  })));
}
var TabItem = (props) => {
  return /* @__PURE__ */ import_react9.default.createElement(import_react9.default.Fragment, null, props.children);
};

// app/components/mdx/index.tsx
function Anchor(props) {
  return /* @__PURE__ */ React.createElement(DocsLink, {
    to: props.href || "",
    className: "no-underline border-b border-docs-theme hover:border-b-2"
  }, props.children);
}
function Heading(_a) {
  var _b = _a, { type, id, children } = _b, props = __objRest(_b, ["type", "id", "children"]);
  return (0, import_react10.createElement)(type, __spreadProps(__spreadValues({}, props), {
    className: (0, import_classnames5.default)("relative", props.className),
    children: type === "h1" ? children : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
      id,
      className: "absolute -top-16 opacity-0 pointer-events-none"
    }), /* @__PURE__ */ React.createElement("a", {
      href: `#${id}`,
      className: "before:content-['#'] before:absolute before:-left-6 before:text-docs-theme no-underline"
    }), /* @__PURE__ */ React.createElement("span", null, children))
  }));
}
var mdx_default = {
  img: Image,
  table: Table,
  pre: Pre,
  a: Anchor,
  h1: (props) => /* @__PURE__ */ React.createElement(Heading, __spreadProps(__spreadValues({}, props), {
    type: "h1"
  })),
  h2: (props) => /* @__PURE__ */ React.createElement(Heading, __spreadProps(__spreadValues({}, props), {
    type: "h2"
  })),
  h3: (props) => /* @__PURE__ */ React.createElement(Heading, __spreadProps(__spreadValues({}, props), {
    type: "h3"
  })),
  h4: (props) => /* @__PURE__ */ React.createElement(Heading, __spreadProps(__spreadValues({}, props), {
    type: "h4"
  })),
  h5: (props) => /* @__PURE__ */ React.createElement(Heading, __spreadProps(__spreadValues({}, props), {
    type: "h5"
  })),
  h6: (props) => /* @__PURE__ */ React.createElement(Heading, __spreadProps(__spreadValues({}, props), {
    type: "h6"
  })),
  Heading,
  YouTube,
  Image,
  Tabs,
  TabItem
};

// app/components/ScrollSpy.tsx
init_react();
var import_classnames6 = __toModule(require("classnames"));
var import_react11 = __toModule(require("react"));
function ScrollSpy() {
  const { headings } = useDocumentationContext();
  const [active, setActive] = (0, import_react11.useState)("");
  (0, import_react11.useEffect)(() => {
    if (!headings) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      for (let entry2 of entries) {
        if (entry2.isIntersecting) {
          const id = entry2.target.getAttribute("id");
          setActive(id);
          break;
        }
      }
    }, {
      threshold: 0.25
    });
    headings.forEach(({ id }) => {
    });
    return () => {
      setActive("");
      observer.disconnect();
    };
  }, [headings]);
  if (!headings) {
    return /* @__PURE__ */ React.createElement("ul", null);
  }
  function onClick(id) {
    const el = document.getElementById(id);
    const sectionTop = el == null ? void 0 : el.getBoundingClientRect().top;
    const currentTop = document.documentElement.scrollTop;
    window.scrollTo({ top: sectionTop + currentTop - 100, behavior: "smooth" });
    if (history.pushState) {
      history.pushState(null, `#${id}`);
    } else {
      location.hash = `#${id}`;
    }
    setActive(id);
  }
  return /* @__PURE__ */ React.createElement("ul", {
    className: "text-sm space-y-2"
  }, headings.map((heading) => /* @__PURE__ */ React.createElement("li", {
    key: heading.id,
    className: (0, import_classnames6.default)({
      "text-docs-theme": active === heading.id
    })
  }, /* @__PURE__ */ React.createElement("a", {
    className: "cursor-pointer",
    onClick: () => onClick(heading.id)
  }, heading.title))));
}

// app/components/Documentation.tsx
function Documentation({ data }) {
  const MDX = (0, import_client.useHydratedMdx)({ code: data.code });
  const hash2 = hash(`${data.owner}/${data.repo}`);
  return /* @__PURE__ */ React.createElement(DocumentationProvider, {
    data
  }, /* @__PURE__ */ React.createElement(Theme, null), /* @__PURE__ */ React.createElement(Header, null), /* @__PURE__ */ React.createElement("div", {
    "data-test-id": "documentation-provider",
    className: "max-w-8xl mx-auto"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "fixed inset-0 py-10 px-8 overflow-x-auto top-14 left-[max(0px,calc(50%-45rem))] w-64"
  }, /* @__PURE__ */ React.createElement(Sidebar, null)), /* @__PURE__ */ React.createElement("div", {
    className: "pt-10 pl-72"
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames7.default)({
      "mr-52 pr-16": true
    })
  }, /* @__PURE__ */ React.createElement("main", {
    className: "prose dark:prose-invert max-w-none\n              prose-code:font-fira prose-code:font-medium\n            "
  }, /* @__PURE__ */ React.createElement(TabsContext, {
    hash: hash2
  }, /* @__PURE__ */ React.createElement(MDX, {
    components: mdx_default
  }))), /* @__PURE__ */ React.createElement(Footer, null)), !!data.headings && /* @__PURE__ */ React.createElement("aside", {
    className: "pt-10 px-8 fixed top-14 bottom-0 w-52 overflow-y-auto right-[max(0px,calc(50%-45rem))]"
  }, /* @__PURE__ */ React.createElement(ScrollSpy, null)))));
}

// route-module:/Users/jacobcable/docs.page/website/app/routes/$owner.$repo.$.tsx
function headers({ loaderHeaders }) {
  return {
    "cache-control": loaderHeaders.get("cache-control")
  };
}
var loader2 = docsLoader;
var links2 = () => {
  return [
    { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@docsearch/css@alpha" },
    { rel: "stylesheet", href: docsearch_default },
    { rel: "stylesheet", href: codeblocks_default },
    { rel: "stylesheet", href: dist_default }
  ];
};
var meta = (props) => {
  var _a, _b;
  if (!props.data) {
    return {
      title: "",
      description: ""
    };
  }
  return {
    title: ((_a = props.data.frontmatter) == null ? void 0 : _a.title) ?? "",
    description: ((_b = props.data.frontmatter) == null ? void 0 : _b.description) ?? ""
  };
};
function Page() {
  const data = (0, import_remix6.useLoaderData)();
  return /* @__PURE__ */ React.createElement(Documentation, {
    data
  });
}
function CatchBoundary2() {
  const e = (0, import_remix6.useCatch)();
  console.log(e);
  let child;
  if (e.status === 404) {
    child = /* @__PURE__ */ React.createElement(NotFound, {
      error: e
    });
  } else if (e.status === 500) {
    child = /* @__PURE__ */ React.createElement(ServerError, {
      title: "Internal server error"
    });
  } else if (e.status === 400) {
    child = /* @__PURE__ */ React.createElement(BadRequest, {
      error: e
    });
  } else {
    child = /* @__PURE__ */ React.createElement(ServerError, {
      title: "Something went wrong"
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    "data-testid": "error-container"
  }, child, /* @__PURE__ */ React.createElement(Footer, null));
}
function ErrorBoundary2() {
  return /* @__PURE__ */ React.createElement(ServerError, {
    title: "An uncaught error was thrown"
  });
}

// route-module:/Users/jacobcable/docs.page/website/app/routes/preview.tsx
var preview_exports = {};
__export(preview_exports, {
  CatchBoundary: () => CatchBoundary3,
  ErrorBoundary: () => ErrorBoundary3,
  default: () => LocalPreview,
  links: () => links3,
  meta: () => meta2
});
init_react();
var import_remix7 = __toModule(require_remix());
var import_detect_browser = __toModule(require("detect-browser"));
var links3 = () => {
  return [
    { rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/@docsearch/css@alpha" },
    { rel: "stylesheet", href: docsearch_default },
    { rel: "stylesheet", href: dist_default }
  ];
};
var meta2 = () => {
  return {
    title: "docs.page Local Preview Mode",
    description: ""
  };
};
function LocalPreview() {
  const { select, handles, configHandle, error: directoryError } = useDirectorySelector();
  const [data, urls, pollErrorCode] = usePollLocalDocs(handles, configHandle, 500);
  if (directoryError) {
    return /* @__PURE__ */ React.createElement(PreviewNotFound, {
      error: ""
    });
  }
  if (pollErrorCode) {
    return /* @__PURE__ */ React.createElement(PreviewNotFound, {
      error: ""
    });
  }
  if (!handles || !data || !data.code) {
    return /* @__PURE__ */ React.createElement(LandingPage, {
      onSelect: select
    });
  }
  return /* @__PURE__ */ React.createElement(PreviewModeContext.Provider, {
    value: { enabled: true, onSelect: select, imageUrls: urls }
  }, /* @__PURE__ */ React.createElement(Documentation, {
    data
  }));
}
function LandingPage({ onSelect }) {
  const browser = (0, import_detect_browser.detect)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "dark:text-white"
  }, /* @__PURE__ */ React.createElement("section", {
    className: "py-16 lg:py-32 items-center text-center px-4 lg:text-left"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "max-w-6xl mx-auto tracking-wider"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-center lg:justify-between mb-4 space-x-4"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-start space-x-4"
  }, /* @__PURE__ */ React.createElement("h3", {
    className: "font-anton text-4xl"
  }, "docs.page"), /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/invertase/docs.page",
    className: "text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-100"
  }, /* @__PURE__ */ React.createElement(GitHub, {
    size: 40
  })), /* @__PURE__ */ React.createElement("h3", {
    className: "italic"
  }, "Local Preview Mode (Beta)"))), /* @__PURE__ */ React.createElement("h1", {
    className: " text-center font-anton mt-40 mb-4 text-2xl lg:text-5xl bg-clip-text text-transparent bg-gradient-to-br from-gray-900 dark:from-gray-100 via-gray-700 dark:via-gray-300 to-gray-900 dark:to-gray-200"
  }, "Preview from your machine, with", " ", /* @__PURE__ */ React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-br from-red-600 to-black dark:from-yellow-200 dark:to-red-400"
  }, "hot reload."), " ", /* @__PURE__ */ React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-br from-red-800 to-violet-500"
  })), (browser == null ? void 0 : browser.name) === "chrome" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", {
    suppressHydrationWarning: true,
    className: "text-center pt-20"
  }, "To get started, simply select the local directory containing your docs.json config file:"), /* @__PURE__ */ React.createElement("div", {
    className: "w-100% pt-8 text-center items-center justify-center content-center"
  }, /* @__PURE__ */ React.createElement("button", {
    className: "cursor-pointer bg-green-600 hover:bg-green-500 px-3 py-2 text-s rounded-lg shadow text-white transition-colors whitespace-nowrap",
    onClick: onSelect
  }, "Select Directory!"))) : /* @__PURE__ */ React.createElement("p", {
    suppressHydrationWarning: true,
    className: "text-center pt-20"
  }, "Local Preview Mode is only available on Chrome at the moment, sorry :(")), /* @__PURE__ */ React.createElement("div", {
    className: "mt-32 max-w-5xl mx-auto px-4 lg:px-0"
  }, /* @__PURE__ */ React.createElement(Footer, null))));
}
function CatchBoundary3() {
  const e = (0, import_remix7.useCatch)();
  console.log(e);
  let child;
  if (e.status === 404) {
    child = /* @__PURE__ */ React.createElement(PreviewNotFound, {
      error: ""
    });
  } else if (e.status === 500) {
    child = /* @__PURE__ */ React.createElement(ServerError, {
      title: "Internal server error"
    });
  } else if (e.status === 400) {
    child = /* @__PURE__ */ React.createElement(BadRequest, {
      error: e
    });
  } else {
    child = /* @__PURE__ */ React.createElement(ServerError, {
      title: "Something went wrong"
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    "data-testid": "error-container"
  }, child, /* @__PURE__ */ React.createElement(Footer, null));
}
function ErrorBoundary3() {
  return /* @__PURE__ */ React.createElement(ServerError, {
    title: "An uncaught error was thrown"
  });
}

// route-module:/Users/jacobcable/docs.page/website/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  Button: () => Button,
  Feature: () => Feature,
  Heading: () => Heading2,
  default: () => Index,
  meta: () => meta3
});
init_react();
var import_classnames8 = __toModule(require("classnames"));
var import_react_router_dom3 = __toModule(require("react-router-dom"));
var import_solid2 = __toModule(require("@heroicons/react/solid"));
var meta3 = () => ({
  "theme-color": "#ffffff",
  title: "docs.page | Create an instant Open Source docs page with zero configuration.",
  description: "Create an instant Open Source docs page with zero configuration.",
  "og:title": "docs.page",
  "og:description": "Create an instant Open Source docs page with zero configuration.",
  "og:image": "http://docs.page/assets/docs-page-social.png",
  "og:url": "http://docs.page",
  "twitter:title": "docs.page",
  "twitter:description": "Create an instant Open Source docs page with zero configuration.",
  "twitter:image": "http://docs.page/assets/docs-page-social.png",
  "twitter:card": "summary_large_image"
});
function Index() {
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("section", {
    className: "py-16 lg:py-32 text-center px-4 lg:text-left"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "max-w-6xl mx-auto tracking-wider"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center justify-center lg:justify-start mb-4 space-x-4"
  }, /* @__PURE__ */ React.createElement("h3", {
    className: "font-anton text-4xl"
  }, "docs.page"), /* @__PURE__ */ React.createElement("a", {
    href: "https://github.com/invertase/docs.page",
    className: "text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors duration-100"
  }, /* @__PURE__ */ React.createElement("svg", {
    className: "h-10 w-10 ",
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",
    clipRule: "evenodd"
  })))), /* @__PURE__ */ React.createElement("h1", {
    className: "font-anton mb-4 text-6xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-br from-gray-900 dark:from-gray-100 via-gray-700 dark:via-gray-300 to-gray-900 dark:to-gray-200"
  }, "Instant", " ", /* @__PURE__ */ React.createElement("span", {
    className: "bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-blue-500"
  }, "Open Source"), " ", "docs ", /* @__PURE__ */ React.createElement("br", null), " with zero configuration."))), /* @__PURE__ */ React.createElement("div", {
    className: "max-w-5xl mx-auto px-4 lg:px-0"
  }, /* @__PURE__ */ React.createElement(Heading2, {
    step: 1,
    title: /* @__PURE__ */ React.createElement("span", null, "Add a", " ", /* @__PURE__ */ React.createElement("span", {
      className: "bg-clip-text text-transparent bg-gradient-to-br from-purple-400 via-pink-500 to-red-500"
    }, "docs"), " ", "directory to your GitHub repository."),
    from: "from-purple-400",
    to: "to-red-500"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "lg:ml-20 mt-16 lg:flex items-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-1"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-lg px-3"
  }, "docs.page sources content directly from any Open Source GitHub repository."), /* @__PURE__ */ React.createElement("p", {
    className: "mt-4 text-lg px-3"
  }, "To get started, create an empty ", /* @__PURE__ */ React.createElement("code", {
    className: "text-red-400"
  }, "docs"), " directory at the root of your repository.")), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mt-10 lg:mt-0 lg:pl-8"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "mx-6 py-3 border-t border-l border-r rounded-tr rounded-tl border-gray-700"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "py-3 px-3 flex items-center border rounded border-gray-700 font-mono text-sm shadow-xl"
  }, /* @__PURE__ */ React.createElement("svg", {
    height: "16",
    viewBox: "0 0 16 16",
    version: "1.1",
    width: "16",
    className: "text-white mr-3"
  }, /* @__PURE__ */ React.createElement("path", {
    fill: "currentColor",
    fillRule: "evenodd",
    d: "M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3h-6.5a.25.25 0 01-.2-.1l-.9-1.2c-.33-.44-.85-.7-1.4-.7h-3.5z"
  })), /* @__PURE__ */ React.createElement("span", {
    className: "flex-1"
  }, "docs"), /* @__PURE__ */ React.createElement("span", {
    className: "text-gray-600"
  }, "A few seconds ago")), /* @__PURE__ */ React.createElement("div", {
    className: "mx-6 py-3 border-b border-l border-r rounded-br rounded-bl border-gray-700"
  })))))), /* @__PURE__ */ React.createElement("div", {
    className: "mt-32 max-w-5xl mx-auto px-4 lg:px-0"
  }, /* @__PURE__ */ React.createElement(Heading2, {
    step: 2,
    title: /* @__PURE__ */ React.createElement("span", null, "Create an", " ", /* @__PURE__ */ React.createElement("span", {
      className: "bg-clip-text text-transparent bg-gradient-to-br from-green-400 to-blue-500"
    }, "index.mdx"), " ", "file."),
    from: "from-green-400",
    to: "to-blue-500"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "lg:ml-20 mt-16 flex flex-col-reverse lg:flex-row items-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "w-full flex-1"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "pr-5 mt-10 lg:mt-0"
  }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    className: "border rounded-tr rounded-tl bg-gray-50 border-gray-700 px-3 py-2"
  }, /* @__PURE__ */ React.createElement("code", {
    className: "text-sm"
  }, "docs/index.mdx")), /* @__PURE__ */ React.createElement("div", {
    className: "flex"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 p-3 font-mono border-gray-700 border-r border-l"
  }, /* @__PURE__ */ React.createElement("div", null, "# Installation"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("div", null, "```bash"), /* @__PURE__ */ React.createElement("div", null, "npm install myawesomelib"), "```"))))), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-lg px-3"
  }, "Create a ", /* @__PURE__ */ React.createElement("code", {
    className: "text-blue-500"
  }, `index.mdx`), " file at the root of your", " ", /* @__PURE__ */ React.createElement("code", {
    className: "text-blue-500"
  }, "/docs"), " directory. docs.page supports nested pages based on your directory structure of the directory."), /* @__PURE__ */ React.createElement("p", {
    className: "mt-4 text-lg px-3"
  }, "Start by writing some ", /* @__PURE__ */ React.createElement("a", {
    href: "https://www.markdownguide.org/"
  }, "Markdown"), " content. Installation pages are always a great place to start!")))), /* @__PURE__ */ React.createElement("div", {
    className: "mt-32 max-w-5xl mx-auto px-4 lg:px-0"
  }, /* @__PURE__ */ React.createElement(Heading2, {
    step: 3,
    title: "Checkout your new documentation!",
    from: "from-yellow-400",
    to: "to-yellow-500"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "lg:ml-20 mt-10 lg:flex"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-1"
  }, "TODO"), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1"
  }))), /* @__PURE__ */ React.createElement("div", {
    className: "mt-32 max-w-5xl mx-auto px-4 lg:px-0"
  }, /* @__PURE__ */ React.createElement(Heading2, {
    step: 4,
    title: "Learn more...",
    from: "from-green-400",
    to: "to-green-500"
  }), /* @__PURE__ */ React.createElement("div", {
    className: "lg:ml-20 mt-10 grid lg:grid-cols-2 gap-16 text-center"
  }, /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/configuration",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-blue-500"
    }, "Configure"),
    text: /* @__PURE__ */ React.createElement("span", null, "Add a ", /* @__PURE__ */ React.createElement("code", {
      className: "text-blue-400"
    }, "docs.json"), " file to the root of the repository to configure your project by adding a theme, search, navigation, analytics and more."),
    icon: /* @__PURE__ */ React.createElement(import_solid2.AdjustmentsIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/previews",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-pink-400"
    }, "Previews"),
    text: /* @__PURE__ */ React.createElement("span", null, "Previewing docs locally with our new Local Preview Mode. Previewing changes on branches and pull requests works out of the box with zero configuration. Install our GitHub bot for preview assistance."),
    icon: /* @__PURE__ */ React.createElement(import_solid2.EyeIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/components",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-yellow-400"
    }, "Components"),
    text: /* @__PURE__ */ React.createElement("span", null, "By using MDX we provide custom React components to help you build better documentation."),
    icon: /* @__PURE__ */ React.createElement(import_solid2.TemplateIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/custom-domains",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-green-400"
    }, "Domains"),
    text: /* @__PURE__ */ React.createElement("span", null, "Using a custom domain name? Simply create a pull request & point your domain to our servers. We'll take care of the rest."),
    icon: /* @__PURE__ */ React.createElement(import_solid2.GlobeAltIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/github-bot",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-purple-500"
    }, "GitHub Bot"),
    text: /* @__PURE__ */ React.createElement("span", null, "Install our GitHub bot on repositories using docs.page. Any new Pull Requests will automatically display a publicly available deployment preview URL for your documentation."),
    icon: /* @__PURE__ */ React.createElement(import_solid2.AnnotationIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/search",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-red-500"
    }, "Search"),
    text: /* @__PURE__ */ React.createElement("span", null, "Add your DocSearch application ID to your configuration file and instantly get full blown documentation search for free, powered by Algolia."),
    icon: /* @__PURE__ */ React.createElement(import_solid2.SearchCircleIcon, {
      width: 80
    })
  }))));
}
function Button({ href, children }) {
  return /* @__PURE__ */ React.createElement(import_react_router_dom3.Link, {
    to: href,
    className: "px-6 py-2 border border-gray-600 hover:border-gray-300 dark:hover:border-white no-underline rounded transition-all duration-100"
  }, children);
}
function Heading2({ step, title, from, to }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames8.default)("w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br shadow-xl", from, to)
  }, /* @__PURE__ */ React.createElement("span", {
    className: "font-anton text-white text-4xl"
  }, step)), /* @__PURE__ */ React.createElement("h2", {
    className: "flex-1 ml-6 font-anton text-4xl leading-relaxed"
  }, title));
}
function Feature({ href, icon, title, text }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex flex-col items-center justify-center p-3"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center"
  }, icon, /* @__PURE__ */ React.createElement("h4", {
    className: "my-8 font-anton text-5xl tracking-wide"
  }, title), /* @__PURE__ */ React.createElement("p", {
    className: "min-h-[90px] leading-relaxed"
  }, text)), /* @__PURE__ */ React.createElement("div", {
    className: "mt-10"
  }, !!href && /* @__PURE__ */ React.createElement(Button, {
    href
  }, "Learn More"), !href && /* @__PURE__ */ React.createElement("div", {
    className: "text-gray-400"
  }, "Coming Soon...")));
}

// <stdin>
var import_assets = __toModule(require("./assets.json"));
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/$owner.$repo.$": {
    id: "routes/$owner.$repo.$",
    parentId: "root",
    path: ":owner/:repo/*",
    index: void 0,
    caseSensitive: void 0,
    module: owner_repo_exports
  },
  "routes/preview": {
    id: "routes/preview",
    parentId: "root",
    path: "preview",
    index: void 0,
    caseSensitive: void 0,
    module: preview_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
/**
 * @remix-run/node v1.1.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/react v1.1.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * @remix-run/server-runtime v1.1.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * remix v1.1.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vbm9kZV9tb2R1bGVzL0ByZW1peC1ydW4vZGV2L2NvbXBpbGVyL3NoaW1zL3JlYWN0LnRzIiwgIi4uLy4uL25vZGVfbW9kdWxlcy9yZW1peC9jbGllbnQuanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWl4L3NlcnZlci5qcyIsICIuLi8uLi9ub2RlX21vZHVsZXMvcmVtaXgvcGxhdGZvcm0uanMiLCAiLi4vLi4vbm9kZV9tb2R1bGVzL3JlbWl4L2luZGV4LmpzIiwgIi4uL3Rlc3RzL21vY2tzL2ZpeHR1cmVzLnRzIiwgIi4uL3Rlc3RzL21vY2tzL2hhbmRsZXJzLnRzIiwgIi4uL3Rlc3RzL21vY2tzL3NlcnZlci50cyIsICIuLi90ZXN0cy9tb2Nrcy9icm93c2VyLnRzIiwgIi4uL3Rlc3RzL21vY2tzL2luZGV4LnRzIiwgIjxzdGRpbj4iLCAiLi4vYXBwL2VudHJ5LnNlcnZlci50c3giLCAicm91dGUtbW9kdWxlOi9Vc2Vycy9qYWNvYmNhYmxlL2RvY3MucGFnZS93ZWJzaXRlL2FwcC9yb290LnRzeCIsICIuLi9hcHAvY29tcG9uZW50cy9EYXJrTW9kZVRvZ2dsZS50c3giLCAiLi4vYXBwL2hvb2tzLnRzIiwgInJvdXRlLW1vZHVsZTovVXNlcnMvamFjb2JjYWJsZS9kb2NzLnBhZ2Uvd2Vic2l0ZS9hcHAvcm91dGVzLyRvd25lci4kcmVwby4kLnRzeCIsICIuLi9hcHAvY29tcG9uZW50cy9Gb290ZXIudHN4IiwgIi4uL2FwcC9jb250ZXh0LnRzeCIsICIuLi9hcHAvdXRpbHMvaW5kZXgudHMiLCAiLi4vYXBwL3V0aWxzL2dldC50cyIsICIuLi9hcHAvdXRpbHMvbG9jYWwtcHJldmlldy1tb2RlLnRzIiwgIi4uL2FwcC91dGlscy9jb25maWcudHMiLCAiLi4vYXBwL2xvYWRlcnMvZG9jdW1lbnRhdGlvbi5zZXJ2ZXIudHMiLCAiLi4vYXBwL2NvbXBvbmVudHMvRXJyb3JzLnRzeCIsICIuLi9hcHAvY29tcG9uZW50cy9Eb2NzTGluay50c3giLCAiLi4vYXBwL2NvbXBvbmVudHMvUXVpY2tsaW5rcy50c3giLCAiLi4vYXBwL2NvbXBvbmVudHMvSWNvbnMudHN4IiwgIi4uL2FwcC9jb21wb25lbnRzL0RvY3VtZW50YXRpb24udHN4IiwgIi4uL2FwcC9jb21wb25lbnRzL0hlYWRlci50c3giLCAiLi4vYXBwL2NvbXBvbmVudHMvU2lkZWJhci50c3giLCAiLi4vYXBwL2NvbXBvbmVudHMvVGhlbWUudHN4IiwgIi4uL2FwcC9jb21wb25lbnRzL21keC9pbmRleC50c3giLCAiLi4vYXBwL2NvbXBvbmVudHMvbWR4L1lvdVR1YmUudHN4IiwgIi4uL2FwcC9jb21wb25lbnRzL21keC9JbWFnZS50c3giLCAiLi4vYXBwL2NvbXBvbmVudHMvbWR4L1RhYmxlLnRzeCIsICIuLi9hcHAvY29tcG9uZW50cy9tZHgvUHJlLnRzeCIsICIuLi9hcHAvY29tcG9uZW50cy9tZHgvVGFicy50c3giLCAiLi4vYXBwL2NvbXBvbmVudHMvU2Nyb2xsU3B5LnRzeCIsICJyb3V0ZS1tb2R1bGU6L1VzZXJzL2phY29iY2FibGUvZG9jcy5wYWdlL3dlYnNpdGUvYXBwL3JvdXRlcy9wcmV2aWV3LnRzeCIsICJyb3V0ZS1tb2R1bGU6L1VzZXJzL2phY29iY2FibGUvZG9jcy5wYWdlL3dlYnNpdGUvYXBwL3JvdXRlcy9pbmRleC50c3giXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuZXhwb3J0IHsgUmVhY3QgfTtcbiIsICIvKipcbiAqIEByZW1peC1ydW4vcmVhY3QgdjEuMS4xXG4gKlxuICogQ29weXJpZ2h0IChjKSBSZW1peCBTb2Z0d2FyZSBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFLm1kIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKlxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxudmFyIHJlYWN0ID0gcmVxdWlyZSgnQHJlbWl4LXJ1bi9yZWFjdCcpO1xuXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdGb3JtJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LkZvcm07IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdMaW5rJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0Lkxpbms7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdMaW5rcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC5MaW5rczsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ0xpdmVSZWxvYWQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QuTGl2ZVJlbG9hZDsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ01ldGEnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QuTWV0YTsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ05hdkxpbmsnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QuTmF2TGluazsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ091dGxldCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC5PdXRsZXQ7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdQcmVmZXRjaFBhZ2VMaW5rcycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC5QcmVmZXRjaFBhZ2VMaW5rczsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1JlbWl4QnJvd3NlcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC5SZW1peEJyb3dzZXI7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdSZW1peFNlcnZlcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC5SZW1peFNlcnZlcjsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1NjcmlwdHMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QuU2NyaXB0czsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ1Njcm9sbFJlc3RvcmF0aW9uJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LlNjcm9sbFJlc3RvcmF0aW9uOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlQWN0aW9uRGF0YScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC51c2VBY3Rpb25EYXRhOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlQmVmb3JlVW5sb2FkJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZUJlZm9yZVVubG9hZDsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3VzZUNhdGNoJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZUNhdGNoOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlRmV0Y2hlcicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC51c2VGZXRjaGVyOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlRmV0Y2hlcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QudXNlRmV0Y2hlcnM7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1c2VGb3JtQWN0aW9uJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZUZvcm1BY3Rpb247IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1c2VIcmVmJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZUhyZWY7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1c2VMb2FkZXJEYXRhJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZUxvYWRlckRhdGE7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1c2VMb2NhdGlvbicsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC51c2VMb2NhdGlvbjsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3VzZU1hdGNoZXMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QudXNlTWF0Y2hlczsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3VzZU5hdmlnYXRlJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZU5hdmlnYXRlOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlTmF2aWdhdGlvblR5cGUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QudXNlTmF2aWdhdGlvblR5cGU7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1c2VPdXRsZXQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QudXNlT3V0bGV0OyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlT3V0bGV0Q29udGV4dCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC51c2VPdXRsZXRDb250ZXh0OyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlUGFyYW1zJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZVBhcmFtczsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3VzZVJlc29sdmVkUGF0aCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiByZWFjdC51c2VSZXNvbHZlZFBhdGg7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1c2VTZWFyY2hQYXJhbXMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QudXNlU2VhcmNoUGFyYW1zOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAndXNlU3VibWl0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlYWN0LnVzZVN1Ym1pdDsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3VzZVRyYW5zaXRpb24nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVhY3QudXNlVHJhbnNpdGlvbjsgfVxufSk7XG4iLCAiLyoqXG4gKiBAcmVtaXgtcnVuL3NlcnZlci1ydW50aW1lIHYxLjEuMVxuICpcbiAqIENvcHlyaWdodCAoYykgUmVtaXggU29mdHdhcmUgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS5tZCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBzZXJ2ZXJSdW50aW1lID0gcmVxdWlyZSgnQHJlbWl4LXJ1bi9zZXJ2ZXItcnVudGltZScpO1xuXG5cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjcmVhdGVDb29raWUnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyUnVudGltZS5jcmVhdGVDb29raWU7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdjcmVhdGVDb29raWVTZXNzaW9uU3RvcmFnZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBzZXJ2ZXJSdW50aW1lLmNyZWF0ZUNvb2tpZVNlc3Npb25TdG9yYWdlOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlTWVtb3J5U2Vzc2lvblN0b3JhZ2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyUnVudGltZS5jcmVhdGVNZW1vcnlTZXNzaW9uU3RvcmFnZTsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZVNlc3Npb24nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyUnVudGltZS5jcmVhdGVTZXNzaW9uOyB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnY3JlYXRlU2Vzc2lvblN0b3JhZ2UnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyUnVudGltZS5jcmVhdGVTZXNzaW9uU3RvcmFnZTsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2lzQ29va2llJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlcnZlclJ1bnRpbWUuaXNDb29raWU7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdpc1Nlc3Npb24nLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyUnVudGltZS5pc1Nlc3Npb247IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdqc29uJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlcnZlclJ1bnRpbWUuanNvbjsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3JlZGlyZWN0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlcnZlclJ1bnRpbWUucmVkaXJlY3Q7IH1cbn0pO1xuIiwgIi8qKlxuICogQHJlbWl4LXJ1bi9ub2RlIHYxLjEuMVxuICpcbiAqIENvcHlyaWdodCAoYykgUmVtaXggU29mdHdhcmUgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS5tZCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBub2RlID0gcmVxdWlyZSgnQHJlbWl4LXJ1bi9ub2RlJyk7XG5cblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ2NyZWF0ZUZpbGVTZXNzaW9uU3RvcmFnZScsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBub2RlLmNyZWF0ZUZpbGVTZXNzaW9uU3RvcmFnZTsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Vuc3RhYmxlX2NyZWF0ZUZpbGVVcGxvYWRIYW5kbGVyJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5vZGUudW5zdGFibGVfY3JlYXRlRmlsZVVwbG9hZEhhbmRsZXI7IH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICd1bnN0YWJsZV9jcmVhdGVNZW1vcnlVcGxvYWRIYW5kbGVyJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5vZGUudW5zdGFibGVfY3JlYXRlTWVtb3J5VXBsb2FkSGFuZGxlcjsgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ3Vuc3RhYmxlX3BhcnNlTXVsdGlwYXJ0Rm9ybURhdGEnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbm9kZS51bnN0YWJsZV9wYXJzZU11bHRpcGFydEZvcm1EYXRhOyB9XG59KTtcbiIsICIvKipcbiAqIHJlbWl4IHYxLjEuMVxuICpcbiAqIENvcHlyaWdodCAoYykgUmVtaXggU29mdHdhcmUgSW5jLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRS5tZCBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICpcbiAqIEBsaWNlbnNlIE1JVFxuICovXG4ndXNlIHN0cmljdCc7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG5cbnZhciBjbGllbnQgPSByZXF1aXJlKCcuL2NsaWVudCcpO1xudmFyIHNlcnZlciA9IHJlcXVpcmUoJy4vc2VydmVyJyk7XG52YXIgcGxhdGZvcm0gPSByZXF1aXJlKCcuL3BsYXRmb3JtJyk7XG5cblxuXG5PYmplY3Qua2V5cyhjbGllbnQpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcblx0aWYgKGsgIT09ICdkZWZhdWx0JyAmJiAhZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShrKSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGssIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY2xpZW50W2tdOyB9XG5cdH0pO1xufSk7XG5PYmplY3Qua2V5cyhzZXJ2ZXIpLmZvckVhY2goZnVuY3Rpb24gKGspIHtcblx0aWYgKGsgIT09ICdkZWZhdWx0JyAmJiAhZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShrKSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGssIHtcblx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuXHRcdGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VydmVyW2tdOyB9XG5cdH0pO1xufSk7XG5PYmplY3Qua2V5cyhwbGF0Zm9ybSkuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuXHRpZiAoayAhPT0gJ2RlZmF1bHQnICYmICFleHBvcnRzLmhhc093blByb3BlcnR5KGspKSBPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgaywge1xuXHRcdGVudW1lcmFibGU6IHRydWUsXG5cdFx0Z2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBwbGF0Zm9ybVtrXTsgfVxuXHR9KTtcbn0pO1xuIiwgImV4cG9ydCBjb25zdCBmaXh0dXJlcyA9IHtcbiAgJzIwMCc6IHtcbiAgICBjb2RlOiAndmFyIENvbXBvbmVudD0oKCk9Pnt2YXIgbD1PYmplY3QuY3JlYXRlO3ZhciBvPU9iamVjdC5kZWZpbmVQcm9wZXJ0eTt2YXIgZD1PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO3ZhciBoPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzO3ZhciBtPU9iamVjdC5nZXRQcm90b3R5cGVPZixwPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7dmFyIGE9ZT0+byhlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciB4PShlLHQpPT4oKT0+KHR8fGUoKHQ9e2V4cG9ydHM6e319KS5leHBvcnRzLHQpLHQuZXhwb3J0cyksaj0oZSx0KT0+e2EoZSk7Zm9yKHZhciByIGluIHQpbyhlLHIse2dldDp0W3JdLGVudW1lcmFibGU6ITB9KX0sdT0oZSx0LHIpPT57aWYodCYmdHlwZW9mIHQ9PVwib2JqZWN0XCJ8fHR5cGVvZiB0PT1cImZ1bmN0aW9uXCIpZm9yKGxldCBzIG9mIGgodCkpIXAuY2FsbChlLHMpJiZzIT09XCJkZWZhdWx0XCImJm8oZSxzLHtnZXQ6KCk9PnRbc10sZW51bWVyYWJsZTohKHI9ZCh0LHMpKXx8ci5lbnVtZXJhYmxlfSk7cmV0dXJuIGV9LF89ZT0+dShhKG8oZSE9bnVsbD9sKG0oZSkpOnt9LFwiZGVmYXVsdFwiLGUmJmUuX19lc01vZHVsZSYmXCJkZWZhdWx0XCJpbiBlP3tnZXQ6KCk9PmUuZGVmYXVsdCxlbnVtZXJhYmxlOiEwfTp7dmFsdWU6ZSxlbnVtZXJhYmxlOiEwfSkpLGUpO3ZhciBpPXgoKHcsYyk9PntjLmV4cG9ydHM9X2pzeF9ydW50aW1lfSk7dmFyIE09e307aihNLHtkZWZhdWx0OigpPT5mfSk7dmFyIG49XyhpKCkpO2Z1bmN0aW9uIGcoZT17fSl7bGV0e3dyYXBwZXI6dH09ZS5jb21wb25lbnRzfHx7fTtyZXR1cm4gdD8oMCxuLmpzeCkodCxPYmplY3QuYXNzaWduKHt9LGUse2NoaWxkcmVuOigwLG4uanN4KShyLHt9KX0pKTpyKCk7ZnVuY3Rpb24gcigpe2xldCBzPU9iamVjdC5hc3NpZ24oe2gxOlwiaDFcIixwOlwicFwifSxlLmNvbXBvbmVudHMpO3JldHVybigwLG4uanN4cykobi5GcmFnbWVudCx7Y2hpbGRyZW46WygwLG4uanN4KShzLmgxLHtpZDpcImhlbGxvLXdvcmxkXCIsY2hpbGRyZW46XCJIZWxsbyBXb3JsZFwifSksYFxcbmAsKDAsbi5qc3gpKHMucCx7Y2hpbGRyZW46XCJUaGlzIGlzIGEgdGVzdCBwYWdlIGZvciBkb2NzLnBhZ2VcIn0pXX0pfX12YXIgZj1nO3JldHVybiBNO30pKCk7XFxuO3JldHVybiBDb21wb25lbnQ7JyxcbiAgICBmcm9udG1hdHRlcjoge30sXG4gICAgaGVhZGluZ3M6IG51bGwsXG4gICAgY29uZmlnOiB7XG4gICAgICBuYW1lOiAnZG9jcy5wYWdlJyxcbiAgICAgIHRoZW1lOiAnIzM2QjlCOScsXG4gICAgICB0d2l0dGVyOiAnaW52ZXJ0YXNlaW8nLFxuICAgICAgc2lkZWJhcjogW1xuICAgICAgICBbJ092ZXJ2aWV3JywgJy8nXSxcbiAgICAgICAgWydHZXR0aW5nIFN0YXJ0ZWQnLCAnL2dldHRpbmctc3RhcnRlZCddLFxuICAgICAgICBbJ0NvbmZpZ3VyYXRpb24nLCAnL2NvbmZpZ3VyYXRpb24nXSxcbiAgICAgICAgWydQcmV2aWV3cycsICcvcHJldmlld3MnXSxcbiAgICAgICAgWydDdXN0b20gRG9tYWlucycsICcvY3VzdG9tLWRvbWFpbnMnXSxcbiAgICAgICAgWydDb21wb25lbnRzJywgJy9jb21wb25lbnRzJ10sXG4gICAgICAgIFsnRnJvbnRtYXR0ZXInLCAnL2Zyb250bWF0dGVyJ10sXG4gICAgICAgIFsnR2l0SHViIEJvdCcsICcvZ2l0aHViLWJvdCddLFxuICAgICAgICBbJ1NlYXJjaCcsICcvc2VhcmNoJ10sXG4gICAgICAgIFsnRGVidWdnaW5nJywgJy9kZWJ1Z2dpbmcnXSxcbiAgICAgICAgWydQcmUtcmVuZGVyaW5nJywgJy9wcmUtcmVuZGVyaW5nJ10sXG4gICAgICAgIFsnQWR2YW5jZWQnLCAnL2FkdmFuY2VkJ10sXG4gICAgICAgIFsnQ29udHJpYnV0aW5nJywgJy9jb250cmlidXRpbmcnXSxcbiAgICAgIF0sXG4gICAgICBkb2NzZWFyY2g6IHtcbiAgICAgICAgYXBpS2V5OiAnOWI1OGQxM2VlMzE5NTA5NDEwNWQ1MjhmYzYxNjFhMDEnLFxuICAgICAgICBpbmRleE5hbWU6ICd1c2VfZG9jc19wYWdlJyxcbiAgICAgIH0sXG4gICAgICBnb29nbGVUYWdNYW5hZ2VyOiAnR1RNLVc4OUo2QlgnLFxuICAgIH0sXG4gIH0sXG4gICc0MDAnOiB7XG4gICAgZXJyb3JzOiBbXG4gICAgICB7XG4gICAgICAgIGRldGFpbDoge1xuICAgICAgICAgIG5hbWU6ICcxOjEnLFxuICAgICAgICAgIG1lc3NhZ2U6ICdFeHBlY3RlZCBhIGNsb3NpbmcgdGFnIGZvciBgPD5gICg2OjEtNjozKScsXG4gICAgICAgICAgcmVhc29uOiAnRXhwZWN0ZWQgYSBjbG9zaW5nIHRhZyBmb3IgYDw+YCAoNjoxLTY6MyknLFxuICAgICAgICAgIGxpbmU6IG51bGwsXG4gICAgICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgICAgIHNvdXJjZTogJ21kYXN0LXV0aWwtbWR4LWpzeCcsXG4gICAgICAgICAgcnVsZUlkOiAnZW5kLXRhZy1taXNtYXRjaCcsXG4gICAgICAgICAgcG9zaXRpb246IHtcbiAgICAgICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgICAgIGxpbmU6IG51bGwsXG4gICAgICAgICAgICAgIGNvbHVtbjogbnVsbCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBlbmQ6IHtcbiAgICAgICAgICAgICAgbGluZTogbnVsbCxcbiAgICAgICAgICAgICAgY29sdW1uOiBudWxsLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIGZhdGFsOiB0cnVlLFxuICAgICAgICB9LFxuICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgIGNvbHVtbjogMCxcbiAgICAgICAgICBmaWxlOiAnX21keF9idW5kbGVyX2VudHJ5X3BvaW50LThmNTZlZjI4LTQxODUtNDRlZS1hODlhLTMzNDgyNTgzOGQxNy5tZHgnLFxuICAgICAgICAgIGxlbmd0aDogMCxcbiAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgIGxpbmVUZXh0OiAnIyBIZWxsbyBXb3JsZCcsXG4gICAgICAgICAgbmFtZXNwYWNlOiAnZmlsZScsXG4gICAgICAgICAgc3VnZ2VzdGlvbjogJycsXG4gICAgICAgIH0sXG4gICAgICAgIG5vdGVzOiBbXSxcbiAgICAgICAgcGx1Z2luTmFtZTogJ2VzYnVpbGQteGRtJyxcbiAgICAgICAgdGV4dDogJ0V4cGVjdGVkIGEgY2xvc2luZyB0YWcgZm9yIGA8PmAgKDY6MS02OjMpJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICB3YXJuaW5nczogW10sXG4gIH0sXG4gICc0MDQnOiB7XG4gICAgY29kZTogbnVsbCxcbiAgICBmcm9udG1hdHRlcjoge30sXG4gICAgaGVhZGluZ3M6IFtdLFxuICAgIGNvbmZpZzogbnVsbCxcbiAgfSxcbiAgJzUwMCc6IHt9LFxufTtcbiIsICJpbXBvcnQgeyBQYXRoUGFyYW1zLCByZXN0IH0gZnJvbSAnbXN3JztcbmltcG9ydCB7IGZpeHR1cmVzIH0gZnJvbSAnLi9maXh0dXJlcyc7XG5cbmV4cG9ydCBjb25zdCBoYW5kbGVycyA9IFtcbiAgcmVzdC5nZXQoJ2h0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9idW5kbGUnLCAocmVxLCByZXMsIGN0eCkgPT4ge1xuICAgIC8vIGNvbnN0IG93bmVyID0gcmVxLnBhcmFtcy5vd25lciBhcyBzdHJpbmc7XG4gICAgLy8gY29uc3QgcmVwb3NpdG9yeSA9IHJlcS5wYXJhbXMucmVwb3NpdG9yeSBhcyAnMjAwJyB8ICc0MDAnIHwgJzQwNCcgfCAnNTAwJztcbiAgICBjb25zdCBvd25lciA9IHJlcS51cmwuc2VhcmNoUGFyYW1zLmdldCgnb3duZXInKTtcbiAgICBpZiAob3duZXIgPT09ICdfdGVzdCcpIHtcbiAgICAgIGNvbnN0IHJlcG9zaXRvcnkgPSByZXEudXJsLnNlYXJjaFBhcmFtcy5nZXQoJ3JlcG9zaXRvcnknKSBhcyB1bmtub3duIGFzXG4gICAgICAgIHwgJzIwMCdcbiAgICAgICAgfCAnNDAwJ1xuICAgICAgICB8ICc0MDQnXG4gICAgICAgIHwgJzUwMCc7XG5cbiAgICAgIHJldHVybiByZXMoY3R4LnN0YXR1cyhwYXJzZUludChyZXBvc2l0b3J5KSksIGN0eC5qc29uKGZpeHR1cmVzW3JlcG9zaXRvcnldKSk7XG4gICAgfVxuICB9KSxcbl07XG4iLCAiaW1wb3J0IHsgaGFuZGxlcnMgfSBmcm9tICcuL2hhbmRsZXJzJztcbmltcG9ydCB7IHNldHVwU2VydmVyIH0gZnJvbSAnbXN3L25vZGUnO1xuZXhwb3J0IGNvbnN0IHNlcnZlciA9IHNldHVwU2VydmVyKFxuICAvLyBEZXNjcmliZSB0aGUgcmVxdWVzdHMgdG8gbW9jay5cbiAgLi4uaGFuZGxlcnMsXG4pO1xuIiwgImltcG9ydCB7IHNldHVwV29ya2VyIH0gZnJvbSAnbXN3JztcbmltcG9ydCB7IGhhbmRsZXJzIH0gZnJvbSAnLi9oYW5kbGVycyc7XG5cbmV4cG9ydCBjb25zdCB3b3JrZXIgPSBzZXR1cFdvcmtlciguLi5oYW5kbGVycyk7XG4iLCAiaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gIGNvbnN0IHsgc2VydmVyIH0gPSByZXF1aXJlKCcuL3NlcnZlcicpO1xuXG4gIHNlcnZlci5saXN0ZW4oKTtcbiAgY29uc29sZS5sb2coJ3NlcnZlciBtb2NrIGxpc3RlbmluZycpO1xufSBlbHNlIHtcbiAgY29uc3QgeyB3b3JrZXIgfSA9IHJlcXVpcmUoJy4vYnJvd3NlcicpO1xuICB3b3JrZXIuc3RhcnQoKTtcbiAgY29uc29sZS5sb2coJ3dvcmtlciBtb2NrIHN0YXJ0ZWQnKTtcbn1cbiIsICJcbmltcG9ydCAqIGFzIGVudHJ5U2VydmVyIGZyb20gXCIvVXNlcnMvamFjb2JjYWJsZS9kb2NzLnBhZ2Uvd2Vic2l0ZS9hcHAvZW50cnkuc2VydmVyLnRzeFwiO1xuaW1wb3J0ICogYXMgcm91dGUwIGZyb20gXCIvVXNlcnMvamFjb2JjYWJsZS9kb2NzLnBhZ2Uvd2Vic2l0ZS9hcHAvcm9vdC50c3hcIjtcbmltcG9ydCAqIGFzIHJvdXRlMSBmcm9tIFwiL1VzZXJzL2phY29iY2FibGUvZG9jcy5wYWdlL3dlYnNpdGUvYXBwL3JvdXRlcy8kb3duZXIuJHJlcG8uJC50c3hcIjtcbmltcG9ydCAqIGFzIHJvdXRlMiBmcm9tIFwiL1VzZXJzL2phY29iY2FibGUvZG9jcy5wYWdlL3dlYnNpdGUvYXBwL3JvdXRlcy9wcmV2aWV3LnRzeFwiO1xuaW1wb3J0ICogYXMgcm91dGUzIGZyb20gXCIvVXNlcnMvamFjb2JjYWJsZS9kb2NzLnBhZ2Uvd2Vic2l0ZS9hcHAvcm91dGVzL2luZGV4LnRzeFwiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBhc3NldHMgfSBmcm9tIFwiLi9hc3NldHMuanNvblwiO1xuZXhwb3J0IGNvbnN0IGVudHJ5ID0geyBtb2R1bGU6IGVudHJ5U2VydmVyIH07XG5leHBvcnQgY29uc3Qgcm91dGVzID0ge1xuICBcInJvb3RcIjoge1xuICAgIGlkOiBcInJvb3RcIixcbiAgICBwYXJlbnRJZDogdW5kZWZpbmVkLFxuICAgIHBhdGg6IFwiXCIsXG4gICAgaW5kZXg6IHVuZGVmaW5lZCxcbiAgICBjYXNlU2Vuc2l0aXZlOiB1bmRlZmluZWQsXG4gICAgbW9kdWxlOiByb3V0ZTBcbiAgfSxcbiAgXCJyb3V0ZXMvJG93bmVyLiRyZXBvLiRcIjoge1xuICAgIGlkOiBcInJvdXRlcy8kb3duZXIuJHJlcG8uJFwiLFxuICAgIHBhcmVudElkOiBcInJvb3RcIixcbiAgICBwYXRoOiBcIjpvd25lci86cmVwby8qXCIsXG4gICAgaW5kZXg6IHVuZGVmaW5lZCxcbiAgICBjYXNlU2Vuc2l0aXZlOiB1bmRlZmluZWQsXG4gICAgbW9kdWxlOiByb3V0ZTFcbiAgfSxcbiAgXCJyb3V0ZXMvcHJldmlld1wiOiB7XG4gICAgaWQ6IFwicm91dGVzL3ByZXZpZXdcIixcbiAgICBwYXJlbnRJZDogXCJyb290XCIsXG4gICAgcGF0aDogXCJwcmV2aWV3XCIsXG4gICAgaW5kZXg6IHVuZGVmaW5lZCxcbiAgICBjYXNlU2Vuc2l0aXZlOiB1bmRlZmluZWQsXG4gICAgbW9kdWxlOiByb3V0ZTJcbiAgfSxcbiAgXCJyb3V0ZXMvaW5kZXhcIjoge1xuICAgIGlkOiBcInJvdXRlcy9pbmRleFwiLFxuICAgIHBhcmVudElkOiBcInJvb3RcIixcbiAgICBwYXRoOiB1bmRlZmluZWQsXG4gICAgaW5kZXg6IHRydWUsXG4gICAgY2FzZVNlbnNpdGl2ZTogdW5kZWZpbmVkLFxuICAgIG1vZHVsZTogcm91dGUzXG4gIH1cbn07IiwgImltcG9ydCB7IHJlbmRlclRvU3RyaW5nIH0gZnJvbSBcInJlYWN0LWRvbS9zZXJ2ZXJcIjtcbmltcG9ydCB7IFJlbWl4U2VydmVyIH0gZnJvbSBcInJlbWl4XCI7XG5pbXBvcnQgdHlwZSB7IEVudHJ5Q29udGV4dCB9IGZyb20gXCJyZW1peFwiO1xuXG5pZiAocHJvY2Vzcy5lbnYuTVNXX0VOQUJMRUQgPT09ICcxJykgeyByZXF1aXJlKCcuLi90ZXN0cy9tb2NrcycpIH07XG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBoYW5kbGVSZXF1ZXN0KFxuICByZXF1ZXN0OiBSZXF1ZXN0LFxuICByZXNwb25zZVN0YXR1c0NvZGU6IG51bWJlcixcbiAgcmVzcG9uc2VIZWFkZXJzOiBIZWFkZXJzLFxuICByZW1peENvbnRleHQ6IEVudHJ5Q29udGV4dFxuKSB7XG4gIGxldCBtYXJrdXAgPSByZW5kZXJUb1N0cmluZyhcbiAgICA8UmVtaXhTZXJ2ZXIgY29udGV4dD17cmVtaXhDb250ZXh0fSB1cmw9e3JlcXVlc3QudXJsfSAvPlxuICApO1xuXG4gIHJlc3BvbnNlSGVhZGVycy5zZXQoXCJDb250ZW50LVR5cGVcIiwgXCJ0ZXh0L2h0bWxcIik7XG5cbiAgcmV0dXJuIG5ldyBSZXNwb25zZShcIjwhRE9DVFlQRSBodG1sPlwiICsgbWFya3VwLCB7XG4gICAgc3RhdHVzOiByZXNwb25zZVN0YXR1c0NvZGUsXG4gICAgaGVhZGVyczogcmVzcG9uc2VIZWFkZXJzXG4gIH0pO1xufVxuIiwgImltcG9ydCB7XG4gIExpbmssXG4gIExpbmtzLFxuICBMaXZlUmVsb2FkLFxuICBNZXRhLFxuICBPdXRsZXQsXG4gIFNjcmlwdHMsXG4gIFNjcm9sbFJlc3RvcmF0aW9uLFxuICB1c2VDYXRjaCxcbiAgdXNlTG9hZGVyRGF0YSxcbn0gZnJvbSAncmVtaXgnO1xuaW1wb3J0IHR5cGUgeyBMaW5rc0Z1bmN0aW9uIH0gZnJvbSAncmVtaXgnO1xuXG5pbXBvcnQgdGFpbHdpbmQgZnJvbSAnLi9zdHlsZXMvdGFpbHdpbmQuY3NzJztcbmltcG9ydCB7IFNUT1JBR0VfS0VZIH0gZnJvbSAnLi9jb21wb25lbnRzL0RhcmtNb2RlVG9nZ2xlJztcbmltcG9ydCB7IHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5cbmV4cG9ydCBsZXQgbGlua3M6IExpbmtzRnVuY3Rpb24gPSAoKSA9PiB7XG4gIHJldHVybiBbXG4gICAgeyByZWw6ICdwcmVjb25uZWN0JywgaHJlZjogJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20nIH0sXG4gICAgeyByZWw6ICdwcmVjb25uZWN0JywgaHJlZjogJ2h0dHBzOi8vZm9udHMuZ3N0YXRpYy5jb20nLCBjcm9zc09yaWdpbjogJ2Fub255bW91cycgfSxcbiAgICB7IHJlbDogJ3N0eWxlc2hlZXQnLCBocmVmOiAnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1BbnRvbiZkaXNwbGF5PWJsb2NrJyB9LFxuICAgIHtcbiAgICAgIHJlbDogJ3N0eWxlc2hlZXQnLFxuICAgICAgaHJlZjogJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9RmlyYStDb2RlOndnaHRANTAwJmRpc3BsYXk9YmxvY2snLFxuICAgIH0sXG4gICAge1xuICAgICAgcmVsOiAnc3R5bGVzaGVldCcsXG4gICAgICBocmVmOiAnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1JbnRlcjp3Z2h0QDQwMDs1MDA7NzAwJmRpc3BsYXk9YmxvY2snLFxuICAgIH0sXG4gICAgeyByZWw6ICdzdHlsZXNoZWV0JywgaHJlZjogdGFpbHdpbmQgfSxcbiAgXTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2FkZXIoKSB7XG4gIHJldHVybiB7XG4gICAgRU5WOiB7XG4gICAgICBNU1dfRU5BQkxFRDogcHJvY2Vzcy5lbnYuTVNXX0VOQUJMRUQsXG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQXBwKCkge1xuICBjb25zdCBkYXRhID0gdXNlTG9hZGVyRGF0YSgpO1xuICByZXR1cm4gKFxuICAgIDxEb2N1bWVudD5cbiAgICAgIDxzY3JpcHRcbiAgICAgICAgZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3tcbiAgICAgICAgICBfX2h0bWw6IGB3aW5kb3cuRU5WID0gJHtKU09OLnN0cmluZ2lmeShkYXRhLkVOVil9YCxcbiAgICAgICAgfX1cbiAgICAgIC8+XG4gICAgICA8T3V0bGV0IC8+XG4gICAgPC9Eb2N1bWVudD5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVycm9yQm91bmRhcnkoeyBlcnJvciB9OiB7IGVycm9yOiBFcnJvciB9KSB7XG4gIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICByZXR1cm4gKFxuICAgIDxEb2N1bWVudCB0aXRsZT1cIkVycm9yIVwiPlxuICAgICAgPGRpdj5cbiAgICAgICAgPGgxPlRoZXJlIHdhcyBhbiBlcnJvcjwvaDE+XG4gICAgICAgIDxwPntlcnJvci5tZXNzYWdlfTwvcD5cbiAgICAgICAgPGhyIC8+XG4gICAgICAgIDxwPkhleSwgZGV2ZWxvcGVyLCB5b3Ugc2hvdWxkIHJlcGxhY2UgdGhpcyB3aXRoIHdoYXQgeW91IHdhbnQgeW91ciB1c2VycyB0byBzZWUuPC9wPlxuICAgICAgPC9kaXY+XG4gICAgPC9Eb2N1bWVudD5cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENhdGNoQm91bmRhcnkoKSB7XG4gIGxldCBjYXVnaHQgPSB1c2VDYXRjaCgpO1xuXG4gIGxldCBtZXNzYWdlO1xuICBzd2l0Y2ggKGNhdWdodC5zdGF0dXMpIHtcbiAgICBjYXNlIDQwMTpcbiAgICAgIG1lc3NhZ2UgPSA8cD5Pb3BzISBMb29rcyBsaWtlIHlvdSB0cmllZCB0byB2aXNpdCBhIHBhZ2UgdGhhdCB5b3UgZG8gbm90IGhhdmUgYWNjZXNzIHRvLjwvcD47XG4gICAgICBicmVhaztcbiAgICBjYXNlIDQwNDpcbiAgICAgIG1lc3NhZ2UgPSA8cD5Pb3BzISBMb29rcyBsaWtlIHlvdSB0cmllZCB0byB2aXNpdCBhIHBhZ2UgdGhhdCBkb2VzIG5vdCBleGlzdC48L3A+O1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGNhdWdodC5kYXRhIHx8IGNhdWdodC5zdGF0dXNUZXh0KTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPERvY3VtZW50IHRpdGxlPXtgJHtjYXVnaHQuc3RhdHVzfSAke2NhdWdodC5zdGF0dXNUZXh0fWB9PlxuICAgICAgPGgxPlxuICAgICAgICB7Y2F1Z2h0LnN0YXR1c306IHtjYXVnaHQuc3RhdHVzVGV4dH1cbiAgICAgIDwvaDE+XG4gICAgICB7bWVzc2FnZX1cbiAgICA8L0RvY3VtZW50PlxuICApO1xufVxuXG5mdW5jdGlvbiBEb2N1bWVudCh7IGNoaWxkcmVuLCB0aXRsZSB9OiB7IGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGU7IHRpdGxlPzogc3RyaW5nIH0pIHtcbiAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpXG5cbiAgcmV0dXJuIChcbiAgICA8aHRtbCBsYW5nPVwiZW5cIj5cbiAgICAgIDxoZWFkPlxuICAgICAgICA8bWV0YSBjaGFyU2V0PVwidXRmLThcIiAvPlxuICAgICAgICA8bWV0YSBuYW1lPVwidmlld3BvcnRcIiBjb250ZW50PVwid2lkdGg9ZGV2aWNlLXdpZHRoLGluaXRpYWwtc2NhbGU9MVwiIC8+XG4gICAgICAgIHt0aXRsZSA/IDx0aXRsZT57dGl0bGV9PC90aXRsZT4gOiBudWxsfVxuICAgICAgICA8TWV0YSAvPlxuICAgICAgICA8TGlua3MgLz5cbiAgICAgIDwvaGVhZD5cbiAgICAgIDxib2R5IGNsYXNzTmFtZT1cImZvbnQtaW50ZXIgZGFyazpiZy16aW5jLTkwMCBkYXJrOnRleHQtd2hpdGVcIj5cbiAgICAgICAgPHNjcmlwdFxuICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgICBfX2h0bWw6IGBcbiAgICAgICAgICAgICAgaWYgKGxvY2FsU3RvcmFnZVtcIiR7U1RPUkFHRV9LRVl9XCJdID09PSAnZGFyaycgfHwgKCEoXCIke1NUT1JBR0VfS0VZfVwiIGluIGxvY2FsU3RvcmFnZSkgJiYgd2luZG93Lm1hdGNoTWVkaWEoJyhwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyayknKS5tYXRjaGVzKSkge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QuYWRkKCdkYXJrJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdjb2xvci1zY2hlbWUnLCAnZGFyaycpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrJyk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdjb2xvci1zY2hlbWUnLCAnbGlnaHQnKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgYCxcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgIHtsb2NhdGlvbi5wYXRobmFtZSAhPT0gJy9wcmV2aWV3JyAmJiA8U2Nyb2xsUmVzdG9yYXRpb24gLz59XG4gICAgICAgIDxTY3JpcHRzIC8+XG4gICAgICAgIHtwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyAmJiA8TGl2ZVJlbG9hZCAvPn1cbiAgICAgIDwvYm9keT5cbiAgICA8L2h0bWw+XG4gICk7XG59XG4iLCAiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTm9TU1IgfSBmcm9tICcuLi9ob29rcyc7XG5pbXBvcnQgeyBNb29uSWNvbiwgU3VuSWNvbiwgRGVza3RvcENvbXB1dGVySWNvbiB9IGZyb20gJ0BoZXJvaWNvbnMvcmVhY3Qvc29saWQnO1xuXG5leHBvcnQgY29uc3QgU1RPUkFHRV9LRVkgPSAnZG9jcy5wYWdlOmRhcmstbW9kZSc7XG5leHBvcnQgY29uc3QgREFSS19NT0RFX0NMQVNTX05BTUUgPSAnZGFyayc7XG5leHBvcnQgY29uc3QgTElHSFRfTU9ERV9DTEFTU19OQU1FID0gJ2xpZ2h0JztcbmV4cG9ydCBjb25zdCBIVE1MX0RBVEFfQVRUUklCVVRFID0gJ3RoZW1lJztcblxuZnVuY3Rpb24gdXNlRGFya01vZGUoKSB7XG4gIHJldHVybiB7XG4gICAgZW5hYmxlKCkge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RPUkFHRV9LRVksICdkYXJrJyk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGFyaycpO1xuICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdjb2xvci1zY2hlbWUnLCAnZGFyaycpO1xuICAgIH0sXG4gICAgZGlzYWJsZSgpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNUT1JBR0VfS0VZLCAnbGlnaHQnKTtcbiAgICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkYXJrJyk7XG4gICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJ2NvbG9yLXNjaGVtZScsICdsaWdodCcpO1xuICAgIH0sXG4gICAgYXV0bygpIHtcbiAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKFNUT1JBR0VfS0VZKTtcbiAgICAgIGlmICh3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXMpIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2RhcmsnKTtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdjb2xvci1zY2hlbWUnLCAnZGFyaycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2RhcmsnKTtcbiAgICAgICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdjb2xvci1zY2hlbWUnLCAnbGlnaHQnKTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufVxuXG4vKipcbiAqIFJlbmRlcnMgYSBzd2l0Y2ggd2hpY2ggdG9nZ2xlcyBsaWdodCAmIGRhcmsgbW9kZS5cbiAqXG4gKiBUaGUgdG9nZ2xlIGl0c2VsZiBwcm92aWRlcyB0aGUgYGNoZWNrZWRgIHZhbHVlLCBhbmQgZW5hYmxlcy9kaXNhYmxlc1xuICogdGhlIHZhbHVlIHZpYSB0aGUgYHVzZURhcmtNb2RlYCBob29rLlxuICpcbiAqIFNpbmNlIHRoZSB1c2VyIHByZWZlcmVuY2UgaXMgb25seSBhdmFpbGFibGUgb24gdGhlIGNsaWVudCwgYW4gZW1wdHkgY29udGFpbmVyXG4gKiBpcyByZW5kZXJlZCBvbiB0aGUgc2VydmVyLlxuICovXG5leHBvcnQgZnVuY3Rpb24gRGFya01vZGVUb2dnbGUoKSB7XG4gIGNvbnN0IHJlYWR5ID0gdXNlTm9TU1IoKTtcbiAgY29uc3QgZGFya01vZGUgPSB1c2VEYXJrTW9kZSgpO1xuXG4gIC8vIE51bGwgb24gU1NSIHNpbmNlIHdlIGRvbid0IGtub3cgdGhlIHVzZXJzIHNldHRpbmdcbiAgY29uc3QgW21vZGUsIHNldE1vZGVdID0gdXNlU3RhdGU8c3RyaW5nIHwgbnVsbD4obnVsbCk7XG5cbiAgY29uc3QgY29udGFpbmVyID0gKGNoaWxkcmVuPzogUmVhY3QuUmVhY3RFbGVtZW50KSA9PiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZSB3LTI4IHB4LTIgaC04IGZsZXggaXRlbXMtY2VudGVyIGRhcms6dGV4dC13aGl0ZSBiZy1bI2ZiZmJmYl0gaG92ZXI6YmctdHJhbnNwYXJlbnQgZGFyazpiZy10cmFuc3BhcmVudCBib3JkZXIgaG92ZXI6Ym9yZGVyLWdyYXktMzAwIGRhcms6Ym9yZGVyLWdyYXktNzAwIGRhcms6aG92ZXI6Ym9yZGVyLWdyYXktNjAwIHJvdW5kZWQgZm9jdXM6b3V0bGluZS1ub25lXCI+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICk7XG5cbiAgZnVuY3Rpb24gZ2V0U2VsZWN0T3B0aW9uKCkge1xuICAgIHJldHVybiAhIW1vZGVcbiAgICAgID8gbW9kZVxuICAgICAgOiBsb2NhbFN0b3JhZ2VbU1RPUkFHRV9LRVldXG4gICAgICA/IGxvY2FsU3RvcmFnZVtTVE9SQUdFX0tFWV0gPT09ICdkYXJrJ1xuICAgICAgICA/ICdkYXJrJ1xuICAgICAgICA6ICdsaWdodCdcbiAgICAgIDogJ3N5c3RlbSc7XG4gIH1cblxuICAvLyBSZW5kZXIgYW4gZW1wdHkgY29udGFpbmVyIGR1cmluZyBTU1JcbiAgaWYgKCFyZWFkeSkge1xuICAgIHJldHVybiBjb250YWluZXIoKTtcbiAgfVxuXG4gIGNvbnN0IG9wdGlvbiA9IGdldFNlbGVjdE9wdGlvbigpO1xuXG4gIHJldHVybiBjb250YWluZXIoXG4gICAgPD5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xXCI+XG4gICAgICAgIHtvcHRpb24gPT09ICdkYXJrJyAmJiA8TW9vbkljb24gd2lkdGg9ezE0fSAvPn1cbiAgICAgICAge29wdGlvbiA9PT0gJ2xpZ2h0JyAmJiA8U3VuSWNvbiB3aWR0aD17MTR9IC8+fVxuICAgICAgICB7b3B0aW9uID09PSAnc3lzdGVtJyAmJiA8RGVza3RvcENvbXB1dGVySWNvbiB3aWR0aD17MTR9IC8+fVxuICAgICAgPC9kaXY+XG4gICAgICA8c2VsZWN0XG4gICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICBjbGFzc05hbWU9XCJhYnNvbHV0ZSBpbnNldC0wIGFwcGVhcmFuY2Utbm9uZSB3LWZ1bGwgZmxleCBpdGVtcy1jZW50ZXIgZm9udC1tZWRpdW0gYmctdHJhbnNwYXJlbnQgZm9jdXM6b3V0bGluZS1ub25lIHBsLTggdGV4dC1ncmF5LTYwMCBob3Zlcjp0ZXh0LWJsYWNrIGRhcms6dGV4dC1ncmF5LTMwMCBkYXJrOmhvdmVyOnRleHQtd2hpdGUgdGV4dC14cyBwci0zXCJcbiAgICAgICAgdmFsdWU9e29wdGlvbn1cbiAgICAgICAgb25DaGFuZ2U9e2UgPT4ge1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgc2V0TW9kZSh2YWx1ZSk7XG5cbiAgICAgICAgICBpZiAodmFsdWUgPT09ICdkYXJrJykge1xuICAgICAgICAgICAgZGFya01vZGUuZW5hYmxlKCk7XG4gICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA9PT0gJ2xpZ2h0Jykge1xuICAgICAgICAgICAgZGFya01vZGUuZGlzYWJsZSgpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkYXJrTW9kZS5hdXRvKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZGFya1wiPkRhcms8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImxpZ2h0XCI+TGlnaHQ8L29wdGlvbj5cbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInN5c3RlbVwiPlN5c3RlbTwvb3B0aW9uPlxuICAgICAgPC9zZWxlY3Q+XG4gICAgICA8ZGl2PlxuICAgICAgICA8c3ZnXG4gICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgd2lkdGg9XCIxNlwiXG4gICAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgc3Ryb2tlV2lkdGg9XCIxLjVcIlxuICAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgICAgIHNoYXBlUmVuZGVyaW5nPVwiZ2VvbWV0cmljUHJlY2lzaW9uXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxwYXRoIGQ9XCJNMTcgOC41MTdMMTIgMyA3IDguNTE3TTcgMTUuNDhsNSA1LjUxNyA1LTUuNTE3XCI+PC9wYXRoPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgIDwvPixcbiAgKTtcbn1cbiIsICJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VOb1NTUigpOiBib29sZWFuIHtcbiAgY29uc3QgW3JlYWR5LCBzZXRSZWFkeV0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIHVzZUVmZmVjdCgoKSA9PiBzZXRSZWFkeSh0cnVlKSwgW10pO1xuICByZXR1cm4gcmVhZHk7XG59IiwgImltcG9ydCB7IE1ldGFGdW5jdGlvbiwgdXNlTG9hZGVyRGF0YSwgTGlua3NGdW5jdGlvbiwgdXNlQ2F0Y2ggfSBmcm9tICdyZW1peCc7XG5cbmltcG9ydCB7IEZvb3RlciB9IGZyb20gJ34vY29tcG9uZW50cy9Gb290ZXInO1xuaW1wb3J0IGNvZGVIaWtlU3R5bGVzIGZyb20gJ0Bjb2RlLWhpa2UvbWR4L2Rpc3QvaW5kZXguY3NzJztcbmltcG9ydCBjb2RlYmxvY2tzIGZyb20gJy4uL3N0eWxlcy9jb2RlYmxvY2tzLmNzcyc7XG5pbXBvcnQge1xuICBkb2NzTG9hZGVyLFxuICBEb2N1bWVudGF0aW9uTG9hZGVyLFxuICBUaHJvd25CdW5kbGVFcnJvcixcbiAgVGhyb3duRXJyb3IsXG4gIFRocm93bk5vdEZvdW5kRXJyb3IsXG59IGZyb20gJy4uL2xvYWRlcnMvZG9jdW1lbnRhdGlvbi5zZXJ2ZXInO1xuaW1wb3J0IGRvY3NlYXJjaCBmcm9tICcuLi9zdHlsZXMvZG9jc2VhcmNoLmNzcyc7XG5pbXBvcnQgeyBCYWRSZXF1ZXN0LCBOb3RGb3VuZCwgU2VydmVyRXJyb3IgfSBmcm9tICd+L2NvbXBvbmVudHMvRXJyb3JzJztcbmltcG9ydCBEb2N1bWVudGF0aW9uIGZyb20gJ34vY29tcG9uZW50cy9Eb2N1bWVudGF0aW9uJztcblxuLy9AdHMtaWdub3JlXG5leHBvcnQgZnVuY3Rpb24gaGVhZGVycyh7IGxvYWRlckhlYWRlcnMgfSkge1xuICByZXR1cm4ge1xuICAgIFwiY2FjaGUtY29udHJvbFwiOiBsb2FkZXJIZWFkZXJzLmdldCgnY2FjaGUtY29udHJvbCcpXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGxvYWRlciA9IGRvY3NMb2FkZXI7XG5cbmV4cG9ydCBsZXQgbGlua3M6IExpbmtzRnVuY3Rpb24gPSAoKSA9PiB7XG4gIHJldHVybiBbXG4gICAgeyByZWw6ICdzdHlsZXNoZWV0JywgaHJlZjogJ2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vQGRvY3NlYXJjaC9jc3NAYWxwaGEnIH0sXG4gICAgeyByZWw6ICdzdHlsZXNoZWV0JywgaHJlZjogZG9jc2VhcmNoIH0sXG4gICAgeyByZWw6ICdzdHlsZXNoZWV0JywgaHJlZjogY29kZWJsb2NrcyB9LFxuICAgIHsgcmVsOiAnc3R5bGVzaGVldCcsIGhyZWY6IGNvZGVIaWtlU3R5bGVzIH1cbiAgXTtcbn07XG5cbmV4cG9ydCBjb25zdCBtZXRhOiBNZXRhRnVuY3Rpb24gPSAocHJvcHM6IHsgZGF0YT86IERvY3VtZW50YXRpb25Mb2FkZXIgfSkgPT4ge1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL3JlbWl4L2lzc3Vlcy8xMDU0XG4gIGlmICghcHJvcHMuZGF0YSkge1xuICAgIHJldHVybiB7XG4gICAgICB0aXRsZTogJycsXG4gICAgICBkZXNjcmlwdGlvbjogJycsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdGl0bGU6IHByb3BzLmRhdGEuZnJvbnRtYXR0ZXI/LnRpdGxlID8/ICcnLFxuICAgIGRlc2NyaXB0aW9uOiBwcm9wcy5kYXRhLmZyb250bWF0dGVyPy5kZXNjcmlwdGlvbiA/PyAnJyxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFBhZ2UoKSB7XG4gIGNvbnN0IGRhdGEgPSB1c2VMb2FkZXJEYXRhPERvY3VtZW50YXRpb25Mb2FkZXI+KCk7XG4gIC8vIHJldHVybiA8cD57ZGF0YS5jb2RlfTwvcD5cbiAgcmV0dXJuIDxEb2N1bWVudGF0aW9uIGRhdGE9e2RhdGF9IC8+XG59XG5cbi8vIGhhbmRsaW5nIGVycm9yc1xuZXhwb3J0IGZ1bmN0aW9uIENhdGNoQm91bmRhcnkoKSB7XG4gIGNvbnN0IGUgPSB1c2VDYXRjaDxUaHJvd25FcnJvcj4oKTtcbiAgY29uc29sZS5sb2coZSk7XG5cbiAgbGV0IGNoaWxkOiBKU1guRWxlbWVudDtcblxuICBpZiAoZS5zdGF0dXMgPT09IDQwNCkge1xuICAgIGNoaWxkID0gPE5vdEZvdW5kIGVycm9yPXtlIGFzIFRocm93bk5vdEZvdW5kRXJyb3J9IC8+O1xuICB9IGVsc2UgaWYgKGUuc3RhdHVzID09PSA1MDApIHtcbiAgICBjaGlsZCA9IDxTZXJ2ZXJFcnJvciB0aXRsZT1cIkludGVybmFsIHNlcnZlciBlcnJvclwiIC8+O1xuICB9IGVsc2UgaWYgKGUuc3RhdHVzID09PSA0MDApIHtcbiAgICBjaGlsZCA9IDxCYWRSZXF1ZXN0IGVycm9yPXtlIGFzIFRocm93bkJ1bmRsZUVycm9yfSAvPjtcbiAgfSBlbHNlIHtcbiAgICBjaGlsZCA9IDxTZXJ2ZXJFcnJvciB0aXRsZT1cIlNvbWV0aGluZyB3ZW50IHdyb25nXCIgLz47XG4gIH1cblxuICByZXR1cm4gPGRpdiBkYXRhLXRlc3RpZD17J2Vycm9yLWNvbnRhaW5lcid9PntjaGlsZCF9PEZvb3RlciAvPjwvZGl2Pjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVycm9yQm91bmRhcnkoKSB7XG5cblxuICByZXR1cm4gPFNlcnZlckVycm9yIHRpdGxlPVwiQW4gdW5jYXVnaHQgZXJyb3Igd2FzIHRocm93blwiIC8+XG59XG4iLCAiaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlbWl4JztcbmltcG9ydCB7IHVzZURvY3VtZW50YXRpb25Db250ZXh0IH0gZnJvbSAnfi9jb250ZXh0JztcblxuZXhwb3J0IGZ1bmN0aW9uIEZvb3RlcigpIHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgcmVmLCBwYXRoIH0gPSB1c2VEb2N1bWVudGF0aW9uQ29udGV4dCgpO1xuICBjb25zdCBlZGl0VXJsID0gYGh0dHBzOi8vZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99L2VkaXQke3JlZn0vJHtwYXRofWBcbiAgcmV0dXJuIChcbiAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cIm10LTE2IHB5LTggcHgtNCBsZzpweC04IGJvcmRlci10IGJvcmRlci1ncmF5LTkwMC8xMFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IHRleHQtc20gZm9udC1tZWRpdW0gdGV4dC1ncmF5LTUwMCBkYXJrOnRleHQtZ3JheS0zMDBcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LWdyb3dcIj5cbiAgICAgICAgICBQb3dlcmVkIGJ5eycgJ31cbiAgICAgICAgICA8TGluayB0bz1cIi9cIiBjbGFzc05hbWU9XCJob3Zlcjp0ZXh0LWdyYXktOTAwIGRhcms6aG92ZXI6dGV4dC1ncmF5LTEwMCB0cmFuc2l0aW9uLWNvbG9yc1wiPlxuICAgICAgICAgICAgZG9jcy5wYWdlXG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LXNocmluay0wXCI+XG4gICAgICAgICAgPGFcbiAgICAgICAgICAgIGhyZWY9e2VkaXRVcmx9XG4gICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICAgICAgcmVsPVwibm9vcGVuZXJcIlxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiaG92ZXI6dGV4dC1ncmF5LTkwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS0xMDAgdHJhbnNpdGlvbi1jb2xvcnNcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIEVkaXQgdGhpcyBwYWdlXG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZm9vdGVyPlxuICApO1xufVxuIiwgImltcG9ydCBSZWFjdCwgeyBjcmVhdGVDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgRG9jdW1lbnRhdGlvbkxvYWRlciB9IGZyb20gJy4vbG9hZGVycy9kb2N1bWVudGF0aW9uLnNlcnZlcic7XG5pbXBvcnQgeyBlbnN1cmVMZWFkaW5nU2xhc2ggfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHVzZVByZXZpZXdNb2RlIH0gZnJvbSAnLi91dGlscy9sb2NhbC1wcmV2aWV3LW1vZGUnO1xuXG5jb25zdCBEb2N1bWVudGF0aW9uQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8RG9jdW1lbnRhdGlvbkxvYWRlcj4oe30gYXMgRG9jdW1lbnRhdGlvbkxvYWRlcik7XG5cbmV4cG9ydCB0eXBlIERvY3VtZW50YXRpb25Qcm92aWRlclByb3BzID0ge1xuICBkYXRhOiBEb2N1bWVudGF0aW9uTG9hZGVyO1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlIHwgUmVhY3QuUmVhY3ROb2RlW107XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gRG9jdW1lbnRhdGlvblByb3ZpZGVyKHsgZGF0YSwgY2hpbGRyZW4gfTogRG9jdW1lbnRhdGlvblByb3ZpZGVyUHJvcHMpIHtcbiAgcmV0dXJuIDxEb2N1bWVudGF0aW9uQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17ZGF0YX0+e2NoaWxkcmVufTwvRG9jdW1lbnRhdGlvbkNvbnRleHQuUHJvdmlkZXI+O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRG9jdW1lbnRhdGlvbkNvbnRleHQoKSB7XG4gIHJldHVybiBSZWFjdC51c2VDb250ZXh0KERvY3VtZW50YXRpb25Db250ZXh0KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUJhc2VVcmwoKTogc3RyaW5nIHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgcmVmIH0gPSBSZWFjdC51c2VDb250ZXh0KERvY3VtZW50YXRpb25Db250ZXh0KTtcbiAgbGV0IHVybCA9IGAvJHtvd25lcn0vJHtyZXBvfWA7XG5cbiAgaWYgKHJlZikge1xuICAgIHVybCArPSBgfiR7cmVmfWA7XG4gIH1cblxuICByZXR1cm4gdXJsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlUmVwb3NpdG9yeVVybCgpOiBzdHJpbmcge1xuICBjb25zdCB7IG93bmVyLCByZXBvLCByZWYgfSA9IFJlYWN0LnVzZUNvbnRleHQoRG9jdW1lbnRhdGlvbkNvbnRleHQpO1xuXG4gIHJldHVybiBgaHR0cHM6Ly9naXRodWIuY29tLyR7b3duZXJ9LyR7cmVwb30vdHJlZS8ke3JlZn1gO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlSW1hZ2VQYXRoKHNyYzogc3RyaW5nKSB7XG4gIGlmIChzcmMuc3RhcnRzV2l0aCgnaHR0cCcpKSB7XG4gICAgcmV0dXJuIHNyYztcbiAgfVxuXG4gIGNvbnN0IHByZXZpZXdNb2RlID0gdXNlUHJldmlld01vZGUoKVxuXG4gIGlmIChwcmV2aWV3TW9kZT8uZW5hYmxlZCAmJiBwcmV2aWV3TW9kZS5pbWFnZVVybHMpIHtcbiAgICByZXR1cm4gcHJldmlld01vZGU/LmltYWdlVXJsc1tzcmNdIHx8ICcnXG4gIH1cblxuXG4gIGNvbnN0IGJsb2IgPSB1c2VSYXdCbG9iKHNyYyk7XG4gIHJldHVybiBibG9iO1xufVxuXG4vLyBSZXR1cm5zIGEgcGF0aCB0byBhIGJsb2IgaW4gdGhlIGBkb2NzYCBkaXJlY3RvcnkuXG5leHBvcnQgZnVuY3Rpb24gdXNlUmF3QmxvYihwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCB7IHNvdXJjZSwgYmFzZUJyYW5jaCB9ID0gUmVhY3QudXNlQ29udGV4dChEb2N1bWVudGF0aW9uQ29udGV4dCk7XG4gIGNvbnN0IHsgb3duZXIsIHJlcG9zaXRvcnk6IHJlcG8sIHJlZiB9ID0gc291cmNlO1xuICBpZiAoc291cmNlLnR5cGUgPT09ICdicmFuY2gnKSB7XG4gICAgcmV0dXJuIGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vJHtvd25lcn0vJHtyZXBvfS8ke3JlZiA/PyBiYXNlQnJhbmNofS9kb2NzJHtlbnN1cmVMZWFkaW5nU2xhc2goXG4gICAgICBwYXRoLFxuICAgICl9YDtcbiAgfVxuICBpZiAoc291cmNlLnR5cGUgPT09ICdQUicpIHtcbiAgICByZXR1cm4gYGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8ke293bmVyfS8ke3JlcG99LyR7cmVmID8/IGJhc2VCcmFuY2h9L2RvY3Mke2Vuc3VyZUxlYWRpbmdTbGFzaChcbiAgICAgIHBhdGgsXG4gICAgKX1gO1xuICB9XG5cblxuXG4gIHJldHVybiBgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLyR7b3duZXJ9LyR7cmVwb30vbWFpbi9kb2NzJHtlbnN1cmVMZWFkaW5nU2xhc2goXG4gICAgcGF0aCxcbiAgKX1gO1xufVxuIiwgImltcG9ydCB7IGdldFZhbHVlIH0gZnJvbSAnLi9nZXQnO1xuXG5leHBvcnQgZnVuY3Rpb24gZW5zdXJlTGVhZGluZ1NsYXNoKHBhdGg6IHN0cmluZykge1xuICBpZiAoIXBhdGguc3RhcnRzV2l0aCgnLycpKSB7XG4gICAgcmV0dXJuIGAvJHtwYXRofWA7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5cbmNvbnN0IFZBUklBQkxFX1JFR0VYID0gL3t7XFxzKFthLXpBLVowLTlfLl0qKVxcc319L2dtO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVwbGFjZVZhcmlhYmxlcyh2YXJpYWJsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sIHZhbHVlOiBzdHJpbmcpIHtcbiAgbGV0IG91dHB1dCA9IHZhbHVlO1xuICBsZXQgbTogUmVnRXhwRXhlY0FycmF5IHwgbnVsbDtcblxuICB3aGlsZSAoKG0gPSBWQVJJQUJMRV9SRUdFWC5leGVjKHZhbHVlKSkgIT09IG51bGwpIHtcbiAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSB0byBhdm9pZCBpbmZpbml0ZSBsb29wcyB3aXRoIHplcm8td2lkdGggbWF0Y2hlc1xuICAgIGlmIChtLmluZGV4ID09PSBWQVJJQUJMRV9SRUdFWC5sYXN0SW5kZXgpIHtcbiAgICAgIFZBUklBQkxFX1JFR0VYLmxhc3RJbmRleCsrO1xuICAgIH1cblxuICAgIG91dHB1dCA9IG91dHB1dC5yZXBsYWNlKG1bMF0sIGdldFZhbHVlKHZhcmlhYmxlcywgbVsxXSwgJycpKTtcbiAgfVxuXG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYXNoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBsZXQgaGFzaCA9IDAsXG4gICAgaTogbnVtYmVyLFxuICAgIGNocjogbnVtYmVyO1xuICBmb3IgKGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcbiAgICBjaHIgPSB2YWx1ZS5jaGFyQ29kZUF0KGkpO1xuICAgIGhhc2ggPSAoaGFzaCA8PCA1KSAtIGhhc2ggKyBjaHI7XG4gICAgaGFzaCB8PSAwOyAvLyBDb252ZXJ0IHRvIDMyYml0IGludGVnZXJcbiAgfVxuICByZXR1cm4gaGFzaC50b1N0cmluZygpO1xufSIsICJpbXBvcnQgZ2V0IGZyb20gJ2xvZGFzaC5nZXQnO1xuXG5leHBvcnQgY29uc3QgZ2V0VmFsdWUgPSBnZXQ7XG5cbi8vIFJldHVybnMgYSBndWFyYW50ZWVkIHN0cmluZyB2YWx1ZSBmcm9tIGFuIG9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0cmluZyhcbiAganNvbjogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIGtleTogc3RyaW5nLFxuICBkZWZhdWx0VmFsdWU6IHN0cmluZyxcbik6IHN0cmluZyB7XG4gIGNvbnN0IHZhbHVlID0gZ2V0PFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBzdHJpbmcsIHN0cmluZz4oanNvbiwga2V5LCBkZWZhdWx0VmFsdWUpO1xuXG4gIC8vIElmIHRoZXJlIGlzIGEgY3VzdG9tIHZhbHVlIGJ1dCBpdCBpc24ndCBhIHN0cmluZywgcmV0dXJuIHRoZSBkZWZhdWx0VmFsdWUgaW5zdGVhZC5cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vLyBSZXR1cm5zIGEgZ3VhcmFudGVlZCBudW1iZXIgdmFsdWUgZnJvbSBhbiBvYmplY3RcbmV4cG9ydCBmdW5jdGlvbiBnZXROdW1iZXIoXG4gIGpzb246IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBrZXk6IHN0cmluZyxcbiAgZGVmYXVsdFZhbHVlOiBudW1iZXIsXG4pOiBudW1iZXIge1xuICBjb25zdCB2YWx1ZSA9IGdldDxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgc3RyaW5nLCBudW1iZXI+KGpzb24sIGtleSwgZGVmYXVsdFZhbHVlKTtcblxuICAvLyBJZiB0aGVyZSBpcyBhIGN1c3RvbSB2YWx1ZSBidXQgaXQgaXNuJ3QgYSBzdHJpbmcsIHJldHVybiB0aGUgZGVmYXVsdFZhbHVlIGluc3RlYWQuXG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgfVxuXG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLy8gUmV0dXJucyBhIGd1YXJhbnRlZWQgYm9vbGVhbiB2YWx1ZSBmcm9tIGFuIG9iamVjdFxuZXhwb3J0IGZ1bmN0aW9uIGdldEJvb2xlYW4oXG4gIGpzb246IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBrZXk6IHN0cmluZyxcbiAgZGVmYXVsdFZhbHVlOiBib29sZWFuLFxuKTogYm9vbGVhbiB7XG4gIGNvbnN0IHZhbHVlID0gZ2V0PFJlY29yZDxzdHJpbmcsIHVua25vd24+LCBzdHJpbmcsIGJvb2xlYW4+KGpzb24sIGtleSwgZGVmYXVsdFZhbHVlKTtcblxuICAvLyBJZiB0aGVyZSBpcyBhIGN1c3RvbSB2YWx1ZSBidXQgaXQgaXNuJ3QgYSBzdHJpbmcsIHJldHVybiB0aGUgZGVmYXVsdFZhbHVlIGluc3RlYWQuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHZhbHVlID09PSAnZmFsc2UnKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHZhbHVlID09PSAndHJ1ZScpIHJldHVybiB0cnVlO1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICB9XG5cbiAgcmV0dXJuIHZhbHVlO1xufVxuIiwgImltcG9ydCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNhbGxiYWNrLCB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQnVuZGxlU3VjY2VzcyB9IGZyb20gJ0Bkb2NzLnBhZ2Uvc2VydmVyJztcbmltcG9ydCB7IERvY3VtZW50YXRpb25Mb2FkZXIgfSBmcm9tICd+L2xvYWRlcnMvZG9jdW1lbnRhdGlvbi5zZXJ2ZXInO1xuaW1wb3J0IHsgbWVyZ2VDb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5leHBvcnQgdHlwZSBQcmV2aWV3TW9kZSA9IHtcbiAgICBlbmFibGVkOiBib29sZWFuO1xuICAgIG9uU2VsZWN0OiAoKSA9PiB2b2lkO1xuICAgIGltYWdlVXJsczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB8IG51bGw7XG59O1xuXG5leHBvcnQgY29uc3QgUHJldmlld01vZGVDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxQcmV2aWV3TW9kZT4oe1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgIG9uU2VsZWN0OiAoKSA9PiB7XG4gICAgICAgIHJldHVybjtcbiAgICB9LFxuICAgIGltYWdlVXJsczoge30sXG59KTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVByZXZpZXdNb2RlKCk6IFByZXZpZXdNb2RlIHtcbiAgICByZXR1cm4gdXNlQ29udGV4dChQcmV2aWV3TW9kZUNvbnRleHQpO1xufVxuXG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBleHRyYWN0Q29udGVudHMoXG4gICAgaGFuZGxlOiBGaWxlU3lzdGVtRmlsZUhhbmRsZSxcbiAgICBjb25maWdIYW5kbGU6IEZpbGVTeXN0ZW1GaWxlSGFuZGxlIHwgbnVsbCxcbiAgICBpbWFnZUhhbmRsZXM6IEZpbGVTeXN0ZW1GaWxlSGFuZGxlcyxcbik6IFByb21pc2U8W3N0cmluZywgc3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBFcnJvcltdXT4ge1xuICAgIGxldCBjb25maWcgPSBtZXJnZUNvbmZpZyh7fSk7XG4gICAgbGV0IHRleHQ6IHN0cmluZyA9ICcnXG4gICAgbGV0IGltYWdlVXJscztcblxuXG4gICAgY29uc3QgZXJyb3JzOiBFcnJvcltdID0gW107XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gZ2V0IGRvY3MuanNvbiBmcm9tIGNvbmZpZyBoYW5kbGVcbiAgICAgICAgY29uc3QgY29uZmlnRmlsZSA9IGF3YWl0IGNvbmZpZ0hhbmRsZSEuZ2V0RmlsZSgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gYnVpbGQgY29uZmlnIGZyb20gdGhlIGZpbGUgY29udGVudHNcbiAgICAgICAgICAgIGNvbmZpZyA9IGF3YWl0IG1lcmdlQ29uZmlnKEpTT04ucGFyc2UoYXdhaXQgY29uZmlnRmlsZSEudGV4dCgpKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1Byb2JsZW1zIHdpdGggZG9jcy5qc29uIGZvcm1hdCcpO1xuICAgICAgICAgICAgLy8gZXJyb3JzLnB1c2goZSk7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuYWJsZSB0byBnZXRGaWxlIGNvbmZpZycpO1xuICAgICAgICAvLyBlcnJvcnMucHVzaChlKTtcbiAgICB9XG4gICAgdHJ5IHtcblxuICAgICAgICBjb25zdCBmaWxlID0gYXdhaXQgaGFuZGxlLmdldEZpbGUoKTtcbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgICAgdGV4dCA9IGF3YWl0IGZpbGUudGV4dCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd1bmFibGUgdG8gZXh0cmFjdCB0ZXh0IGZyb20gZmlsZS4nKTtcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKGUgYXMgRXJyb3IpO1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCd1bmFibGUgdG8gZ2V0RmlsZSBwYWdlJyk7XG4gICAgICAgIGVycm9ycy5wdXNoKGUgYXMgRXJyb3IpO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpbWFnZVVybHMgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgICAgICBhd2FpdCBQcm9taXNlLmFsbChcbiAgICAgICAgICAgICAgICBPYmplY3QuZW50cmllcyhpbWFnZUhhbmRsZXMpLm1hcChhc3luYyAoW2tleSwgaGFuZGxlXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygndGVzdCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVybCA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYXdhaXQgaGFuZGxlLmdldEZpbGUoKSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBba2V5LCB1cmxdO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgKSxcbiAgICAgICAgKTtcbiAgICB9IGNhdGNoIChfKSB7IH1cblxuICAgIHJldHVybiBbdGV4dCwgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSwgaW1hZ2VVcmxzLCBlcnJvcnNdO1xufVxuXG5leHBvcnQgdHlwZSBGaWxlU3lzdGVtRmlsZUhhbmRsZXMgPSB7IFtwYXRoOiBzdHJpbmddOiBGaWxlU3lzdGVtRmlsZUhhbmRsZSB9O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXRlcmF0ZURpcmVjdG9yeShcbiAgICBkaXJlY3Rvcnk6IEZpbGVTeXN0ZW1EaXJlY3RvcnlIYW5kbGUsXG4gICAgcmVsYXRpdmVQYXRoPzogc3RyaW5nLFxuICAgIG90aGVyPzogRmlsZVN5c3RlbUZpbGVIYW5kbGVzLFxuKTogUHJvbWlzZTxGaWxlU3lzdGVtRmlsZUhhbmRsZXM+IHtcbiAgICBsZXQgaGFuZGxlczogRmlsZVN5c3RlbUZpbGVIYW5kbGVzID0ge1xuICAgICAgICAuLi5vdGhlcixcbiAgICB9O1xuXG4gICAgZm9yIGF3YWl0IChjb25zdCBlbnRyeSBvZiBkaXJlY3RvcnkudmFsdWVzKCkpIHtcbiAgICAgICAgaWYgKGVudHJ5LmtpbmQgPT09ICdmaWxlJykge1xuICAgICAgICAgICAgaWYgKGVudHJ5Lm5hbWUuZW5kc1dpdGgoJy5tZHgnKSkge1xuICAgICAgICAgICAgICAgIGhhbmRsZXNbYCR7cmVsYXRpdmVQYXRoID8/ICcnfS8ke2VudHJ5Lm5hbWUucmVwbGFjZSgnLm1keCcsICcnKX1gXSA9IGVudHJ5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFsnLnBuZycsICcuZ2lmJywgJy5qcGVnJywgJy5qcGcnXS5maWx0ZXIoZXh0ID0+IGVudHJ5Lm5hbWUuZW5kc1dpdGgoZXh0KSkpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVzW2Ake3JlbGF0aXZlUGF0aCA/PyAnJ30vJHtlbnRyeS5uYW1lfWBdID0gZW50cnk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkua2luZCA9PT0gJ2RpcmVjdG9yeScpIHtcbiAgICAgICAgICAgIGhhbmRsZXMgPSB7XG4gICAgICAgICAgICAgICAgLi4uaGFuZGxlcyxcbiAgICAgICAgICAgICAgICAuLi4oYXdhaXQgaXRlcmF0ZURpcmVjdG9yeShlbnRyeSwgYCR7cmVsYXRpdmVQYXRoID8/ICcnfS8ke2VudHJ5Lm5hbWV9YCwgaGFuZGxlcykpLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBoYW5kbGVzO1xufVxuXG5cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUhhc2hDaGFuZ2UoKTogc3RyaW5nIHtcbiAgICBjb25zdCBbaGFzaCwgc2V0SGFzaF0gPSB1c2VTdGF0ZSgnJyk7XG5cbiAgICBmdW5jdGlvbiBvbkhhc2hDaGFuZ2UoKSB7XG4gICAgICAgIC8vIFRPRE86IHByb2JhYmx5IGhhdmUgdG8gaGFuZGxlIGRlZXBlciBpbmRleCBmaWxlcywgYW5kIHJlZGlyZWN0cyBzb21ld2hlcmVcbiAgICAgICAgY29uc3QgbmV3SGFzaCA9XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpID09PSAnLydcbiAgICAgICAgICAgICAgICA/ICcvaW5kZXgnXG4gICAgICAgICAgICAgICAgOiB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKCcjJywgJycpO1xuICAgICAgICByZXR1cm4gc2V0SGFzaChuZXdIYXNoKTtcbiAgICB9XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIG9uSGFzaENoYW5nZSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignaGFzaGNoYW5nZScsIG9uSGFzaENoYW5nZSk7XG4gICAgfSwgW10pO1xuXG4gICAgcmV0dXJuIGhhc2g7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VEaXJlY3RvcnlTZWxlY3RvcigpOiB7XG4gICAgc2VsZWN0OiAoKSA9PiB2b2lkO1xuICAgIGhhbmRsZXM6IEZpbGVTeXN0ZW1GaWxlSGFuZGxlcyB8IG51bGw7XG4gICAgZXJyb3I6IEVycm9yO1xuICAgIHBlbmRpbmc6IGJvb2xlYW47XG4gICAgY29uZmlnSGFuZGxlOiBGaWxlU3lzdGVtRmlsZUhhbmRsZSB8IG51bGw7XG59IHtcbiAgICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlPGFueT4obnVsbCk7XG4gICAgY29uc3QgW3BlbmRpbmcsIHNldFBlbmRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICAgIGNvbnN0IFtoYW5kbGVzLCBzZXRIYW5kbGVzXSA9IHVzZVN0YXRlPEZpbGVTeXN0ZW1GaWxlSGFuZGxlcyB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IFtjb25maWdIYW5kbGUsIHNldENvbmZpZ0hhbmRsZV0gPSB1c2VTdGF0ZTxGaWxlU3lzdGVtRmlsZUhhbmRsZSB8IG51bGw+KG51bGwpO1xuXG4gICAgY29uc3Qgc2VsZWN0ID0gdXNlQ2FsbGJhY2soYXN5bmMgKCkgPT4ge1xuICAgICAgICBzZXRQZW5kaW5nKHRydWUpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgaGFuZGxlID0gKGF3YWl0IHdpbmRvdy5zaG93RGlyZWN0b3J5UGlja2VyKCkpIHx8IG51bGw7XG4gICAgICAgICAgICBsZXQgZG9jczogRmlsZVN5c3RlbURpcmVjdG9yeUhhbmRsZSB8IG51bGwgPSBudWxsO1xuICAgICAgICAgICAgLy8gbGV0IGZvdW5kRG9jc0pzb24gPSBmYWxzZTtcbiAgICAgICAgICAgIGZvciBhd2FpdCAoY29uc3QgZW50cnkgb2YgaGFuZGxlLnZhbHVlcygpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LmtpbmQgPT09ICdmaWxlJyAmJiBlbnRyeS5uYW1lID09PSAnZG9jcy5qc29uJykge1xuICAgICAgICAgICAgICAgICAgICBzZXRDb25maWdIYW5kbGUoZW50cnkpO1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3VuZERvY3NKc29uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVudHJ5LmtpbmQgPT09ICdkaXJlY3RvcnknICYmIGVudHJ5Lm5hbWUgPT09ICdkb2NzJykge1xuICAgICAgICAgICAgICAgICAgICBkb2NzID0gZW50cnk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIWRvY3MpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIGRvY3MgZGlyZWN0b3J5IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRvY3NIYW5kbGVzID0gYXdhaXQgaXRlcmF0ZURpcmVjdG9yeShkb2NzKTtcblxuICAgICAgICAgICAgc2V0SGFuZGxlcyhkb2NzSGFuZGxlcyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHNldEVycm9yKGUpO1xuICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgc2V0UGVuZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9LCBbXSk7XG5cbiAgICByZXR1cm4geyBzZWxlY3QsIGhhbmRsZXMsIGVycm9yLCBwZW5kaW5nLCBjb25maWdIYW5kbGUgfTtcbn1cblxuXG5cbmNvbnN0IGNhY2hlID0ge1xuICAgIHRleHQ6ICcnLFxuICAgIGNvbmZpZzoge30sXG4gICAgcHJvcHM6IG51bGwsXG4gICAgdXJsczoge30sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlUG9sbExvY2FsRG9jcyhcbiAgICBoYW5kbGVzOiBGaWxlU3lzdGVtRmlsZUhhbmRsZXMgfCBudWxsLFxuICAgIGNvbmZpZ0hhbmRsZTogRmlsZVN5c3RlbUZpbGVIYW5kbGUgfCBudWxsLFxuICAgIG1zID0gNTAwLFxuKTogW0RvY3VtZW50YXRpb25Mb2FkZXIgfCBudWxsLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LCBudW1iZXIgfCBudWxsXSB7XG4gICAgY29uc3QgW3VwZGF0aW5nLCBzZXRVcGRhdGluZ10gPSB1c2VTdGF0ZSgwKTtcbiAgICBjb25zdCBbcGFnZVByb3BzLCBzZXRQYWdlUHJvcHNdID0gdXNlU3RhdGU8RG9jdW1lbnRhdGlvbkxvYWRlciB8IG51bGw+KG51bGwpO1xuICAgIGNvbnN0IGhhc2ggPSB1c2VIYXNoQ2hhbmdlKCk7XG4gICAgY29uc3QgW2Vycm9yQ29kZSwgc2V0RXJyb3JDb2RlXSA9IHVzZVN0YXRlPG51bWJlciB8IG51bGw+KG51bGwpO1xuXG4gICAgdXNlRWZmZWN0KCgpID0+IHtcblxuICAgICAgICBpZiAoIWhhbmRsZXMpIHtcblxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyBUT0RPOiBpbWFnZSBoYW5kbGVzIG9uY2Ugd2UndmUgc29ydGVkIG91dCBMaW5rIGFuZCBJbWFnZSBMaW5rcyBldGNcbiAgICAgICAgY29uc3QgaW1hZ2VIYW5kbGVzID0gT2JqZWN0LmtleXMoaGFuZGxlcylcbiAgICAgICAgICAgIC5maWx0ZXIoa2V5ID0+IFsnLnBuZycsICcuanBnJywgJy5naWYnLCAnLmpwZWcnXS5zb21lKGV4dCA9PiBrZXkuZW5kc1dpdGgoZXh0KSkpXG4gICAgICAgICAgICAucmVkdWNlKChvYmosIGtleSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIG9ialtrZXldID0gaGFuZGxlc1trZXldO1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgICAgICB9LCB7fSk7XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IGhhc2ggPyBoYW5kbGVzW2hhc2hdIDogaGFuZGxlc1tgL2luZGV4Lm1keGBdO1xuXG4gICAgICAgIGNvbnN0IGludGVydmFsID0gc2V0SW50ZXJ2YWwoXG4gICAgICAgICAgICAoKSA9PlxuICAgICAgICAgICAgICAgIGV4dHJhY3RDb250ZW50cyhoYW5kbGUsIGNvbmZpZ0hhbmRsZSwgaW1hZ2VIYW5kbGVzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoW3RleHQsIGNvbmZpZywgdXJsc10pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0ZXh0ICE9PSBjYWNoZS50ZXh0IHx8IGNvbmZpZyAhPT0gY2FjaGUuY29uZmlnIHx8IHVybHMgIT09IGNhY2hlLnVybHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS51cmxzID0gdXJscztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS50ZXh0ID0gdGV4dDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWNoZS5jb25maWcgPSBjb25maWc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VXBkYXRpbmcodXBkYXRpbmcgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldEVycm9yQ29kZSg0MDQpO1xuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIG1zLFxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gKCkgPT4gY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7XG4gICAgfSwgW2hhc2gsIGhhbmRsZXMsIHVwZGF0aW5nXSk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnJWMgRmlsZSBjaGFuZ2UgZGV0ZWN0ZWQsIGhvdCB1cGRhdGUhIFx1RDgzRFx1REQyNScsICdjb2xvcjogIzhiMDAwMDsnKTtcblxuICAgICAgICBidWlsZFByZXZpZXdQcm9wcyh7IGhhc2gsIGNvbmZpZzogY2FjaGUuY29uZmlnLCB0ZXh0OiBjYWNoZS50ZXh0LCB1cmxzOiBjYWNoZS51cmxzIH0pLnRoZW4oXG4gICAgICAgICAgICBwcmV2aWV3UHJvcHMgPT4ge1xuICAgICAgICAgICAgICAgIHNldFBhZ2VQcm9wcyhwcmV2aWV3UHJvcHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgKTtcbiAgICB9LCBbY2FjaGUudGV4dCwgY2FjaGUuY29uZmlnXSk7XG5cbiAgICByZXR1cm4gW3BhZ2VQcm9wcywgY2FjaGUudXJscywgZXJyb3JDb2RlXTtcbn1cblxuY29uc3QgcmF3RW5kcG9pbnQgPSBgaHR0cDovL2xvY2FsaG9zdDo4MDAwL3Jhd2BcblxuY29uc3QgYnVpbGRQcmV2aWV3UHJvcHMgPSBhc3luYyAocGFyYW1zOiBhbnkpOiBQcm9taXNlPERvY3VtZW50YXRpb25Mb2FkZXI+ID0+IHtcblxuICAgIC8vIGNvbnN0IG93bmVyID0gJ293bmVyJztcbiAgICAvLyBjb25zdCByZXBvc2l0b3J5ID0gJ3JlcG8nXG4gICAgLy8gY29uc3QgcGF0aCA9ICdpbmRleCc7XG4gICAgY29uc3QgY29uZmlnID0gSlNPTi5wYXJzZShwYXJhbXMuY29uZmlnKTtcbiAgICBjb25zdCBtZCA9IHBhcmFtcy50ZXh0O1xuXG4gICAgbGV0IGNvZGU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICAgIGxldCBmcm9udG1hdHRlcjogQnVuZGxlU3VjY2Vzc1snZnJvbnRtYXR0ZXInXSB8IG51bGwgPSBudWxsO1xuICAgIGxldCBoZWFkaW5nczogQnVuZGxlU3VjY2Vzc1snaGVhZGluZ3MnXSB8IG51bGwgPSBudWxsXG4gICAgY29uc3QgYm9keSA9IHtcbiAgICAgICAgbWQsXG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgYmFzZUJyYW5jaDogJ21haW4nXG4gICAgfVxuXG4gICAgaWYgKG1kKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBidW5kbGUgPSBhd2FpdCBmZXRjaChgJHtyYXdFbmRwb2ludH1gLCB7XG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgJ2NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuICAgICAgICAgICAgICAgIH0sIGJvZHk6IEpTT04uc3RyaW5naWZ5KGJvZHkpXG4gICAgICAgICAgICB9KS50aGVuKHIgPT4gci5qc29uKCkpXG4gICAgICAgICAgICBjb2RlID0gYnVuZGxlLmNvZGU7XG4gICAgICAgICAgICBmcm9udG1hdHRlciA9IGJ1bmRsZS5mcm9udG1hdHRlcjtcbiAgICAgICAgICAgIGhlYWRpbmdzID0gYnVuZGxlLmhlYWRpbmdzO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Vycm9yIGJ1bmRsaW5nJylcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICAgIG93bmVyOiAncHJldmlldycsXG4gICAgICAgIHJlcG86ICdkb2NzJyxcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIHJlZjogJ0hFQUQnLFxuICAgICAgICBiYXNlQnJhbmNoOiAnbWFpbicsXG4gICAgICAgIHNvdXJjZTogeyB0eXBlOiAnYnJhbmNoJywgb3duZXI6ICdwcmV2aWV3JywgcmVwb3NpdG9yeTogJ2RvY3MnLCByZWY6ICdyZWYnIH0sXG4gICAgICAgIGNvZGU6IGNvZGUgfHwgJycsXG4gICAgICAgIGhlYWRpbmdzLFxuICAgICAgICBjb25maWc6IG1lcmdlQ29uZmlnKGNvbmZpZyksXG4gICAgICAgIGZyb250bWF0dGVyOiBmcm9udG1hdHRlciB8fCB7fSxcbiAgICB9XG59IiwgImltcG9ydCB7IGdldEJvb2xlYW4sIGdldE51bWJlciwgZ2V0U3RyaW5nLCBnZXRWYWx1ZSB9IGZyb20gJy4vZ2V0JztcbmltcG9ydCBnZXQgZnJvbSAnbG9kYXNoLmdldCc7XG5cbi8vIFJlcHJlc2VudHMgaG93IHRoZSBzaWRlYmFyIHNob3VsZCBsb29rIGluIHRoZSBjb25maWcgZmlsZS5cbmV4cG9ydCB0eXBlIFNpZGViYXJJdGVtID0gW3N0cmluZywgQXJyYXk8W3N0cmluZywgc3RyaW5nXT5dIHwgW3N0cmluZywgc3RyaW5nXTtcblxuLy8gTWVyZ2VzIGluIGEgdXNlciBzaWRlYmFyIGNvbmZpZyBhbmQgZW5zdXJlcyBhbGwgaXRlbXMgYXJlIHZhbGlkLlxuZnVuY3Rpb24gbWVyZ2VTaWRlYmFyQ29uZmlnKGpzb246IFBhcnRpYWw8UHJvamVjdENvbmZpZz4gfCBudWxsKTogU2lkZWJhckl0ZW1bXSB7XG4gIGNvbnN0IHNpZGViYXIgPSBnZXQoanNvbiwgJ3NpZGViYXInLCBkZWZhdWx0Q29uZmlnLnNpZGViYXIpO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShzaWRlYmFyKSkge1xuICAgIHJldHVybiBkZWZhdWx0Q29uZmlnLnNpZGViYXI7XG4gIH1cblxuICBmdW5jdGlvbiBpdGVyYXRlKHNpZGViYXI6IFNpZGViYXJJdGVtW10pOiBTaWRlYmFySXRlbVtdIHtcbiAgICByZXR1cm4gKFxuICAgICAgc2lkZWJhclxuICAgICAgICAubWFwKChpdGVtOiBTaWRlYmFySXRlbSkgPT4ge1xuICAgICAgICAgIC8vIEVhY2ggaXRlbSBzaG91bGQgYmUgYW4gYXJyYXkuXG4gICAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZW0pKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgIC8vIEdldCB0aGUgbGFiZWwgYW5kIHVybC9jaGlsZHJlblxuICAgICAgICAgIGNvbnN0IFtsYWJlbCwgdXJsT3JDaGlsZHJlbl0gPSBpdGVtO1xuXG4gICAgICAgICAgLy8gVGhlIGxhYmVsIHNob3VsZCBiZSBhIHN0cmluZy5cbiAgICAgICAgICBpZiAodHlwZW9mIGxhYmVsICE9PSAnc3RyaW5nJykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgc2Vjb25kIGl0ZW0gaXMgYSBzdHJpbmcsIGl0J3MgYSB1cmwuXG4gICAgICAgICAgaWYgKHR5cGVvZiB1cmxPckNoaWxkcmVuID09PSAnc3RyaW5nJykgcmV0dXJuIFtsYWJlbCwgdXJsT3JDaGlsZHJlbl07XG5cbiAgICAgICAgICAvLyBUaGVyZWZvcmUsIHRoZSBzZWNvbmQgaXRlbSBtdXN0IGJlIGFuIGFycmF5LlxuICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheSh1cmxPckNoaWxkcmVuKSkgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAvLyBJdGVyYXRlIHRoZSBjaGlsZHJlbiBhbmQgZG8gc29tZSB2YWxpZGF0aW9uLlxuICAgICAgICAgIGNvbnN0IGNoaWxkcmVuID0gdXJsT3JDaGlsZHJlblxuICAgICAgICAgICAgLm1hcCgoW25lc3RlZExhYmVsLCBuZXN0ZWRVcmxdKSA9PiB7XG4gICAgICAgICAgICAgIC8vIE9ubHkgYWxsb3cgc2luZ2xlIGRlcHRoIC0gZWFjaCBpdGVtIG11c3QgYmUgYSBzdHJpbmcuXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgbmVzdGVkTGFiZWwgIT09ICdzdHJpbmcnIHx8IHR5cGVvZiBuZXN0ZWRVcmwgIT09ICdzdHJpbmcnKSByZXR1cm4gbnVsbDtcblxuICAgICAgICAgICAgICByZXR1cm4gW25lc3RlZExhYmVsLCBuZXN0ZWRVcmxdO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbik7XG5cbiAgICAgICAgICByZXR1cm4gW2xhYmVsLCBjaGlsZHJlbl07XG4gICAgICAgIH0pXG4gICAgICAgIC8vIEZpbHRlciBvdXQgYW55IG51bGxzLlxuICAgICAgICAuZmlsdGVyKEJvb2xlYW4pIGFzIFNpZGViYXJJdGVtW11cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIGl0ZXJhdGUoc2lkZWJhcik7XG59XG5cbi8qKlxuICogUHJvamVjdCBjb25maWcuXG4gKlxuICogVGhpcyBjYW4gYmUgcHJvdmlkZWQgYnkgY3JlYXRpbmcgYSBgZG9jcy5qc29uYCBmaWxlIGF0IHRoZSByb290IG9mIHlvdXJcbiAqIHJlcG9zaXRvcnkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgUHJvamVjdENvbmZpZyB7XG4gIC8vIFByb2plY3QgbmFtZS5cbiAgbmFtZTogc3RyaW5nO1xuICAvLyBVUkwgdG8gcHJvamVjdCBsb2dvLlxuICBsb2dvOiBzdHJpbmc7XG4gIC8vIFVSTCB0byBwcm9qZWN0IGxvZ28gZm9yIGRhcmsgbW9kZVxuICBsb2dvRGFyazogc3RyaW5nO1xuICAvLyBVUkwgdG8gdGhlIGZhdmljb25cbiAgZmF2aWNvbjogc3RyaW5nO1xuICAvLyBJbWFnZSB0byBkaXNwbGF5IGFzIHRoZSBzb2NpYWwgcHJldmlldyBvbiBzaGFyZWQgVVJMc1xuICBzb2NpYWxQcmV2aWV3OiBzdHJpbmc7XG4gIC8vIFR3aXR0ZXIgdGFnIGZvciB1c2UgaW4gdGhlIGhlYWRlci5cbiAgdHdpdHRlcjogc3RyaW5nO1xuICAvLyBXaGV0aGVyIHRoZSB3ZWJzaXRlIHNob3VsZCBiZSBpbmRleGFibGUgYnkgc2VhcmNoIGJvdHMuXG4gIG5vaW5kZXg6IGJvb2xlYW47XG4gIC8vIEEgY29sb3IgdGhlbWUgdXNlZCBmb3IgdGhpcyBwcm9qZWN0LiBEZWZhdWx0cyB0byBcIiMwMGJjZDRcIi5cbiAgdGhlbWU6IHN0cmluZztcbiAgLy8gRG9jc2VhcmNoIEFwcGxpY2F0aW9uIElELiBJZiBwb3B1bGF0ZWQsIGEgc2VhcmNoIGJveCB3aXRoIGF1dG9jb21wbGV0ZSB3aWxsIGJlIHJlbmRlcmVkLlxuICBkb2NzZWFyY2g/OiB7XG4gICAgYXBwSWQ/OiBzdHJpbmc7XG4gICAgYXBpS2V5OiBzdHJpbmc7XG4gICAgaW5kZXhOYW1lOiBzdHJpbmc7XG4gIH07XG4gIC8vIEhlYWRlciBuYXZpZ2F0aW9uXG4gIC8vIG5hdmlnYXRpb246IE5hdmlnYXRpb25JdGVtW107XG4gIC8vIFNpZGViYXJcbiAgc2lkZWJhcjogU2lkZWJhckl0ZW1bXTtcbiAgLy8gVGhlIGRlcHRoIHRvIGhlYWRpbmcgdGFncyBhcmUgbGlua2VkLiBTZXQgdG8gMCB0byByZW1vdmUgYW55IGxpbmtpbmcuXG4gIGhlYWRlckRlcHRoOiBudW1iZXI7XG4gIC8vIFZhcmlhYmxlcyB3aGljaCBjYW4gYmUgaW5qZWN0ZWQgaW50byB0aGUgcGFnZXMgY29udGVudC5cbiAgdmFyaWFibGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAvLyBBZGRzIEdvb2dsZSBUYWcgTWFuYWdlciB0byB5b3VyIGRvY3VtZW50YXRpb24gcGFnZXMuXG4gIGdvb2dsZVRhZ01hbmFnZXI6IHN0cmluZztcbiAgLy8gV2hldGhlciB6b29tYWJsZSBpbWFnZXMgYXJlIGVuYWJsZWQgYnkgZGVmYXVsdFxuICB6b29tSW1hZ2VzOiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgZGVmYXVsdENvbmZpZzogUHJvamVjdENvbmZpZyA9IHtcbiAgbmFtZTogJycsXG4gIGxvZ286ICcnLFxuICBsb2dvRGFyazogJycsXG4gIGZhdmljb246ICcnLFxuICBzb2NpYWxQcmV2aWV3OiAnJyxcbiAgdHdpdHRlcjogJycsXG4gIG5vaW5kZXg6IGZhbHNlLFxuICB0aGVtZTogJyMwMGJjZDQnLFxuICAvLyBuYXZpZ2F0aW9uOiBbXSxcbiAgc2lkZWJhcjogW10sXG4gIGhlYWRlckRlcHRoOiAzLFxuICB2YXJpYWJsZXM6IHt9LFxuICBnb29nbGVUYWdNYW5hZ2VyOiAnJyxcbiAgem9vbUltYWdlczogZmFsc2UsXG59O1xuXG4vLyBNZXJnZXMgYW55IHVzZXIgY29uZmlnIHdpdGggZGVmYXVsdCB2YWx1ZXMuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VDb25maWcoanNvbjogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiBQcm9qZWN0Q29uZmlnIHtcblxuICByZXR1cm4ge1xuICAgIG5hbWU6IGdldFN0cmluZyhqc29uLCAnbmFtZScsIGRlZmF1bHRDb25maWcubmFtZSksXG4gICAgbG9nbzogZ2V0U3RyaW5nKGpzb24sICdsb2dvJywgZGVmYXVsdENvbmZpZy5sb2dvKSxcbiAgICBsb2dvRGFyazogZ2V0U3RyaW5nKGpzb24sICdsb2dvRGFyaycsIGRlZmF1bHRDb25maWcubG9nb0RhcmspLFxuICAgIGZhdmljb246IGdldFN0cmluZyhqc29uLCAnZmF2aWNvbicsIGRlZmF1bHRDb25maWcuZmF2aWNvbiksXG4gICAgc29jaWFsUHJldmlldzogZ2V0U3RyaW5nKGpzb24sICdzb2NpYWxQcmV2aWV3JywgZGVmYXVsdENvbmZpZy5zb2NpYWxQcmV2aWV3KSxcbiAgICB0d2l0dGVyOiBnZXRTdHJpbmcoanNvbiwgJ3R3aXR0ZXInLCBkZWZhdWx0Q29uZmlnLnR3aXR0ZXIpLFxuICAgIG5vaW5kZXg6IGdldEJvb2xlYW4oanNvbiwgJ25vaW5kZXgnLCBkZWZhdWx0Q29uZmlnLm5vaW5kZXgpLFxuICAgIHRoZW1lOiBnZXRTdHJpbmcoanNvbiwgJ3RoZW1lJywgZGVmYXVsdENvbmZpZy50aGVtZSksXG4gICAgZG9jc2VhcmNoOiBnZXRWYWx1ZShqc29uLCAnZG9jc2VhcmNoJylcbiAgICAgID8ge1xuICAgICAgICBhcHBJZDogZ2V0U3RyaW5nKGpzb24sICdkb2NzZWFyY2guYXBwSWQnLCAnJyksXG4gICAgICAgIGFwaUtleTogZ2V0U3RyaW5nKGpzb24sICdkb2NzZWFyY2guYXBpS2V5JywgJycpLFxuICAgICAgICBpbmRleE5hbWU6IGdldFN0cmluZyhqc29uLCAnZG9jc2VhcmNoLmluZGV4TmFtZScsICcnKSxcbiAgICAgIH1cbiAgICAgIDogZGVmYXVsdENvbmZpZy5kb2NzZWFyY2gsXG4gICAgLy8gbmF2aWdhdGlvbjogbWVyZ2VOYXZpZ2F0aW9uQ29uZmlnKGpzb24pLFxuICAgIHNpZGViYXI6IG1lcmdlU2lkZWJhckNvbmZpZyhqc29uKSxcbiAgICBoZWFkZXJEZXB0aDogZ2V0TnVtYmVyKGpzb24sICdoZWFkZXJEZXB0aCcsIGRlZmF1bHRDb25maWcuaGVhZGVyRGVwdGgpLFxuICAgIHZhcmlhYmxlczogZ2V0VmFsdWUoanNvbiwgJ3ZhcmlhYmxlcycsIGRlZmF1bHRDb25maWcudmFyaWFibGVzKSBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgIGdvb2dsZVRhZ01hbmFnZXI6IGdldFN0cmluZyhqc29uLCAnZ29vZ2xlVGFnTWFuYWdlcicsIGRlZmF1bHRDb25maWcuZ29vZ2xlVGFnTWFuYWdlciksXG4gICAgem9vbUltYWdlczogZ2V0Qm9vbGVhbihqc29uLCAnem9vbUltYWdlcycsIGRlZmF1bHRDb25maWcuem9vbUltYWdlcyksXG4gIH07XG59XG4iLCAiaW1wb3J0IHsgQnVuZGxlU3VjY2VzcywgZmV0Y2hCdW5kbGUsIEJ1bmRsZVJlc3BvbnNlRGF0YSwgQnVuZGxlRXJyb3IgfSBmcm9tICdAZG9jcy5wYWdlL3NlcnZlcic7XG5pbXBvcnQgeyBqc29uLCByZWRpcmVjdCwgTG9hZGVyRnVuY3Rpb24sIFRocm93blJlc3BvbnNlIH0gZnJvbSAncmVtaXgnO1xuaW1wb3J0IHsgcmVwbGFjZVZhcmlhYmxlcyB9IGZyb20gJ34vdXRpbHMnO1xuaW1wb3J0IHsgbWVyZ2VDb25maWcsIFByb2plY3RDb25maWcgfSBmcm9tICd+L3V0aWxzL2NvbmZpZyc7XG5cbmV4cG9ydCB0eXBlIFRocm93bkVycm9yID0gVGhyb3duQnVuZGxlRXJyb3IgfCBUaHJvd25Ob3RGb3VuZEVycm9yO1xuXG4vLyBBIHRocm93biBlcnJvciBmcm9tIHRoZSBsb2FkZXIgY29udGFpbmluZyB0aGUgYnVuZGxlIGVycm9yLlxuZXhwb3J0IHR5cGUgVGhyb3duQnVuZGxlRXJyb3IgPSBUaHJvd25SZXNwb25zZTxudW1iZXIsIEJ1bmRsZUVycm9yIHwgbnVsbD47XG5cbmV4cG9ydCB0eXBlIFRocm93bk5vdEZvdW5kRXJyb3IgPSBUaHJvd25SZXNwb25zZTxcbiAgbnVtYmVyLFxuICBQaWNrPERvY3VtZW50YXRpb25Mb2FkZXIsICdvd25lcicgfCAncmVwbycgfCAncGF0aCc+ICYgeyByZXBvc2l0b3J5Rm91bmQ6IGJvb2xlYW4gfVxuPjtcblxuLy8gUmVzcG9uc2UgZnJvbSB0aGUgbG9hZGVyIGNvbnRhaW5pbmcgdGhlIGJ1bmRsZSBkYXRhLlxuZXhwb3J0IHR5cGUgRG9jdW1lbnRhdGlvbkxvYWRlciA9IHtcbiAgLy8gVGhlIG93bmVyIG9mIHRoZSByZXF1ZXN0LCBlLmcuIGBpbnZlcnRhc2VgXG4gIG93bmVyOiBzdHJpbmc7XG4gIC8vIFRoZSByZXBvc2l0b3J5IG9mIHRoZSByZXF1ZXN0IGUuZy4gYHJlYWN0LW5hdGl2ZS1maXJlYmFzZWBcbiAgcmVwbzogc3RyaW5nO1xuICAvLyBUaGUgcGF0aCBvZiB0aGUgcmVxdWVzdCwgZS5nLiBgL2dldHRpbmctc3RhcnRlZGBcbiAgcGF0aDogc3RyaW5nO1xuICAvLyBBbiBvcHRpb25hbCByZWYgKGUuZy4gUFIsIGJyYW5jaCwgdGFnKSBwcm92aWRlZCB0byB0aGUgVVJMLlxuICByZWY/OiBzdHJpbmc7XG4gIC8vIFRoZSBzb3VyY2Ugb2YgdGhlIGNvbnRlbnQgKGUuZy4gbWFpbiwgbWFzdGVyLCBQUiwgcmVmKVxuICBzb3VyY2U6IHtcbiAgICB0eXBlOiAnUFInIHwgJ2NvbW1pdCcgfCAnYnJhbmNoJyxcbiAgICBvd25lcjogc3RyaW5nLFxuICAgIHJlcG9zaXRvcnk6IHN0cmluZyxcbiAgICByZWY6IHN0cmluZyxcbiAgfTtcbiAgLy8gVGhlIGJ1bmRsZSBkYXRhLlxuICBjb2RlOiBzdHJpbmc7XG4gIC8vIFBhZ2UgaGVhZGluZyBub2Rlcy5cbiAgaGVhZGluZ3M6IEJ1bmRsZVN1Y2Nlc3NbJ2hlYWRpbmdzJ107XG4gIC8vIENvbmZpZ3VyYXRpb24gZm9yIHRoZSByZXBvLlxuICBjb25maWc6IFByb2plY3RDb25maWc7XG4gIC8vIEFueSBwYWdlIGZyb250bWF0dGVyLlxuICBmcm9udG1hdHRlcjogQnVuZGxlU3VjY2Vzc1snZnJvbnRtYXR0ZXInXTtcbiAgLy8gYmFzZSBicmFuY2hcbiAgYmFzZUJyYW5jaDogc3RyaW5nO1xufTtcblxuLy8gVXRpbGl0eSB0byBndWFyZCBhZ2FpbnN0IGEgYnVuZGxlciBlcnJvci5cbmV4cG9ydCBmdW5jdGlvbiBpc0J1bmRsZUVycm9yKGJ1bmRsZTogYW55KTogYnVuZGxlIGlzIEJ1bmRsZUVycm9yIHtcbiAgcmV0dXJuIGJ1bmRsZS5lcnJvcnMgIT09IHVuZGVmaW5lZDtcbn1cbi8vIEB0cy1pZ25vcmVcbmV4cG9ydCBjb25zdCBkb2NzTG9hZGVyOiBMb2FkZXJGdW5jdGlvbiA9IGFzeW5jICh7IHBhcmFtcyB9KSA9PiB7XG4gIGNvbnN0IG93bmVyID0gcGFyYW1zLm93bmVyITtcbiAgbGV0IHJlcG8gPSBwYXJhbXMucmVwbyE7XG4gIGNvbnN0IHBhdGggPSBwYXJhbXNbJyonXSE7XG4gIGxldCByZWY6IHN0cmluZyB8IHVuZGVmaW5lZDtcblxuICAvLyBDaGVjayBpZiB0aGUgcmVwbyBpbmNsdWRlcyBhIHJlZlxuICBpZiAocmVwby5pbmNsdWRlcygnficpKSB7XG4gICAgW3JlcG8sIHJlZl0gPSByZXBvLnNwbGl0KCd+Jyk7XG4gIH1cblxuICBsZXQgYnVuZGxlOiBCdW5kbGVSZXNwb25zZURhdGE7XG5cbiAgdHJ5IHtcbiAgICBidW5kbGUgPSBhd2FpdCBmZXRjaEJ1bmRsZSh7IG93bmVyLCByZXBvc2l0b3J5OiByZXBvLCBwYXRoLCByZWYgfSk7XG5cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyBJZiB0aGUgYnVuZGxlciBmYWlsZWQgKGUuZy4gQVBJIGRvd24pLCB0aHJvdyBhIHNlcnZlciBlcnJvclxuICAgIGNvbnNvbGUubG9nKGVycm9yKTtcblxuXG4gICAgdGhyb3cganNvbihudWxsLCA1MDApO1xuICB9XG5cbiAgLy8gSWYgdGhlIGJ1bmRsZXIgZXJyb3JzLCByZXR1cm4gdGhlIGVycm9yIGFzIGEgYmFkIHJlcXVlc3QuXG4gIGlmIChpc0J1bmRsZUVycm9yKGJ1bmRsZSkpIHtcbiAgICB0aHJvdyBqc29uKGJ1bmRsZSwgNDAwKTtcbiAgfVxuXG4gIC8vIE5vIGJ1bmRsZWQgY29kZSBvciBjb25maWcgc2hvdWxkIDQwNFxuICBpZiAoYnVuZGxlLmNvbmZpZyA9PT0gbnVsbCB8fCBidW5kbGUuY29kZSA9PT0gbnVsbCkge1xuICAgIHRocm93IGpzb248VGhyb3duTm90Rm91bmRFcnJvclsnZGF0YSddPihcbiAgICAgIHtcbiAgICAgICAgb3duZXIsXG4gICAgICAgIHJlcG8sXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHJlcG9zaXRvcnlGb3VuZDogYnVuZGxlLnJlcG9zaXRvcnlGb3VuZFxuICAgICAgfSxcbiAgICAgIDQwNCxcbiAgICApO1xuICB9XG5cbiAgLy8gQXBwbHkgYSByZWRpcmVjdCBpZiBwcm92aWRlZCBpbiB0aGUgZnJvbnRtYXR0ZXJcbiAgaWYgKGJ1bmRsZS5mcm9udG1hdHRlci5yZWRpcmVjdCkge1xuICAgIHJldHVybiByZWRpcmVjdChidW5kbGUuZnJvbnRtYXR0ZXIucmVkaXJlY3QpO1xuICB9XG5cbiAgY29uc3QgY29uZmlnID0gbWVyZ2VDb25maWcoYnVuZGxlLmNvbmZpZyk7XG5cbiAgY29uc3QgY29kZSA9IHJlcGxhY2VWYXJpYWJsZXMoY29uZmlnLnZhcmlhYmxlcywgYnVuZGxlLmNvZGUpO1xuXG4gIGNvbnNvbGUubG9nKGJ1bmRsZS5zb3VyY2UpO1xuXG4gIHJldHVybiBqc29uPERvY3VtZW50YXRpb25Mb2FkZXI+KHtcbiAgICBvd25lcixcbiAgICByZXBvLFxuICAgIHBhdGgsXG4gICAgcmVmLFxuICAgIHNvdXJjZTogYnVuZGxlLnNvdXJjZSxcbiAgICBjb2RlLFxuICAgIGhlYWRpbmdzOiBidW5kbGUuaGVhZGluZ3MsXG4gICAgY29uZmlnOiBtZXJnZUNvbmZpZyhidW5kbGUuY29uZmlnKSxcbiAgICBmcm9udG1hdHRlcjogYnVuZGxlLmZyb250bWF0dGVyLFxuICAgIGJhc2VCcmFuY2g6IGJ1bmRsZS5iYXNlQnJhbmNoID8/ICdtYWluJ1xuICB9LFxuICAgIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgJ2NhY2hlLWNvbnRyb2wnOiAnbWF4LWFnZT0zMCwgc3RhbGUtd2hpbGUtcmV2YWxpZGF0ZT0zMTU2MDAwMCwgcy1tYXhhZ2U9MzAwJ1xuICAgICAgfVxuICAgIH0pO1xufTtcbiIsICJpbXBvcnQgdHlwZSB7IFRocm93bkJ1bmRsZUVycm9yLCBUaHJvd25Ob3RGb3VuZEVycm9yIH0gZnJvbSAnLi4vbG9hZGVycy9kb2N1bWVudGF0aW9uLnNlcnZlcic7XG5pbXBvcnQgeyBEb2NzTGluayB9IGZyb20gJy4vRG9jc0xpbmsnO1xuaW1wb3J0IHsgUXVpY2tMaW5rcyB9IGZyb20gJy4vUXVpY2tsaW5rcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIFByZXZpZXdOb3RGb3VuZCh7IGVycm9yIH06IHsgZXJyb3I6IGFueSB9KSB7XG4gIGNvbnN0IGNvbmZpZ0ZvdW5kID0gdHJ1ZVxuICByZXR1cm4gKFxuICAgIDxFcnJvckNvbnRhaW5lciB0aXRsZT17XCJUaGlzIHBhZ2UgY291bGQgbm90IGJlIGZvdW5kXCJ9IGNvZGU9ezQwNH0+XG4gICAgICB7XG4gICAgICAgIGNvbmZpZ0ZvdW5kID8gPD5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgV2UgY291bGRuJ3QgZmluZCB5b3VyIGRvY3MgaW4gdGhpcyBkaXJlY3RvcnkuIE1ha2Ugc3VyZSB5b3Ugc2VsZWN0IGEgZGlyZWN0b3J5IHdpdGggYSA8Y29kZT5kb2NzLmpzb248L2NvZGU+IGZpbGUsIGFuZCBhIDxjb2RlPmRvY3MvaW5kZXgubWR4PC9jb2RlPiBmaWxlLlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXY+XG4gICAgICAgICAgICBJZiB5b3UgdGhpbmsgc29tZXRoaW5nIGVsc2UgaXMgdXAsIHBsZWFzZSBsZXQgdXMga25vdyBieSBmaWxpbmcgYW4gPGEgY2xhc3NOYW1lPVwidGV4dC1ibHVlLTYwMFwiIGhyZWY9XCJodHRwczovL2dpdGh1Yi5jb20vaW52ZXJ0YXNlL2RvY3MucGFnZS9pc3N1ZXNcIj5pc3N1ZTwvYT4uXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0xMFwiPlxuICAgICAgICAgICAgUmV0dXJuIHRvIHsnICd9XG4gICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJ0ZXh0LWJsdWUtNjAwXCIgaHJlZj1cIi9wcmV2aWV3XCI+IFByZXZpZXcgTW9kZTwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC8+IDpcbiAgICAgICAgICA8ZGl2PmRvY3MuanNvbiBub3QgZm91bmQ8L2Rpdj5cbiAgICAgIH1cbiAgICA8L0Vycm9yQ29udGFpbmVyPlxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gTm90Rm91bmQoeyBlcnJvciB9OiB7IGVycm9yOiBUaHJvd25Ob3RGb3VuZEVycm9yIH0pIHtcblxuICBjb25zdCB7IG93bmVyLCByZXBvLCBwYXRoLCByZXBvc2l0b3J5Rm91bmQgfSA9IGVycm9yLmRhdGE7XG5cbiAgcmV0dXJuIChcbiAgICA8RXJyb3JDb250YWluZXIgdGl0bGU9e1wiVGhpcyBwYWdlIGNvdWxkIG5vdCBiZSBmb3VuZFwifSBjb2RlPXtlcnJvci5zdGF0dXN9PlxuICAgICAge1xuICAgICAgICByZXBvc2l0b3J5Rm91bmQgPyA8RmlsZU5vdEZvdW5kIG93bmVyPXtvd25lcn0gcmVwbz17cmVwb30gcGF0aD17cGF0aH0gLz4gOlxuICAgICAgICAgIDxSZXBvTm90Rm91bmQgb3duZXI9e293bmVyfSByZXBvPXtyZXBvfSAvPlxuICAgICAgfVxuICAgIDwvRXJyb3JDb250YWluZXI+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBCYWRSZXF1ZXN0KHsgZXJyb3IgfTogeyBlcnJvcjogVGhyb3duQnVuZGxlRXJyb3IgfSkge1xuICByZXR1cm4gKFxuICAgIDxFcnJvckNvbnRhaW5lciB0aXRsZT17XCJUaGlzIHBhZ2UgY291bGQgbm90IGJlIGdlbmVyYXRlZFwifSBjb2RlPXtlcnJvci5zdGF0dXN9PlxuICAgICAgPGRpdj57J1RoaXMgbWF5IGJlIGR1ZSB0byBhbiBlcnJvciBpbiB5b3VyIG1keC4nfTwvZGl2PlxuICAgIDwvRXJyb3JDb250YWluZXI+XG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBTZXJ2ZXJFcnJvcih7IHRpdGxlIH06IHsgdGl0bGU6IHN0cmluZyB9KSB7XG4gIHJldHVybiAoXG4gICAgPEVycm9yQ29udGFpbmVyIHRpdGxlPXt0aXRsZX0gY29kZT17NTAwfT5cbiAgICAgIDxkaXY+eydTb21ldGhpbmcgd2VudCB3cm9uZy4gVHJ5IGFnYWluIGxhdGVyIG9yIHJlcG9ydCBhbiBpc3N1ZSB3aXRoIHVzIHVzaW5nIHRoZSBsaW5rIGJlbG93Lid9PC9kaXY+XG4gICAgPC9FcnJvckNvbnRhaW5lcj5cbiAgKTtcbn1cblxuZnVuY3Rpb24gRXJyb3JDb250YWluZXIoeyB0aXRsZSwgY29kZSwgY2hpbGRyZW4gfTogeyB0aXRsZTogc3RyaW5nLCBjb2RlOiBudW1iZXIsIGNoaWxkcmVuOiBSZWFjdC5SZWFjdEVsZW1lbnQgfSkge1xuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJtdC0yMCBtYXgtdy1sZyBteC1hdXRvXCI+XG4gICAgPFRpdGxlIHN0YXR1c0NvZGU9e2NvZGV9IHRpdGxlPXt0aXRsZX0gLz5cbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEwIGZsZXgtY29sXCI+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9kaXY+XG4gICAgPFF1aWNrTGlua3MgLz5cbiAgPC9kaXY+XG59XG5cbmludGVyZmFjZSBUaXRsZVByb3BzIHtcbiAgc3RhdHVzQ29kZTogbnVtYmVyO1xuICB0aXRsZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRpdGxlKHsgc3RhdHVzQ29kZSwgdGl0bGUgfTogVGl0bGVQcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb250LWFudG9uIG1iLTQgdGV4dC1jZW50ZXIgbGc6dGV4dC1sZWZ0XCI+XG4gICAgICAgIDxoMSBjbGFzc05hbWU9XCJ0ZXh0LTd4bCBsZzp0ZXh0LTl4bFwiPlxuICAgICAgICAgIDxzcGFuIGRhdGEtdGVzdGlkPSdlcnJvci1zdGF0dXMtY29kZScgY2xhc3NOYW1lPVwiYmctY2xpcC10ZXh0IHRleHQtdHJhbnNwYXJlbnQgYmctZ3JhZGllbnQtdG8tYnIgZnJvbS1wdXJwbGUtNDAwIHZpYS1waW5rLTUwMCB0by1yZWQtNTAwXCI+XG4gICAgICAgICAgICB7c3RhdHVzQ29kZX1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvaDE+XG4gICAgICAgIDxoMiBkYXRhLXRlc3RpZD0nZXJyb3ItdGl0bGUnIGNsYXNzTmFtZT1cInRleHQtNXhsIGxnOnRleHQtNHhsIHRleHQtZ3JheS05MDAgZGFyazp0ZXh0LXdoaXRlXCI+e3RpdGxlfTwvaDI+XG4gICAgICA8L2Rpdj5cbiAgICA8Lz5cbiAgKTtcbn1cblxuY29uc3QgUmVwb05vdEZvdW5kID0gKHsgb3duZXIsIHJlcG8gfTogeyBvd25lcjogc3RyaW5nLCByZXBvOiBzdHJpbmcgfSkgPT4gPD48cD5cbiAgVGhlIEdpdEh1YiByZXBvc2l0b3J5eycgJ31cbiAgPERvY3NMaW5rIGNsYXNzTmFtZT1cInRleHQtYmx1ZS02MDBcIiB0bz17YGh0dHBzOi8vZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99YH0+XG4gICAge293bmVyfS97cmVwb31cbiAgPC9Eb2NzTGluaz57JyAnfVxuICB3YXMgbm90IGZvdW5kLlxuPC9wPlxuICA8cD5cbiAgICBUbyBnZXQgc3RhcnRlZCwgY3JlYXRlIGEgbmV3IHJlcG9zaXRvcnkgb257JyAnfVxuICAgIDxEb2NzTGluayBjbGFzc05hbWU9XCJ0ZXh0LWJsdWUtNjAwXCIgdG89XCJodHRwczovL2dpdGh1Yi5jb20vbmV3XCI+R2l0SHViPC9Eb2NzTGluaz4uXG4gIDwvcD48Lz5cblxuY29uc3QgRmlsZU5vdEZvdW5kID0gKHsgb3duZXIsIHJlcG8sIHBhdGggfTogeyBvd25lcjogc3RyaW5nLCByZXBvOiBzdHJpbmcsIHBhdGg6IHN0cmluZyB9KSA9PiA8PjxwPlxuICBUaGUgZmlsZSB7JyAnfVxuICA8RG9jc0xpbmsgY2xhc3NOYW1lPVwidGV4dC1ibHVlLTYwMFwiIHRvPXtgaHR0cHM6Ly9naXRodWIuY29tLyR7b3duZXJ9LyR7cmVwb30vYmxvYi9tYWluLyR7cGF0aH0ubWR4YH0+XG4gICAge3BhdGh9Lm1keFxuICA8L0RvY3NMaW5rPnsnICd9XG4gIHdhcyBub3QgZm91bmQuXG48L3A+XG4gIDxwPlxuICAgIFRoaXMgY291bGQgYmUgYmVjYXVzZSBvZiBhIHR5cG8gaW4geW91ciBzaWRlYmFyIGNvbmZpZywgb3IgeW91J3ZlIG5vdCBtYWRlIGEgZmlsZSBhdCB0aGlzIHBhdGguXG4gIDwvcD48Lz4iLCAiaW1wb3J0IHsgTmF2TGluaywgTmF2TGlua1Byb3BzIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyB1c2VEb2N1bWVudGF0aW9uQ29udGV4dCB9IGZyb20gJ34vY29udGV4dCc7XG5pbXBvcnQgeyB1c2VQcmV2aWV3TW9kZSB9IGZyb20gJ34vdXRpbHMvbG9jYWwtcHJldmlldy1tb2RlJztcblxuZXhwb3J0IGZ1bmN0aW9uIERvY3NMaW5rKHsgLi4ucHJvcHMgfTogTmF2TGlua1Byb3BzKSB7XG4gIGNvbnN0IHsgb3duZXIsIHJlcG8sIHJlZiB9ID0gdXNlRG9jdW1lbnRhdGlvbkNvbnRleHQoKTtcbiAgY29uc3QgcHJldmlld01vZGUgPSB1c2VQcmV2aWV3TW9kZSgpO1xuXG4gIGlmICh0eXBlb2YgcHJvcHMudG8gPT09ICdzdHJpbmcnICYmIGlzRXh0ZXJuYWxMaW5rKHByb3BzLnRvKSkge1xuICAgIHJldHVybiAoXG4gICAgICA8YVxuICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxuICAgICAgICByZWw9XCJub29wZW5lciBub2ZvbGxvd1wiXG4gICAgICAgIGhyZWY9e3Byb3BzLnRvfVxuICAgICAgICBjbGFzc05hbWU9e1xuICAgICAgICAgIHR5cGVvZiBwcm9wcy5jbGFzc05hbWUgPT09ICdmdW5jdGlvbidcbiAgICAgICAgICAgID8gcHJvcHMuY2xhc3NOYW1lKHsgaXNBY3RpdmU6IGZhbHNlIH0pXG4gICAgICAgICAgICA6IHByb3BzLmNsYXNzTmFtZVxuICAgICAgICB9XG4gICAgICA+XG4gICAgICAgIHtwcm9wcy5jaGlsZHJlbn1cbiAgICAgIDwvYT5cbiAgICApO1xuICB9XG5cbiAgbGV0IHRvID0gYC8ke293bmVyfS8ke3JlcG99YDtcblxuICBpZiAocmVmICYmIHJlZiAhPT0gJ0hFQUQnKSB7XG4gICAgdG8gKz0gYH4ke3JlZn1gO1xuICB9XG5cbiAgaWYgKHByZXZpZXdNb2RlLmVuYWJsZWQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGFcbiAgICAgICAgY2xhc3NOYW1lPXtcbiAgICAgICAgICB0eXBlb2YgcHJvcHMuY2xhc3NOYW1lID09PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICA/IHByb3BzLmNsYXNzTmFtZSh7IGlzQWN0aXZlOiBmYWxzZSB9KVxuICAgICAgICAgICAgOiBwcm9wcy5jbGFzc05hbWVcbiAgICAgICAgfVxuICAgICAgICBocmVmPXtgIyR7cHJvcHMudG99YH1cbiAgICAgID5cbiAgICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgPC9hPlxuICAgICk7XG4gIH1cblxuICByZXR1cm4gPE5hdkxpbmsgey4uLnByb3BzfSB0bz17cmVtb3ZlVHJhaWxpbmdTbGFzaChgJHt0b30ke3Byb3BzLnRvfWApfSAvPjtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVHJhaWxpbmdTbGFzaChwYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXFwvJC8sICcnKTtcbn1cblxuZnVuY3Rpb24gaXNFeHRlcm5hbExpbmsodG86IHN0cmluZykge1xuICByZXR1cm4gdG8uc3RhcnRzV2l0aCgnaHR0cCcpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIYXNoTGluayhsaW5rOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGxpbmsuc3RhcnRzV2l0aCgnIycpO1xufVxuIiwgImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBHaXRIdWIsXG4gIEFkanVzdG1lbnRzLFxuICBQdWxsUmVxdWVzdCxcbiAgVGVtcGxhdGUsXG4gIEdsb2JlQWx0LFxuICBJc3N1ZSxcbiAgQW5ub3RhdGlvbixcbiAgU2VhcmNoQ2lyY2xlLFxufSBmcm9tICcuL0ljb25zJztcblxuY29uc3QgZGVmYXVsdEljb25TaXplID0gMzA7XG5jb25zdCBkb2N1bWVudGF0aW9uTG9jYXRpb24gPSAnaHR0cHM6Ly91c2UuZG9jcy5wYWdlL3NlYXJjaCc7XG5cbmNvbnN0IGxpbmtEYXRhOiBRdWlja0xpbmtQcm9wc1tdID0gW1xuICB7XG4gICAgaHJlZjogJ2h0dHBzOi8vZ2l0aHViLmNvbS9pbnZlcnRhc2UvZG9jcy5wYWdlJyxcbiAgICBjaGlsZHJlbjogJ0NvbnRyaWJ1dGUnLFxuICAgIGljb246IDxHaXRIdWIgc2l6ZT17ZGVmYXVsdEljb25TaXplfSAvPixcbiAgfSxcbiAge1xuICAgIGhyZWY6ICdodHRwczovL2dpdGh1Yi5jb20vaW52ZXJ0YXNlL2RvY3MucGFnZS9pc3N1ZXMnLFxuICAgIGNoaWxkcmVuOiAnUmVwb3J0IGFuIGlzc3VlJyxcbiAgICBpY29uOiA8SXNzdWUgc2l6ZT17ZGVmYXVsdEljb25TaXplfSAvPixcbiAgfSxcbiAge1xuICAgIGhyZWY6IGAke2RvY3VtZW50YXRpb25Mb2NhdGlvbn0vY29uZmlndXJhdGlvbmAsXG4gICAgY2hpbGRyZW46ICdDb25maWd1cmF0aW9uJyxcbiAgICBpY29uOiA8QWRqdXN0bWVudHMgc2l6ZT17ZGVmYXVsdEljb25TaXplfSAvPixcbiAgfSxcbiAge1xuICAgIGhyZWY6IGAke2RvY3VtZW50YXRpb25Mb2NhdGlvbn0vcHJldmlld3NgLFxuICAgIGNoaWxkcmVuOiAnUHJldmlld3MnLFxuICAgIGljb246IDxQdWxsUmVxdWVzdCBzaXplPXtkZWZhdWx0SWNvblNpemV9IC8+LFxuICB9LFxuICB7XG4gICAgaHJlZjogYCR7ZG9jdW1lbnRhdGlvbkxvY2F0aW9ufS9jb21wb25lbnRzYCxcbiAgICBjaGlsZHJlbjogJ0NvbXBvbmVudHMnLFxuICAgIGljb246IDxUZW1wbGF0ZSBzaXplPXtkZWZhdWx0SWNvblNpemV9IC8+LFxuICB9LFxuICB7XG4gICAgaHJlZjogYCR7ZG9jdW1lbnRhdGlvbkxvY2F0aW9ufS9jdXN0b20tZG9tYWluc2AsXG4gICAgY2hpbGRyZW46ICdDdXN0b20gRG9tYWlucycsXG4gICAgaWNvbjogPEdsb2JlQWx0IHNpemU9e2RlZmF1bHRJY29uU2l6ZX0gLz4sXG4gIH0sXG4gIHtcbiAgICBocmVmOiBgJHtkb2N1bWVudGF0aW9uTG9jYXRpb259L2dpdGh1Yi1ib3RgLFxuICAgIGNoaWxkcmVuOiAnR2l0SHViIEJvdCcsXG4gICAgaWNvbjogPEFubm90YXRpb24gc2l6ZT17ZGVmYXVsdEljb25TaXplfSAvPixcbiAgfSxcbiAge1xuICAgIGhyZWY6IGAke2RvY3VtZW50YXRpb25Mb2NhdGlvbn0vc2VhcmNoYCxcbiAgICBjaGlsZHJlbjogJ1NlYXJjaCcsXG4gICAgaWNvbjogPFNlYXJjaENpcmNsZSBzaXplPXtkZWZhdWx0SWNvblNpemV9IC8+LFxuICB9LFxuXTtcblxuZXhwb3J0IGZ1bmN0aW9uIFF1aWNrTGlua3MoKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiZGFyazp0ZXh0LXdoaXRlIG1iLTEyIG10LTEwXCI+XG4gICAgICA8aDIgY2xhc3NOYW1lPVwidGV4dC14bCBmb250LXNlbWlib2xkIG1iLTRcIj5RdWljayBMaW5rczwvaDI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImxnOmZsZXggZmxleC13cmFwXCI+XG4gICAgICAgIHtsaW5rRGF0YS5tYXAoKGxpbmssIGkpID0+IChcbiAgICAgICAgICA8UXVpY2tMaW5rIGtleT17aX0gaHJlZj17bGluay5ocmVmfSBpY29uPXtsaW5rLmljb259PlxuICAgICAgICAgICAge2xpbmsuY2hpbGRyZW59XG4gICAgICAgICAgPC9RdWlja0xpbms+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmludGVyZmFjZSBRdWlja0xpbmtQcm9wcyB7XG4gIGhyZWY6IHN0cmluZztcbiAgY2hpbGRyZW46IHN0cmluZztcbiAgaWNvbj86IFJlYWN0LlJlYWN0RWxlbWVudDtcbn1cblxuZnVuY3Rpb24gUXVpY2tMaW5rKHsgaHJlZiwgaWNvbiwgY2hpbGRyZW4gfTogUXVpY2tMaW5rUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTIgZmxleCBsZzp3LTEvMiBcIj5cbiAgICAgIDxhXG4gICAgICAgIGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIHNwYWNlLXgtNCB3LWZ1bGwgbXgtMiBwLTQgcm91bmRlZCBob3ZlcjpiZy1ncmF5LTQwMC8xMFwiXG4gICAgICAgIGhyZWY9e2hyZWZ9XG4gICAgICA+XG4gICAgICAgIHtpY29ufVxuICAgICAgICA8c3Bhbj57Y2hpbGRyZW59PC9zcGFuPlxuICAgICAgPC9hPlxuICAgIDwvZGl2PlxuICApO1xufVxuIiwgIi8qKlxuICogQ3JlZGl0OiBodHRwczovL2hlcm9pY29ucy5jb21cbiAqL1xuXG4gaW1wb3J0IHsgQ1NTUHJvcGVydGllcyB9IGZyb20gJ3JlYWN0JztcblxuIGludGVyZmFjZSBJY29uUHJvcHMge1xuICAgc2l6ZTogbnVtYmVyO1xuICAgY2xhc3NOYW1lPzogc3RyaW5nO1xuICAgc3R5bGU/OiBDU1NQcm9wZXJ0aWVzO1xuIH1cbiBcbiBleHBvcnQgZnVuY3Rpb24gQWRqdXN0bWVudHMoeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XG4gICAgICAgICBkPVwiTTEyIDZWNG0wIDJhMiAyIDAgMTAwIDRtMC00YTIgMiAwIDExMCA0bS02IDhhMiAyIDAgMTAwLTRtMCA0YTIgMiAwIDExMC00bTAgNHYybTAtNlY0bTYgNnYxMG02LTJhMiAyIDAgMTAwLTRtMCA0YTIgMiAwIDExMC00bTAgNHYybTAtNlY0XCJcbiAgICAgICAvPlxuICAgICA8L3N2Zz5cbiAgICk7XG4gfVxuIFxuIGV4cG9ydCBmdW5jdGlvbiBQdWxsUmVxdWVzdCh7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3N0eWxlfSB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgIGQ9XCJNNy4xNzcgMy4wNzNMOS41NzMuNjc3QS4yNS4yNSAwIDAxMTAgLjg1NHY0Ljc5MmEuMjUuMjUgMCAwMS0uNDI3LjE3N0w3LjE3NyAzLjQyN2EuMjUuMjUgMCAwMTAtLjM1NHpNMy43NSAyLjVhLjc1Ljc1IDAgMTAwIDEuNS43NS43NSAwIDAwMC0xLjV6bS0yLjI1Ljc1YTIuMjUgMi4yNSAwIDExMyAyLjEyMnY1LjI1NmEyLjI1MSAyLjI1MSAwIDExLTEuNSAwVjUuMzcyQTIuMjUgMi4yNSAwIDAxMS41IDMuMjV6TTExIDIuNWgtMVY0aDFhMSAxIDAgMDExIDF2NS42MjhhMi4yNTEgMi4yNTEgMCAxMDEuNSAwVjVBMi41IDIuNSAwIDAwMTEgMi41em0xIDEwLjI1YS43NS43NSAwIDExMS41IDAgLjc1Ljc1IDAgMDEtMS41IDB6TTMuNzUgMTJhLjc1Ljc1IDAgMTAwIDEuNS43NS43NSAwIDAwMC0xLjV6XCJcbiAgICAgICAvPlxuICAgICA8L3N2Zz5cbiAgICk7XG4gfVxuIFxuIGV4cG9ydCBmdW5jdGlvbiBCcmFuY2goeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IHN0eWxlPXtzdHlsZX0gdmlld0JveD1cIjAgMCAxNiAxNlwiPlxuICAgICAgIDxwYXRoXG4gICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICBkPVwiTTExLjc1IDIuNWEuNzUuNzUgMCAxMDAgMS41Ljc1Ljc1IDAgMDAwLTEuNXptLTIuMjUuNzVhMi4yNSAyLjI1IDAgMTEzIDIuMTIyVjZBMi41IDIuNSAwIDAxMTAgOC41SDZhMSAxIDAgMDAtMSAxdjEuMTI4YTIuMjUxIDIuMjUxIDAgMTEtMS41IDBWNS4zNzJhMi4yNSAyLjI1IDAgMTExLjUgMHYxLjgzNkEyLjQ5MiAyLjQ5MiAwIDAxNiA3aDRhMSAxIDAgMDAxLTF2LS42MjhBMi4yNSAyLjI1IDAgMDE5LjUgMy4yNXpNNC4yNSAxMmEuNzUuNzUgMCAxMDAgMS41Ljc1Ljc1IDAgMDAwLTEuNXpNMy41IDMuMjVhLjc1Ljc1IDAgMTExLjUgMCAuNzUuNzUgMCAwMS0xLjUgMHpcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIENvbW1pdCh7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2ZyB3aWR0aD17c2l6ZX0gaGVpZ2h0PXtzaXplfSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gc3R5bGU9e3N0eWxlfSB2aWV3Qm94PVwiMCAwIDE2IDE2XCI+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgIGQ9XCJNMTAuNSA3Ljc1YTIuNSAyLjUgMCAxMS01IDAgMi41IDIuNSAwIDAxNSAwem0xLjQzLjc1YTQuMDAyIDQuMDAyIDAgMDEtNy44NiAwSC43NWEuNzUuNzUgMCAxMTAtMS41aDMuMzJhNC4wMDEgNC4wMDEgMCAwMTcuODYgMGgzLjMyYS43NS43NSAwIDExMCAxLjVoLTMuMzJ6XCJcbiAgICAgICAvPlxuICAgICA8L3N2Zz5cbiAgICk7XG4gfVxuIFxuIGV4cG9ydCBmdW5jdGlvbiBUZW1wbGF0ZSh7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2Z1xuICAgICAgIHdpZHRoPXtzaXplfVxuICAgICAgIGhlaWdodD17c2l6ZX1cbiAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgID5cbiAgICAgICA8cGF0aFxuICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VXaWR0aD17Mn1cbiAgICAgICAgIGQ9XCJNNCA1YTEgMSAwIDAxMS0xaDE0YTEgMSAwIDAxMSAxdjJhMSAxIDAgMDEtMSAxSDVhMSAxIDAgMDEtMS0xVjV6TTQgMTNhMSAxIDAgMDExLTFoNmExIDEgMCAwMTEgMXY2YTEgMSAwIDAxLTEgMUg1YTEgMSAwIDAxLTEtMXYtNnpNMTYgMTNhMSAxIDAgMDExLTFoMmExIDEgMCAwMTEgMXY2YTEgMSAwIDAxLTEgMWgtMmExIDEgMCAwMS0xLTF2LTZ6XCJcbiAgICAgICAvPlxuICAgICA8L3N2Zz5cbiAgICk7XG4gfVxuIFxuIGV4cG9ydCBmdW5jdGlvbiBHbG9iZUFsdCh7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2Z1xuICAgICAgIHdpZHRoPXtzaXplfVxuICAgICAgIGhlaWdodD17c2l6ZX1cbiAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgID5cbiAgICAgICA8cGF0aFxuICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XG4gICAgICAgICBkPVwiTTIxIDEyYTkgOSAwIDAxLTkgOW05LTlhOSA5IDAgMDAtOS05bTkgOUgzbTkgOWE5IDkgMCAwMS05LTltOSA5YzEuNjU3IDAgMy00LjAzIDMtOXMtMS4zNDMtOS0zLTltMCAxOGMtMS42NTcgMC0zLTQuMDMtMy05czEuMzQzLTkgMy05bS05IDlhOSA5IDAgMDE5LTlcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIEFubm90YXRpb24oeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAgZD1cIk03IDhoMTBNNyAxMmg0bTEgOGwtNC00SDVhMiAyIDAgMDEtMi0yVjZhMiAyIDAgMDEyLTJoMTRhMiAyIDAgMDEyIDJ2OGEyIDIgMCAwMS0yIDJoLTNsLTQgNHpcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIEdpdEh1Yih7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2Z1xuICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgIHdpZHRoPXtzaXplfVxuICAgICAgIGhlaWdodD17c2l6ZX1cbiAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgID5cbiAgICAgICA8cGF0aFxuICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICBkPVwiTTEyIDBjLTYuNjI2IDAtMTIgNS4zNzMtMTIgMTIgMCA1LjMwMiAzLjQzOCA5LjggOC4yMDcgMTEuMzg3LjU5OS4xMTEuNzkzLS4yNjEuNzkzLS41Nzd2LTIuMjM0Yy0zLjMzOC43MjYtNC4wMzMtMS40MTYtNC4wMzMtMS40MTYtLjU0Ni0xLjM4Ny0xLjMzMy0xLjc1Ni0xLjMzMy0xLjc1Ni0xLjA4OS0uNzQ1LjA4My0uNzI5LjA4My0uNzI5IDEuMjA1LjA4NCAxLjgzOSAxLjIzNyAxLjgzOSAxLjIzNyAxLjA3IDEuODM0IDIuODA3IDEuMzA0IDMuNDkyLjk5Ny4xMDctLjc3NS40MTgtMS4zMDUuNzYyLTEuNjA0LTIuNjY1LS4zMDUtNS40NjctMS4zMzQtNS40NjctNS45MzEgMC0xLjMxMS40NjktMi4zODEgMS4yMzYtMy4yMjEtLjEyNC0uMzAzLS41MzUtMS41MjQuMTE3LTMuMTc2IDAgMCAxLjAwOC0uMzIyIDMuMzAxIDEuMjMuOTU3LS4yNjYgMS45ODMtLjM5OSAzLjAwMy0uNDA0IDEuMDIuMDA1IDIuMDQ3LjEzOCAzLjAwNi40MDQgMi4yOTEtMS41NTIgMy4yOTctMS4yMyAzLjI5Ny0xLjIzLjY1MyAxLjY1My4yNDIgMi44NzQuMTE4IDMuMTc2Ljc3Ljg0IDEuMjM1IDEuOTExIDEuMjM1IDMuMjIxIDAgNC42MDktMi44MDcgNS42MjQtNS40NzkgNS45MjEuNDMuMzcyLjgyMyAxLjEwMi44MjMgMi4yMjJ2My4yOTNjMCAuMzE5LjE5Mi42OTQuODAxLjU3NiA0Ljc2NS0xLjU4OSA4LjE5OS02LjA4NiA4LjE5OS0xMS4zODYgMC02LjYyNy01LjM3My0xMi0xMi0xMnpcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIFR3aXR0ZXIoeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgZD1cIk0yNCA0LjU1N2MtLjg4My4zOTItMS44MzIuNjU2LTIuODI4Ljc3NSAxLjAxNy0uNjA5IDEuNzk4LTEuNTc0IDIuMTY1LTIuNzI0LS45NTEuNTY0LTIuMDA1Ljk3NC0zLjEyNyAxLjE5NS0uODk3LS45NTctMi4xNzgtMS41NTUtMy41OTQtMS41NTUtMy4xNzkgMC01LjUxNSAyLjk2Ni00Ljc5NyA2LjA0NS00LjA5MS0uMjA1LTcuNzE5LTIuMTY1LTEwLjE0OC01LjE0NC0xLjI5IDIuMjEzLS42NjkgNS4xMDggMS41MjMgNi41NzQtLjgwNi0uMDI2LTEuNTY2LS4yNDctMi4yMjktLjYxNi0uMDU0IDIuMjgxIDEuNTgxIDQuNDE1IDMuOTQ5IDQuODktLjY5My4xODgtMS40NTIuMjMyLTIuMjI0LjA4NC42MjYgMS45NTYgMi40NDQgMy4zNzkgNC42IDMuNDE5LTIuMDcgMS42MjMtNC42NzggMi4zNDgtNy4yOSAyLjA0IDIuMTc5IDEuMzk3IDQuNzY4IDIuMjEyIDcuNTQ4IDIuMjEyIDkuMTQyIDAgMTQuMzA3LTcuNzIxIDEzLjk5NS0xNC42NDYuOTYyLS42OTUgMS43OTctMS41NjIgMi40NTctMi41NDl6XCJcbiAgICAgICAvPlxuICAgICA8L3N2Zz5cbiAgICk7XG4gfVxuIFxuIGV4cG9ydCBmdW5jdGlvbiBQZW5jaWwoeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAgZD1cIk0xNS4yMzIgNS4yMzJsMy41MzYgMy41MzZtLTIuMDM2LTUuMDM2YTIuNSAyLjUgMCAxMTMuNTM2IDMuNTM2TDYuNSAyMS4wMzZIM3YtMy41NzJMMTYuNzMyIDMuNzMyelwiXG4gICAgICAgLz5cbiAgICAgPC9zdmc+XG4gICApO1xuIH1cbiBcbiBleHBvcnQgZnVuY3Rpb24gQ2hldnJvbkRvdWJsZVVwKHsgc2l6ZSwgY2xhc3NOYW1lLCBzdHlsZSB9OiBJY29uUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gICByZXR1cm4gKFxuICAgICA8c3ZnXG4gICAgICAgd2lkdGg9e3NpemV9XG4gICAgICAgaGVpZ2h0PXtzaXplfVxuICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgPlxuICAgICAgIDxwYXRoXG4gICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VXaWR0aD17Mn1cbiAgICAgICAgIGQ9XCJNNSAxMWw3LTcgNyA3TTUgMTlsNy03IDcgN1wiXG4gICAgICAgLz5cbiAgICAgPC9zdmc+XG4gICApO1xuIH1cbiBcbiBleHBvcnQgZnVuY3Rpb24gTWVudSh7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2Z1xuICAgICAgIHdpZHRoPXtzaXplfVxuICAgICAgIGhlaWdodD17c2l6ZX1cbiAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgID5cbiAgICAgICA8cGF0aFxuICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XG4gICAgICAgICBkPVwiTTQgNmgxNk00IDEyaDE2TTQgMThoMTZcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIE1lbnVPcGVuUmlnaHQoeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZVdpZHRoPVwiMlwiXG4gICAgICAgICBkPVwiTTQgNmgxNk00IDEyaDE2bS03IDZoN1wiXG4gICAgICAgLz5cbiAgICAgPC9zdmc+XG4gICApO1xuIH1cbiBcbiBleHBvcnQgZnVuY3Rpb24gRXllKHsgc2l6ZSwgY2xhc3NOYW1lLCBzdHlsZSB9OiBJY29uUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gICByZXR1cm4gKFxuICAgICA8c3ZnXG4gICAgICAgd2lkdGg9e3NpemV9XG4gICAgICAgaGVpZ2h0PXtzaXplfVxuICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgPlxuICAgICAgIDxwYXRoXG4gICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgZD1cIk0xNSAxMmEzIDMgMCAxMS02IDAgMyAzIDAgMDE2IDB6XCJcbiAgICAgICAvPlxuICAgICAgIDxwYXRoXG4gICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VXaWR0aD1cIjJcIlxuICAgICAgICAgZD1cIk0yLjQ1OCAxMkMzLjczMiA3Ljk0MyA3LjUyMyA1IDEyIDVjNC40NzggMCA4LjI2OCAyLjk0MyA5LjU0MiA3LTEuMjc0IDQuMDU3LTUuMDY0IDctOS41NDIgNy00LjQ3NyAwLTguMjY4LTIuOTQzLTkuNTQyLTd6XCJcbiAgICAgICAvPlxuICAgICA8L3N2Zz5cbiAgICk7XG4gfVxuIFxuIGV4cG9ydCBmdW5jdGlvbiBFeWVPZmYoeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlV2lkdGg9XCIyXCJcbiAgICAgICAgIGQ9XCJNMTMuODc1IDE4LjgyNUExMC4wNSAxMC4wNSAwIDAxMTIgMTljLTQuNDc4IDAtOC4yNjgtMi45NDMtOS41NDMtN2E5Ljk3IDkuOTcgMCAwMTEuNTYzLTMuMDI5bTUuODU4LjkwOGEzIDMgMCAxMTQuMjQzIDQuMjQzTTkuODc4IDkuODc4bDQuMjQyIDQuMjQyTTkuODggOS44OGwtMy4yOS0zLjI5bTcuNTMyIDcuNTMybDMuMjkgMy4yOU0zIDNsMy41OSAzLjU5bTAgMEE5Ljk1MyA5Ljk1MyAwIDAxMTIgNWM0LjQ3OCAwIDguMjY4IDIuOTQzIDkuNTQzIDdhMTAuMDI1IDEwLjAyNSAwIDAxLTQuMTMyIDUuNDExbTAgMEwyMSAyMVwiXG4gICAgICAgLz5cbiAgICAgPC9zdmc+XG4gICApO1xuIH1cbiBcbiBleHBvcnQgZnVuY3Rpb24gSXNzdWUoeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmcgd2lkdGg9e3NpemV9IGhlaWdodD17c2l6ZX0gY2xhc3NOYW1lPXtjbGFzc05hbWV9IHN0eWxlPXtzdHlsZX0gdmlld0JveD1cIjAgMCAxNiAxNlwiPlxuICAgICAgIDxwYXRoXG4gICAgICAgICBmaWxsPVwiY3VycmVudENvbG9yXCJcbiAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICBkPVwiTTggMS41YTYuNSA2LjUgMCAxMDAgMTMgNi41IDYuNSAwIDAwMC0xM3pNMCA4YTggOCAwIDExMTYgMEE4IDggMCAwMTAgOHptOSAzYTEgMSAwIDExLTIgMCAxIDEgMCAwMTIgMHptLS4yNS02LjI1YS43NS43NSAwIDAwLTEuNSAwdjMuNWEuNzUuNzUgMCAwMDEuNSAwdi0zLjV6XCJcbiAgICAgICAvPlxuICAgICA8L3N2Zz5cbiAgICk7XG4gfVxuIFxuIGV4cG9ydCBmdW5jdGlvbiBTZWFyY2hDaXJjbGUoeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAgZD1cIk0yMSAyMWwtNi02bTItNWE3IDcgMCAxMS0xNCAwIDcgNyAwIDAxMTQgMHpcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIENsb3NlKHsgc2l6ZSwgY2xhc3NOYW1lLCBzdHlsZSB9OiBJY29uUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gICByZXR1cm4gKFxuICAgICA8c3ZnXG4gICAgICAgd2lkdGg9e3NpemV9XG4gICAgICAgaGVpZ2h0PXtzaXplfVxuICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCJcbiAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgPlxuICAgICAgIDxwYXRoIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIiBzdHJva2VXaWR0aD17Mn0gZD1cIk02IDE4TDE4IDZNNiA2bDEyIDEyXCIgLz5cbiAgICAgPC9zdmc+XG4gICApO1xuIH1cbiBcbiBleHBvcnQgZnVuY3Rpb24gTGlnaHRuaW5nQm9sdCh7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2Z1xuICAgICAgIHdpZHRoPXtzaXplfVxuICAgICAgIGhlaWdodD17c2l6ZX1cbiAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgID5cbiAgICAgICA8cGF0aFxuICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XG4gICAgICAgICBkPVwiTTEzIDEwVjNMNCAxNGg3djdsOS0xMWgtN3pcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIE1vb24oeyBzaXplLCBjbGFzc05hbWUsIHN0eWxlIH06IEljb25Qcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgIHJldHVybiAoXG4gICAgIDxzdmdcbiAgICAgICB3aWR0aD17c2l6ZX1cbiAgICAgICBoZWlnaHQ9e3NpemV9XG4gICAgICAgY2xhc3NOYW1lPXtjbGFzc05hbWV9XG4gICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgIGZpbGw9XCJub25lXCJcbiAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICBzdHJva2U9XCJjdXJyZW50Q29sb3JcIlxuICAgICA+XG4gICAgICAgPHBhdGhcbiAgICAgICAgIHN0cm9rZUxpbmVjYXA9XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VMaW5lam9pbj1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZVdpZHRoPXsyfVxuICAgICAgICAgZD1cIk0yMC4zNTQgMTUuMzU0QTkgOSAwIDAxOC42NDYgMy42NDYgOS4wMDMgOS4wMDMgMCAwMDEyIDIxYTkuMDAzIDkuMDAzIDAgMDA4LjM1NC01LjY0NnpcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIFN1bih7IHNpemUsIGNsYXNzTmFtZSwgc3R5bGUgfTogSWNvblByb3BzKTogSlNYLkVsZW1lbnQge1xuICAgcmV0dXJuIChcbiAgICAgPHN2Z1xuICAgICAgIHdpZHRoPXtzaXplfVxuICAgICAgIGhlaWdodD17c2l6ZX1cbiAgICAgICBjbGFzc05hbWU9e2NsYXNzTmFtZX1cbiAgICAgICBzdHlsZT17c3R5bGV9XG4gICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgZmlsbD1cIm5vbmVcIlxuICAgICAgIHZpZXdCb3g9XCIwIDAgMjQgMjRcIlxuICAgICAgIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiXG4gICAgID5cbiAgICAgICA8cGF0aFxuICAgICAgICAgc3Ryb2tlTGluZWNhcD1cInJvdW5kXCJcbiAgICAgICAgIHN0cm9rZUxpbmVqb2luPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlV2lkdGg9ezJ9XG4gICAgICAgICBkPVwiTTEyIDN2MW0wIDE2djFtOS05aC0xTTQgMTJIM20xNS4zNjQgNi4zNjRsLS43MDctLjcwN002LjM0MyA2LjM0M2wtLjcwNy0uNzA3bTEyLjcyOCAwbC0uNzA3LjcwN002LjM0MyAxNy42NTdsLS43MDcuNzA3TTE2IDEyYTQgNCAwIDExLTggMCA0IDQgMCAwMTggMHpcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9XG4gXG4gZXhwb3J0IGZ1bmN0aW9uIENvbXB1dGVyKHsgc2l6ZSwgY2xhc3NOYW1lLCBzdHlsZSB9OiBJY29uUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gICByZXR1cm4gKFxuICAgICA8c3ZnXG4gICAgICAgd2lkdGg9e3NpemV9XG4gICAgICAgaGVpZ2h0PXtzaXplfVxuICAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxuICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICBmaWxsPVwibm9uZVwiXG4gICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgc3Ryb2tlPVwiY3VycmVudENvbG9yXCJcbiAgICAgPlxuICAgICAgIDxwYXRoXG4gICAgICAgICBzdHJva2VMaW5lY2FwPVwicm91bmRcIlxuICAgICAgICAgc3Ryb2tlTGluZWpvaW49XCJyb3VuZFwiXG4gICAgICAgICBzdHJva2VXaWR0aD17Mn1cbiAgICAgICAgIGQ9XCJNOS43NSAxN0w5IDIwbC0xIDFoOGwtMS0xLS43NS0zTTMgMTNoMThNNSAxN2gxNGEyIDIgMCAwMDItMlY1YTIgMiAwIDAwLTItMkg1YTIgMiAwIDAwLTIgMnYxMGEyIDIgMCAwMDIgMnpcIlxuICAgICAgIC8+XG4gICAgIDwvc3ZnPlxuICAgKTtcbiB9IiwgImltcG9ydCB7IHVzZUh5ZHJhdGVkTWR4IH0gZnJvbSAnQGRvY3MucGFnZS9jbGllbnQnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgeyBGb290ZXIgfSBmcm9tICd+L2NvbXBvbmVudHMvRm9vdGVyJztcbmltcG9ydCB7IEhlYWRlciB9IGZyb20gJ34vY29tcG9uZW50cy9IZWFkZXInO1xuaW1wb3J0IHsgU2lkZWJhciB9IGZyb20gJ34vY29tcG9uZW50cy9TaWRlYmFyJztcbmltcG9ydCB7IFRoZW1lIH0gZnJvbSAnfi9jb21wb25lbnRzL1RoZW1lJztcbmltcG9ydCBjb21wb25lbnRzIGZyb20gJ34vY29tcG9uZW50cy9tZHgnO1xuaW1wb3J0IHsgRG9jdW1lbnRhdGlvblByb3ZpZGVyIH0gZnJvbSAnfi9jb250ZXh0JztcbmltcG9ydCB7IERvY3VtZW50YXRpb25Mb2FkZXIgfSBmcm9tICcuLi9sb2FkZXJzL2RvY3VtZW50YXRpb24uc2VydmVyJztcbmltcG9ydCB7IFNjcm9sbFNweSB9IGZyb20gJ34vY29tcG9uZW50cy9TY3JvbGxTcHknO1xuaW1wb3J0IHsgVGFic0NvbnRleHQgfSBmcm9tICcuL21keC9UYWJzJztcbmltcG9ydCB7IGhhc2ggYXMgY3JlYXRlSGFzaCB9IGZyb20gJ34vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBEb2N1bWVudGF0aW9uKHsgZGF0YSB9OiB7IGRhdGE6IERvY3VtZW50YXRpb25Mb2FkZXIgfSkge1xuICBjb25zdCBNRFggPSB1c2VIeWRyYXRlZE1keCh7IGNvZGU6IGRhdGEuY29kZSB9KTtcbiAgY29uc3QgaGFzaCA9IGNyZWF0ZUhhc2goYCR7ZGF0YS5vd25lcn0vJHtkYXRhLnJlcG99YCk7XG4gIHJldHVybiAoXG4gICAgPERvY3VtZW50YXRpb25Qcm92aWRlciBkYXRhPXtkYXRhfT5cbiAgICAgIDxUaGVtZSAvPlxuICAgICAgPEhlYWRlciAvPlxuICAgICAgPGRpdiBkYXRhLXRlc3QtaWQ9eydkb2N1bWVudGF0aW9uLXByb3ZpZGVyJ30gY2xhc3NOYW1lPVwibWF4LXctOHhsIG14LWF1dG9cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmaXhlZCBpbnNldC0wIHB5LTEwIHB4LTggb3ZlcmZsb3cteC1hdXRvIHRvcC0xNCBsZWZ0LVttYXgoMHB4LGNhbGMoNTAlLTQ1cmVtKSldIHctNjRcIj5cbiAgICAgICAgICA8U2lkZWJhciAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwdC0xMCBwbC03MlwiPlxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goe1xuICAgICAgICAgICAgICAnbXItNTIgcHItMTYnOiB0cnVlLFxuICAgICAgICAgICAgfSl9XG4gICAgICAgICAgPlxuICAgICAgICAgICAgPG1haW5cbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwicHJvc2UgZGFyazpwcm9zZS1pbnZlcnQgbWF4LXctbm9uZVxuICAgICAgICAgICAgICBwcm9zZS1jb2RlOmZvbnQtZmlyYSBwcm9zZS1jb2RlOmZvbnQtbWVkaXVtXG4gICAgICAgICAgICBcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICA8VGFic0NvbnRleHQgaGFzaD17aGFzaH0+XG4gICAgICAgICAgICAgICAgPE1EWCBjb21wb25lbnRzPXtjb21wb25lbnRzfSAvPlxuICAgICAgICAgICAgICA8L1RhYnNDb250ZXh0PlxuICAgICAgICAgICAgPC9tYWluPlxuICAgICAgICAgICAgPEZvb3RlciAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIHshIWRhdGEuaGVhZGluZ3MgJiYgKFxuICAgICAgICAgICAgPGFzaWRlIGNsYXNzTmFtZT1cInB0LTEwIHB4LTggZml4ZWQgdG9wLTE0IGJvdHRvbS0wIHctNTIgb3ZlcmZsb3cteS1hdXRvIHJpZ2h0LVttYXgoMHB4LGNhbGMoNTAlLTQ1cmVtKSldXCI+XG4gICAgICAgICAgICAgIDxTY3JvbGxTcHkgLz5cbiAgICAgICAgICAgIDwvYXNpZGU+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L0RvY3VtZW50YXRpb25Qcm92aWRlcj5cbiAgKTtcbn1cbiIsICJpbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVtaXgnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHsgRG9jU2VhcmNoIH0gZnJvbSAnQGRvY3NlYXJjaC9yZWFjdCc7XG5cbmltcG9ydCB7IERhcmtNb2RlVG9nZ2xlIH0gZnJvbSAnLi9EYXJrTW9kZVRvZ2dsZSc7XG5pbXBvcnQgeyB1c2VCYXNlVXJsLCB1c2VEb2N1bWVudGF0aW9uQ29udGV4dCwgdXNlSW1hZ2VQYXRoIH0gZnJvbSAnfi9jb250ZXh0JztcbmltcG9ydCB7IEJyYW5jaCwgQ29tbWl0LCBQdWxsUmVxdWVzdCB9IGZyb20gJy4vSWNvbnMnO1xuaW1wb3J0IHsgdXNlUHJldmlld01vZGUgfSBmcm9tICd+L3V0aWxzL2xvY2FsLXByZXZpZXctbW9kZSc7XG5cbi8vIFRPRE8gbGlua1xuZXhwb3J0IGZ1bmN0aW9uIEhlYWRlcigpIHtcbiAgY29uc3QgeyBvd25lciwgcmVwbywgY29uZmlnLCByZWYsIHNvdXJjZSB9ID0gdXNlRG9jdW1lbnRhdGlvbkNvbnRleHQoKTtcblxuICBjb25zdCBiYXNlID0gdXNlQmFzZVVybCgpO1xuXG4gIGNvbnN0IGxvZ29MaWdodCA9IHVzZUltYWdlUGF0aChjb25maWcubG9nbyk7XG4gIGNvbnN0IGxvZ29EYXJrID0gdXNlSW1hZ2VQYXRoKGNvbmZpZy5sb2dvRGFyayk7XG4gIGNvbnN0IHByZXZpZXdNb2RlID0gdXNlUHJldmlld01vZGUoKTtcbiAgcmV0dXJuIChcbiAgICA8aGVhZGVyIGNsYXNzTmFtZT1cInN0aWNreSB0b3AtMCB6LTQwIHctZnVsbCBiYWNrZHJvcC1ibHVyIGZsZXgtbm9uZSB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi01MDAgbGc6ei01MCBsZzpib3JkZXItYiBsZzpib3JkZXItZ3JheS05MDAvMTAgZGFyazpsZzpib3JkZXItZ3JheS00MDAvMTAgYmctd2hpdGUvNjAgZGFyazpiZy16aW5jLTkwMC82MFwiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy04eGwgbXgtYXV0byBmbGV4IGl0ZW1zLWNlbnRlciBoLTE0IHB4LTQgbGc6cHgtOFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtc2hyaW5rLTBcIj5cbiAgICAgICAgICA8TGluayB0bz17YmFzZX0gY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIgZm9udC1ib2xkXCI+XG4gICAgICAgICAgICB7ISFjb25maWcubG9nbyAmJiAoXG4gICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXtjeCgndy02IGgtNiBtci0zIGlubGluZS1ibG9jayBkYXJrOmhpZGRlbicsIHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rhcms6aGlkZGVuJzogISFjb25maWcubG9nb0RhcmssXG4gICAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgICAgIHNyYz17bG9nb0xpZ2h0fVxuICAgICAgICAgICAgICAgICAgYWx0PVwiTG9nb1wiXG4gICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgeyEhY29uZmlnLmxvZ29EYXJrICYmIChcbiAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctNiBoLTYgbXItMyBoaWRkZW4gZGFyazppbmxpbmUtYmxvY2tcIlxuICAgICAgICAgICAgICAgIHNyYz17bG9nb0Rhcmt9XG4gICAgICAgICAgICAgICAgYWx0PVwiTG9nb1wiXG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPHNwYW4+e2NvbmZpZy5uYW1lIHx8IGAke293bmVyfS8ke3JlcG99YH08L3NwYW4+XG4gICAgICAgICAgPC9MaW5rPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3ByZXZpZXdNb2RlLmVuYWJsZWQgJiYgKFxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1sLTQgcHgtNCBweS0yIGRhcms6dGV4dC1ibGFjayB0ZXh0LXdoaXRlIGl0YWxpYyB0ZXh0LXhzIHJvdW5kZWQtbGcgYmctZ3JhZGllbnQtdG8tYnIgZnJvbS1yZWQtNjAwIHRvLWJsYWNrIGRhcms6ZnJvbS15ZWxsb3ctMjAwIGRhcms6dG8tcmVkLTQwMFwiPlxuICAgICAgICAgICAgcHJldmlldyBtb2RlXG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICApfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtZ3JvdyBmbGV4IGp1c3RpZnktZW5kXCI+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImZsZXggc3BhY2UteC00XCI+XG4gICAgICAgICAgICB7ISFjb25maWcudHdpdHRlciAmJiAoXG4gICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgaHJlZj17YGh0dHBzOi8vZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99YH1cbiAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtYmx1ZS01MDAgaG92ZXI6dGV4dC1ibHVlLTQwMCB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0xMDBcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImgtOCB3LThcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDI0IDI0XCJcbiAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgICAgZmlsbD1cImN1cnJlbnRDb2xvclwiXG4gICAgICAgICAgICAgICAgICAgICAgZD1cIk0yNCA0LjU1N2MtLjg4My4zOTItMS44MzIuNjU2LTIuODI4Ljc3NSAxLjAxNy0uNjA5IDEuNzk4LTEuNTc0IDIuMTY1LTIuNzI0LS45NTEuNTY0LTIuMDA1Ljk3NC0zLjEyNyAxLjE5NS0uODk3LS45NTctMi4xNzgtMS41NTUtMy41OTQtMS41NTUtMy4xNzkgMC01LjUxNSAyLjk2Ni00Ljc5NyA2LjA0NS00LjA5MS0uMjA1LTcuNzE5LTIuMTY1LTEwLjE0OC01LjE0NC0xLjI5IDIuMjEzLS42NjkgNS4xMDggMS41MjMgNi41NzQtLjgwNi0uMDI2LTEuNTY2LS4yNDctMi4yMjktLjYxNi0uMDU0IDIuMjgxIDEuNTgxIDQuNDE1IDMuOTQ5IDQuODktLjY5My4xODgtMS40NTIuMjMyLTIuMjI0LjA4NC42MjYgMS45NTYgMi40NDQgMy4zNzkgNC42IDMuNDE5LTIuMDcgMS42MjMtNC42NzggMi4zNDgtNy4yOSAyLjA0IDIuMTc5IDEuMzk3IDQuNzY4IDIuMjEyIDcuNTQ4IDIuMjEyIDkuMTQyIDAgMTQuMzA3LTcuNzIxIDEzLjk5NS0xNC42NDYuOTYyLS42OTUgMS43OTctMS41NjIgMi40NTctMi41NDl6XCJcbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDwvc3ZnPlxuICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICl9XG4gICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgaHJlZj17YGh0dHBzOi8vZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99YH1cbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNzAwIGhvdmVyOnRleHQtYmxhY2sgZGFyazp0ZXh0LWdyYXktMzAwIGRhcms6aG92ZXI6dGV4dC13aGl0ZSB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0xMDBcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJoLTggdy04XCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cbiAgICAgICAgICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgIGQ9XCJNMTIgMkM2LjQ3NyAyIDIgNi40ODQgMiAxMi4wMTdjMCA0LjQyNSAyLjg2NSA4LjE4IDYuODM5IDkuNTA0LjUuMDkyLjY4Mi0uMjE3LjY4Mi0uNDgzIDAtLjIzNy0uMDA4LS44NjgtLjAxMy0xLjcwMy0yLjc4Mi42MDUtMy4zNjktMS4zNDMtMy4zNjktMS4zNDMtLjQ1NC0xLjE1OC0xLjExLTEuNDY2LTEuMTEtMS40NjYtLjkwOC0uNjIuMDY5LS42MDguMDY5LS42MDggMS4wMDMuMDcgMS41MzEgMS4wMzIgMS41MzEgMS4wMzIuODkyIDEuNTMgMi4zNDEgMS4wODggMi45MS44MzIuMDkyLS42NDcuMzUtMS4wODguNjM2LTEuMzM4LTIuMjItLjI1My00LjU1NS0xLjExMy00LjU1NS00Ljk1MSAwLTEuMDkzLjM5LTEuOTg4IDEuMDI5LTIuNjg4LS4xMDMtLjI1My0uNDQ2LTEuMjcyLjA5OC0yLjY1IDAgMCAuODQtLjI3IDIuNzUgMS4wMjZBOS41NjQgOS41NjQgMCAwMTEyIDYuODQ0Yy44NS4wMDQgMS43MDUuMTE1IDIuNTA0LjMzNyAxLjkwOS0xLjI5NiAyLjc0Ny0xLjAyNyAyLjc0Ny0xLjAyNy41NDYgMS4zNzkuMjAyIDIuMzk4LjEgMi42NTEuNjQuNyAxLjAyOCAxLjU5NSAxLjAyOCAyLjY4OCAwIDMuODQ4LTIuMzM5IDQuNjk1LTQuNTY2IDQuOTQzLjM1OS4zMDkuNjc4LjkyLjY3OCAxLjg1NSAwIDEuMzM4LS4wMTIgMi40MTktLjAxMiAyLjc0NyAwIC4yNjguMTguNTguNjg4LjQ4MkExMC4wMTkgMTAuMDE5IDAgMDAyMiAxMi4wMTdDMjIgNi40ODQgMTcuNTIyIDIgMTIgMnpcIlxuICAgICAgICAgICAgICAgICAgICBjbGlwUnVsZT1cImV2ZW5vZGRcIlxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIHtwcmV2aWV3TW9kZS5lbmFibGVkICYmIChcbiAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e3ByZXZpZXdNb2RlLm9uU2VsZWN0fVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cIm1yLTQgZmxleCBweC0zIHB5LTIgdGV4dC14cyByb3VuZGVkLWxnIHNoYWRvdyB0ZXh0LXdoaXRlIHRyYW5zaXRpb24tY29sb3JzIHdoaXRlc3BhY2Utbm93cmFwIGJnLWdyZWVuLTYwMCBob3ZlcjpiZy1ncmVlbi01MDBcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC13aGl0ZVwiPkNoYW5nZSBkaXJlY3Rvcnk8L3NwYW4+XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgISFyZWYgJiYgc291cmNlLnR5cGUgIT09ICdicmFuY2gnICYmIHNvdXJjZS5yZWYgIT09ICdIRUFEJyAmJiAhcHJldmlld01vZGUuZW5hYmxlZCAmJlxuICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgPFJlZkxpbmsgcG9pbnRlcj17cmVmfSBvd25lcj17b3duZXJ9IHJlcG89e3JlcG99IHNvdXJjZT17c291cmNlfSAvPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeyEhY29uZmlnLmRvY3NlYXJjaCAmJiAhcHJldmlld01vZGUuZW5hYmxlZCAmJiAoXG4gICAgICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgICAgICA8RG9jU2VhcmNoXG4gICAgICAgICAgICAgICAgICBhcHBJZD17Y29uZmlnLmRvY3NlYXJjaC5hcHBJZH1cbiAgICAgICAgICAgICAgICAgIGFwaUtleT17Y29uZmlnLmRvY3NlYXJjaC5hcGlLZXl9XG4gICAgICAgICAgICAgICAgICBpbmRleE5hbWU9e2NvbmZpZy5kb2NzZWFyY2guaW5kZXhOYW1lfVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICA8RGFya01vZGVUb2dnbGUgLz5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2hlYWRlcj5cbiAgKTtcbn1cblxuaW50ZXJmYWNlIFJlZkxpbmtQcm9wcyB7XG4gIHBvaW50ZXI6IHN0cmluZyxcbiAgb3duZXI6IHN0cmluZyxcbiAgcmVwbzogc3RyaW5nLFxuICBzb3VyY2U6IHtcbiAgICB0eXBlOiBzdHJpbmcsXG4gICAgb3duZXI6IHN0cmluZyxcbiAgICByZXBvc2l0b3J5OiBzdHJpbmcsXG4gICAgcmVmOiBzdHJpbmdcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIFJlZkxpbmsoeyBwb2ludGVyLCBvd25lciwgcmVwbywgc291cmNlIH06IFJlZkxpbmtQcm9wcyk6IEpTWC5FbGVtZW50IHtcblxuICBjb25zdCBkZWZhdWx0SWNvblNpemUgPSAxNjtcblxuICBjb25zdCBsaW5rRGF0YTogUmVjb3JkPHN0cmluZywgYW55PiA9IHtcbiAgICBicmFuY2g6IHtcbiAgICAgIGhyZWY6IGBodHRwczovL2dpdGh1Yi5jb20vJHtvd25lcn0vJHtyZXBvfS90cmVlLyR7cG9pbnRlcn1gLFxuICAgICAgaWNvbjogPEJyYW5jaCBzaXplPXtkZWZhdWx0SWNvblNpemV9IC8+LFxuICAgICAgY2xhc3NOYW1lOiAnYmctZ3JlZW4tNjAwIGhvdmVyOmJnLWdyZWVuLTUwMCAnXG4gICAgfSxcbiAgICBQUjoge1xuICAgICAgaHJlZjogYGh0dHBzOi8vZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99L3B1bGwvJHtwb2ludGVyfWAsXG4gICAgICBpY29uOiA8UHVsbFJlcXVlc3Qgc2l6ZT17ZGVmYXVsdEljb25TaXplfSAvPixcbiAgICAgIGNsYXNzTmFtZTogJ2JnLWJsdWUtNjAwIGhvdmVyOmJnLWJsdWUtNTAwICdcbiAgICB9LFxuICAgIGNvbW1pdDoge1xuICAgICAgaHJlZjogYGh0dHBzOi8vZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99L3RyZWUvJHtwb2ludGVyfWAsXG4gICAgICBpY29uOiA8Q29tbWl0IHNpemU9e2RlZmF1bHRJY29uU2l6ZX0gLz4sXG4gICAgICBjbGFzc05hbWU6ICdiZy1waW5rLTYwMCBob3ZlcjpiZy1waW5rLTUwMCAnXG4gICAgfVxuICB9XG5cbiAgY29uc3QgeyBocmVmLCBpY29uLCBjbGFzc05hbWUgfSA9IGxpbmtEYXRhW3NvdXJjZT8udHlwZSA/PyAnYnJhbmNoJ107XG5cbiAgcmV0dXJuIDxhIGhyZWY9e2hyZWZ9PlxuICAgIDxkaXYgY2xhc3NOYW1lPXtjeChcbiAgICAgICdmbGV4IHB4LTMgcHktMiB0ZXh0LXhzIHJvdW5kZWQtbGcgc2hhZG93IHRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnMgd2hpdGVzcGFjZS1ub3dyYXAnLFxuICAgICAgYCR7Y2xhc3NOYW1lfWBcbiAgICApfT5cbiAgICAgIHtpY29ufVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwbC0xXCI+e3BvaW50ZXJ9PC9kaXY+XG4gICAgPC9kaXY+XG4gIDwvYT5cbn0iLCAiaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHsgdXNlRG9jdW1lbnRhdGlvbkNvbnRleHQgfSBmcm9tICd+L2NvbnRleHQnO1xuaW1wb3J0IHsgRG9jc0xpbmsgfSBmcm9tICcuL0RvY3NMaW5rJztcblxuZXhwb3J0IGZ1bmN0aW9uIFNpZGViYXIoKSB7XG4gIGNvbnN0IHsgc2lkZWJhciB9ID0gdXNlRG9jdW1lbnRhdGlvbkNvbnRleHQoKS5jb25maWc7XG5cbiAgcmV0dXJuIChcbiAgICA8bmF2PlxuICAgICAgPHVsIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTYwMCBkYXJrOnRleHQtZ3JheS0zMDBcIj5cbiAgICAgICAge3NpZGViYXIubWFwKChbdGl0bGUsIHVybE9yQ2hpbGRyZW5dKSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiB1cmxPckNoaWxkcmVuID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPGxpIGtleT17dXJsT3JDaGlsZHJlbn0+XG4gICAgICAgICAgICAgICAgPERvY3NMaW5rXG4gICAgICAgICAgICAgICAgICBlbmQ9e3VybE9yQ2hpbGRyZW4gPT09ICcvJ31cbiAgICAgICAgICAgICAgICAgIHRvPXt1cmxPckNoaWxkcmVufVxuICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPXsoeyBpc0FjdGl2ZSB9KSA9PlxuICAgICAgICAgICAgICAgICAgICBjeCgnYmxvY2sgbXktMicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAnaG92ZXI6dGV4dC1ncmF5LTgwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS0xMDAnOiAhaXNBY3RpdmUsXG4gICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZG9jcy10aGVtZSBmb250LW1lZGl1bSBib3JkZXItZG9jcy10aGVtZSc6IGlzQWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICA8L0RvY3NMaW5rPlxuICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGxpIGtleT17dGl0bGV9IGNsYXNzTmFtZT1cIm10LTQgZmlyc3Q6bXQtMCBtYi00XCI+XG4gICAgICAgICAgICAgIDxoNSBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktOTAwIGRhcms6dGV4dC1ncmF5LTIwMCBmb250LXNlbWlib2xkIHRyYWNraW5nLXdpZGUgcGItM1wiPlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgPC9oNT5cbiAgICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImJvcmRlci1sIGJvcmRlci1ncmF5LTEwMCBkYXJrOmJvcmRlci1ncmF5LTcwMCBzcGFjZS15LTJcIj5cbiAgICAgICAgICAgICAgICB7dXJsT3JDaGlsZHJlbi5tYXAoKFt0aXRsZSwgdXJsXSkgPT4gKFxuICAgICAgICAgICAgICAgICAgPGxpIGtleT17dXJsfT5cbiAgICAgICAgICAgICAgICAgICAgPERvY3NMaW5rXG4gICAgICAgICAgICAgICAgICAgICAgZW5kPXt1cmwgPT09ICcvJ31cbiAgICAgICAgICAgICAgICAgICAgICB0bz17dXJsfVxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17KHsgaXNBY3RpdmUgfSkgPT5cbiAgICAgICAgICAgICAgICAgICAgICAgIGN4KCdibG9jayBwbC00IC1tbC1weCBib3JkZXItbCBib3JkZXItdHJhbnNwYXJlbnQnLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICdob3Zlcjpib3JkZXItZ3JheS00MDAgaG92ZXI6dGV4dC1ncmF5LTgwMCBkYXJrOmhvdmVyOnRleHQtZ3JheS0xMDAnOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICFpc0FjdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ3RleHQtZG9jcy10aGVtZSBmb250LW1lZGl1bSAhYm9yZGVyLWRvY3MtdGhlbWUnOiBpc0FjdGl2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAge3RpdGxlfVxuICAgICAgICAgICAgICAgICAgICA8L0RvY3NMaW5rPlxuICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L3VsPlxuICAgIDwvbmF2PlxuICApO1xufVxuIiwgImltcG9ydCBDb2xvciBmcm9tICdjb2xvcic7XG5pbXBvcnQgeyB1c2VEb2N1bWVudGF0aW9uQ29udGV4dCB9IGZyb20gJ34vY29udGV4dCc7XG5pbXBvcnQgeyBkZWZhdWx0Q29uZmlnIH0gZnJvbSAnfi91dGlscy9jb25maWcnO1xuXG50eXBlIFZhcmlhbnQgPSAnYmFzZScgfCAnZGFyaycgfCAnbGlnaHQnO1xuXG4vLyBUT0RPIHBhc3MgY29uZmlnXG5leHBvcnQgZnVuY3Rpb24gVGhlbWUoKSB7XG4gIGNvbnN0IHRoZW1lID0gdXNlRG9jdW1lbnRhdGlvbkNvbnRleHQoKS5jb25maWcudGhlbWU7XG5cbiAgbGV0IGNvbG9yOiBDb2xvcjtcbiAgdHJ5IHtcbiAgICBjb2xvciA9IENvbG9yKHRoZW1lKTtcbiAgfSBjYXRjaCB7XG4gICAgY29sb3IgPSBDb2xvcihkZWZhdWx0Q29uZmlnLnRoZW1lKTtcbiAgfVxuXG4gIGNvbnN0IHZhcmlhbnRzOiB7IFtrZXkgaW4gVmFyaWFudF06IHN0cmluZyB9ID0ge1xuICAgIGJhc2U6IGNvbG9yLmhleCgpLnRvU3RyaW5nKCksXG4gICAgZGFyazogY29sb3IuZGFya2VuKDAuMikuaGV4KCkudG9TdHJpbmcoKSxcbiAgICBsaWdodDogY29sb3IubGlnaHRlbigwLjIpLmhleCgpLnRvU3RyaW5nKCksXG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8c2NyaXB0XG4gICAgICBkYW5nZXJvdXNseVNldElubmVySFRNTD17e1xuICAgICAgICBfX2h0bWw6IGBcbiAgICAgICAgICBjb25zdCByb290ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICAgIHJvb3Quc3R5bGUuc2V0UHJvcGVydHkoJy0tdGhlbWUtY29sb3InLCAnJHt2YXJpYW50cy5iYXNlfScpO1xuICAgICAgICAgIHJvb3Quc3R5bGUuc2V0UHJvcGVydHkoJy0tdGhlbWUtY29sb3ItZGFyaycsICcke3ZhcmlhbnRzLmRhcmt9Jyk7XG4gICAgICAgICAgcm9vdC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS10aGVtZS1jb2xvci1saWdodCcsICcke3ZhcmlhbnRzLmxpZ2h0fScpO1xuICAgICAgICAgIHJvb3Quc3R5bGUuc2V0UHJvcGVydHkoJy0tZG9jc2VhcmNoLXByaW1hcnktY29sb3InLCAnLS12YXIoLS10aGVtZS1jb2xvciknKTtcbiAgICAgIGAsXG4gICAgICB9fVxuICAgIC8+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgY3JlYXRlRWxlbWVudCwgRGV0YWlsZWRIVE1MUHJvcHMgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7IERvY3NMaW5rIH0gZnJvbSAnLi4vRG9jc0xpbmsnO1xuaW1wb3J0IHsgWW91VHViZSB9IGZyb20gJy4vWW91VHViZSc7XG5pbXBvcnQgeyBJbWFnZSB9IGZyb20gJy4vSW1hZ2UnO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tICcuL1RhYmxlJztcbmltcG9ydCB7IFByZSB9IGZyb20gJy4vUHJlJztcbmltcG9ydCB7IFRhYnMsIFRhYkl0ZW0gfSBmcm9tICcuL1RhYnMnO1xuXG5mdW5jdGlvbiBBbmNob3IoXG4gIHByb3BzOiBEZXRhaWxlZEhUTUxQcm9wczxSZWFjdC5BbmNob3JIVE1MQXR0cmlidXRlczxIVE1MQW5jaG9yRWxlbWVudD4sIEhUTUxBbmNob3JFbGVtZW50Pixcbikge1xuICByZXR1cm4gKFxuICAgIDxEb2NzTGlua1xuICAgICAgdG89e3Byb3BzLmhyZWYgfHwgJyd9XG4gICAgICBjbGFzc05hbWU9XCJuby11bmRlcmxpbmUgYm9yZGVyLWIgYm9yZGVyLWRvY3MtdGhlbWUgaG92ZXI6Ym9yZGVyLWItMlwiXG4gICAgPlxuICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgIDwvRG9jc0xpbms+XG4gICk7XG59XG5cbnR5cGUgSFRNTEhlYWRpbmdQcm9wcyA9IERldGFpbGVkSFRNTFByb3BzPFxuICBSZWFjdC5IVE1MQXR0cmlidXRlczxIVE1MSGVhZGluZ0VsZW1lbnQ+LFxuICBIVE1MSGVhZGluZ0VsZW1lbnRcbj47XG5cbmludGVyZmFjZSBIZWFkaW5nUHJvcHMgZXh0ZW5kcyBIVE1MSGVhZGluZ1Byb3BzIHtcbiAgdHlwZTogJ2gxJyB8ICdoMicgfCAnaDMnIHwgJ2g0JyB8ICdoNScgfCAnaDYnO1xufVxuXG5mdW5jdGlvbiBIZWFkaW5nKHsgdHlwZSwgaWQsIGNoaWxkcmVuLCAuLi5wcm9wcyB9OiBIZWFkaW5nUHJvcHMpIHtcbiAgcmV0dXJuIGNyZWF0ZUVsZW1lbnQodHlwZSwge1xuICAgIC4uLnByb3BzLFxuICAgIGNsYXNzTmFtZTogY3goJ3JlbGF0aXZlJywgcHJvcHMuY2xhc3NOYW1lKSxcbiAgICBjaGlsZHJlbjpcbiAgICAgIHR5cGUgPT09ICdoMScgPyAoXG4gICAgICAgIGNoaWxkcmVuXG4gICAgICApIDogKFxuICAgICAgICA8PlxuICAgICAgICAgIDxkaXYgaWQ9e2lkfSBjbGFzc05hbWU9XCJhYnNvbHV0ZSAtdG9wLTE2IG9wYWNpdHktMCBwb2ludGVyLWV2ZW50cy1ub25lXCIgLz5cbiAgICAgICAgICA8YVxuICAgICAgICAgICAgaHJlZj17YCMke2lkfWB9XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJiZWZvcmU6Y29udGVudC1bJyMnXSBiZWZvcmU6YWJzb2x1dGUgYmVmb3JlOi1sZWZ0LTYgYmVmb3JlOnRleHQtZG9jcy10aGVtZSBuby11bmRlcmxpbmVcIlxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW4+e2NoaWxkcmVufTwvc3Bhbj5cbiAgICAgICAgPC8+XG4gICAgICApLFxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICBpbWc6IEltYWdlLFxuICB0YWJsZTogVGFibGUsXG4gIHByZTogUHJlLFxuICBhOiBBbmNob3IsXG4gIGgxOiAocHJvcHM6IEhUTUxIZWFkaW5nUHJvcHMpID0+IDxIZWFkaW5nIHsuLi5wcm9wc30gdHlwZT1cImgxXCIgLz4sXG4gIGgyOiAocHJvcHM6IEhUTUxIZWFkaW5nUHJvcHMpID0+IDxIZWFkaW5nIHsuLi5wcm9wc30gdHlwZT1cImgyXCIgLz4sXG4gIGgzOiAocHJvcHM6IEhUTUxIZWFkaW5nUHJvcHMpID0+IDxIZWFkaW5nIHsuLi5wcm9wc30gdHlwZT1cImgzXCIgLz4sXG4gIGg0OiAocHJvcHM6IEhUTUxIZWFkaW5nUHJvcHMpID0+IDxIZWFkaW5nIHsuLi5wcm9wc30gdHlwZT1cImg0XCIgLz4sXG4gIGg1OiAocHJvcHM6IEhUTUxIZWFkaW5nUHJvcHMpID0+IDxIZWFkaW5nIHsuLi5wcm9wc30gdHlwZT1cImg1XCIgLz4sXG4gIGg2OiAocHJvcHM6IEhUTUxIZWFkaW5nUHJvcHMpID0+IDxIZWFkaW5nIHsuLi5wcm9wc30gdHlwZT1cImg2XCIgLz4sXG4gIEhlYWRpbmcsXG4gIFlvdVR1YmUsXG4gIEltYWdlLFxuICBUYWJzLFxuICBUYWJJdGVtLFxufTtcbiIsICJleHBvcnQgdHlwZSBZb3VUdWJlUHJvcHMgPSB7XG4gIGlkOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gWW91VHViZSh7IGlkIH06IFlvdVR1YmVQcm9wcykge1xuICBpZiAoIWlkKSB7XG4gICAgcmV0dXJuIDxkaXYgLz47XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxpZnJhbWVcbiAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBhc3BlY3QtdmlkZW8gcm91bmRlZCBvdmVyZmxvdy1oaWRkZW5cIlxuICAgICAgc3JjPXtgaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJHtpZH1gfVxuICAgICAgYWxsb3dGdWxsU2NyZWVuXG4gICAgICBhbGxvdz1cImFjY2VsZXJvbWV0ZXI7IGF1dG9wbGF5OyBlbmNyeXB0ZWQtbWVkaWE7IGd5cm9zY29wZTsgcGljdHVyZS1pbi1waWN0dXJlXCJcbiAgICAvPlxuICApO1xufVxuIiwgImltcG9ydCB7IENTU1Byb3BlcnRpZXMsIERldGFpbGVkSFRNTFByb3BzLCB1c2VDYWxsYmFjaywgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VJbWFnZVBhdGggfSBmcm9tICd+L2NvbnRleHQnO1xuaW1wb3J0IHsgQ29udHJvbGxlZCBhcyBDb250cm9sbGVkWm9vbSB9IGZyb20gJ3JlYWN0LW1lZGl1bS1pbWFnZS16b29tJztcbmltcG9ydCB7IERvY3NMaW5rIH0gZnJvbSAnLi4vRG9jc0xpbmsnO1xuXG5pbnRlcmZhY2UgSW1hZ2VQcm9wc1xuICBleHRlbmRzIERldGFpbGVkSFRNTFByb3BzPFJlYWN0LkltZ0hUTUxBdHRyaWJ1dGVzPEhUTUxJbWFnZUVsZW1lbnQ+LCBIVE1MSW1hZ2VFbGVtZW50PiB7XG4gIGhlaWdodD86IHN0cmluZyB8IG51bWJlcjtcbiAgd2lkdGg/OiBzdHJpbmcgfCBudW1iZXI7XG4gIGFsdD86IHN0cmluZztcbiAgc3JjPzogc3RyaW5nO1xuICBjYXB0aW9uPzogc3RyaW5nO1xuICB6b29tPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEltYWdlKHsgem9vbSwgY2FwdGlvbiwgLi4ucHJvcHMgfTogSW1hZ2VQcm9wcyAmIHsgaHJlZj86IHN0cmluZyB9KTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBzcmMgPSB1c2VJbWFnZVBhdGgocHJvcHMuc3JjIHx8ICcnKTtcblxuICBjb25zdCB6b29tRW5hYmxlZCA9IHpvb207XG5cbiAgLy8gaWYgKCFzcmMpIHtcbiAgLy8gICAgIHJldHVybiA8PjwvPjtcbiAgLy8gfVxuXG4gIGNvbnN0IHdyYXBwZXIgPSAoY2hpbGQ6IFJlYWN0LlJlYWN0RWxlbWVudCkgPT5cbiAgICBwcm9wcy5ocmVmXG4gICAgICA/IHdpdGhIcmVmKHdpdGhGaWd1cmUoem9vbUVuYWJsZWQgPyB3aXRoWm9vbShjaGlsZCkgOiBjaGlsZCwgY2FwdGlvbiksIHByb3BzLmhyZWYpXG4gICAgICA6IHdpdGhGaWd1cmUoem9vbUVuYWJsZWQgPyB3aXRoWm9vbShjaGlsZCkgOiBjaGlsZCwgY2FwdGlvbik7XG5cbiAgY29uc3Qgc3R5bGU6IENTU1Byb3BlcnRpZXMgPSB7XG4gICAgaGVpZ2h0OiBwcm9wcy5oZWlnaHQgPyBwYXJzZUludChgJHtwcm9wcy5oZWlnaHR9YCkgOiAnaW5oZXJpdCcsXG4gICAgd2lkdGg6IHByb3BzLndpZHRoID8gcGFyc2VJbnQoYCR7cHJvcHMud2lkdGh9YCkgOiAnaW5oZXJpdCcsXG4gIH07XG5cbiAgcmV0dXJuIHdyYXBwZXIoXG4gICAgPGltZ1xuICAgICAgY2xhc3NOYW1lPVwibXgtYXV0b1wiXG4gICAgICB7Li4ucHJvcHN9XG4gICAgICBzdHlsZT17c3R5bGV9XG4gICAgICBzcmM9e3NyY31cbiAgICAgIGFsdD17cHJvcHMuYWx0ID8/ICcnfVxuICAgICAgbG9hZGluZz1cImxhenlcIlxuICAgIC8+LFxuICApO1xufVxuXG5mdW5jdGlvbiB3aXRoSHJlZihjaGlsZDogUmVhY3QuUmVhY3RFbGVtZW50LCBocmVmOiBzdHJpbmcpIHtcbiAgcmV0dXJuIDxEb2NzTGluayB0bz17aHJlZn0+e2NoaWxkfTwvRG9jc0xpbms+O1xufVxuXG5mdW5jdGlvbiB3aXRoRmlndXJlKGNoaWxkOiBSZWFjdC5SZWFjdEVsZW1lbnQsIGNhcHRpb24/OiBzdHJpbmcpIHtcbiAgcmV0dXJuIChcbiAgICA8ZmlndXJlPlxuICAgICAge2NoaWxkfVxuICAgICAgeyEhY2FwdGlvbiAmJiAoXG4gICAgICAgIDxmaWdjYXB0aW9uIGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHRleHQtc20gaXRhbGljIG15LTMgZGFyazp0ZXh0LXdoaXRlXCI+XG4gICAgICAgICAge2NhcHRpb259XG4gICAgICAgIDwvZmlnY2FwdGlvbj5cbiAgICAgICl9XG4gICAgPC9maWd1cmU+XG4gICk7XG59XG5cbmZ1bmN0aW9uIHdpdGhab29tKGNoaWxkOiBSZWFjdC5SZWFjdEVsZW1lbnQpIHtcbiAgY29uc3QgW2lzWm9vbWVkLCBzZXRJc1pvb21lZF0gPSB1c2VTdGF0ZShmYWxzZSk7XG5cbiAgY29uc3QgaGFuZGxlWm9vbUNoYW5nZSA9IHVzZUNhbGxiYWNrKHNob3VsZFpvb20gPT4ge1xuICAgIHNldElzWm9vbWVkKHNob3VsZFpvb20pO1xuICB9LCBbXSk7XG4gIHJldHVybiAoXG4gICAgPENvbnRyb2xsZWRab29tXG4gICAgICB3cmFwU3R5bGU9e1xuICAgICAgICBpc1pvb21lZFxuICAgICAgICAgID8geyB3aWR0aDogJzEwMCUnLCBoZWlnaHQ6ICdhdXRvJywgdHJhbnNpdGlvbjogJ2hlaWdodCBlYXNlLW91dCAgMC41cycgfVxuICAgICAgICAgIDogeyB0cmFuc2l0aW9uOiAnaGVpZ2h0IGVhc2Utb3V0ICAwLjVzJyB9XG4gICAgICB9XG4gICAgICBpc1pvb21lZD17aXNab29tZWR9XG4gICAgICBvblpvb21DaGFuZ2U9e2hhbmRsZVpvb21DaGFuZ2V9XG4gICAgPlxuICAgICAge2NoaWxkfVxuICAgIDwvQ29udHJvbGxlZFpvb20+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgRGV0YWlsZWRIVE1MUHJvcHMgfSBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBUYWJsZShcbiAgcHJvcHM6IERldGFpbGVkSFRNTFByb3BzPFJlYWN0LkltZ0hUTUxBdHRyaWJ1dGVzPEhUTUxUYWJsZUVsZW1lbnQ+LCBIVE1MVGFibGVFbGVtZW50Pixcbikge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwib3ZlcmZsb3ctc2Nyb2xsIHNtOm92ZXJmbG93LXZpc2libGVcIj5cbiAgICAgIDx0YWJsZSB7Li4ucHJvcHN9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iLCAiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCBDb3B5VG9DbGlwYm9hcmQgZnJvbSAncmVhY3QtY29weS10by1jbGlwYm9hcmQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByZVByb3BzIGV4dGVuZHMgUmVhY3QuSFRNTFByb3BzPEhUTUxQcmVFbGVtZW50PiB7XG4gIHRpdGxlPzogc3RyaW5nO1xuICByYXc6IHN0cmluZztcbiAgaHRtbDogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gUHJlKHByb3BzOiBQcmVQcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgW2NvcGllZCwgc2V0Q29waWVkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KGZhbHNlKTtcbiAgbGV0IHRpbWVvdXQ6IE5vZGVKUy5UaW1lb3V0O1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGNvcGllZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBzZXRDb3BpZWQoZmFsc2UpO1xuICAgICAgfSwgMjAwMCk7XG4gICAgfVxuICB9LCBbY29waWVkXSk7XG5cbiAgLy8gRXh0cmFjdCB0aGUgZGF0YSBhdHRyaWJ1dGVzIGZyb20gdGhlIGNvbXBvbmVudFxuICBjb25zdCB0aXRsZSA9IHByb3BzLnRpdGxlO1xuICBjb25zdCByYXcgPSBkZWNvZGVVUklDb21wb25lbnQoZW5jb2RlVVJJQ29tcG9uZW50KHByb3BzLnJhdykpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHshIXRpdGxlICYmIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3VuZGVkLXRyIHJvdW5kZWQtdGwgZm9udC1tb25vIGZvbnQtYm9sZCB0ZXh0LWdyYXktMzAwIHRleHQtc20gcHgtNCBweS0yIGJvcmRlci1iIGJvcmRlci1ncmF5LTcwMCBiZy1bIzI0MjkyZV1cIj5cbiAgICAgICAgICB7dGl0bGV9XG4gICAgICAgIDwvZGl2PlxuICAgICAgKX1cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmVsYXRpdmUgZ3JvdXBcIj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ3NoaWtpLXBhcmVudCcsIHtcbiAgICAgICAgICAgICdzaGlraS1wYXJlbnQtdGl0bGUnOiAhIXRpdGxlLFxuICAgICAgICAgIH0pfVxuICAgICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7IF9faHRtbDogcHJvcHMuaHRtbCB9fVxuICAgICAgICAvPlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICdvcGFjaXR5LTAgZ3JvdXAtaG92ZXI6b3BhY2l0eS0xMDAgdHJhbnNpdGlvbi1vcGFjaXR5IGFic29sdXRlIHRvcC0wIHJpZ2h0LTAgbXItMiBtdC0yJyxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgJ29wYWNpdHktMTAwJzogY29waWVkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICApfVxuICAgICAgICA+XG4gICAgICAgICAgPENvcHlUb0NsaXBib2FyZCB0ZXh0PXtyYXd9IG9uQ29weT17KCkgPT4gc2V0Q29waWVkKHRydWUpfT5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwidGV4dC13aGl0ZSB0ZXh0LXhzIGZvbnQtbW9ubyBiZy1ibGFjayBob3ZlcjpiZy1ibGFjay80MCB0cmFuc2l0aW9uLWNvbG9ycyBweC0zIHB5LTIgcm91bmRlZC1sZ1wiPlxuICAgICAgICAgICAgICB7Y29waWVkID8gJ0NvcGllZCcgOiAnQ29weSd9XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8L0NvcHlUb0NsaXBib2FyZD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8Lz5cbiAgKTtcbn1cbiIsICJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSwgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5cbi8vIFRoZSBwcmVmaXggd2l0aGluIGxvY2FsIHN0b3JhZ2UgZm9yIGFsbCA8VGFicyAvPiBjb21wb25lbnRzXG5jb25zdCBQUkVGSVggPSAnZG9jcy5wYWdlOnRhYnMnO1xuXG50eXBlIENvbnRleHRQcm9wcyA9IHtcbiAgdGFiczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfTtcbiAgdXBkYXRlVGFiOiAoa2V5OiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBudWxsKSA9PiB2b2lkO1xuICBoYXNoOiBzdHJpbmc7XG59O1xuXG4vLyBDb250ZXh0IGhvbGRpbmcgYWxsIGxvY2FsIHN0b3JhZ2UgaXRlbXMgZm9yIHRoZSBQUkVGSVhcbmNvbnN0IENvbnRleHQgPSBjcmVhdGVDb250ZXh0PENvbnRleHRQcm9wcz4oe1xuICB0YWJzOiB7fSxcbiAgdXBkYXRlVGFiOiAoKSA9PiB7XG4gICAgcmV0dXJuO1xuICB9LFxuICBoYXNoOiAnJyxcbn0pO1xuXG4vLyBQcm92aWRlcyBjb250ZXh0IHRvIGFsbCA8VGFicyAvPiBjb21wb25lbnRzIHRvIGFsbG93IGZvciBsaXN0ZW5pbmcgdG9cbi8vIGNoYW5nZXMgb24gc3luY2hyb25pemVkIHRhYnMuXG5leHBvcnQgZnVuY3Rpb24gVGFic0NvbnRleHQoe1xuICBjaGlsZHJlbixcbiAgaGFzaCxcbn06IHtcbiAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZTtcbiAgaGFzaDogc3RyaW5nO1xufSk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgW3RhYnMsIHNldFRhYnNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgc3RyaW5nPj4oe30pO1xuXG4gIGNvbnN0IHVwZGF0ZVRhYiA9IHVzZUNhbGxiYWNrKChrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IG51bGwpID0+IHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHNldFRhYnMoJCA9PiAoe1xuICAgICAgICAuLi4kLFxuICAgICAgICBba2V5XTogdmFsdWUsXG4gICAgICB9KSk7XG4gICAgfVxuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8Q29udGV4dC5Qcm92aWRlclxuICAgICAgdmFsdWU9e3tcbiAgICAgICAgdGFicyxcbiAgICAgICAgdXBkYXRlVGFiLFxuICAgICAgICBoYXNoLFxuICAgICAgfX1cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9Db250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuXG4vLyBIb29rIHdoaWNoIHByb3ZpZGVzIGFjY2VzcyB0byBhbnkgY3VycmVudCBzdG9yZWQgbG9jYWwgc3RvcmFnZSBrZXlcbi8vIGZvciBhIHByb3ZpZGVkIGdyb3VwSWQuIEFsc28gYWNjZXB0cyBhIGxvY2FsIHN0YXRlIGRpc3BhdGNoIGFuZCB1cGRhdGVzIGl0LlxuXG4vLyBSZW1vdmUgb25jZSBjb21wb25lbnQgd29ya2luZyBhZ2FpblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuZnVuY3Rpb24gdXNlVGFiU3luY2hyb25pemF0aW9uKFxuICBncm91cElkOiBzdHJpbmcsXG4gIHNldFN0YXRlOiBSZWFjdC5EaXNwYXRjaDxSZWFjdC5TZXRTdGF0ZUFjdGlvbjxzdHJpbmcgfCBudWxsPj4sXG4pOiAodGFiOiBzdHJpbmcpID0+IHZvaWQge1xuICBjb25zdCB7IHRhYnMsIHVwZGF0ZVRhYiwgaGFzaCB9ID0gdXNlQ29udGV4dChDb250ZXh0KTtcblxuICBjb25zdCBrZXkgPSBgJHtQUkVGSVh9OiR7aGFzaH06JHtncm91cElkfWA7XG4gIGNvbnN0IHZhbHVlID0gdGFic1trZXldO1xuXG4gIGNvbnN0IHN5bmNocm9uaXplID0gdXNlQ2FsbGJhY2soXG4gICAgKHRhYjogc3RyaW5nKSA9PiB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHRhYik7XG4gICAgICB1cGRhdGVUYWIoa2V5LCB0YWIpO1xuICAgIH0sXG4gICAgW2tleSwgZ3JvdXBJZF0sXG4gICk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBpbml0aWFsVmFsdWUgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgIHVwZGF0ZVRhYihrZXksIGluaXRpYWxWYWx1ZSk7XG4gIH0sIFtncm91cElkXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoZ3JvdXBJZCAmJiB2YWx1ZSkge1xuICAgICAgc2V0U3RhdGUodmFsdWUpO1xuICAgIH1cbiAgfSwgW2dyb3VwSWQsIHZhbHVlXSk7XG5cbiAgcmV0dXJuIHN5bmNocm9uaXplO1xufVxuXG50eXBlIFRhYkl0ZW1FbGVtZW50ID0gUmVhY3QuUmVhY3RFbGVtZW50PHtcbiAgY2hpbGRyZW46IFJlYWN0LlJlYWN0Tm9kZTtcbiAgbWR4VHlwZTogc3RyaW5nO1xuICBwYXJlbnROYW1lOiBzdHJpbmc7XG4gIHZhbHVlOiBzdHJpbmc7XG59PjtcblxudHlwZSBUYWJWYWx1ZSA9IHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdmFsdWU6IHN0cmluZztcbn07XG5cbnR5cGUgVGFic1Byb3BzID0ge1xuICBncm91cElkPzogc3RyaW5nO1xuICBkZWZhdWx0VmFsdWU/OiBzdHJpbmc7XG4gIHZhbHVlczogVGFiVmFsdWVbXTtcbiAgY2hpbGRyZW46IFJlYWN0LlJlYWN0RWxlbWVudDtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufTtcblxuLy8gTURYIHYyIGhhcyBhIGJ1ZyB3aGVyZSBpdGVtcyBhcmUgd3JhcHBlZCB3aXRoaW4gYHBgIHRhZ3MuXG4vLyBUaGlzIGZ1bmN0aW9uIHNjYW5zIHRoZSBjaGlsZHJlbiBmb3IgYWxsIGBUYWJJdGVtYCBjb21wb25lbnRzXG4vLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL21keC1qcy9tZHgvaXNzdWVzLzE0NTEjaXNzdWVjb21tZW50LTg2MzEzODQ2M1xuZnVuY3Rpb24gZXh0cmFjdFRhYkl0ZW1zKGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGUpOiBUYWJJdGVtRWxlbWVudFtdIHtcbiAgbGV0IGl0ZW1zOiBUYWJJdGVtRWxlbWVudFtdID0gW107XG5cbiAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaChjaGlsZHJlbiwgY2hpbGQgPT4ge1xuICAgIGlmIChSZWFjdC5pc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgIGlmIChjaGlsZC5wcm9wcy5jaGlsZHJlbikge1xuICAgICAgICBpdGVtcyA9IFsuLi5pdGVtcywgLi4uZXh0cmFjdFRhYkl0ZW1zKGNoaWxkLnByb3BzLmNoaWxkcmVuKV07XG4gICAgICB9XG5cbiAgICAgIC8vIEB0cy1pZ25vcmUgYWNjZXNzIHByaXZhdGUgbmFtZSB3aGljaCB3b3JrcyBvbiBwcm9kdWN0aW9uXG4gICAgICBjb25zdCBuYW1lID0gY2hpbGQudHlwZS5uYW1lO1xuXG4gICAgICBpZiAobmFtZSA9PT0gJ1RhYkl0ZW0nKSB7XG4gICAgICAgIGl0ZW1zID0gWy4uLml0ZW1zLCBjaGlsZF07XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gaXRlbXM7XG59XG5cbi8vIFJlbW92ZSBvbmNlIGNvbXBvbmVudCB3b3JraW5nIGFnYWluLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuZXhwb3J0IGZ1bmN0aW9uIFRhYnMocHJvcHM6IFRhYnNQcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgaWYgKCFwcm9wcy52YWx1ZXM/Lmxlbmd0aCkge1xuICAgIGNvbnNvbGUud2FybignPFRhYnMgLz46IEV4cGVjdGVkIGEgYHZhbHVlc2AgYXJyYXkuJyk7XG4gICAgcmV0dXJuIDw+PC8+O1xuICB9XG5cbiAgLy8gTURYIHdyYXBzIGNvbXBvbmVudHMgaW4gYSBgcGAgdGFnOiBodHRwczovL2dpdGh1Yi5jb20vbWR4LWpzL21keC9pc3N1ZXMvMTQ1MVxuICBjb25zdCB0YWJzID0gZXh0cmFjdFRhYkl0ZW1zKHByb3BzLmNoaWxkcmVuKTtcblxuICBjb25zdCBbc2VsZWN0ZWQsIHNldFNlbGVjdGVkXSA9IHVzZVN0YXRlPHN0cmluZyB8IG51bGw+KCgpID0+IHtcbiAgICBpZiAocHJvcHMuZ3JvdXBJZCkgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIHByb3BzLmRlZmF1bHRWYWx1ZSB8fCBwcm9wcy52YWx1ZXNbMF0udmFsdWU7XG4gIH0pO1xuXG4gIGNvbnN0IHN5bmMgPSB1c2VUYWJTeW5jaHJvbml6YXRpb24ocHJvcHMuZ3JvdXBJZCA/PyAnJywgc2V0U2VsZWN0ZWQpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJtYi02IGJvcmRlciBkYXJrOmJvcmRlci1ncmF5LTcwMCByb3VuZGVkXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggcC0yXCI+XG4gICAgICAgIHtwcm9wcy52YWx1ZXMubWFwKCh7IGxhYmVsLCB2YWx1ZSB9KSA9PiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgcm9sZT1cImJ1dHRvblwiXG4gICAgICAgICAgICBrZXk9e3ZhbHVlfVxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICAgJ3B4LTYgcHktNSBmbGV4IGl0ZW1zLWNlbnRlciBib3JkZXItYi0yIGZvbnQtYm9sZCBob3ZlcjpiZy1ncmF5LTUwMCBob3ZlcjpiZy1vcGFjaXR5LTEwIHJvdW5kZWQnLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ2JvcmRlci1kb2NzLXRoZW1lJzogdmFsdWUgPT09IHNlbGVjdGVkLFxuICAgICAgICAgICAgICAgICdib3JkZXItdHJhbnNwYXJlbnQnOiB2YWx1ZSAhPT0gc2VsZWN0ZWQsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICBzZXRTZWxlY3RlZCh2YWx1ZSk7XG5cbiAgICAgICAgICAgICAgaWYgKHByb3BzLmdyb3VwSWQpIHtcbiAgICAgICAgICAgICAgICBzeW5jKHZhbHVlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7bGFiZWx9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICkpfVxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInAtNlwiPlxuICAgICAgICA8c3R5bGU+e2BcbiAgICAgICAgICBkaXYudGFiW2RhdGEtYWN0aXZlPSd0cnVlJ10ge1xuICAgICAgICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgICAgICAgfVxuICAgICAgICBgfTwvc3R5bGU+XG4gICAgICAgIHt0YWJzLm1hcChjaGlsZCA9PiB7XG4gICAgICAgICAgY29uc3QgdGFiID0gcHJvcHMudmFsdWVzLmZpbmQodiA9PiB2LnZhbHVlID09PSBjaGlsZC5wcm9wcy52YWx1ZSk7XG5cbiAgICAgICAgICAvLyBFbnN1cmUgdGhlIFRhYkl0ZW0gYWN0dWFsbHkgbWF0Y2hlcyB0aGUgdmFsdWVzIHByb3ZpZGVkXG4gICAgICAgICAgaWYgKCF0YWIpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRhYiBoaWRkZW5cIlxuICAgICAgICAgICAgICBrZXk9e3RhYi52YWx1ZX1cbiAgICAgICAgICAgICAgZGF0YS10YWI9e3RhYi52YWx1ZX1cbiAgICAgICAgICAgICAgZGF0YS1hY3RpdmU9eyhzZWxlY3RlZCA9PT0gdGFiLnZhbHVlKS50b1N0cmluZygpfVxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICB7Y2hpbGR9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApO1xuICAgICAgICB9KX1cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG50eXBlIFRhYkl0ZW1Qcm9wcyA9IHtcbiAgaWQ6IHN0cmluZztcbiAgY2hpbGRyZW46IEpTWC5FbGVtZW50IHwgSlNYLkVsZW1lbnRbXTtcbn07XG5cbmV4cG9ydCBjb25zdCBUYWJJdGVtOiBSZWFjdC5GQzxUYWJJdGVtUHJvcHM+ID0gKHByb3BzOiBUYWJJdGVtUHJvcHMpID0+IHtcbiAgcmV0dXJuIDw+e3Byb3BzLmNoaWxkcmVufTwvPjtcbn07XG4iLCAiaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZURvY3VtZW50YXRpb25Db250ZXh0IH0gZnJvbSBcIn4vY29udGV4dFwiO1xuXG5leHBvcnQgZnVuY3Rpb24gU2Nyb2xsU3B5KCkge1xuICBjb25zdCB7IGhlYWRpbmdzIH0gPSB1c2VEb2N1bWVudGF0aW9uQ29udGV4dCgpO1xuICBjb25zdCBbYWN0aXZlLCBzZXRBY3RpdmVdID0gdXNlU3RhdGU8c3RyaW5nPignJyk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWhlYWRpbmdzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVE9ETyBpbXByb3ZlIG9uY2Ugd3JhcHBlZCBoZWFkaW5nIHNlY3Rpb25zIGFyZSBhcHBsaWVkXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICAgIGZvciAobGV0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coZW50cnkuaW50ZXJzZWN0aW9uUmF0aW8pXG4gICAgICAgIGlmIChlbnRyeS5pc0ludGVyc2VjdGluZykge1xuICAgICAgICAgIGNvbnN0IGlkID0gZW50cnkudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKTtcbiAgICAgICAgICBzZXRBY3RpdmUoaWQhKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIC8vIHJvb3RNYXJnaW46ICctMTAwcHggMHB4IDBweCAwcHgnLFxuICAgICAgdGhyZXNob2xkOiAwLjI1LFxuICAgIH0pO1xuXG4gICAgaGVhZGluZ3MuZm9yRWFjaCgoeyBpZCB9KSA9PiB7XG4gICAgICAvLyBjb25zdCBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCMke2lkfWApXG4gICAgICAvLyBpZiAoZWwpIG9ic2VydmVyLm9ic2VydmUoZWwpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHNldEFjdGl2ZSgnJylcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuICAgIH07XG4gIH0sIFtoZWFkaW5nc10pO1xuXG4gIGlmICghaGVhZGluZ3MpIHtcbiAgICByZXR1cm4gPHVsIC8+XG4gIH1cblxuICBmdW5jdGlvbiBvbkNsaWNrKGlkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKVxuICAgIGNvbnN0IHNlY3Rpb25Ub3AgPSBlbD8uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIGNvbnN0IGN1cnJlbnRUb3AgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogc2VjdGlvblRvcCEgKyBjdXJyZW50VG9wIC0gMTAwLCBiZWhhdmlvcjogJ3Ntb290aCcgfSlcbiAgICBpZiAoaGlzdG9yeS5wdXNoU3RhdGUpIHtcbiAgICAgIGhpc3RvcnkucHVzaFN0YXRlKG51bGwsIGAjJHtpZH1gKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBsb2NhdGlvbi5oYXNoID0gYCMke2lkfWA7XG4gICAgfVxuICAgIHNldEFjdGl2ZShpZCEpO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8dWwgY2xhc3NOYW1lPVwidGV4dC1zbSBzcGFjZS15LTJcIj5cbiAgICAgIHtoZWFkaW5ncy5tYXAoaGVhZGluZyA9PiAoXG4gICAgICAgIDxsaVxuICAgICAgICAgIGtleT17aGVhZGluZy5pZH1cbiAgICAgICAgICBjbGFzc05hbWU9e2N4KHtcbiAgICAgICAgICAgICd0ZXh0LWRvY3MtdGhlbWUnOiBhY3RpdmUgPT09IGhlYWRpbmcuaWQsXG4gICAgICAgICAgfSl9XG4gICAgICAgID5cbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJjdXJzb3ItcG9pbnRlclwiIG9uQ2xpY2s9eygpID0+IG9uQ2xpY2soaGVhZGluZy5pZCl9ID57aGVhZGluZy50aXRsZX08L2E+XG4gICAgICAgIDwvbGk+XG4gICAgICApKX1cbiAgICA8L3VsPlxuICApO1xufVxuIiwgImltcG9ydCB7IE1ldGFGdW5jdGlvbiwgdXNlTG9hZGVyRGF0YSwgTGlua3NGdW5jdGlvbiwgdXNlQ2F0Y2ggfSBmcm9tICdyZW1peCc7XG5pbXBvcnQgeyBkZXRlY3QgfSBmcm9tICdkZXRlY3QtYnJvd3Nlcic7XG5cbmltcG9ydCB7IEZvb3RlciB9IGZyb20gJ34vY29tcG9uZW50cy9Gb290ZXInO1xuaW1wb3J0IGNvZGVIaWtlU3R5bGVzIGZyb20gJ0Bjb2RlLWhpa2UvbWR4L2Rpc3QvaW5kZXguY3NzJztcbmltcG9ydCB7XG4gICAgVGhyb3duQnVuZGxlRXJyb3IsXG4gICAgLy8gVGhyb3duRXJyb3IsXG4gICAgLy8gVGhyb3duTm90Rm91bmRFcnJvcixcbn0gZnJvbSAnLi4vbG9hZGVycy9kb2N1bWVudGF0aW9uLnNlcnZlcic7XG5pbXBvcnQgZG9jc2VhcmNoIGZyb20gJy4uL3N0eWxlcy9kb2NzZWFyY2guY3NzJztcbmltcG9ydCB7IEJhZFJlcXVlc3QsIE5vdEZvdW5kLCBQcmV2aWV3Tm90Rm91bmQsIFNlcnZlckVycm9yIH0gZnJvbSAnfi9jb21wb25lbnRzL0Vycm9ycyc7XG5pbXBvcnQgeyBHaXRIdWIgfSBmcm9tICd+L2NvbXBvbmVudHMvSWNvbnMnO1xuaW1wb3J0IHsgUHJldmlld01vZGVDb250ZXh0LCB1c2VEaXJlY3RvcnlTZWxlY3RvciwgdXNlUG9sbExvY2FsRG9jcyB9IGZyb20gJ34vdXRpbHMvbG9jYWwtcHJldmlldy1tb2RlJztcbmltcG9ydCBEb2N1bWVudGF0aW9uIGZyb20gJ34vY29tcG9uZW50cy9Eb2N1bWVudGF0aW9uJztcblxuZXhwb3J0IGxldCBsaW5rczogTGlua3NGdW5jdGlvbiA9ICgpID0+IHtcbiAgICByZXR1cm4gW1xuICAgICAgICB7IHJlbDogJ3N0eWxlc2hlZXQnLCBocmVmOiAnaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9AZG9jc2VhcmNoL2Nzc0BhbHBoYScgfSxcbiAgICAgICAgeyByZWw6ICdzdHlsZXNoZWV0JywgaHJlZjogZG9jc2VhcmNoIH0sXG4gICAgICAgIHsgcmVsOiAnc3R5bGVzaGVldCcsIGhyZWY6IGNvZGVIaWtlU3R5bGVzIH1cbiAgICBdO1xufTtcblxuZXhwb3J0IGNvbnN0IG1ldGE6IE1ldGFGdW5jdGlvbiA9ICgpID0+IHtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHRpdGxlOiAnZG9jcy5wYWdlIExvY2FsIFByZXZpZXcgTW9kZScgPz8gJycsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnJyxcbiAgICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTG9jYWxQcmV2aWV3KCkge1xuICAgIGNvbnN0IHsgc2VsZWN0LCBoYW5kbGVzLCBjb25maWdIYW5kbGUsIGVycm9yOiBkaXJlY3RvcnlFcnJvciB9ID0gdXNlRGlyZWN0b3J5U2VsZWN0b3IoKTtcbiAgICBjb25zdCBbZGF0YSwgdXJscywgcG9sbEVycm9yQ29kZV0gPSB1c2VQb2xsTG9jYWxEb2NzKGhhbmRsZXMsIGNvbmZpZ0hhbmRsZSwgNTAwKTtcblxuXG4gICAgLy8gVE9ETyBoYW5kbGUgNDAwIGVycm9yc1xuICAgIGlmIChkaXJlY3RvcnlFcnJvcikge1xuICAgICAgICByZXR1cm4gPFByZXZpZXdOb3RGb3VuZCBlcnJvcj0nJyAvPlxuICAgIH1cbiAgICBpZiAocG9sbEVycm9yQ29kZSkge1xuICAgICAgICByZXR1cm4gPFByZXZpZXdOb3RGb3VuZCBlcnJvcj0nJyAvPlxuICAgIH1cblxuICAgIGlmICghaGFuZGxlcyB8fCAhZGF0YSB8fCAhZGF0YS5jb2RlKSB7XG4gICAgICAgIHJldHVybiA8TGFuZGluZ1BhZ2Ugb25TZWxlY3Q9e3NlbGVjdH0gLz5cbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8UHJldmlld01vZGVDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXt7IGVuYWJsZWQ6IHRydWUsIG9uU2VsZWN0OiBzZWxlY3QsIGltYWdlVXJsczogdXJscyB9fT5cbiAgICAgICAgICAgIDxEb2N1bWVudGF0aW9uIGRhdGE9e2RhdGF9IC8+XG4gICAgICAgIDwvUHJldmlld01vZGVDb250ZXh0LlByb3ZpZGVyPlxuICAgIClcbn1cblxuXG5mdW5jdGlvbiBMYW5kaW5nUGFnZSh7IG9uU2VsZWN0IH06IHsgb25TZWxlY3Q6ICgpID0+IHZvaWQgfSk6IEpTWC5FbGVtZW50IHtcbiAgICBjb25zdCBicm93c2VyID0gZGV0ZWN0KCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRhcms6dGV4dC13aGl0ZVwiPlxuICAgICAgICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwicHktMTYgbGc6cHktMzIgaXRlbXMtY2VudGVyIHRleHQtY2VudGVyIHB4LTQgbGc6dGV4dC1sZWZ0XCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy02eGwgbXgtYXV0byB0cmFja2luZy13aWRlclwiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGxnOmp1c3RpZnktYmV0d2VlbiBtYi00IHNwYWNlLXgtNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlciBqdXN0aWZ5LXN0YXJ0IHNwYWNlLXgtNFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJmb250LWFudG9uIHRleHQtNHhsXCI+ZG9jcy5wYWdlPC9oMz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly9naXRodWIuY29tL2ludmVydGFzZS9kb2NzLnBhZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNzAwIGhvdmVyOnRleHQtYmxhY2sgZGFyazp0ZXh0LWdyYXktMzAwIGRhcms6aG92ZXI6dGV4dC13aGl0ZSB0cmFuc2l0aW9uLWNvbG9ycyBkdXJhdGlvbi0xMDBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEdpdEh1YiBzaXplPXs0MH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cIml0YWxpY1wiPkxvY2FsIFByZXZpZXcgTW9kZSAoQmV0YSk8L2gzPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiIHRleHQtY2VudGVyIGZvbnQtYW50b24gbXQtNDAgbWItNCB0ZXh0LTJ4bCBsZzp0ZXh0LTV4bCBiZy1jbGlwLXRleHQgdGV4dC10cmFuc3BhcmVudCBiZy1ncmFkaWVudC10by1iciBmcm9tLWdyYXktOTAwIGRhcms6ZnJvbS1ncmF5LTEwMCB2aWEtZ3JheS03MDAgZGFyazp2aWEtZ3JheS0zMDAgdG8tZ3JheS05MDAgZGFyazp0by1ncmF5LTIwMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgUHJldmlldyBmcm9tIHlvdXIgbWFjaGluZSwgd2l0aHsnICd9XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJiZy1jbGlwLXRleHQgdGV4dC10cmFuc3BhcmVudCBiZy1ncmFkaWVudC10by1iciBmcm9tLXJlZC02MDAgdG8tYmxhY2sgZGFyazpmcm9tLXllbGxvdy0yMDAgZGFyazp0by1yZWQtNDAwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaG90IHJlbG9hZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj57JyAnfVxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmctY2xpcC10ZXh0IHRleHQtdHJhbnNwYXJlbnQgYmctZ3JhZGllbnQtdG8tYnIgZnJvbS1yZWQtODAwIHRvLXZpb2xldC01MDBcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvaDE+XG4gICAgICAgICAgICAgICAgICAgIHticm93c2VyPy5uYW1lID09PSAnY2hyb21lJyA/IChcbiAgICAgICAgICAgICAgICAgICAgICAgIDw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3VwcHJlc3NIeWRyYXRpb25XYXJuaW5nIGNsYXNzTmFtZT1cInRleHQtY2VudGVyIHB0LTIwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRvIGdldCBzdGFydGVkLCBzaW1wbHkgc2VsZWN0IHRoZSBsb2NhbCBkaXJlY3RvcnkgY29udGFpbmluZyB5b3VyIGRvY3MuanNvbiBjb25maWcgZmlsZTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEwMCUgcHQtOCB0ZXh0LWNlbnRlciBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgY29udGVudC1jZW50ZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiY3Vyc29yLXBvaW50ZXIgYmctZ3JlZW4tNjAwIGhvdmVyOmJnLWdyZWVuLTUwMCBweC0zIHB5LTIgdGV4dC1zIHJvdW5kZWQtbGcgc2hhZG93IHRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnMgd2hpdGVzcGFjZS1ub3dyYXBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17b25TZWxlY3R9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNlbGVjdCBEaXJlY3RvcnkhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPC8+XG4gICAgICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8cCBzdXBwcmVzc0h5ZHJhdGlvbldhcm5pbmcgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgcHQtMjBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBMb2NhbCBQcmV2aWV3IE1vZGUgaXMgb25seSBhdmFpbGFibGUgb24gQ2hyb21lIGF0IHRoZSBtb21lbnQsIHNvcnJ5IDooXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3A+XG4gICAgICAgICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0zMiBtYXgtdy01eGwgbXgtYXV0byBweC00IGxnOnB4LTBcIj5cbiAgICAgICAgICAgICAgICAgICAgPEZvb3RlciAvPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9zZWN0aW9uPlxuICAgICAgICA8L2Rpdj5cbiAgICApO1xufVxuXG5cbi8vIFRPRE8gaGFuZGxlIG1lXG5leHBvcnQgZnVuY3Rpb24gQ2F0Y2hCb3VuZGFyeSgpIHtcbiAgICBjb25zdCBlID0gdXNlQ2F0Y2g8YW55PigpO1xuICAgIGNvbnNvbGUubG9nKGUpO1xuXG4gICAgbGV0IGNoaWxkOiBKU1guRWxlbWVudDtcblxuICAgIGlmIChlLnN0YXR1cyA9PT0gNDA0KSB7XG4gICAgICAgIGNoaWxkID0gPFByZXZpZXdOb3RGb3VuZCBlcnJvcj17Jyd9IC8+O1xuICAgIH0gZWxzZSBpZiAoZS5zdGF0dXMgPT09IDUwMCkge1xuICAgICAgICBjaGlsZCA9IDxTZXJ2ZXJFcnJvciB0aXRsZT1cIkludGVybmFsIHNlcnZlciBlcnJvclwiIC8+O1xuICAgIH0gZWxzZSBpZiAoZS5zdGF0dXMgPT09IDQwMCkge1xuICAgICAgICBjaGlsZCA9IDxCYWRSZXF1ZXN0IGVycm9yPXtlIGFzIFRocm93bkJ1bmRsZUVycm9yfSAvPjtcbiAgICB9IGVsc2Uge1xuICAgICAgICBjaGlsZCA9IDxTZXJ2ZXJFcnJvciB0aXRsZT1cIlNvbWV0aGluZyB3ZW50IHdyb25nXCIgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIDxkaXYgZGF0YS10ZXN0aWQ9eydlcnJvci1jb250YWluZXInfT57Y2hpbGQhfTxGb290ZXIgLz48L2Rpdj47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBFcnJvckJvdW5kYXJ5KCkge1xuXG4gICAgcmV0dXJuIDxTZXJ2ZXJFcnJvciB0aXRsZT1cIkFuIHVuY2F1Z2h0IGVycm9yIHdhcyB0aHJvd25cIiAvPlxufSIsICJpbXBvcnQgdHlwZSB7IE1ldGFGdW5jdGlvbiB9IGZyb20gJ3JlbWl4JztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcbmltcG9ydCB7XG4gIEFkanVzdG1lbnRzSWNvbixcbiAgQW5ub3RhdGlvbkljb24sXG4gIEdsb2JlQWx0SWNvbixcbiAgRXllSWNvbixcbiAgU2VhcmNoQ2lyY2xlSWNvbixcbiAgVGVtcGxhdGVJY29uLFxufSBmcm9tICdAaGVyb2ljb25zL3JlYWN0L3NvbGlkJztcblxuZXhwb3J0IGNvbnN0IG1ldGE6IE1ldGFGdW5jdGlvbiA9ICgpID0+ICh7XG4gICd0aGVtZS1jb2xvcic6ICcjZmZmZmZmJyxcbiAgdGl0bGU6ICdkb2NzLnBhZ2UgfCBDcmVhdGUgYW4gaW5zdGFudCBPcGVuIFNvdXJjZSBkb2NzIHBhZ2Ugd2l0aCB6ZXJvIGNvbmZpZ3VyYXRpb24uJyxcbiAgZGVzY3JpcHRpb246ICdDcmVhdGUgYW4gaW5zdGFudCBPcGVuIFNvdXJjZSBkb2NzIHBhZ2Ugd2l0aCB6ZXJvIGNvbmZpZ3VyYXRpb24uJyxcbiAgJ29nOnRpdGxlJzogJ2RvY3MucGFnZScsXG4gICdvZzpkZXNjcmlwdGlvbic6ICdDcmVhdGUgYW4gaW5zdGFudCBPcGVuIFNvdXJjZSBkb2NzIHBhZ2Ugd2l0aCB6ZXJvIGNvbmZpZ3VyYXRpb24uJyxcbiAgJ29nOmltYWdlJzogJ2h0dHA6Ly9kb2NzLnBhZ2UvYXNzZXRzL2RvY3MtcGFnZS1zb2NpYWwucG5nJyxcbiAgJ29nOnVybCc6ICdodHRwOi8vZG9jcy5wYWdlJyxcbiAgJ3R3aXR0ZXI6dGl0bGUnOiAnZG9jcy5wYWdlJyxcbiAgJ3R3aXR0ZXI6ZGVzY3JpcHRpb24nOiAnQ3JlYXRlIGFuIGluc3RhbnQgT3BlbiBTb3VyY2UgZG9jcyBwYWdlIHdpdGggemVybyBjb25maWd1cmF0aW9uLicsXG4gICd0d2l0dGVyOmltYWdlJzogJ2h0dHA6Ly9kb2NzLnBhZ2UvYXNzZXRzL2RvY3MtcGFnZS1zb2NpYWwucG5nJyxcbiAgJ3R3aXR0ZXI6Y2FyZCc6ICdzdW1tYXJ5X2xhcmdlX2ltYWdlJyxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBJbmRleCgpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2PlxuICAgICAgPHNlY3Rpb24gY2xhc3NOYW1lPVwicHktMTYgbGc6cHktMzIgdGV4dC1jZW50ZXIgcHgtNCBsZzp0ZXh0LWxlZnRcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy02eGwgbXgtYXV0byB0cmFja2luZy13aWRlclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgbGc6anVzdGlmeS1zdGFydCBtYi00IHNwYWNlLXgtNFwiPlxuICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cImZvbnQtYW50b24gdGV4dC00eGxcIj5kb2NzLnBhZ2U8L2gzPlxuICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgaHJlZj1cImh0dHBzOi8vZ2l0aHViLmNvbS9pbnZlcnRhc2UvZG9jcy5wYWdlXCJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTcwMCBob3Zlcjp0ZXh0LWJsYWNrIGRhcms6dGV4dC1ncmF5LTMwMCBkYXJrOmhvdmVyOnRleHQtd2hpdGUgdHJhbnNpdGlvbi1jb2xvcnMgZHVyYXRpb24tMTAwXCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPHN2ZyBjbGFzc05hbWU9XCJoLTEwIHctMTAgXCIgZmlsbD1cImN1cnJlbnRDb2xvclwiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cbiAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgZmlsbFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAgIGQ9XCJNMTIgMkM2LjQ3NyAyIDIgNi40ODQgMiAxMi4wMTdjMCA0LjQyNSAyLjg2NSA4LjE4IDYuODM5IDkuNTA0LjUuMDkyLjY4Mi0uMjE3LjY4Mi0uNDgzIDAtLjIzNy0uMDA4LS44NjgtLjAxMy0xLjcwMy0yLjc4Mi42MDUtMy4zNjktMS4zNDMtMy4zNjktMS4zNDMtLjQ1NC0xLjE1OC0xLjExLTEuNDY2LTEuMTEtMS40NjYtLjkwOC0uNjIuMDY5LS42MDguMDY5LS42MDggMS4wMDMuMDcgMS41MzEgMS4wMzIgMS41MzEgMS4wMzIuODkyIDEuNTMgMi4zNDEgMS4wODggMi45MS44MzIuMDkyLS42NDcuMzUtMS4wODguNjM2LTEuMzM4LTIuMjItLjI1My00LjU1NS0xLjExMy00LjU1NS00Ljk1MSAwLTEuMDkzLjM5LTEuOTg4IDEuMDI5LTIuNjg4LS4xMDMtLjI1My0uNDQ2LTEuMjcyLjA5OC0yLjY1IDAgMCAuODQtLjI3IDIuNzUgMS4wMjZBOS41NjQgOS41NjQgMCAwMTEyIDYuODQ0Yy44NS4wMDQgMS43MDUuMTE1IDIuNTA0LjMzNyAxLjkwOS0xLjI5NiAyLjc0Ny0xLjAyNyAyLjc0Ny0xLjAyNy41NDYgMS4zNzkuMjAyIDIuMzk4LjEgMi42NTEuNjQuNyAxLjAyOCAxLjU5NSAxLjAyOCAyLjY4OCAwIDMuODQ4LTIuMzM5IDQuNjk1LTQuNTY2IDQuOTQzLjM1OS4zMDkuNjc4LjkyLjY3OCAxLjg1NSAwIDEuMzM4LS4wMTIgMi40MTktLjAxMiAyLjc0NyAwIC4yNjguMTguNTguNjg4LjQ4MkExMC4wMTkgMTAuMDE5IDAgMDAyMiAxMi4wMTdDMjIgNi40ODQgMTcuNTIyIDIgMTIgMnpcIlxuICAgICAgICAgICAgICAgICAgY2xpcFJ1bGU9XCJldmVub2RkXCJcbiAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiZm9udC1hbnRvbiBtYi00IHRleHQtNnhsIGxnOnRleHQtOHhsIGJnLWNsaXAtdGV4dCB0ZXh0LXRyYW5zcGFyZW50IGJnLWdyYWRpZW50LXRvLWJyIGZyb20tZ3JheS05MDAgZGFyazpmcm9tLWdyYXktMTAwIHZpYS1ncmF5LTcwMCBkYXJrOnZpYS1ncmF5LTMwMCB0by1ncmF5LTkwMCBkYXJrOnRvLWdyYXktMjAwXCI+XG4gICAgICAgICAgICBJbnN0YW50eycgJ31cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJnLWNsaXAtdGV4dCB0ZXh0LXRyYW5zcGFyZW50IGJnLWdyYWRpZW50LXRvLWJyIGZyb20tZ3JlZW4tNDAwIHRvLWJsdWUtNTAwXCI+XG4gICAgICAgICAgICAgIE9wZW4gU291cmNlXG4gICAgICAgICAgICA8L3NwYW4+eycgJ31cbiAgICAgICAgICAgIGRvY3MgPGJyIC8+IHdpdGggemVybyBjb25maWd1cmF0aW9uLlxuICAgICAgICAgIDwvaDE+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9zZWN0aW9uPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtYXgtdy01eGwgbXgtYXV0byBweC00IGxnOnB4LTBcIj5cbiAgICAgICAgPEhlYWRpbmdcbiAgICAgICAgICBzdGVwPXsxfVxuICAgICAgICAgIHRpdGxlPXtcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICBBZGQgYXsnICd9XG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJnLWNsaXAtdGV4dCB0ZXh0LXRyYW5zcGFyZW50IGJnLWdyYWRpZW50LXRvLWJyIGZyb20tcHVycGxlLTQwMCB2aWEtcGluay01MDAgdG8tcmVkLTUwMFwiPlxuICAgICAgICAgICAgICAgIGRvY3NcbiAgICAgICAgICAgICAgPC9zcGFuPnsnICd9XG4gICAgICAgICAgICAgIGRpcmVjdG9yeSB0byB5b3VyIEdpdEh1YiByZXBvc2l0b3J5LlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIH1cbiAgICAgICAgICBmcm9tPVwiZnJvbS1wdXJwbGUtNDAwXCJcbiAgICAgICAgICB0bz1cInRvLXJlZC01MDBcIlxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxnOm1sLTIwIG10LTE2IGxnOmZsZXggaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTFcIj5cbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtbGcgcHgtM1wiPlxuICAgICAgICAgICAgICBkb2NzLnBhZ2Ugc291cmNlcyBjb250ZW50IGRpcmVjdGx5IGZyb20gYW55IE9wZW4gU291cmNlIEdpdEh1YiByZXBvc2l0b3J5LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtNCB0ZXh0LWxnIHB4LTNcIj5cbiAgICAgICAgICAgICAgVG8gZ2V0IHN0YXJ0ZWQsIGNyZWF0ZSBhbiBlbXB0eSA8Y29kZSBjbGFzc05hbWU9XCJ0ZXh0LXJlZC00MDBcIj5kb2NzPC9jb2RlPiBkaXJlY3RvcnlcbiAgICAgICAgICAgICAgYXQgdGhlIHJvb3Qgb2YgeW91ciByZXBvc2l0b3J5LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEwIGxnOm10LTAgbGc6cGwtOFwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtNiBweS0zIGJvcmRlci10IGJvcmRlci1sIGJvcmRlci1yIHJvdW5kZWQtdHIgcm91bmRlZC10bCBib3JkZXItZ3JheS03MDBcIiAvPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicHktMyBweC0zIGZsZXggaXRlbXMtY2VudGVyIGJvcmRlciByb3VuZGVkIGJvcmRlci1ncmF5LTcwMCBmb250LW1vbm8gdGV4dC1zbSBzaGFkb3cteGxcIj5cbiAgICAgICAgICAgICAgICAgIDxzdmdcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMTZcIlxuICAgICAgICAgICAgICAgICAgICB2aWV3Qm94PVwiMCAwIDE2IDE2XCJcbiAgICAgICAgICAgICAgICAgICAgdmVyc2lvbj1cIjEuMVwiXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMTZcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LXdoaXRlIG1yLTNcIlxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICA8cGF0aFxuICAgICAgICAgICAgICAgICAgICAgIGZpbGw9XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgICAgICAgICAgIGZpbGxSdWxlPVwiZXZlbm9kZFwiXG4gICAgICAgICAgICAgICAgICAgICAgZD1cIk0xLjc1IDFBMS43NSAxLjc1IDAgMDAwIDIuNzV2MTAuNUMwIDE0LjIxNi43ODQgMTUgMS43NSAxNWgxMi41QTEuNzUgMS43NSAwIDAwMTYgMTMuMjV2LTguNUExLjc1IDEuNzUgMCAwMDE0LjI1IDNoLTYuNWEuMjUuMjUgMCAwMS0uMi0uMWwtLjktMS4yYy0uMzMtLjQ0LS44NS0uNy0xLjQtLjdoLTMuNXpcIlxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPC9zdmc+XG4gICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmbGV4LTFcIj5kb2NzPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwidGV4dC1ncmF5LTYwMFwiPkEgZmV3IHNlY29uZHMgYWdvPC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXgtNiBweS0zIGJvcmRlci1iIGJvcmRlci1sIGJvcmRlci1yIHJvdW5kZWQtYnIgcm91bmRlZC1ibCBib3JkZXItZ3JheS03MDBcIiAvPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0zMiBtYXgtdy01eGwgbXgtYXV0byBweC00IGxnOnB4LTBcIj5cbiAgICAgICAgPEhlYWRpbmdcbiAgICAgICAgICBzdGVwPXsyfVxuICAgICAgICAgIHRpdGxlPXtcbiAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICBDcmVhdGUgYW57JyAnfVxuICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJiZy1jbGlwLXRleHQgdGV4dC10cmFuc3BhcmVudCBiZy1ncmFkaWVudC10by1iciBmcm9tLWdyZWVuLTQwMCB0by1ibHVlLTUwMFwiPlxuICAgICAgICAgICAgICAgIGluZGV4Lm1keFxuICAgICAgICAgICAgICA8L3NwYW4+eycgJ31cbiAgICAgICAgICAgICAgZmlsZS5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICB9XG4gICAgICAgICAgZnJvbT1cImZyb20tZ3JlZW4tNDAwXCJcbiAgICAgICAgICB0bz1cInRvLWJsdWUtNTAwXCJcbiAgICAgICAgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJsZzptbC0yMCBtdC0xNiBmbGV4IGZsZXgtY29sLXJldmVyc2UgbGc6ZmxleC1yb3cgaXRlbXMtY2VudGVyXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgZmxleC0xXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByLTUgbXQtMTAgbGc6bXQtMFwiPlxuICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYm9yZGVyIHJvdW5kZWQtdHIgcm91bmRlZC10bCBiZy1ncmF5LTUwIGJvcmRlci1ncmF5LTcwMCBweC0zIHB5LTJcIj5cbiAgICAgICAgICAgICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cInRleHQtc21cIj5kb2NzL2luZGV4Lm1keDwvY29kZT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXhcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xIHAtMyBmb250LW1vbm8gYm9yZGVyLWdyYXktNzAwIGJvcmRlci1yIGJvcmRlci1sXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+IyBJbnN0YWxsYXRpb248L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICAgICAgICAgIDxkaXY+YGBgYmFzaDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2Pm5wbSBpbnN0YWxsIG15YXdlc29tZWxpYjwvZGl2PlxuICAgICAgICAgICAgICAgICAgICBgYGBcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxleC0xXCI+XG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWxnIHB4LTNcIj5cbiAgICAgICAgICAgICAgQ3JlYXRlIGEgPGNvZGUgY2xhc3NOYW1lPVwidGV4dC1ibHVlLTUwMFwiPntgaW5kZXgubWR4YH08L2NvZGU+IGZpbGUgYXQgdGhlIHJvb3Qgb2YgeW91cnsnICd9XG4gICAgICAgICAgICAgIDxjb2RlIGNsYXNzTmFtZT1cInRleHQtYmx1ZS01MDBcIj4vZG9jczwvY29kZT4gZGlyZWN0b3J5LiBkb2NzLnBhZ2Ugc3VwcG9ydHMgbmVzdGVkXG4gICAgICAgICAgICAgIHBhZ2VzIGJhc2VkIG9uIHlvdXIgZGlyZWN0b3J5IHN0cnVjdHVyZSBvZiB0aGUgZGlyZWN0b3J5LlxuICAgICAgICAgICAgPC9wPlxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibXQtNCB0ZXh0LWxnIHB4LTNcIj5cbiAgICAgICAgICAgICAgU3RhcnQgYnkgd3JpdGluZyBzb21lIDxhIGhyZWY9XCJodHRwczovL3d3dy5tYXJrZG93bmd1aWRlLm9yZy9cIj5NYXJrZG93bjwvYT4gY29udGVudC5cbiAgICAgICAgICAgICAgSW5zdGFsbGF0aW9uIHBhZ2VzIGFyZSBhbHdheXMgYSBncmVhdCBwbGFjZSB0byBzdGFydCFcbiAgICAgICAgICAgIDwvcD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibXQtMzIgbWF4LXctNXhsIG14LWF1dG8gcHgtNCBsZzpweC0wXCI+XG4gICAgICAgIDxIZWFkaW5nXG4gICAgICAgICAgc3RlcD17M31cbiAgICAgICAgICB0aXRsZT1cIkNoZWNrb3V0IHlvdXIgbmV3IGRvY3VtZW50YXRpb24hXCJcbiAgICAgICAgICBmcm9tPVwiZnJvbS15ZWxsb3ctNDAwXCJcbiAgICAgICAgICB0bz1cInRvLXllbGxvdy01MDBcIlxuICAgICAgICAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxnOm1sLTIwIG10LTEwIGxnOmZsZXhcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPlRPRE88L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgtMVwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0zMiBtYXgtdy01eGwgbXgtYXV0byBweC00IGxnOnB4LTBcIj5cbiAgICAgICAgPEhlYWRpbmcgc3RlcD17NH0gdGl0bGU9XCJMZWFybiBtb3JlLi4uXCIgZnJvbT1cImZyb20tZ3JlZW4tNDAwXCIgdG89XCJ0by1ncmVlbi01MDBcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImxnOm1sLTIwIG10LTEwIGdyaWQgbGc6Z3JpZC1jb2xzLTIgZ2FwLTE2IHRleHQtY2VudGVyXCI+XG4gICAgICAgICAgPEZlYXR1cmVcbiAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3VzZS5kb2NzLnBhZ2UvY29uZmlndXJhdGlvblwiXG4gICAgICAgICAgICB0aXRsZT17PHNwYW4gY2xhc3NOYW1lPVwidGV4dC1ibHVlLTUwMFwiPkNvbmZpZ3VyZTwvc3Bhbj59XG4gICAgICAgICAgICB0ZXh0PXtcbiAgICAgICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICAgICAgQWRkIGEgPGNvZGUgY2xhc3NOYW1lPVwidGV4dC1ibHVlLTQwMFwiPmRvY3MuanNvbjwvY29kZT4gZmlsZSB0byB0aGUgcm9vdCBvZiB0aGVcbiAgICAgICAgICAgICAgICByZXBvc2l0b3J5IHRvIGNvbmZpZ3VyZSB5b3VyIHByb2plY3QgYnkgYWRkaW5nIGEgdGhlbWUsIHNlYXJjaCwgbmF2aWdhdGlvbixcbiAgICAgICAgICAgICAgICBhbmFseXRpY3MgYW5kIG1vcmUuXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGljb249ezxBZGp1c3RtZW50c0ljb24gd2lkdGg9ezgwfSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGZWF0dXJlXG4gICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly91c2UuZG9jcy5wYWdlL3ByZXZpZXdzXCJcbiAgICAgICAgICAgIHRpdGxlPXs8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXBpbmstNDAwXCI+UHJldmlld3M8L3NwYW4+fVxuICAgICAgICAgICAgdGV4dD17XG4gICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIFByZXZpZXdpbmcgZG9jcyBsb2NhbGx5IHdpdGggb3VyIG5ldyBMb2NhbCBQcmV2aWV3IE1vZGUuIFByZXZpZXdpbmcgY2hhbmdlcyBvblxuICAgICAgICAgICAgICAgIGJyYW5jaGVzIGFuZCBwdWxsIHJlcXVlc3RzIHdvcmtzIG91dCBvZiB0aGUgYm94IHdpdGggemVybyBjb25maWd1cmF0aW9uLiBJbnN0YWxsIG91clxuICAgICAgICAgICAgICAgIEdpdEh1YiBib3QgZm9yIHByZXZpZXcgYXNzaXN0YW5jZS5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWNvbj17PEV5ZUljb24gd2lkdGg9ezgwfSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGZWF0dXJlXG4gICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly91c2UuZG9jcy5wYWdlL2NvbXBvbmVudHNcIlxuICAgICAgICAgICAgdGl0bGU9ezxzcGFuIGNsYXNzTmFtZT1cInRleHQteWVsbG93LTQwMFwiPkNvbXBvbmVudHM8L3NwYW4+fVxuICAgICAgICAgICAgdGV4dD17XG4gICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIEJ5IHVzaW5nIE1EWCB3ZSBwcm92aWRlIGN1c3RvbSBSZWFjdCBjb21wb25lbnRzIHRvIGhlbHAgeW91IGJ1aWxkIGJldHRlclxuICAgICAgICAgICAgICAgIGRvY3VtZW50YXRpb24uXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGljb249ezxUZW1wbGF0ZUljb24gd2lkdGg9ezgwfSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGZWF0dXJlXG4gICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly91c2UuZG9jcy5wYWdlL2N1c3RvbS1kb21haW5zXCJcbiAgICAgICAgICAgIHRpdGxlPXs8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LWdyZWVuLTQwMFwiPkRvbWFpbnM8L3NwYW4+fVxuICAgICAgICAgICAgdGV4dD17XG4gICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIFVzaW5nIGEgY3VzdG9tIGRvbWFpbiBuYW1lPyBTaW1wbHkgY3JlYXRlIGEgcHVsbCByZXF1ZXN0ICYgcG9pbnQgeW91ciBkb21haW4gdG8gb3VyXG4gICAgICAgICAgICAgICAgc2VydmVycy4gV2UmYXBvcztsbCB0YWtlIGNhcmUgb2YgdGhlIHJlc3QuXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGljb249ezxHbG9iZUFsdEljb24gd2lkdGg9ezgwfSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxGZWF0dXJlXG4gICAgICAgICAgICBocmVmPVwiaHR0cHM6Ly91c2UuZG9jcy5wYWdlL2dpdGh1Yi1ib3RcIlxuICAgICAgICAgICAgdGl0bGU9ezxzcGFuIGNsYXNzTmFtZT1cInRleHQtcHVycGxlLTUwMFwiPkdpdEh1YiBCb3Q8L3NwYW4+fVxuICAgICAgICAgICAgdGV4dD17XG4gICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIEluc3RhbGwgb3VyIEdpdEh1YiBib3Qgb24gcmVwb3NpdG9yaWVzIHVzaW5nIGRvY3MucGFnZS4gQW55IG5ldyBQdWxsIFJlcXVlc3RzIHdpbGxcbiAgICAgICAgICAgICAgICBhdXRvbWF0aWNhbGx5IGRpc3BsYXkgYSBwdWJsaWNseSBhdmFpbGFibGUgZGVwbG95bWVudCBwcmV2aWV3IFVSTCBmb3IgeW91clxuICAgICAgICAgICAgICAgIGRvY3VtZW50YXRpb24uXG4gICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGljb249ezxBbm5vdGF0aW9uSWNvbiB3aWR0aD17ODB9IC8+fVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPEZlYXR1cmVcbiAgICAgICAgICAgIGhyZWY9XCJodHRwczovL3VzZS5kb2NzLnBhZ2Uvc2VhcmNoXCJcbiAgICAgICAgICAgIHRpdGxlPXs8c3BhbiBjbGFzc05hbWU9XCJ0ZXh0LXJlZC01MDBcIj5TZWFyY2g8L3NwYW4+fVxuICAgICAgICAgICAgdGV4dD17XG4gICAgICAgICAgICAgIDxzcGFuPlxuICAgICAgICAgICAgICAgIEFkZCB5b3VyIERvY1NlYXJjaCBhcHBsaWNhdGlvbiBJRCB0byB5b3VyIGNvbmZpZ3VyYXRpb24gZmlsZSBhbmQgaW5zdGFudGx5IGdldCBmdWxsXG4gICAgICAgICAgICAgICAgYmxvd24gZG9jdW1lbnRhdGlvbiBzZWFyY2ggZm9yIGZyZWUsIHBvd2VyZWQgYnkgQWxnb2xpYS5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWNvbj17PFNlYXJjaENpcmNsZUljb24gd2lkdGg9ezgwfSAvPn1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuXG50eXBlIEJ1dHRvblByb3BzID0ge1xuICBocmVmOiBzdHJpbmc7XG4gIGNoaWxkcmVuOiBzdHJpbmc7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gQnV0dG9uKHsgaHJlZiwgY2hpbGRyZW4gfTogQnV0dG9uUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gIHJldHVybiAoXG4gICAgPExpbmtcbiAgICAgIHRvPXtocmVmfVxuICAgICAgY2xhc3NOYW1lPVwicHgtNiBweS0yIGJvcmRlciBib3JkZXItZ3JheS02MDAgaG92ZXI6Ym9yZGVyLWdyYXktMzAwIGRhcms6aG92ZXI6Ym9yZGVyLXdoaXRlIG5vLXVuZGVybGluZSByb3VuZGVkIHRyYW5zaXRpb24tYWxsIGR1cmF0aW9uLTEwMFwiXG4gICAgPlxuICAgICAge2NoaWxkcmVufVxuICAgIDwvTGluaz5cbiAgKTtcbn1cblxudHlwZSBIZWFkaW5nUHJvcHMgPSB7XG4gIHN0ZXA6IG51bWJlcjtcbiAgdGl0bGU6IFJlYWN0LlJlYWN0Tm9kZTtcbiAgZnJvbTogc3RyaW5nO1xuICB0bzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEhlYWRpbmcoeyBzdGVwLCB0aXRsZSwgZnJvbSwgdG8gfTogSGVhZGluZ1Byb3BzKSB7XG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGl0ZW1zLWNlbnRlclwiPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICAgICd3LTE2IGgtMTYgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgcm91bmRlZC1mdWxsIGJnLWdyYWRpZW50LXRvLWJyIHNoYWRvdy14bCcsXG4gICAgICAgICAgZnJvbSxcbiAgICAgICAgICB0byxcbiAgICAgICAgKX1cbiAgICAgID5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9udC1hbnRvbiB0ZXh0LXdoaXRlIHRleHQtNHhsXCI+e3N0ZXB9PC9zcGFuPlxuICAgICAgPC9kaXY+XG4gICAgICA8aDIgY2xhc3NOYW1lPVwiZmxleC0xIG1sLTYgZm9udC1hbnRvbiB0ZXh0LTR4bCBsZWFkaW5nLXJlbGF4ZWRcIj57dGl0bGV9PC9oMj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxudHlwZSBGZWF0dXJlUHJvcHMgPSB7XG4gIGhyZWY/OiBzdHJpbmc7XG4gIGljb246IFJlYWN0LlJlYWN0RWxlbWVudDtcbiAgdGl0bGU6IHN0cmluZyB8IFJlYWN0LlJlYWN0RWxlbWVudDtcbiAgdGV4dDogUmVhY3QuUmVhY3ROb2RlO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIEZlYXR1cmUoeyBocmVmLCBpY29uLCB0aXRsZSwgdGV4dCB9OiBGZWF0dXJlUHJvcHMpIHtcbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXggZmxleC1jb2wgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIHAtM1wiPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4LTEgZmxleCBmbGV4LWNvbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXJcIj5cbiAgICAgICAge2ljb259XG4gICAgICAgIDxoNCBjbGFzc05hbWU9XCJteS04IGZvbnQtYW50b24gdGV4dC01eGwgdHJhY2tpbmctd2lkZVwiPnt0aXRsZX08L2g0PlxuICAgICAgICA8cCBjbGFzc05hbWU9XCJtaW4taC1bOTBweF0gbGVhZGluZy1yZWxheGVkXCI+e3RleHR9PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm10LTEwXCI+XG4gICAgICAgIHshIWhyZWYgJiYgPEJ1dHRvbiBocmVmPXtocmVmfT5MZWFybiBNb3JlPC9CdXR0b24+fVxuICAgICAgICB7IWhyZWYgJiYgPGRpdiBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNDAwXCI+Q29taW5nIFNvb24uLi48L2Rpdj59XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBLFlBQXVCO0FBQUE7QUFBQTs7O0FDQXZCO0FBQUE7QUFBQTtBQVVBO0FBRUEsV0FBTyxlQUFlLFNBQVMsY0FBYyxFQUFFLE9BQU87QUFFdEQsUUFBSSxRQUFRLFFBQVE7QUFJcEIs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
