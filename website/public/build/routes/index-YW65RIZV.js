import {
  React,
  __commonJS,
  __toModule,
  init_react
} from "/build/_shared/chunk-6LNJWX5T.js";

// ../node_modules/classnames/index.js
var require_classnames = __commonJS({
  "../node_modules/classnames/index.js"(exports, module) {
    init_react();
    (function() {
      "use strict";
      var hasOwn = {}.hasOwnProperty;
      function classNames() {
        var classes = [];
        for (var i = 0; i < arguments.length; i++) {
          var arg = arguments[i];
          if (!arg)
            continue;
          var argType = typeof arg;
          if (argType === "string" || argType === "number") {
            classes.push(arg);
          } else if (Array.isArray(arg)) {
            if (arg.length) {
              var inner = classNames.apply(null, arg);
              if (inner) {
                classes.push(inner);
              }
            }
          } else if (argType === "object") {
            if (arg.toString === Object.prototype.toString) {
              for (var key in arg) {
                if (hasOwn.call(arg, key) && arg[key]) {
                  classes.push(key);
                }
              }
            } else {
              classes.push(arg.toString());
            }
          }
        }
        return classes.join(" ");
      }
      if (typeof module !== "undefined" && module.exports) {
        classNames.default = classNames;
        module.exports = classNames;
      } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define("classnames", [], function() {
          return classNames;
        });
      } else {
        window.classNames = classNames;
      }
    })();
  }
});

// browser-route-module:/Users/elliothesp/Documents/Code/oss-docs/website/app/routes/index.tsx?browser
init_react();

// app/routes/index.tsx
init_react();
var import_classnames = __toModule(require_classnames());
var meta = () => {
  return {
    title: "docs.page | Create an instant Open Source docs page with zero configuration.",
    description: "Create an instant Open Source docs page with zero configuration."
  };
};
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
  })))), /* @__PURE__ */ React.createElement("div", {
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
  })), /* @__PURE__ */ React.createElement("div", {
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
  }), /* @__PURE__ */ React.createElement("div", {
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
    icon: /* @__PURE__ */ React.createElement(Adjustments, {
      size: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/previews",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-pink-400"
    }, "Previews"),
    text: /* @__PURE__ */ React.createElement("span", null, "Previewing docs locally with our new Local Preview Mode. Previewing changes on branches and pull requests works out of the box with zero configuration. Install our GitHub bot for preview assistance."),
    icon: /* @__PURE__ */ React.createElement(PullRequest, {
      size: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/components",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-yellow-400"
    }, "Components"),
    text: /* @__PURE__ */ React.createElement("span", null, "By using MDX we provide custom React components to help you build better documentation."),
    icon: /* @__PURE__ */ React.createElement(Template, {
      size: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/custom-domains",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-green-400"
    }, "Domains"),
    text: /* @__PURE__ */ React.createElement("span", null, "Using a custom domain name? Simply create a pull request & point your domain to our servers. We'll take care of the rest."),
    icon: /* @__PURE__ */ React.createElement(GlobeAlt, {
      size: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/github-bot",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-purple-500"
    }, "GitHub Bot"),
    text: /* @__PURE__ */ React.createElement("span", null, "Install our GitHub bot on repositories using docs.page. Any new Pull Requests will automatically display a publicly available deployment preview URL for your documentation."),
    icon: /* @__PURE__ */ React.createElement(Annotation, {
      size: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/search",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-red-500"
    }, "Search"),
    text: /* @__PURE__ */ React.createElement("span", null, "Add your DocSearch application ID to your configuration file and instantly get full blown documentation search for free, powered by Algolia."),
    icon: /* @__PURE__ */ React.createElement(SearchCircle, {
      size: 80
    })
  }))));
}
function Heading({
  step,
  title,
  from,
  to
}) {
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
export {
  Index as default,
  meta
};
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
//# sourceMappingURL=/build/routes/index-YW65RIZV.js.map
