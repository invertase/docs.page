module.exports = {
  webpack: (config) => {
    
    config.module.rules.push({
      test: /\.txt$/,
      use: "raw-loader",
    });

    // Important: return the modified config
    return config;
  },
};
