import express, { text, RequestHandler } from 'express';
import routes from './routes.js';
import morgan from 'morgan';
import cors from 'cors';
import basicAuth from 'express-basic-auth';
import { config } from 'dotenv';
config();
const PORT = process.env.PORT || 8000;

const app = express();

const unless = function (path: string, middleware: RequestHandler): RequestHandler {
  return function (req, res, next) {
    if (path === req.path) {
      return next();
    } else {
      return middleware(req, res, next);
    }
  };
};

if (process.env.API_PASSWORD) {
  app.use(
    unless(
      '/status',
      basicAuth({
        users: { admin: process.env.API_PASSWORD },
      }),
    ),
  );
}

app.use(text());
app.use(cors());
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
