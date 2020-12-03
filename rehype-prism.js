/**
 * Modified version of https://github.com/mapbox/rehype-prism
 */

const visit = require('unist-util-visit');
const nodeToString = require('hast-util-to-string');
const refractor = require('refractor');

module.exports = options => {
  options = options || {};

  return tree => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    const lang = getLanguage(node);

    if (lang === null) {
      return;
    }

    // Raw value of the `code` block - used for copy/paste
    parent.properties.raw = '';

    let result;
    try {
      parent.properties.className = (parent.properties.className || []).concat('language-' + lang);
      parent.properties.raw = nodeToString(node);
      result = refractor.highlight(parent.properties.raw, lang);
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
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase();
    }
  }

  return null;
}
