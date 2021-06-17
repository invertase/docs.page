const fs = require('fs');
const path = require('path');

module.exports = {
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
    const domains = fs
      .readFileSync(path.join(process.cwd(), 'domains.txt'), 'utf-8')
      .split('\n')
      .map(line => line.split(' '))
      .filter(line => line.length === 2);

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
