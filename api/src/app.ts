import { config } from "dotenv";
import express, { Router, text } from "express";
import morgan from "morgan";

import probot from "./probot";
import { notFound } from "./res";
import bundle from "./routes/bundle";
import preview from "./routes/preview";
import schema from "./routes/schema";
import githubWebhook from "./routes/webhooks.github";

config();

const PORT = process.env.PORT || 8080;
const app = express();
app.use(text());
app.use(morgan("dev"));
app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	}),
);
app.use(probot);

const router = Router();
router.get("/status", (_, res) => res.status(200).send("OK"));
router.get("/schema.json", schema);
router.post("/preview", preview);
router.get("/bundle", bundle);
router.post("/webhooks/github", githubWebhook);
router.all("*", (_, res) => notFound(res));
app.use(router);

app.listen(PORT, () => {
	console.log(`docs.page api server is running at http://localhost:${PORT}`);
});
