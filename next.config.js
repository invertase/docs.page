module.exports = {
  async redirects() {
    return [
      {
        source: '/:slug',
        destination: '/', // Matched parameters can be used in the destination
        permanent: true,
      },
    ];
  },
};
