import { render, hydrate } from 'react-dom';
import { RemixBrowser } from 'remix';
//@ts-ignore
if (window.ENV.MSW_ENABLED === '1') {
  require('../tests/mocks');
}
render(<RemixBrowser />, document);
