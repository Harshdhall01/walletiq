import express from 'express';
import { analyzeWallet } from '../controllers/walletController.js';

const router = express.Router();

router.post('/analyze', analyzeWallet);

export default router;