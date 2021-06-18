const fs = require('fs');
const path = require('path');

// Extract an array of domains and repositories
const domains = fs
  .readFileSync(path.join(process.cwd(), 'domains.txt'), 'utf-8')
  .split('\n')
  .map(line => line.split(' '))
  .filter(line => line.length === 2);

module.exports = {
  async redirects() {
    // TODO: handle refs
    const redirects = domains.map(([domain, repository]) => {
      const [organization, repo] = repository.split('/');

      return {
        source: `/${organization}/${repo}/:path*`,
        has: [
          {
            type: 'host',
            value: process.env.NODE_ENV === 'production' ? 'docs.page' : 'localhost',
          },
        ],
        destination:
          process.env.NODE_ENV === 'production'
            ? `https://${domain}/:path*`
            : `http://${domain}:${process.env.PORT}/:path*`,
        permanent: true,
      };
    });

    return [
      {
        source: '/robots.txt',
        destination: '/res/robots.txt',
        permanent: true,
      },
      ...redirects,
    ];
  },
  async rewrites() {
    return {
      beforeFiles: domains.map(([domain, repository]) => {
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
      }),
      afterFiles: domains.map(([domain, repository]) => {
        const [organization, repo] = repository.split('/');

        return {
          // Map all incoming requests
          source: '/:path*',
          // Only where the domain matches the one provided
          has: [
            {
              type: 'host',
              value: domain,
            },
          ],
          destination: `/${organization}/${repo}/:path*`,
        };
      }),
    };
  },
};
