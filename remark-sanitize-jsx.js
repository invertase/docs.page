const sanitizeHtml = require('sanitize-html');
const visit = require('unist-util-visit');

// If a user provides HTML to a remote markdown file, it needs to 
// be valid markup (e.g. closing tags) to be rendered as JSX.
// Using the `sanitize-html` library, we can cleanup any jsx nodes
// found during serialization.
function closeTags() {
  return tree => {
    visit(tree, 'jsx', visitor);
  };

  function visitor(node, index, parent) {
    node.value = sanitizeHtml(node.value, {
      allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    });
  }
}

module.exports = closeTags;
