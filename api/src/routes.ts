import { Router } from 'express';
import * as rawController from './controllers/raw.js';
import * as githubController from './controllers/github.js';
import * as statusController from './controllers/status.js';
import ProbotMiddleWare from './controllers/bot.js';

const router = Router();

router.get('/status', statusController.statusRes);
router.get('/bundle', githubController.bundleGitHub);
router.post('/raw', rawController.bundleRaw);
router.post('/webhooks/bot-docs-page', (req, res) => ProbotMiddleWare(req, res))
export default router;