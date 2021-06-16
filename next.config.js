// unified plugins are shipping ESM only now
const withTM = require('next-transpile-modules')([
  'hast-util-heading-rank',
  'hast-util-has-property',
  'hast-util-to-text',
  'unist-util-find-after',
]);

module.exports = withTM({
  async redirects() {
    return [
      {
        source: '/robots.txt',
        destination: '/res/robots.txt',
        permanent: true,
      },
      {
        source: '/:slug',
        destination: '/',
        permanent: true,
      },
    ];
  },
});
