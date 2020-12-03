const visit = require("unist-util-visit");
const { selectAll } = require("hast-util-select");
const parseSelector = require("hast-util-parse-selector");

const selector = ".markdown > *";
const wrapper = ".prose dark:prose-dark";

/**
 * A custom rehype tree parser.
 * 
 * 1. Wrap the entire tree in a `div.markdown` node.
 * 2. Target all direct children (> *) of the `div.markdown` node
 * 3. For each child, check whether it is a `pre` element with the `live`property
 *    (created via `rehype-prism.js`).
 * 4. If the child is not that element, wrap it in a div with a Tailwind `prose`
 *    class. The contents are then wrapped in another an empty div to prevent Tailwind
 *    from removing margins.
 */
module.exports = () => {
  return (tree) => {
    // Wrap everything within a "markdown" div
    const topLevelWrapper = parseSelector("div.markdown");
    topLevelWrapper.children = tree.children;
    tree.children = [topLevelWrapper];

    for (const match of selectAll(selector, tree)) {
      visit(tree, match, (node, i, parent) => {
        if (match.tagName === "pre" && match.properties.live === "true") {
          return;
        }

        const emptyWrapperWithCurrentNode = parseSelector("div");
        emptyWrapperWithCurrentNode.children = [node];

        // Create an element to wrap the selected element in
        const wrap = parseSelector(wrapper);
        wrap.children = [emptyWrapperWithCurrentNode];

        parent.children[i] = wrap;
      });
    }
  };
};
