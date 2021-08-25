import express, { Request, Response, text, json} from 'express';
import { _debug } from './utils/debug.js';
const PORT = process.env.PORT || 8000;

const app = express();
app.use(text());
app.use(json());

app.get('/', (req, res) => res.send('mdx bundler express app.'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

app.post('/debug', async (req: Request, res: Response) => {
  const bundled = await _debug(req?.body?.trim());
  res.send(bundled);
});

interface BundleRequest extends Request {
  body: string
  query: {
    headingDepth: string
  }
}

app.post('/bundle', async (req: BundleRequest, res: Response) => {
  const headingDepth = parseInt(req.query.headingDepth) || 2

  const bundled = await _debug(req?.body.trim(),headingDepth);
  res.send(bundled);
});