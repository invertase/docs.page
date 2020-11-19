module.exports = {
  webpack: (config) => {
    
    // https://github.com/FormidableLabs/react-live#what-bundle-size-can-i-expect
    config.resolve.alias['buble'] = '@philpl/buble';

    // TODO: remove if no domain loading is required locally
    config.module.rules.push({
      test: /\.txt$/,
      use: "raw-loader",
    });

    // Important: return the modified config
    return config;
  },
};
