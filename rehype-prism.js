/**
 * Modified version of https://github.com/mapbox/rehype-prism
 *
 * Instead of converting every single code block with a language tag with refractor,
 * we first check whether the `live` tag is present, which leaves the code untouched
 * to allow `react-live` to handle the formatting and output.
 */

const visit = require("unist-util-visit");
const nodeToString = require("hast-util-to-string");
const refractor = require("refractor");

module.exports = (options) => {
  options = options || {};

  return (tree) => {
    visit(tree, "element", visitor);
  };

  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== "pre" || node.tagName !== "code") {
      return;
    }

    const lang = getLanguage(node);

    if (lang === null) {
      return;
    }
    
    // If the lang is jsx and the user has added the `live` tag, ignore this node
    if (lang === 'jsx' && node.properties.live === true) {
      parent.properties.live = 'true';
      return;
    }

    // Force the `live` property to false (as string) if it's not JSX
    parent.properties.live = 'false';

    let result;
    try {
      parent.properties.className = (parent.properties.className || []).concat(
        "language-" + lang
      );
      result = refractor.highlight(nodeToString(node), lang);
    } catch (err) {
      if (/Unknown language/.test(err.message)) {
        return;
      }
      throw err;
    }

    node.children = result;
  }
};

function getLanguage(node) {
  const className = node.properties.className || [];

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === "language-") {
      return classListItem.slice(9).toLowerCase();
    }
  }

  return null;
}
