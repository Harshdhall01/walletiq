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
export async function chatWithWallet(req, res) {
  const { address, message } = req.body;
  if (!address || !message) {
    return res.status(400).json({ error: 'Address and message required' });
  }
  try {
    // Get wallet data from cache
    const wallet = await Wallet.findOne({ address: address.toLowerCase() });
    if (!wallet) {
      return res.status(404).json({ error: 'Analyze wallet first!' });
    }
    // Import Groq
    const Groq = (await import('groq-sdk')).default;
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are WalletIQ, an expert blockchain analyst. 
          You are analyzing this Ethereum wallet:
          Address: ${wallet.address}
          Balance: ${wallet.balance} ETH
          Total Transactions: ${wallet.totalTransactions}
          Risk Score: ${wallet.riskScore}/100
          Risk Level: ${wallet.riskLevel}
          Activity Type: ${wallet.activityType}
          Tags: ${wallet.tags?.join(', ')}
          Red Flags: ${wallet.redFlags?.join(', ') || 'None'}
          AI Summary: ${wallet.summary}
          
          Answer questions about this wallet clearly and concisely.
          Keep responses under 3 sentences unless detail is needed.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 300,
    });
    const reply = completion.choices[0].message.content;
    return res.json({ reply });
  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: err.message });
  }
}