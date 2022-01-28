import express, { text, RequestHandler } from 'express';
import routes from './routes.js';
import morgan from 'morgan';
import cors from 'cors';
// import basicAuth from 'express-basic-auth';
import { config } from 'dotenv';
// import { isParenthesizedTypeNode } from 'typescript';

config();
const PORT = process.env.PORT || 8000;

const app = express();

// const unless = function (paths: string[], middleware: RequestHandler): RequestHandler {
//   return function (req, res, next) {
//     if (paths.includes(req.path) || req.method === 'OPTIONS') {
//       return next();
//     } else {
//       return middleware(req, res, next);
//     }
//   };
// };

/*
if (process.env.API_PASSWORD) {
  app.use(
    unless(
      ['/status'],
      basicAuth({
        users: { admin: process.env.API_PASSWORD },
      }),
    ),
  );
}
*/

app.use(text());
app.use(cors());
app.options('/raw', (req, res, next) => {
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
