/**
 * Modified version of https://github.com/mapbox/rehype-prism
 */

const visit = require('unist-util-visit');
const nodeToString = require('hast-util-to-string');
// const rangeParser = require('parse-numeric-range');

module.exports = () => {
  return tree => {
    visit(tree, 'element', visitor);
  };

  function visitor(node, _i, parent) {
    // Only modify `pre code` tags, ignoring inline styles
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return;
    }

    // Raw value of the `code` block - used for copy/paste
    parent.properties['data-raw'] = nodeToString(node);

    // // Parse any line highlighting syntax and add as a property on the `pre` tag
    // const lineHighlighting = (node.properties.metastring || '').match(/{([\s0-9,-]*)}/);
    // if (lineHighlighting && lineHighlighting[1]) {
    //   parent.properties.highlight = rangeParser(lineHighlighting[1]).join(',');
    // }

    if (node.properties.title) {
      parent.properties['data-title'] = node.properties.title;
    }
  }
};
