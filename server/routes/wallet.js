import express from 'express';
import { analyzeWallet, chatWithWallet } from '../controllers/walletController.js';
const router = express.Router();
router.post('/analyze', analyzeWallet);
router.post('/chat', chatWithWallet);
export default router;