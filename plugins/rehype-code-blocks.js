/**
 * Modified version of https://github.com/mapbox/rehype-prism
 */

const visit = require('unist-util-visit');
const nodeToString = require('hast-util-to-string');
const rangeParser = require('parse-numeric-range');

module.exports = options => {
  options = options || {};

  return tree => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, index, parent) {
    // Only modify `pre code` tags, ignoring inline styles
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    const lang = getLanguage(node) || 'text';

    // Add the `lang` property onto the parent `pre`
    parent.properties.lang = lang;

    // Attach the language className to the parent `pre`
    parent.properties.className = (parent.properties.className || []).concat('language-' + lang);

    // Raw value of the `code` block - used for copy/paste
    parent.properties.raw = nodeToString(node);

    // Parse any line highlighting syntax and add as a property on the `pre` tag
    const lineHighlighting = (node.properties.metastring || '').match(/{([\s0-9,-]*)}/);
    if (lineHighlighting && lineHighlighting[1]) {
      parent.properties.highlight = rangeParser(lineHighlighting[1]).join(',');
    }

    if (node.properties.title) {
      parent.properties.title = node.properties.title;
    }
  }
};

// Extracts the language type from the class name
function getLanguage(node) {
  const className = node.properties.className || [];

  for (const classListItem of className) {
    if (classListItem.slice(0, 9) === 'language-') {
      return classListItem.slice(9).toLowerCase();
    }
  }

  return null;
}
