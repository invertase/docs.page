const domains = require('./domains.json');
// const domains = domainList.filter(([domain,repository]) => domain !== 'melos.invertase.dev')
module.exports = {
  experimental: { esmExternals: true },
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
};
