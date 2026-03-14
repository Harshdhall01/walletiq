import mongoose from 'mongoose';

const WalletSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  balance: String,
  totalTransactions: Number,
  recentTransactions: Array,
  summary: String,
  riskScore: Number,
  riskLevel: String,
  tags: [String],
  redFlags: [String],
  activityType: String,
}, { timestamps: true });

export default mongoose.model('Wallet', WalletSchema);