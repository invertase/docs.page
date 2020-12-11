module.exports = {
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
};
