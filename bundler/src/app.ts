import express, {Request, Response, text} from 'express';

const PORT = process.env.PORT || 8000;

const app = express();
app.use(text());

app.get('/', (req, res) => res.send('Express + TypeScript Server With ESM'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is totally running at http://localhost:${PORT}`);
});