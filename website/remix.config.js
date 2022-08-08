/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  devServerPort: 8002,
  appDirectory: 'app',
  assetsBuildDirectory: 'public/_docs.page',
  ignoredRouteFiles: ['.*'],
  publicPath: '/_docs.page/',
  // serverBuildDirectory: "server/build",
  serverBuildPath: 'server/build/index.js',
  serverBuildTarget: 'node-cjs',
  serverDependenciesToBundle: ['react-medium-image-zoom'],
};
