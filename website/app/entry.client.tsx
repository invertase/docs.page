import { hydrate } from 'react-dom';
import { RemixBrowser } from 'remix';
//@ts-ignore
if (window.ENV.MSW_ENABLED === '1') {
  require('../tests/mocks');
}

if (
  //@ts-ignore
  window.ENV.NODE_ENV === 'production' &&
  window.location.host !== 'docs.page'
) {
  window.__remixManifest.routes['routes/$owner.$repo.$'].path = '*';
  window.__remixManifest.routes['routes/$owner.$repo.$'].index = false;
  delete window.__remixManifest.routes['routes/index'];
  delete window.__remixManifest.routes['routes/preview'];
  delete window.__remixManifest.routes['routes/preview-fetch'];
  window.__remixManifest.routes['routes/$owner.$repo.$2'] = Object.assign(
    {},
    window.__remixManifest.routes['routes/$owner.$repo.$'],
  );
  window.__remixManifest.routes['routes/$owner.$repo.$2'].path = '/';
}

hydrate(<RemixBrowser />, document);
