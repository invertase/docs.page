const path = require('path');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { createRequestHandler } = require('@remix-run/express');

const MODE = process.env.NODE_ENV;
const BUILD_DIR = path.join(process.cwd(), 'server/build');

const app = express();
app.use(compression());
app.disable('x-powered-by');

// You may want to be more aggressive with this caching
app.use(express.static('public', { maxAge: '1h' }));

// Remix fingerprints its assets so we can cache forever
app.use(express.static('public/_docs.page', { immutable: true, maxAge: '1y' }));

// TODO switch to Bunyan for GCP logging in prod; https://cloud.google.com/logging/docs/setup/nodejs
app.use(
  morgan('tiny', {
    skip: function (req) {
      // Skipp logging assets.
      return req.path.includes('_docs.page') || req.path.includes('favicon.ico');
    },
  }),
);
app.all(
  '*',
  MODE === 'production'
    ? createRequestHandler({ build: require('./build') })
    : (req, res, next) => {
        purgeRequireCache();
        const build = require('./build');
        return createRequestHandler({ build, mode: MODE })(req, res, next);
      },
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`docs.page web server listening on port ${port}`);
});

////////////////////////////////////////////////////////////////////////////////
function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, we prefer the DX of this though, so we've included it
  // for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
