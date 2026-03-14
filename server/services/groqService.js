import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateWalletSummary(address, transactions, balance) {
  const txSummary = transactions.slice(0, 10).map(tx => ({
    from: tx.from,
    to: tx.to,
    value: (parseInt(tx.value) / 1e18).toFixed(4) + ' ETH',
    time: new Date(tx.timeStamp * 1000).toLocaleDateString(),
    isError: tx.isError === '1',
  }));

  const prompt = `
You are a blockchain analyst AI. Analyze this Ethereum wallet and give a clear, plain-English summary.

Wallet Address: ${address}
Current Balance: ${balance} ETH
Recent Transactions (last 10): ${JSON.stringify(txSummary, null, 2)}

Respond ONLY in this JSON format (no markdown, no extra text):
{
  "summary": "2-3 sentence plain English explanation of wallet behavior",
  "riskScore": <number 0-100>,
  "riskLevel": "Low" | "Medium" | "High",
  "tags": ["tag1", "tag2", "tag3"],
  "redFlags": ["flag1"] or [],
  "activityType": "e.g. Active Trader / DeFi User / HODLer / Suspicious"
}
`;

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.4,
    max_tokens: 500,
  });

  const raw = completion.choices[0].message.content;
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
}