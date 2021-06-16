const sanitizeHtml = require('sanitize-html');
const visit = require('unist-util-visit');
const isHtml = require('is-html');

// If a user provides HTML to a remote markdown file, it needs to
// be valid markup (e.g. closing tags) to be rendered as JSX.
// Using the `sanitize-html` library, we can cleanup any jsx nodes
// found during serialization.
function sanitizeJsx() {
  return tree => {
    console.log(tree);
    visit(tree, 'jsx', visitor);
  };

  function visitor(node) {
    // A `jsx` node might be a HTML element from the Markdown, or a MDX
    // component. We only want to sanitize the HTML ones.
    if (isHtml(node.value)) {
      node.value = sanitizeHtml(node.value, {
        allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
        allowedAttributes: {
          ...sanitizeHtml.defaults.allowedAttributes,
          img: [...sanitizeHtml.defaults.allowedAttributes.img, 'alt', 'width', 'height'],
        },
      });
    } else {
      // TODO: validate any MDX nodes, remove if not found to reduce error page chance
    }
  }
}

module.exports = sanitizeJsx;
