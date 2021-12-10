import express, {text} from 'express';
import routes from "./routes.js";
import morgan from "morgan";
import cors from "cors";
import { config } from "dotenv";
config();
const PORT = process.env.PORT || 8000;

const app = express();
app.use(text());
console.log(process.env.GITHUB_PAT);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use("/", routes);
// API Routes
app.get("/", (req, res) => res.send("Express + TypeScript Server With ESM"));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is totally running at http://localhost:${PORT}`);
});