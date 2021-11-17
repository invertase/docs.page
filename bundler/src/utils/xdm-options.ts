/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// TODO type everything
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import remarkStyleBadges from './plugins/remark-style-badges.js';
import { headerDepthToHeaderList } from './bundle.js';
import rehypeHeadings from './plugins/rehype-headings.js';
import remarkComponentCheck from './plugins/remark-component-check.js';
import remarkUndeclaredVariables from './plugins/remark-undeclared-variables.js';
import rehypeCodeBlocks from './plugins/rehype-code-blocks.js';
import rehypePluginMy from './plugins/remark-style-badges.js';

export const setupXdmOptions = ({
  output,
  headingDepth,
}: {
  output: any;
  headingDepth?: number;
}) => {
  const remarkPlugins = [
    // Checks for undefined components, converts them to text:
    [
      remarkComponentCheck,
      {
        callback: output.warnings.push.bind(output.warnings),
      },
    ],
    // Checks for undeclared variables, converts them to text:
    [
      remarkUndeclaredVariables,
      {
        callback: output.warnings.push.bind(output.warnings),
      },
    ],
    // Support GitHub flavoured markdown
    remarkGfm,
    // Ensure any `img` tags are not wrapped in `p` tags
  ];

  const rehypePlugins = [
    rehypeCodeBlocks,
    // Add an `id` to all heading tags
    rehypeSlug,
    rehypePluginMy,
    [
      rehypeHeadings,
      {
        headings: headerDepthToHeaderList(headingDepth || 3),
        callback: (headings: any) => {
          output.headings = headings;
        },
      },
    ],
    // Make emojis accessible
    rehypeAccessibleEmojis,
  ];
  return {
    xdmOptions: function xdmOptions(options: any) {
      // @ts-ignore TODO fix types
      options.remarkPlugins = [...(options.remarkPlugins ?? []), ...remarkPlugins];
      // @ts-ignore TODO fix types
      options.rehypePlugins = [...(options.rehypePlugins ?? []), ...rehypePlugins];

      return options;
    },
  };
};
