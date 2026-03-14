import { getTransactions, getBalance } from '../services/etherscanService.js';
import { generateWalletSummary } from '../services/groqService.js';
import Wallet from '../models/wallet.js';

export async function analyzeWallet(req, res) {
  const { address } = req.body;

  if (!address || !address.startsWith('0x')) {
    return res.status(400).json({ error: 'Invalid Ethereum address' });
  }

  try {
    // Check cache in MongoDB first
    const cached = await Wallet.findOne({ address: address.toLowerCase() });
    if (cached) {
      console.log('📦 Returning cached result');
      return res.json({ ...cached.toObject(), cached: true });
    }

    // Fetch live data
    const [transactions, balance] = await Promise.all([
      getTransactions(address),
      getBalance(address),
    ]);

    // AI analysis
    const aiResult = await generateWalletSummary(address, transactions, balance);

    // Build response
    const result = {
      address: address.toLowerCase(),
      balance,
      totalTransactions: transactions.length,
      recentTransactions: transactions.slice(0, 10).map(tx => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: (parseInt(tx.value) / 1e18).toFixed(4),
        timestamp: new Date(tx.timeStamp * 1000).toISOString(),
        isIncoming: tx.to.toLowerCase() === address.toLowerCase(),
        isError: tx.isError === '1',
      })),
      ...aiResult,
    };

    // Save to MongoDB
    await Wallet.create(result);

    return res.json({ ...result, cached: false });

  } catch (err) {
    console.error('❌ Full error:', err);
    return res.status(500).json({ error: err.message });
  }
}