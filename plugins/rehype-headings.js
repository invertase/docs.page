const visit = require('unist-util-visit');
const has = require('hast-util-has-property');
const rank = require('hast-util-heading-rank');
const toString = require('hast-util-to-string');

function headings(options = {}) {
  const allowedHeadings = options.headings || ['h2', 'h3', 'h4', 'h5', 'h6'];
  let nodes = [];

  return tree => {
    visit(tree, 'element', visitor);

    if (options.callback) {
      options.callback(nodes);
    }
  };

  function visitor(node) {
    if (rank(node) && has(node, 'id')) {
      if (allowedHeadings.includes(node.tagName)) {
        nodes.push({
          id: node.properties.id,
          title: toString(node),
          rank: rank(node),
        });
      }
    }
  }
}

module.exports = headings;
