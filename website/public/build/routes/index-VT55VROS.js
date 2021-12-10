import {
  React,
  __commonJS,
  __toModule,
  init_react,
  require_main2 as require_main,
  require_react
} from "/build/_shared/chunk-RD6LXAOG.js";

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
var import_react_router_dom = __toModule(require_main());

// ../node_modules/@heroicons/react/solid/esm/index.js
init_react();

// ../node_modules/@heroicons/react/solid/esm/AcademicCapIcon.js
init_react();
var React2 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/AdjustmentsIcon.js
init_react();
var React3 = __toModule(require_react());
function AdjustmentsIcon(props) {
  return /* @__PURE__ */ React3.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, props), /* @__PURE__ */ React3.createElement("path", {
    d: "M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
  }));
}
var AdjustmentsIcon_default = AdjustmentsIcon;

// ../node_modules/@heroicons/react/solid/esm/AnnotationIcon.js
init_react();
var React4 = __toModule(require_react());
function AnnotationIcon(props) {
  return /* @__PURE__ */ React4.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, props), /* @__PURE__ */ React4.createElement("path", {
    fillRule: "evenodd",
    d: "M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z",
    clipRule: "evenodd"
  }));
}
var AnnotationIcon_default = AnnotationIcon;

// ../node_modules/@heroicons/react/solid/esm/ArchiveIcon.js
init_react();
var React5 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowCircleDownIcon.js
init_react();
var React6 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowCircleLeftIcon.js
init_react();
var React7 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowCircleRightIcon.js
init_react();
var React8 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowCircleUpIcon.js
init_react();
var React9 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowDownIcon.js
init_react();
var React10 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowLeftIcon.js
init_react();
var React11 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowNarrowDownIcon.js
init_react();
var React12 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowNarrowLeftIcon.js
init_react();
var React13 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowNarrowRightIcon.js
init_react();
var React14 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowNarrowUpIcon.js
init_react();
var React15 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowRightIcon.js
init_react();
var React16 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowSmDownIcon.js
init_react();
var React17 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowSmLeftIcon.js
init_react();
var React18 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowSmRightIcon.js
init_react();
var React19 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowSmUpIcon.js
init_react();
var React20 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowUpIcon.js
init_react();
var React21 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ArrowsExpandIcon.js
init_react();
var React22 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/AtSymbolIcon.js
init_react();
var React23 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BackspaceIcon.js
init_react();
var React24 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BadgeCheckIcon.js
init_react();
var React25 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BanIcon.js
init_react();
var React26 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BeakerIcon.js
init_react();
var React27 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BellIcon.js
init_react();
var React28 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BookOpenIcon.js
init_react();
var React29 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BookmarkAltIcon.js
init_react();
var React30 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BookmarkIcon.js
init_react();
var React31 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/BriefcaseIcon.js
init_react();
var React32 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CakeIcon.js
init_react();
var React33 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CalculatorIcon.js
init_react();
var React34 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CalendarIcon.js
init_react();
var React35 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CameraIcon.js
init_react();
var React36 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CashIcon.js
init_react();
var React37 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChartBarIcon.js
init_react();
var React38 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChartPieIcon.js
init_react();
var React39 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChartSquareBarIcon.js
init_react();
var React40 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChatAlt2Icon.js
init_react();
var React41 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChatAltIcon.js
init_react();
var React42 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChatIcon.js
init_react();
var React43 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CheckCircleIcon.js
init_react();
var React44 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CheckIcon.js
init_react();
var React45 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronDoubleDownIcon.js
init_react();
var React46 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronDoubleLeftIcon.js
init_react();
var React47 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronDoubleRightIcon.js
init_react();
var React48 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronDoubleUpIcon.js
init_react();
var React49 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronDownIcon.js
init_react();
var React50 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronLeftIcon.js
init_react();
var React51 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronRightIcon.js
init_react();
var React52 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChevronUpIcon.js
init_react();
var React53 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ChipIcon.js
init_react();
var React54 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ClipboardCheckIcon.js
init_react();
var React55 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ClipboardCopyIcon.js
init_react();
var React56 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ClipboardListIcon.js
init_react();
var React57 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ClipboardIcon.js
init_react();
var React58 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ClockIcon.js
init_react();
var React59 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CloudDownloadIcon.js
init_react();
var React60 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CloudUploadIcon.js
init_react();
var React61 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CloudIcon.js
init_react();
var React62 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CodeIcon.js
init_react();
var React63 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CogIcon.js
init_react();
var React64 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CollectionIcon.js
init_react();
var React65 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ColorSwatchIcon.js
init_react();
var React66 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CreditCardIcon.js
init_react();
var React67 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CubeTransparentIcon.js
init_react();
var React68 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CubeIcon.js
init_react();
var React69 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CurrencyBangladeshiIcon.js
init_react();
var React70 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CurrencyDollarIcon.js
init_react();
var React71 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CurrencyEuroIcon.js
init_react();
var React72 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CurrencyPoundIcon.js
init_react();
var React73 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CurrencyRupeeIcon.js
init_react();
var React74 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CurrencyYenIcon.js
init_react();
var React75 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/CursorClickIcon.js
init_react();
var React76 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DatabaseIcon.js
init_react();
var React77 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DesktopComputerIcon.js
init_react();
var React78 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DeviceMobileIcon.js
init_react();
var React79 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DeviceTabletIcon.js
init_react();
var React80 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentAddIcon.js
init_react();
var React81 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentDownloadIcon.js
init_react();
var React82 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentDuplicateIcon.js
init_react();
var React83 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentRemoveIcon.js
init_react();
var React84 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentReportIcon.js
init_react();
var React85 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentSearchIcon.js
init_react();
var React86 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentTextIcon.js
init_react();
var React87 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DocumentIcon.js
init_react();
var React88 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DotsCircleHorizontalIcon.js
init_react();
var React89 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DotsHorizontalIcon.js
init_react();
var React90 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DotsVerticalIcon.js
init_react();
var React91 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DownloadIcon.js
init_react();
var React92 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/DuplicateIcon.js
init_react();
var React93 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/EmojiHappyIcon.js
init_react();
var React94 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/EmojiSadIcon.js
init_react();
var React95 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ExclamationCircleIcon.js
init_react();
var React96 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ExclamationIcon.js
init_react();
var React97 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ExternalLinkIcon.js
init_react();
var React98 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/EyeOffIcon.js
init_react();
var React99 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/EyeIcon.js
init_react();
var React100 = __toModule(require_react());
function EyeIcon(props) {
  return /* @__PURE__ */ React100.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, props), /* @__PURE__ */ React100.createElement("path", {
    d: "M10 12a2 2 0 100-4 2 2 0 000 4z"
  }), /* @__PURE__ */ React100.createElement("path", {
    fillRule: "evenodd",
    d: "M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z",
    clipRule: "evenodd"
  }));
}
var EyeIcon_default = EyeIcon;

// ../node_modules/@heroicons/react/solid/esm/FastForwardIcon.js
init_react();
var React101 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FilmIcon.js
init_react();
var React102 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FilterIcon.js
init_react();
var React103 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FingerPrintIcon.js
init_react();
var React104 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FireIcon.js
init_react();
var React105 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FlagIcon.js
init_react();
var React106 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FolderAddIcon.js
init_react();
var React107 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FolderDownloadIcon.js
init_react();
var React108 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FolderOpenIcon.js
init_react();
var React109 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FolderRemoveIcon.js
init_react();
var React110 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/FolderIcon.js
init_react();
var React111 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/GiftIcon.js
init_react();
var React112 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/GlobeAltIcon.js
init_react();
var React113 = __toModule(require_react());
function GlobeAltIcon(props) {
  return /* @__PURE__ */ React113.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, props), /* @__PURE__ */ React113.createElement("path", {
    fillRule: "evenodd",
    d: "M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z",
    clipRule: "evenodd"
  }));
}
var GlobeAltIcon_default = GlobeAltIcon;

// ../node_modules/@heroicons/react/solid/esm/GlobeIcon.js
init_react();
var React114 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/HandIcon.js
init_react();
var React115 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/HashtagIcon.js
init_react();
var React116 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/HeartIcon.js
init_react();
var React117 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/HomeIcon.js
init_react();
var React118 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/IdentificationIcon.js
init_react();
var React119 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/InboxInIcon.js
init_react();
var React120 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/InboxIcon.js
init_react();
var React121 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/InformationCircleIcon.js
init_react();
var React122 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/KeyIcon.js
init_react();
var React123 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LibraryIcon.js
init_react();
var React124 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LightBulbIcon.js
init_react();
var React125 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LightningBoltIcon.js
init_react();
var React126 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LinkIcon.js
init_react();
var React127 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LocationMarkerIcon.js
init_react();
var React128 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LockClosedIcon.js
init_react();
var React129 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LockOpenIcon.js
init_react();
var React130 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LoginIcon.js
init_react();
var React131 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/LogoutIcon.js
init_react();
var React132 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MailOpenIcon.js
init_react();
var React133 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MailIcon.js
init_react();
var React134 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MapIcon.js
init_react();
var React135 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MenuAlt1Icon.js
init_react();
var React136 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MenuAlt2Icon.js
init_react();
var React137 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MenuAlt3Icon.js
init_react();
var React138 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MenuAlt4Icon.js
init_react();
var React139 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MenuIcon.js
init_react();
var React140 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MicrophoneIcon.js
init_react();
var React141 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MinusCircleIcon.js
init_react();
var React142 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MinusSmIcon.js
init_react();
var React143 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MinusIcon.js
init_react();
var React144 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MoonIcon.js
init_react();
var React145 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/MusicNoteIcon.js
init_react();
var React146 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/NewspaperIcon.js
init_react();
var React147 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/OfficeBuildingIcon.js
init_react();
var React148 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PaperAirplaneIcon.js
init_react();
var React149 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PaperClipIcon.js
init_react();
var React150 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PauseIcon.js
init_react();
var React151 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PencilAltIcon.js
init_react();
var React152 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PencilIcon.js
init_react();
var React153 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PhoneIncomingIcon.js
init_react();
var React154 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PhoneMissedCallIcon.js
init_react();
var React155 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PhoneOutgoingIcon.js
init_react();
var React156 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PhoneIcon.js
init_react();
var React157 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PhotographIcon.js
init_react();
var React158 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PlayIcon.js
init_react();
var React159 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PlusCircleIcon.js
init_react();
var React160 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PlusSmIcon.js
init_react();
var React161 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PlusIcon.js
init_react();
var React162 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PresentationChartBarIcon.js
init_react();
var React163 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PresentationChartLineIcon.js
init_react();
var React164 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PrinterIcon.js
init_react();
var React165 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/PuzzleIcon.js
init_react();
var React166 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/QrcodeIcon.js
init_react();
var React167 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/QuestionMarkCircleIcon.js
init_react();
var React168 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ReceiptRefundIcon.js
init_react();
var React169 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ReceiptTaxIcon.js
init_react();
var React170 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/RefreshIcon.js
init_react();
var React171 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ReplyIcon.js
init_react();
var React172 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/RewindIcon.js
init_react();
var React173 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/RssIcon.js
init_react();
var React174 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SaveAsIcon.js
init_react();
var React175 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SaveIcon.js
init_react();
var React176 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ScaleIcon.js
init_react();
var React177 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ScissorsIcon.js
init_react();
var React178 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SearchCircleIcon.js
init_react();
var React179 = __toModule(require_react());
function SearchCircleIcon(props) {
  return /* @__PURE__ */ React179.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, props), /* @__PURE__ */ React179.createElement("path", {
    d: "M9 9a2 2 0 114 0 2 2 0 01-4 0z"
  }), /* @__PURE__ */ React179.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a4 4 0 00-3.446 6.032l-2.261 2.26a1 1 0 101.414 1.415l2.261-2.261A4 4 0 1011 5z",
    clipRule: "evenodd"
  }));
}
var SearchCircleIcon_default = SearchCircleIcon;

// ../node_modules/@heroicons/react/solid/esm/SearchIcon.js
init_react();
var React180 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SelectorIcon.js
init_react();
var React181 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ServerIcon.js
init_react();
var React182 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ShareIcon.js
init_react();
var React183 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ShieldCheckIcon.js
init_react();
var React184 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ShieldExclamationIcon.js
init_react();
var React185 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ShoppingBagIcon.js
init_react();
var React186 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ShoppingCartIcon.js
init_react();
var React187 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SortAscendingIcon.js
init_react();
var React188 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SortDescendingIcon.js
init_react();
var React189 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SparklesIcon.js
init_react();
var React190 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SpeakerphoneIcon.js
init_react();
var React191 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/StarIcon.js
init_react();
var React192 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/StatusOfflineIcon.js
init_react();
var React193 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/StatusOnlineIcon.js
init_react();
var React194 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/StopIcon.js
init_react();
var React195 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SunIcon.js
init_react();
var React196 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SupportIcon.js
init_react();
var React197 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SwitchHorizontalIcon.js
init_react();
var React198 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/SwitchVerticalIcon.js
init_react();
var React199 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TableIcon.js
init_react();
var React200 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TagIcon.js
init_react();
var React201 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TemplateIcon.js
init_react();
var React202 = __toModule(require_react());
function TemplateIcon(props) {
  return /* @__PURE__ */ React202.createElement("svg", Object.assign({
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    "aria-hidden": "true"
  }, props), /* @__PURE__ */ React202.createElement("path", {
    d: "M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
  }));
}
var TemplateIcon_default = TemplateIcon;

// ../node_modules/@heroicons/react/solid/esm/TerminalIcon.js
init_react();
var React203 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ThumbDownIcon.js
init_react();
var React204 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ThumbUpIcon.js
init_react();
var React205 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TicketIcon.js
init_react();
var React206 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TranslateIcon.js
init_react();
var React207 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TrashIcon.js
init_react();
var React208 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TrendingDownIcon.js
init_react();
var React209 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TrendingUpIcon.js
init_react();
var React210 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/TruckIcon.js
init_react();
var React211 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/UploadIcon.js
init_react();
var React212 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/UserAddIcon.js
init_react();
var React213 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/UserCircleIcon.js
init_react();
var React214 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/UserGroupIcon.js
init_react();
var React215 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/UserRemoveIcon.js
init_react();
var React216 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/UserIcon.js
init_react();
var React217 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/UsersIcon.js
init_react();
var React218 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/VariableIcon.js
init_react();
var React219 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/VideoCameraIcon.js
init_react();
var React220 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ViewBoardsIcon.js
init_react();
var React221 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ViewGridAddIcon.js
init_react();
var React222 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ViewGridIcon.js
init_react();
var React223 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ViewListIcon.js
init_react();
var React224 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/VolumeOffIcon.js
init_react();
var React225 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/VolumeUpIcon.js
init_react();
var React226 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/WifiIcon.js
init_react();
var React227 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/XCircleIcon.js
init_react();
var React228 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/XIcon.js
init_react();
var React229 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ZoomInIcon.js
init_react();
var React230 = __toModule(require_react());

// ../node_modules/@heroicons/react/solid/esm/ZoomOutIcon.js
init_react();
var React231 = __toModule(require_react());

// app/routes/index.tsx
var meta = () => {
  return {
    title: "docs.page | Create an instant Open Source docs page with zero configuration.",
    description: "Create an instant Open Source docs page with zero configuration.",
    "og:title": "docs.page",
    "og:description": "Create an instant Open Source docs page with zero configuration.",
    "og:image": "http://docs.page/assets/docs-page-social.png",
    "og:url": "http://docs.page",
    "twitter:title": "docs.page",
    "twitter:description": "Create an instant Open Source docs page with zero configuration.",
    "og:image": "http://docs.page/assets/docs-page-social.png"
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
    icon: /* @__PURE__ */ React.createElement(AdjustmentsIcon_default, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/previews",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-pink-400"
    }, "Previews"),
    text: /* @__PURE__ */ React.createElement("span", null, "Previewing docs locally with our new Local Preview Mode. Previewing changes on branches and pull requests works out of the box with zero configuration. Install our GitHub bot for preview assistance."),
    icon: /* @__PURE__ */ React.createElement(EyeIcon_default, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/components",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-yellow-400"
    }, "Components"),
    text: /* @__PURE__ */ React.createElement("span", null, "By using MDX we provide custom React components to help you build better documentation."),
    icon: /* @__PURE__ */ React.createElement(TemplateIcon_default, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/custom-domains",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-green-400"
    }, "Domains"),
    text: /* @__PURE__ */ React.createElement("span", null, "Using a custom domain name? Simply create a pull request & point your domain to our servers. We'll take care of the rest."),
    icon: /* @__PURE__ */ React.createElement(GlobeAltIcon_default, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/github-bot",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-purple-500"
    }, "GitHub Bot"),
    text: /* @__PURE__ */ React.createElement("span", null, "Install our GitHub bot on repositories using docs.page. Any new Pull Requests will automatically display a publicly available deployment preview URL for your documentation."),
    icon: /* @__PURE__ */ React.createElement(AnnotationIcon_default, {
      width: 80
    })
  }), /* @__PURE__ */ React.createElement(Feature, {
    href: "https://use.docs.page/search",
    title: /* @__PURE__ */ React.createElement("span", {
      className: "text-red-500"
    }, "Search"),
    text: /* @__PURE__ */ React.createElement("span", null, "Add your DocSearch application ID to your configuration file and instantly get full blown documentation search for free, powered by Algolia."),
    icon: /* @__PURE__ */ React.createElement(SearchCircleIcon_default, {
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
export {
  Index as default,
  meta
};
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
//# sourceMappingURL=/build/routes/index-VT55VROS.js.map
