import { hydrate } from 'react-dom';
import { RemixBrowser } from 'remix';
//@ts-ignore
if (window.ENV.MSW_ENABLED === '1') {
  require('../tests/mocks');
}

if (
  process.env.NODE_ENV === 'production' &&
  window.location.hostname !== 'localhost' &&
  window.location.hostname !== 'docs.page'
) {
  window.__remixManifest.routes['routes/$owner.$repo.$'].path = '*';
  window.__remixManifest.routes['root'].path = '*';
  window.__remixManifest.routes['routes/$owner.$repo.$'].index = false;
  delete window.__remixManifest.routes['routes/index'];
  delete window.__remixManifest.routes['routes/preview'];
  delete window.__remixManifest.routes['routes/preview-fetch'];
}

hydrate(<RemixBrowser />, document);
