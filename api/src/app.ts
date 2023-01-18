import express, { Router, text } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';

import bundle from './routes/bundle';
import mdx from './routes/mdx';
import probot from './probot';
import { notFound } from './res';

config();
const PORT = process.env.PORT || 8000;

const app = express();

app.use(text());
app.use(cors());
app.options('/raw', (_req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end;
});
app.use(morgan('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(probot);

const router = Router();
router.get('/status', (_, res) => res.status(200).send('OK'));
router.get('/bundle', bundle);
router.post('/mdx', mdx);
router.all('*', (_, res) => notFound(res));

app.use(router);

app.listen(PORT, () => {
  console.log(`docs.page api server is running at http://localhost:${PORT}`);
});
