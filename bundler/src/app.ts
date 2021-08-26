import express, { Request, Response, text, json} from 'express';
import { bundleWithOptions } from './utils/bundle.js';
import { incrementalDebug } from './utils/debug.js';
const PORT = process.env.PORT || 8000;

const app = express();
app.use(text());
app.use(json());

app.get('/', (req, res) => res.send('mdx bundler express app.'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
interface BundleRequest extends Request {
  body: string
  query: {
    headingDepth: string
  }
}

interface RecursiveDebugRequest extends Request {
  body: string
  query: {
    line: string
  }
}

app.post('/bundle', async (req: BundleRequest, res: Response) => {
  const bundled = await bundleWithOptions(req?.body.trim());
  res.send(bundled);
});

app.post('/debug', async (req: RecursiveDebugRequest, res: Response) => {
  console.log(req.query);
  
  const bundled = await incrementalDebug(req?.body?.trim(), parseInt(req.query.line))
  console.log(bundled);
  
  res.send(bundled)
})