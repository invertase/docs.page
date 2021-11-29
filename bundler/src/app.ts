import express, { Response, text, json } from 'express';
import { bundleWithOptions } from './utils/bundle.js';
import { incrementalDebug } from './utils/debug.js';
import { BundleRequest, RecursiveDebugRequest } from './types.js';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(text());
app.use(json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Bundler is running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => res.send('Welcome to the docs.page MDX bundler service.'));

app.post('/bundle', async (req: BundleRequest, res: Response) => {
  const { headingDepth } = req.query;
  const bundled = await bundleWithOptions(req?.body, parseInt(headingDepth) ?? 3);
  res.send(bundled);
});

// Incrementally bundles a faulty mdx file, stops and returns partial bundle failing line.
app.post('/debug', async (req: RecursiveDebugRequest, res: Response) => {
  const bundled = await incrementalDebug(req?.body, parseInt(req.query.line));
  res.send(bundled);
});

app.post('/typedoc', async (req: BundleRequest, res: Response) => {
  const { headingDepth } = req.query;
  const escapedMdx = req.body.replaceAll(/(?<!\\)</g, '\\<');
  const bundled = await bundleWithOptions(escapedMdx, parseInt(headingDepth) ?? 3);
  res.send(bundled);
});
