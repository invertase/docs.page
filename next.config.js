const withTM = require('next-transpile-modules')([
  'hast-util-heading-rank',
  'hast-util-has-property',
  'hast-util-to-text',
  'unist-util-find-after',
]);

const domains = require('./domains.json');

// https://vercel.com/docs/environment-variables#system-environment-variables
// const env = process.env.VERCEL_ENV;

// const host =
//   env === 'production' ? 'docs.page' : env === 'preview' ? process.env.VERCEL_URL : 'localhost';

module.exports = withTM({
  // async redirects() {
  //   const redirects = domains.map(([domain, repository]) => {
  //     const [organization, repo] = repository.split('/');

  //     return {
  //       // TODO handle refs? -> `/${organization}/${repo}~:ref/:path*`,
  //       source: `/${organization}/${repo}/:path*`,
  //       has: [
  //         {
  //           type: 'host',
  //           value: host,
  //         },
  //       ],
  //       destination:
  //         process.env.NODE_ENV === 'production'
  //           ? `https://${domain}/:path*`
  //           : `http://${domain}:${process.env.PORT || 3000}/:path*`,
  //       permanent: true,
  //     };
  //   });

  //   return [
  //     {
  //       source: '/robots.txt',
  //       destination: '/res/robots.txt',
  //       permanent: true,
  //     },
  //     ...redirects,
  //   ];
  // },
  async rewrites() {
    const beforeFiles = domains.map(([domain, repository]) => {
      const [organization, repo] = repository.split('/');
      return {
        source: '/',
        has: [
          {
            type: 'host',
            value: domain,
          },
        ],
        destination: `/${organization}/${repo}`,
      };
    });

    const afterFiles = [];
    domains.forEach(([domain, repository]) => {
      const [organization, repo] = repository.split('/');

      // beforeFiles sends the request here to afterFiles, so we need to
      // make sure we don't double prefix the org/repo to the request.
      afterFiles.push({
        source: `/${organization}/${repo}`,
        has: [
          {
            type: 'host',
            value: domain,
          },
        ],
        destination: `/${organization}/${repo}`,
      });

      afterFiles.push({
        source: `/:path*`,
        has: [
          {
            type: 'host',
            value: domain,
          },
        ],
        destination: `/${organization}/${repo}/:path*`,
      });
    });

    return {
      beforeFiles,
      afterFiles,
    };
  },
});
