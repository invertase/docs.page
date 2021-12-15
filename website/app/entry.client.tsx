import { hydrate } from "react-dom";
import { RemixBrowser } from "remix";
if (process.env.MSW_ENABLED === '1') { require('../tests/mocks') };
hydrate(<RemixBrowser />, document);
