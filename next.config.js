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
    // TODO: Not sure if this will work - since the pages wont be rendered because of the rewrites?
    // const redirects = domains.map(([domain, repository]) => {
    //   const [organization, repo] = repository.split('/');

    //   return {
    //     source: `/${organization}/${repo}~ref/:path*`,
    //     has: [
    //       {
    //         type: 'host',
    //         value: 'docs.page',
    //       },
    //     ],
    //     destination: `https://${domain}/~ref/:path*`,
    //   };
    // });

    return [
      {
        source: '/robots.txt',
        destination: '/res/robots.txt',
        permanent: true,
      },
      // ...redirects,
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
