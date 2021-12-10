var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
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

// <stdin>
__export(exports, {
  assets: () => import_assets.default,
  entry: () => entry,
  routes: () => routes
});

// ../node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toModule(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_server = __toModule(require("react-dom/server"));
var import_remix = __toModule(require("remix"));
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

// route-module:/Users/elliothesp/Documents/Code/oss-docs/website/app/root.tsx
var root_exports = {};
__export(root_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  default: () => App,
  links: () => links
});
var import_remix2 = __toModule(require("remix"));

// app/tailwind.css
var tailwind_default = "/build/_assets/tailwind-VRBRS6VW.css";

// route-module:/Users/elliothesp/Documents/Code/oss-docs/website/app/root.tsx
var links = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&display=block" },
    { rel: "stylesheet", href: tailwind_default }
  ];
};
function App() {
  return /* @__PURE__ */ React.createElement(Document, null, /* @__PURE__ */ React.createElement(import_remix2.Outlet, null));
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
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("meta", {
    charSet: "utf-8"
  }), /* @__PURE__ */ React.createElement("meta", {
    name: "viewport",
    content: "width=device-width,initial-scale=1"
  }), title ? /* @__PURE__ */ React.createElement("title", null, title) : null, /* @__PURE__ */ React.createElement(import_remix2.Meta, null), /* @__PURE__ */ React.createElement(import_remix2.Links, null)), /* @__PURE__ */ React.createElement("body", {
    className: "dark:bg-[#202528]"
  }, children, /* @__PURE__ */ React.createElement(import_remix2.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_remix2.Scripts, null), process.env.NODE_ENV === "development" && /* @__PURE__ */ React.createElement(import_remix2.LiveReload, null)));
}

// route-module:/Users/elliothesp/Documents/Code/oss-docs/website/app/routes/$owner.$repo.$.tsx
var owner_repo_exports = {};
__export(owner_repo_exports, {
  default: () => Page,
  loader: () => loader,
  meta: () => meta
});
var import_remix3 = __toModule(require("remix"));
var loader = async ({ params }) => {
  const owner = params.owner;
  const repo = params.repo;
  const path = params["*"];
  return (0, import_remix3.json)({});
};
var meta = () => ({
  title: "",
  description: ""
});
function Page() {
  const data = (0, import_remix3.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", null, "TODO");
}

// route-module:/Users/elliothesp/Documents/Code/oss-docs/website/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  Button: () => Button,
  Feature: () => Feature,
  Heading: () => Heading,
  default: () => Index,
  meta: () => meta2
});
var import_classnames = __toModule(require("classnames"));
var import_react_router_dom = __toModule(require("react-router-dom"));
var import_solid = __toModule(require("@heroicons/react/solid"));
var meta2 = () => ({
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
  }, /* @__PURE__ */ React.createElement(Heading, {
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
  }, /* @__PURE__ */ React.createElement(Heading, {
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
  }, /* @__PURE__ */ React.createElement(Heading, {
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
  }, /* @__PURE__ */ React.createElement(Heading, {
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
    icon: /* @__PURE__ */ React.createElement(import_solid.AdjustmentsIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/previews",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-pink-400"
    }, "Previews"),
    text: /* @__PURE__ */ React.createElement("span", null, "Previewing docs locally with our new Local Preview Mode. Previewing changes on branches and pull requests works out of the box with zero configuration. Install our GitHub bot for preview assistance."),
    icon: /* @__PURE__ */ React.createElement(import_solid.EyeIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/components",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-yellow-400"
    }, "Components"),
    text: /* @__PURE__ */ React.createElement("span", null, "By using MDX we provide custom React components to help you build better documentation."),
    icon: /* @__PURE__ */ React.createElement(import_solid.TemplateIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/custom-domains",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-green-400"
    }, "Domains"),
    text: /* @__PURE__ */ React.createElement("span", null, "Using a custom domain name? Simply create a pull request & point your domain to our servers. We'll take care of the rest."),
    icon: /* @__PURE__ */ React.createElement(import_solid.GlobeAltIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/github-bot",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-purple-500"
    }, "GitHub Bot"),
    text: /* @__PURE__ */ React.createElement("span", null, "Install our GitHub bot on repositories using docs.page. Any new Pull Requests will automatically display a publicly available deployment preview URL for your documentation."),
    icon: /* @__PURE__ */ React.createElement(import_solid.AnnotationIcon, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/search",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-red-500"
    }, "Search"),
    text: /* @__PURE__ */ React.createElement("span", null, "Add your DocSearch application ID to your configuration file and instantly get full blown documentation search for free, powered by Algolia."),
    icon: /* @__PURE__ */ React.createElement(import_solid.SearchCircleIcon, {
      width: 80
    })
  }))));
}
function Button({ href, children }) {
  return /* @__PURE__ */ React.createElement(import_react_router_dom.Link, {
    to: href,
    className: "px-6 py-2 border border-gray-600 hover:border-gray-300 dark:hover:border-white no-underline rounded transition-all duration-100"
  }, children);
}
function Heading({ step, title, from, to }) {
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex items-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: (0, import_classnames.default)("w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br shadow-xl", from, to)
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
//# sourceMappingURL=/build/index.js.map
