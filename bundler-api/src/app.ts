import express, { text } from 'express';
import routes from './routes.js';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';

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
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`docs.page api server is running at http://localhost:${PORT}`);
});
