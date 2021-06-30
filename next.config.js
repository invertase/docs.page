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
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Catch any `https://docs.page` or `https://customdomain.com` requests are prepend the host
        {
          source: '/',
          has: [
            {
              type: 'host',
              value: '(?<host>.*)',
            },
          ],
          destination: '/:host',
        },
      ],
      afterFiles: [
        // Catch all other requests and prepend the host
        {
          source: `/:path*`,
          has: [
            {
              type: 'host',
              value: '(?<domain>.*)',
            },
          ],
          destination: `/:domain/:path*`,
        },
      ],
    };
  },
});
