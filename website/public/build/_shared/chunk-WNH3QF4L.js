import {
  __commonJS,
  init_react,
  require_react
} from "/build/_shared/chunk-6LNJWX5T.js";

// ../node_modules/history/umd/history.development.js
var require_history_development = __commonJS({
  "../node_modules/history/umd/history.development.js"(exports, module) {
    init_react();
    "use strict";
    (function(l, y) {
      typeof exports === "object" && typeof module !== "undefined" ? y(exports) : typeof define === "function" && define.amd ? define(["exports"], y) : (l = typeof globalThis !== "undefined" ? globalThis : l || self, y(l.HistoryLibrary = {}));
    })(exports, function(l) {
      function y() {
        y = Object.assign || function(b) {
          for (var g = 1; g < arguments.length; g++) {
            var h = arguments[g], t;
            for (t in h)
              Object.prototype.hasOwnProperty.call(h, t) && (b[t] = h[t]);
          }
          return b;
        };
        return y.apply(this, arguments);
      }
      function C(b, g) {
        if (!b) {
          typeof console !== "undefined" && console.warn(g);
          try {
            throw Error(g);
          } catch (h) {
          }
        }
      }
      function H(b) {
        b.preventDefault();
        b.returnValue = "";
      }
      function D() {
        var b = [];
        return { get length() {
          return b.length;
        }, push: function(g) {
          b.push(g);
          return function() {
            b = b.filter(function(h) {
              return h !== g;
            });
          };
        }, call: function(g) {
          b.forEach(function(h) {
            return h && h(g);
          });
        } };
      }
      function I() {
        return Math.random().toString(36).substr(2, 8);
      }
      function E(b) {
        var g = b.pathname, h = b.search;
        b = b.hash;
        return (g === void 0 ? "/" : g) + (h === void 0 ? "" : h) + (b === void 0 ? "" : b);
      }
      function F(b) {
        var g = {};
        if (b) {
          var h = b.indexOf("#");
          0 <= h && (g.hash = b.substr(h), b = b.substr(0, h));
          h = b.indexOf("?");
          0 <= h && (g.search = b.substr(h), b = b.substr(0, h));
          b && (g.pathname = b);
        }
        return g;
      }
      l.Action = void 0;
      (function(b) {
        b.Pop = "POP";
        b.Push = "PUSH";
        b.Replace = "REPLACE";
      })(l.Action || (l.Action = {}));
      l.createBrowserHistory = function(b) {
        function g() {
          var c = q.location, a = n.state || {};
          return [a.idx, Object.freeze({ pathname: c.pathname, search: c.search, hash: c.hash, state: a.usr || null, key: a.key || "default" })];
        }
        function h(c) {
          return typeof c === "string" ? c : E(c);
        }
        function t(c, a) {
          a === void 0 && (a = null);
          return Object.freeze(y({ pathname: r.pathname, hash: "", search: "" }, typeof c === "string" ? F(c) : c, { state: a, key: I() }));
        }
        function A(c) {
          u = c;
          c = g();
          w = c[0];
          r = c[1];
          d.call({ action: u, location: r });
        }
        function B(c, a) {
          function e() {
            B(c, a);
          }
          var m = l.Action.Push, k = t(c, a);
          if (!f.length || (f.call({ action: m, location: k, retry: e }), false)) {
            var p = [{ usr: k.state, key: k.key, idx: w + 1 }, h(k)];
            k = p[0];
            p = p[1];
            try {
              n.pushState(k, "", p);
            } catch (G) {
              q.location.assign(p);
            }
            A(m);
          }
        }
        function z(c, a) {
          function e() {
            z(c, a);
          }
          var m = l.Action.Replace, k = t(c, a);
          f.length && (f.call({ action: m, location: k, retry: e }), 1) || (k = [{ usr: k.state, key: k.key, idx: w }, h(k)], n.replaceState(k[0], "", k[1]), A(m));
        }
        function x(c) {
          n.go(c);
        }
        b === void 0 && (b = {});
        b = b.window;
        var q = b === void 0 ? document.defaultView : b, n = q.history, v = null;
        q.addEventListener("popstate", function() {
          if (v)
            f.call(v), v = null;
          else {
            var c = l.Action.Pop, a = g(), e = a[0];
            a = a[1];
            if (f.length)
              if (e != null) {
                var m = w - e;
                m && (v = { action: c, location: a, retry: function() {
                  x(-1 * m);
                } }, x(m));
              } else
                C(false, "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.");
            else
              A(c);
          }
        });
        var u = l.Action.Pop;
        b = g();
        var w = b[0], r = b[1], d = D(), f = D();
        w == null && (w = 0, n.replaceState(y({}, n.state, { idx: w }), ""));
        return { get action() {
          return u;
        }, get location() {
          return r;
        }, createHref: h, push: B, replace: z, go: x, back: function() {
          x(-1);
        }, forward: function() {
          x(1);
        }, listen: function(c) {
          return d.push(c);
        }, block: function(c) {
          var a = f.push(c);
          f.length === 1 && q.addEventListener("beforeunload", H);
          return function() {
            a();
            f.length || q.removeEventListener("beforeunload", H);
          };
        } };
      };
      l.createHashHistory = function(b) {
        function g() {
          var a = F(n.location.hash.substr(1)), e = a.pathname, m = a.search;
          a = a.hash;
          var k = v.state || {};
          return [k.idx, Object.freeze({ pathname: e === void 0 ? "/" : e, search: m === void 0 ? "" : m, hash: a === void 0 ? "" : a, state: k.usr || null, key: k.key || "default" })];
        }
        function h() {
          if (u)
            c.call(u), u = null;
          else {
            var a = l.Action.Pop, e = g(), m = e[0];
            e = e[1];
            if (c.length)
              if (m != null) {
                var k = r - m;
                k && (u = { action: a, location: e, retry: function() {
                  q(-1 * k);
                } }, q(k));
              } else
                C(false, "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.");
            else
              B(a);
          }
        }
        function t(a) {
          var e = document.querySelector("base"), m = "";
          e && e.getAttribute("href") && (e = n.location.href, m = e.indexOf("#"), m = m === -1 ? e : e.slice(0, m));
          return m + "#" + (typeof a === "string" ? a : E(a));
        }
        function A(a, e) {
          e === void 0 && (e = null);
          return Object.freeze(y({ pathname: d.pathname, hash: "", search: "" }, typeof a === "string" ? F(a) : a, { state: e, key: I() }));
        }
        function B(a) {
          w = a;
          a = g();
          r = a[0];
          d = a[1];
          f.call({ action: w, location: d });
        }
        function z(a, e) {
          function m() {
            z(a, e);
          }
          var k = l.Action.Push, p = A(a, e);
          C(p.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.push(" + JSON.stringify(a) + ")");
          if (!c.length || (c.call({ action: k, location: p, retry: m }), false)) {
            var G = [{ usr: p.state, key: p.key, idx: r + 1 }, t(p)];
            p = G[0];
            G = G[1];
            try {
              v.pushState(p, "", G);
            } catch (J) {
              n.location.assign(G);
            }
            B(k);
          }
        }
        function x(a, e) {
          function m() {
            x(a, e);
          }
          var k = l.Action.Replace, p = A(a, e);
          C(p.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(a) + ")");
          c.length && (c.call({ action: k, location: p, retry: m }), 1) || (p = [{ usr: p.state, key: p.key, idx: r }, t(p)], v.replaceState(p[0], "", p[1]), B(k));
        }
        function q(a) {
          v.go(a);
        }
        b === void 0 && (b = {});
        b = b.window;
        var n = b === void 0 ? document.defaultView : b, v = n.history, u = null;
        n.addEventListener("popstate", h);
        n.addEventListener("hashchange", function() {
          var a = g()[1];
          E(a) !== E(d) && h();
        });
        var w = l.Action.Pop;
        b = g();
        var r = b[0], d = b[1], f = D(), c = D();
        r == null && (r = 0, v.replaceState(y({}, v.state, { idx: r }), ""));
        return {
          get action() {
            return w;
          },
          get location() {
            return d;
          },
          createHref: t,
          push: z,
          replace: x,
          go: q,
          back: function() {
            q(-1);
          },
          forward: function() {
            q(1);
          },
          listen: function(a) {
            return f.push(a);
          },
          block: function(a) {
            var e = c.push(a);
            c.length === 1 && n.addEventListener("beforeunload", H);
            return function() {
              e();
              c.length || n.removeEventListener("beforeunload", H);
            };
          }
        };
      };
      l.createMemoryHistory = function(b) {
        function g(d, f) {
          f === void 0 && (f = null);
          return Object.freeze(y({ pathname: u.pathname, search: "", hash: "" }, typeof d === "string" ? F(d) : d, { state: f, key: I() }));
        }
        function h(d, f, c) {
          return !r.length || (r.call({ action: d, location: f, retry: c }), false);
        }
        function t(d, f) {
          v = d;
          u = f;
          w.call({ action: v, location: u });
        }
        function A(d, f) {
          var c = l.Action.Push, a = g(d, f);
          C(u.pathname.charAt(0) === "/", "Relative pathnames are not supported in memory history.push(" + JSON.stringify(d) + ")");
          h(c, a, function() {
            A(d, f);
          }) && (n += 1, q.splice(n, q.length, a), t(c, a));
        }
        function B(d, f) {
          var c = l.Action.Replace, a = g(d, f);
          C(u.pathname.charAt(0) === "/", "Relative pathnames are not supported in memory history.replace(" + JSON.stringify(d) + ")");
          h(c, a, function() {
            B(d, f);
          }) && (q[n] = a, t(c, a));
        }
        function z(d) {
          var f = Math.min(Math.max(n + d, 0), q.length - 1), c = l.Action.Pop, a = q[f];
          h(c, a, function() {
            z(d);
          }) && (n = f, t(c, a));
        }
        b === void 0 && (b = {});
        var x = b;
        b = x.initialEntries;
        x = x.initialIndex;
        var q = (b === void 0 ? ["/"] : b).map(function(d) {
          var f = Object.freeze(y({ pathname: "/", search: "", hash: "", state: null, key: I() }, typeof d === "string" ? F(d) : d));
          C(f.pathname.charAt(0) === "/", "Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: " + JSON.stringify(d) + ")");
          return f;
        }), n = Math.min(Math.max(x == null ? q.length - 1 : x, 0), q.length - 1), v = l.Action.Pop, u = q[n], w = D(), r = D();
        return { get index() {
          return n;
        }, get action() {
          return v;
        }, get location() {
          return u;
        }, createHref: function(d) {
          return typeof d === "string" ? d : E(d);
        }, push: A, replace: B, go: z, back: function() {
          z(-1);
        }, forward: function() {
          z(1);
        }, listen: function(d) {
          return w.push(d);
        }, block: function(d) {
          return r.push(d);
        } };
      };
      l.createPath = E;
      l.parsePath = F;
      Object.defineProperty(l, "__esModule", { value: true });
    });
  }
});

// ../node_modules/history/main.js
var require_main = __commonJS({
  "../node_modules/history/main.js"(exports, module) {
    init_react();
    "use strict";
    module.exports = false ? null : require_history_development();
  }
});

// ../node_modules/react-router/umd/react-router.development.js
var require_react_router_development = __commonJS({
  "../node_modules/react-router/umd/react-router.development.js"(exports, module) {
    init_react();
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_react(), require_main()) : typeof define === "function" && define.amd ? define(["exports", "react", "history"], factory) : (global = global || self, factory(global.ReactRouter = {}, global.React, global.HistoryLibrary));
    })(exports, function(exports2, React2, history) {
      "use strict";
      function invariant(cond, message) {
        if (!cond)
          throw new Error(message);
      }
      function warning(cond, message) {
        if (!cond) {
          if (typeof console !== "undefined")
            console.warn(message);
          try {
            throw new Error(message);
          } catch (e) {
          }
        }
      }
      const alreadyWarned = {};
      function warningOnce(key, cond, message) {
        if (!cond && !alreadyWarned[key]) {
          alreadyWarned[key] = true;
          warning(false, message);
        }
      }
      const NavigationContext = /* @__PURE__ */ React2.createContext(null);
      {
        NavigationContext.displayName = "Navigation";
      }
      const LocationContext = /* @__PURE__ */ React2.createContext(null);
      {
        LocationContext.displayName = "Location";
      }
      const RouteContext = /* @__PURE__ */ React2.createContext({
        outlet: null,
        matches: []
      });
      {
        RouteContext.displayName = "Route";
      }
      function MemoryRouter(_ref) {
        let {
          basename,
          children,
          initialEntries,
          initialIndex
        } = _ref;
        let historyRef = React2.useRef();
        if (historyRef.current == null) {
          historyRef.current = history.createMemoryHistory({
            initialEntries,
            initialIndex
          });
        }
        let history$1 = historyRef.current;
        let [state, setState] = React2.useState({
          action: history$1.action,
          location: history$1.location
        });
        React2.useLayoutEffect(() => history$1.listen(setState), [history$1]);
        return /* @__PURE__ */ React2.createElement(Router, {
          basename,
          children,
          location: state.location,
          navigationType: state.action,
          navigator: history$1
        });
      }
      function Navigate(_ref2) {
        let {
          to,
          replace,
          state
        } = _ref2;
        !useInRouterContext() ? invariant(false, "<Navigate> may be used only in the context of a <Router> component.") : void 0;
        warning(!React2.useContext(NavigationContext).static, "<Navigate> must not be used on the initial render in a <StaticRouter>. This is a no-op, but you should modify your code so the <Navigate> is only ever rendered in response to some user interaction or state change.");
        let navigate = useNavigate();
        React2.useEffect(() => {
          navigate(to, {
            replace,
            state
          });
        });
        return null;
      }
      function Outlet(_props) {
        return useOutlet();
      }
      function Route(_props) {
        invariant(false, "A <Route> is only ever to be used as the child of <Routes> element, never rendered directly. Please wrap your <Route> in a <Routes>.");
      }
      function Router(_ref3) {
        let {
          basename: basenameProp = "/",
          children = null,
          location: locationProp,
          navigationType = history.Action.Pop,
          navigator,
          static: staticProp = false
        } = _ref3;
        !!useInRouterContext() ? invariant(false, "You cannot render a <Router> inside another <Router>. You should never have more than one in your app.") : void 0;
        let basename = normalizePathname(basenameProp);
        let navigationContext = React2.useMemo(() => ({
          basename,
          navigator,
          static: staticProp
        }), [basename, navigator, staticProp]);
        if (typeof locationProp === "string") {
          locationProp = history.parsePath(locationProp);
        }
        let {
          pathname = "/",
          search = "",
          hash = "",
          state = null,
          key = "default"
        } = locationProp;
        let location = React2.useMemo(() => {
          let trailingPathname = stripBasename(pathname, basename);
          if (trailingPathname == null) {
            return null;
          }
          return {
            pathname: trailingPathname,
            search,
            hash,
            state,
            key
          };
        }, [basename, pathname, search, hash, state, key]);
        warning(location != null, '<Router basename="' + basename + '"> is not able to match the URL ' + ('"' + pathname + search + hash + '" because it does not start with the ') + "basename, so the <Router> won't render anything.");
        if (location == null) {
          return null;
        }
        return /* @__PURE__ */ React2.createElement(NavigationContext.Provider, {
          value: navigationContext
        }, /* @__PURE__ */ React2.createElement(LocationContext.Provider, {
          children,
          value: {
            location,
            navigationType
          }
        }));
      }
      function Routes(_ref4) {
        let {
          children,
          location
        } = _ref4;
        return useRoutes(createRoutesFromChildren(children), location);
      }
      function useHref(to) {
        !useInRouterContext() ? invariant(false, "useHref() may be used only in the context of a <Router> component.") : void 0;
        let {
          basename,
          navigator
        } = React2.useContext(NavigationContext);
        let {
          hash,
          pathname,
          search
        } = useResolvedPath(to);
        let joinedPathname = pathname;
        if (basename !== "/") {
          let toPathname = getToPathname(to);
          let endsWithSlash = toPathname != null && toPathname.endsWith("/");
          joinedPathname = pathname === "/" ? basename + (endsWithSlash ? "/" : "") : joinPaths([basename, pathname]);
        }
        return navigator.createHref({
          pathname: joinedPathname,
          search,
          hash
        });
      }
      function useInRouterContext() {
        return React2.useContext(LocationContext) != null;
      }
      function useLocation() {
        !useInRouterContext() ? invariant(false, "useLocation() may be used only in the context of a <Router> component.") : void 0;
        return React2.useContext(LocationContext).location;
      }
      function useNavigationType() {
        return React2.useContext(LocationContext).navigationType;
      }
      function useMatch(pattern) {
        !useInRouterContext() ? invariant(false, "useMatch() may be used only in the context of a <Router> component.") : void 0;
        return matchPath(pattern, useLocation().pathname);
      }
      function useNavigate() {
        !useInRouterContext() ? invariant(false, "useNavigate() may be used only in the context of a <Router> component.") : void 0;
        let {
          basename,
          navigator
        } = React2.useContext(NavigationContext);
        let {
          matches
        } = React2.useContext(RouteContext);
        let {
          pathname: locationPathname
        } = useLocation();
        let routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase));
        let activeRef = React2.useRef(false);
        React2.useEffect(() => {
          activeRef.current = true;
        });
        let navigate = React2.useCallback(function(to, options) {
          if (options === void 0) {
            options = {};
          }
          warning(activeRef.current, "You should call navigate() in a React.useEffect(), not when your component is first rendered.");
          if (!activeRef.current)
            return;
          if (typeof to === "number") {
            navigator.go(to);
            return;
          }
          let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname);
          if (basename !== "/") {
            path.pathname = joinPaths([basename, path.pathname]);
          }
          (!!options.replace ? navigator.replace : navigator.push)(path, options.state);
        }, [basename, navigator, routePathnamesJson, locationPathname]);
        return navigate;
      }
      function useOutlet() {
        return React2.useContext(RouteContext).outlet;
      }
      function useParams() {
        let {
          matches
        } = React2.useContext(RouteContext);
        let routeMatch = matches[matches.length - 1];
        return routeMatch ? routeMatch.params : {};
      }
      function useResolvedPath(to) {
        let {
          matches
        } = React2.useContext(RouteContext);
        let {
          pathname: locationPathname
        } = useLocation();
        let routePathnamesJson = JSON.stringify(matches.map((match) => match.pathnameBase));
        return React2.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname), [to, routePathnamesJson, locationPathname]);
      }
      function useRoutes(routes, locationArg) {
        !useInRouterContext() ? invariant(false, "useRoutes() may be used only in the context of a <Router> component.") : void 0;
        let {
          matches: parentMatches
        } = React2.useContext(RouteContext);
        let routeMatch = parentMatches[parentMatches.length - 1];
        let parentParams = routeMatch ? routeMatch.params : {};
        let parentPathname = routeMatch ? routeMatch.pathname : "/";
        let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
        let parentRoute = routeMatch && routeMatch.route;
        {
          let parentPath = parentRoute && parentRoute.path || "";
          warningOnce(parentPathname, !parentRoute || parentPath.endsWith("*"), "You rendered descendant <Routes> (or called `useRoutes()`) at " + ('"' + parentPathname + '" (under <Route path="' + parentPath + '">) but the ') + `parent route path has no trailing "*". This means if you navigate deeper, the parent won't match anymore and therefore the child routes will never render.

` + ('Please change the parent <Route path="' + parentPath + '"> to <Route ') + ('path="' + parentPath + '/*">.'));
        }
        let locationFromContext = useLocation();
        let location;
        if (locationArg) {
          var _parsedLocationArg$pa;
          let parsedLocationArg = typeof locationArg === "string" ? history.parsePath(locationArg) : locationArg;
          !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, the location pathname must begin with the portion of the URL pathname that was " + ('matched by all parent routes. The current pathname base is "' + parentPathnameBase + '" ') + ('but pathname "' + parsedLocationArg.pathname + '" was given in the `location` prop.')) : void 0;
          location = parsedLocationArg;
        } else {
          location = locationFromContext;
        }
        let pathname = location.pathname || "/";
        let remainingPathname = parentPathnameBase === "/" ? pathname : pathname.slice(parentPathnameBase.length) || "/";
        let matches = matchRoutes(routes, {
          pathname: remainingPathname
        });
        {
          warning(parentRoute || matches != null, 'No routes matched location "' + location.pathname + location.search + location.hash + '" ');
          warning(matches == null || matches[matches.length - 1].route.element !== void 0, 'Matched leaf route at location "' + location.pathname + location.search + location.hash + '" does not have an element. This means it will render an <Outlet /> with a null value by default resulting in an "empty" page.');
        }
        return _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
          params: Object.assign({}, parentParams, match.params),
          pathname: joinPaths([parentPathnameBase, match.pathname]),
          pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([parentPathnameBase, match.pathnameBase])
        })), parentMatches);
      }
      function createRoutesFromChildren(children) {
        let routes = [];
        React2.Children.forEach(children, (element) => {
          if (!/* @__PURE__ */ React2.isValidElement(element)) {
            return;
          }
          if (element.type === React2.Fragment) {
            routes.push.apply(routes, createRoutesFromChildren(element.props.children));
            return;
          }
          !(element.type === Route) ? invariant(false, "[" + (typeof element.type === "string" ? element.type : element.type.name) + "] is not a <Route> component. All component children of <Routes> must be a <Route> or <React.Fragment>") : void 0;
          let route = {
            caseSensitive: element.props.caseSensitive,
            element: element.props.element,
            index: element.props.index,
            path: element.props.path
          };
          if (element.props.children) {
            route.children = createRoutesFromChildren(element.props.children);
          }
          routes.push(route);
        });
        return routes;
      }
      function generatePath(path, params) {
        if (params === void 0) {
          params = {};
        }
        return path.replace(/:(\w+)/g, (_, key) => {
          !(params[key] != null) ? invariant(false, 'Missing ":' + key + '" param') : void 0;
          return params[key];
        }).replace(/\/*\*$/, (_) => params["*"] == null ? "" : params["*"].replace(/^\/*/, "/"));
      }
      function matchRoutes(routes, locationArg, basename) {
        if (basename === void 0) {
          basename = "/";
        }
        let location = typeof locationArg === "string" ? history.parsePath(locationArg) : locationArg;
        let pathname = stripBasename(location.pathname || "/", basename);
        if (pathname == null) {
          return null;
        }
        let branches = flattenRoutes(routes);
        rankRouteBranches(branches);
        let matches = null;
        for (let i = 0; matches == null && i < branches.length; ++i) {
          matches = matchRouteBranch(branches[i], routes, pathname);
        }
        return matches;
      }
      function flattenRoutes(routes, branches, parentsMeta, parentPath) {
        if (branches === void 0) {
          branches = [];
        }
        if (parentsMeta === void 0) {
          parentsMeta = [];
        }
        if (parentPath === void 0) {
          parentPath = "";
        }
        routes.forEach((route, index) => {
          let meta = {
            relativePath: route.path || "",
            caseSensitive: route.caseSensitive === true,
            childrenIndex: index
          };
          if (meta.relativePath.startsWith("/")) {
            !meta.relativePath.startsWith(parentPath) ? invariant(false, 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.") : void 0;
            meta.relativePath = meta.relativePath.slice(parentPath.length);
          }
          let path = joinPaths([parentPath, meta.relativePath]);
          let routesMeta = parentsMeta.concat(meta);
          if (route.children && route.children.length > 0) {
            !(route.index !== true) ? invariant(false, "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')) : void 0;
            flattenRoutes(route.children, branches, routesMeta, path);
          }
          if (route.path == null && !route.index) {
            return;
          }
          branches.push({
            path,
            score: computeScore(path, route.index),
            routesMeta
          });
        });
        return branches;
      }
      function rankRouteBranches(branches) {
        branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
      }
      const paramRe = /^:\w+$/;
      const dynamicSegmentValue = 3;
      const indexRouteValue = 2;
      const emptySegmentValue = 1;
      const staticSegmentValue = 10;
      const splatPenalty = -2;
      const isSplat = (s) => s === "*";
      function computeScore(path, index) {
        let segments = path.split("/");
        let initialScore = segments.length;
        if (segments.some(isSplat)) {
          initialScore += splatPenalty;
        }
        if (index) {
          initialScore += indexRouteValue;
        }
        return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
      }
      function compareIndexes(a, b) {
        let siblings = a.length === b.length && a.slice(0, -1).every((n, i) => n === b[i]);
        return siblings ? a[a.length - 1] - b[b.length - 1] : 0;
      }
      function matchRouteBranch(branch, routesArg, pathname) {
        let routes = routesArg;
        let {
          routesMeta
        } = branch;
        let matchedParams = {};
        let matchedPathname = "/";
        let matches = [];
        for (let i = 0; i < routesMeta.length; ++i) {
          let meta = routesMeta[i];
          let end = i === routesMeta.length - 1;
          let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
          let match = matchPath({
            path: meta.relativePath,
            caseSensitive: meta.caseSensitive,
            end
          }, remainingPathname);
          if (!match)
            return null;
          Object.assign(matchedParams, match.params);
          let route = routes[meta.childrenIndex];
          matches.push({
            params: matchedParams,
            pathname: joinPaths([matchedPathname, match.pathname]),
            pathnameBase: joinPaths([matchedPathname, match.pathnameBase]),
            route
          });
          if (match.pathnameBase !== "/") {
            matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
          }
          routes = route.children;
        }
        return matches;
      }
      function renderMatches(matches) {
        return _renderMatches(matches);
      }
      function _renderMatches(matches, parentMatches) {
        if (parentMatches === void 0) {
          parentMatches = [];
        }
        if (matches == null)
          return null;
        return matches.reduceRight((outlet, match, index) => {
          return /* @__PURE__ */ React2.createElement(RouteContext.Provider, {
            children: match.route.element !== void 0 ? match.route.element : /* @__PURE__ */ React2.createElement(Outlet, null),
            value: {
              outlet,
              matches: parentMatches.concat(matches.slice(0, index + 1))
            }
          });
        }, null);
      }
      function matchPath(pattern, pathname) {
        if (typeof pattern === "string") {
          pattern = {
            path: pattern,
            caseSensitive: false,
            end: true
          };
        }
        let [matcher, paramNames] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
        let match = pathname.match(matcher);
        if (!match)
          return null;
        let matchedPathname = match[0];
        let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
        let captureGroups = match.slice(1);
        let params = paramNames.reduce((memo, paramName, index) => {
          if (paramName === "*") {
            let splatValue = captureGroups[index] || "";
            pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
          }
          memo[paramName] = safelyDecodeURIComponent(captureGroups[index] || "", paramName);
          return memo;
        }, {});
        return {
          params,
          pathname: matchedPathname,
          pathnameBase,
          pattern
        };
      }
      function compilePath(path, caseSensitive, end) {
        if (caseSensitive === void 0) {
          caseSensitive = false;
        }
        if (end === void 0) {
          end = true;
        }
        warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
        let paramNames = [];
        let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^$?{}|()[\]]/g, "\\$&").replace(/:(\w+)/g, (_, paramName) => {
          paramNames.push(paramName);
          return "([^\\/]+)";
        });
        if (path.endsWith("*")) {
          paramNames.push("*");
          regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
        } else {
          regexpSource += end ? "\\/*$" : "(?:\\b|$)";
        }
        let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
        return [matcher, paramNames];
      }
      function safelyDecodeURIComponent(value, paramName) {
        try {
          return decodeURIComponent(value);
        } catch (error) {
          warning(false, 'The value for the URL param "' + paramName + '" will not be decoded because' + (' the string "' + value + '" is a malformed URL segment. This is probably') + (" due to a bad percent encoding (" + error + ")."));
          return value;
        }
      }
      function resolvePath(to, fromPathname) {
        if (fromPathname === void 0) {
          fromPathname = "/";
        }
        let {
          pathname: toPathname,
          search = "",
          hash = ""
        } = typeof to === "string" ? history.parsePath(to) : to;
        let pathname = toPathname ? toPathname.startsWith("/") ? toPathname : resolvePathname(toPathname, fromPathname) : fromPathname;
        return {
          pathname,
          search: normalizeSearch(search),
          hash: normalizeHash(hash)
        };
      }
      function resolvePathname(relativePath, fromPathname) {
        let segments = fromPathname.replace(/\/+$/, "").split("/");
        let relativeSegments = relativePath.split("/");
        relativeSegments.forEach((segment) => {
          if (segment === "..") {
            if (segments.length > 1)
              segments.pop();
          } else if (segment !== ".") {
            segments.push(segment);
          }
        });
        return segments.length > 1 ? segments.join("/") : "/";
      }
      function resolveTo(toArg, routePathnames, locationPathname) {
        let to = typeof toArg === "string" ? history.parsePath(toArg) : toArg;
        let toPathname = toArg === "" || to.pathname === "" ? "/" : to.pathname;
        let from;
        if (toPathname == null) {
          from = locationPathname;
        } else {
          let routePathnameIndex = routePathnames.length - 1;
          if (toPathname.startsWith("..")) {
            let toSegments = toPathname.split("/");
            while (toSegments[0] === "..") {
              toSegments.shift();
              routePathnameIndex -= 1;
            }
            to.pathname = toSegments.join("/");
          }
          from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
        }
        let path = resolvePath(to, from);
        if (toPathname && toPathname !== "/" && toPathname.endsWith("/") && !path.pathname.endsWith("/")) {
          path.pathname += "/";
        }
        return path;
      }
      function getToPathname(to) {
        return to === "" || to.pathname === "" ? "/" : typeof to === "string" ? history.parsePath(to).pathname : to.pathname;
      }
      function stripBasename(pathname, basename) {
        if (basename === "/")
          return pathname;
        if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
          return null;
        }
        let nextChar = pathname.charAt(basename.length);
        if (nextChar && nextChar !== "/") {
          return null;
        }
        return pathname.slice(basename.length) || "/";
      }
      const joinPaths = (paths) => paths.join("/").replace(/\/\/+/g, "/");
      const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
      const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
      const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
      exports2.MemoryRouter = MemoryRouter;
      exports2.Navigate = Navigate;
      exports2.Outlet = Outlet;
      exports2.Route = Route;
      exports2.Router = Router;
      exports2.Routes = Routes;
      exports2.UNSAFE_LocationContext = LocationContext;
      exports2.UNSAFE_NavigationContext = NavigationContext;
      exports2.UNSAFE_RouteContext = RouteContext;
      exports2.createRoutesFromChildren = createRoutesFromChildren;
      exports2.generatePath = generatePath;
      exports2.matchPath = matchPath;
      exports2.matchRoutes = matchRoutes;
      exports2.renderMatches = renderMatches;
      exports2.resolvePath = resolvePath;
      exports2.useHref = useHref;
      exports2.useInRouterContext = useInRouterContext;
      exports2.useLocation = useLocation;
      exports2.useMatch = useMatch;
      exports2.useNavigate = useNavigate;
      exports2.useNavigationType = useNavigationType;
      exports2.useOutlet = useOutlet;
      exports2.useParams = useParams;
      exports2.useResolvedPath = useResolvedPath;
      exports2.useRoutes = useRoutes;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// ../node_modules/react-router/main.js
var require_main2 = __commonJS({
  "../node_modules/react-router/main.js"(exports, module) {
    init_react();
    "use strict";
    module.exports = false ? null : require_react_router_development();
  }
});

// ../node_modules/react-router-dom/umd/react-router-dom.development.js
var require_react_router_dom_development = __commonJS({
  "../node_modules/react-router-dom/umd/react-router-dom.development.js"(exports, module) {
    init_react();
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require_react(), require_main(), require_main2()) : typeof define === "function" && define.amd ? define(["exports", "react", "history", "react-router"], factory) : (global = global || self, factory(global.ReactRouterDOM = {}, global.React, global.HistoryLibrary, global.ReactRouter));
    })(exports, function(exports2, React, history, reactRouter) {
      "use strict";
      function _extends() {
        _extends = Object.assign || function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
        return _extends.apply(this, arguments);
      }
      function _objectWithoutPropertiesLoose(source, excluded) {
        if (source == null)
          return {};
        var target = {};
        var sourceKeys = Object.keys(source);
        var key, i;
        for (i = 0; i < sourceKeys.length; i++) {
          key = sourceKeys[i];
          if (excluded.indexOf(key) >= 0)
            continue;
          target[key] = source[key];
        }
        return target;
      }
      const _excluded = ["onClick", "reloadDocument", "replace", "state", "target", "to"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to"];
      function warning(cond, message) {
        if (!cond) {
          if (typeof console !== "undefined")
            console.warn(message);
          try {
            throw new Error(message);
          } catch (e) {
          }
        }
      }
      function BrowserRouter(_ref) {
        let {
          basename,
          children,
          window
        } = _ref;
        let historyRef = React.useRef();
        if (historyRef.current == null) {
          historyRef.current = history.createBrowserHistory({
            window
          });
        }
        let history$1 = historyRef.current;
        let [state, setState] = React.useState({
          action: history$1.action,
          location: history$1.location
        });
        React.useLayoutEffect(() => history$1.listen(setState), [history$1]);
        return /* @__PURE__ */ React.createElement(reactRouter.Router, {
          basename,
          children,
          location: state.location,
          navigationType: state.action,
          navigator: history$1
        });
      }
      function HashRouter(_ref2) {
        let {
          basename,
          children,
          window
        } = _ref2;
        let historyRef = React.useRef();
        if (historyRef.current == null) {
          historyRef.current = history.createHashHistory({
            window
          });
        }
        let history$1 = historyRef.current;
        let [state, setState] = React.useState({
          action: history$1.action,
          location: history$1.location
        });
        React.useLayoutEffect(() => history$1.listen(setState), [history$1]);
        return /* @__PURE__ */ React.createElement(reactRouter.Router, {
          basename,
          children,
          location: state.location,
          navigationType: state.action,
          navigator: history$1
        });
      }
      function isModifiedEvent(event) {
        return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
      }
      const Link = /* @__PURE__ */ React.forwardRef(function LinkWithRef(_ref3, ref) {
        let {
          onClick,
          reloadDocument,
          replace = false,
          state,
          target,
          to
        } = _ref3, rest = _objectWithoutPropertiesLoose(_ref3, _excluded);
        let href = reactRouter.useHref(to);
        let internalOnClick = useLinkClickHandler(to, {
          replace,
          state,
          target
        });
        function handleClick(event) {
          if (onClick)
            onClick(event);
          if (!event.defaultPrevented && !reloadDocument) {
            internalOnClick(event);
          }
        }
        return /* @__PURE__ */ React.createElement("a", _extends({}, rest, {
          href,
          onClick: handleClick,
          ref,
          target
        }));
      });
      {
        Link.displayName = "Link";
      }
      const NavLink = /* @__PURE__ */ React.forwardRef(function NavLinkWithRef(_ref4, ref) {
        let {
          "aria-current": ariaCurrentProp = "page",
          caseSensitive = false,
          className: classNameProp = "",
          end = false,
          style: styleProp,
          to
        } = _ref4, rest = _objectWithoutPropertiesLoose(_ref4, _excluded2);
        let location = reactRouter.useLocation();
        let path = reactRouter.useResolvedPath(to);
        let locationPathname = location.pathname;
        let toPathname = path.pathname;
        if (!caseSensitive) {
          locationPathname = locationPathname.toLowerCase();
          toPathname = toPathname.toLowerCase();
        }
        let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/";
        let ariaCurrent = isActive ? ariaCurrentProp : void 0;
        let className;
        if (typeof classNameProp === "function") {
          className = classNameProp({
            isActive
          });
        } else {
          className = [classNameProp, isActive ? "active" : null].filter(Boolean).join(" ");
        }
        let style = typeof styleProp === "function" ? styleProp({
          isActive
        }) : styleProp;
        return /* @__PURE__ */ React.createElement(Link, _extends({}, rest, {
          "aria-current": ariaCurrent,
          className,
          ref,
          style,
          to
        }));
      });
      {
        NavLink.displayName = "NavLink";
      }
      function useLinkClickHandler(to, _temp) {
        let {
          target,
          replace: replaceProp,
          state
        } = _temp === void 0 ? {} : _temp;
        let navigate = reactRouter.useNavigate();
        let location = reactRouter.useLocation();
        let path = reactRouter.useResolvedPath(to);
        return React.useCallback((event) => {
          if (event.button === 0 && (!target || target === "_self") && !isModifiedEvent(event)) {
            event.preventDefault();
            let replace = !!replaceProp || history.createPath(location) === history.createPath(path);
            navigate(to, {
              replace,
              state
            });
          }
        }, [location, navigate, path, replaceProp, state, target, to]);
      }
      function useSearchParams(defaultInit) {
        warning(typeof URLSearchParams !== "undefined", "You cannot use the `useSearchParams` hook in a browser that does not support the URLSearchParams API. If you need to support Internet Explorer 11, we recommend you load a polyfill such as https://github.com/ungap/url-search-params\n\nIf you're unsure how to load polyfills, we recommend you check out https://polyfill.io/v3/ which provides some recommendations about how to load polyfills only for users that need them, instead of for every user.");
        let defaultSearchParamsRef = React.useRef(createSearchParams(defaultInit));
        let location = reactRouter.useLocation();
        let searchParams = React.useMemo(() => {
          let searchParams2 = createSearchParams(location.search);
          for (let key of defaultSearchParamsRef.current.keys()) {
            if (!searchParams2.has(key)) {
              defaultSearchParamsRef.current.getAll(key).forEach((value) => {
                searchParams2.append(key, value);
              });
            }
          }
          return searchParams2;
        }, [location.search]);
        let navigate = reactRouter.useNavigate();
        let setSearchParams = React.useCallback((nextInit, navigateOptions) => {
          navigate("?" + createSearchParams(nextInit), navigateOptions);
        }, [navigate]);
        return [searchParams, setSearchParams];
      }
      function createSearchParams(init) {
        if (init === void 0) {
          init = "";
        }
        return new URLSearchParams(typeof init === "string" || Array.isArray(init) || init instanceof URLSearchParams ? init : Object.keys(init).reduce((memo, key) => {
          let value = init[key];
          return memo.concat(Array.isArray(value) ? value.map((v) => [key, v]) : [[key, value]]);
        }, []));
      }
      Object.defineProperty(exports2, "MemoryRouter", {
        enumerable: true,
        get: function() {
          return reactRouter.MemoryRouter;
        }
      });
      Object.defineProperty(exports2, "Navigate", {
        enumerable: true,
        get: function() {
          return reactRouter.Navigate;
        }
      });
      Object.defineProperty(exports2, "Outlet", {
        enumerable: true,
        get: function() {
          return reactRouter.Outlet;
        }
      });
      Object.defineProperty(exports2, "Route", {
        enumerable: true,
        get: function() {
          return reactRouter.Route;
        }
      });
      Object.defineProperty(exports2, "Router", {
        enumerable: true,
        get: function() {
          return reactRouter.Router;
        }
      });
      Object.defineProperty(exports2, "Routes", {
        enumerable: true,
        get: function() {
          return reactRouter.Routes;
        }
      });
      Object.defineProperty(exports2, "UNSAFE_LocationContext", {
        enumerable: true,
        get: function() {
          return reactRouter.UNSAFE_LocationContext;
        }
      });
      Object.defineProperty(exports2, "UNSAFE_NavigationContext", {
        enumerable: true,
        get: function() {
          return reactRouter.UNSAFE_NavigationContext;
        }
      });
      Object.defineProperty(exports2, "UNSAFE_RouteContext", {
        enumerable: true,
        get: function() {
          return reactRouter.UNSAFE_RouteContext;
        }
      });
      Object.defineProperty(exports2, "createRoutesFromChildren", {
        enumerable: true,
        get: function() {
          return reactRouter.createRoutesFromChildren;
        }
      });
      Object.defineProperty(exports2, "generatePath", {
        enumerable: true,
        get: function() {
          return reactRouter.generatePath;
        }
      });
      Object.defineProperty(exports2, "matchPath", {
        enumerable: true,
        get: function() {
          return reactRouter.matchPath;
        }
      });
      Object.defineProperty(exports2, "matchRoutes", {
        enumerable: true,
        get: function() {
          return reactRouter.matchRoutes;
        }
      });
      Object.defineProperty(exports2, "renderMatches", {
        enumerable: true,
        get: function() {
          return reactRouter.renderMatches;
        }
      });
      Object.defineProperty(exports2, "resolvePath", {
        enumerable: true,
        get: function() {
          return reactRouter.resolvePath;
        }
      });
      Object.defineProperty(exports2, "useHref", {
        enumerable: true,
        get: function() {
          return reactRouter.useHref;
        }
      });
      Object.defineProperty(exports2, "useInRouterContext", {
        enumerable: true,
        get: function() {
          return reactRouter.useInRouterContext;
        }
      });
      Object.defineProperty(exports2, "useLocation", {
        enumerable: true,
        get: function() {
          return reactRouter.useLocation;
        }
      });
      Object.defineProperty(exports2, "useMatch", {
        enumerable: true,
        get: function() {
          return reactRouter.useMatch;
        }
      });
      Object.defineProperty(exports2, "useNavigate", {
        enumerable: true,
        get: function() {
          return reactRouter.useNavigate;
        }
      });
      Object.defineProperty(exports2, "useNavigationType", {
        enumerable: true,
        get: function() {
          return reactRouter.useNavigationType;
        }
      });
      Object.defineProperty(exports2, "useOutlet", {
        enumerable: true,
        get: function() {
          return reactRouter.useOutlet;
        }
      });
      Object.defineProperty(exports2, "useParams", {
        enumerable: true,
        get: function() {
          return reactRouter.useParams;
        }
      });
      Object.defineProperty(exports2, "useResolvedPath", {
        enumerable: true,
        get: function() {
          return reactRouter.useResolvedPath;
        }
      });
      Object.defineProperty(exports2, "useRoutes", {
        enumerable: true,
        get: function() {
          return reactRouter.useRoutes;
        }
      });
      exports2.BrowserRouter = BrowserRouter;
      exports2.HashRouter = HashRouter;
      exports2.Link = Link;
      exports2.NavLink = NavLink;
      exports2.createSearchParams = createSearchParams;
      exports2.useLinkClickHandler = useLinkClickHandler;
      exports2.useSearchParams = useSearchParams;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// ../node_modules/react-router-dom/main.js
var require_main3 = __commonJS({
  "../node_modules/react-router-dom/main.js"(exports, module) {
    init_react();
    "use strict";
    module.exports = false ? null : require_react_router_dom_development();
  }
});

export {
  require_main,
  require_main3 as require_main2
};
/**
 * React Router DOM v6.0.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
/**
 * React Router v6.0.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
//# sourceMappingURL=/build/_shared/chunk-WNH3QF4L.js.map
