const withTM = require("next-transpile-modules")(["react-children-utilities"]);

module.exports = withTM({
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.module.rules.push({
      test: /\.txt$/,
      use: "raw-loader",
    });

    // Important: return the modified config
    return config;
  },
});
