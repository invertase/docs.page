import express, { Response, text, json } from 'express';
import { bundleWithOptions } from './utils/bundle.js';
import { incrementalDebug } from './utils/debug.js';
const PORT = process.env.PORT || 8000;
import jsonwebtoken from 'jsonwebtoken';
import { BundleRequest, RecursiveDebugRequest } from './types.js';

const app = express();

app.use(text());
app.use(json());
// app.use(jwt({ secret: 'secret-for-bundler', algorithms: ['HS256'] }).unless({ path: ['/token'] }));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Bundler is running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => res.send('Welcome to the MDX bundler server.'));

// authenticate
app.post('/token', function (req, res) {
  res.send('foobar');
  // const { username, password } = req?.body;

  // console.log('user', username);
  // console.log('password', password);

  // if (username === process.env.USERNAME && password === process.env.PASSWORD) {
  //   console.log('auth ok');

  //   const token = jsonwebtoken.sign({ username: 'bundler' }, 'secret-for-bundler', {
  //     expiresIn: 120,
  //   });
  //   res.send(token);
  // }
  // res.sendStatus(401);
});

// Endpoints

// just bundles using mdx-bundler
app.post('/bundle', async (req: BundleRequest, res: Response) => {
  const { headingDepth } = req.query;
  console.log(req);

  const bundled = await bundleWithOptions(req?.body, parseInt(headingDepth) ?? 3);
  res.send(bundled);
});

// incrementally bundles a faulty mdx file, stops and returns partial bundle failing line
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