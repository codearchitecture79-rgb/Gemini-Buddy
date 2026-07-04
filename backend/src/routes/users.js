import express from 'express';
import { createPrompt } from '../controllers/users.js';

const router = express.Router();

router.post('/', createPrompt);

export default router;