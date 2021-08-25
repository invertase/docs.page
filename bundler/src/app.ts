import express, {Request, Response, text} from 'express';
import rateLimit from "express-rate-limit";

import {_debug} from './utils/debug.js'
const PORT = process.env.PORT || 8000;

const app = express();
app.use(text());

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 1000
});

app.use('/bundle', apiLimiter)

app.get('/', (req, res) => res.send('Express + TypeScript Server With ESM'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is totally running at http://localhost:${PORT}`);
});

app.post('/bundle', async (req: Request, res: Response) => {
  const bundled = await _debug(req?.body?.trim())
  res.send(bundled)
})