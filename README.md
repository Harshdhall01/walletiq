# WalletIQ 🔍⚡
### AI-Powered Ethereum Wallet Intelligence Platform

> Instantly analyze any Ethereum wallet — risk scoring, on-chain intelligence & behavioral profiling powered by Groq AI

![WalletIQ Banner](https://img.shields.io/badge/WalletIQ-AI%20Wallet%20Analyzer-orange?style=for-the-badge&logo=ethereum)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![Groq AI](https://img.shields.io/badge/Groq-AI%20Powered-blue?style=for-the-badge)

---

## 🚨 Problem Statement

Blockchain wallets are completely opaque to regular users. When someone sends you a wallet address — is it safe? Is it a scammer? A whale? A bot? Without deep technical expertise, there's no way to know.

**WalletIQ solves this.**

---

## 💡 Solution

Enter any Ethereum wallet address → get an instant AI-generated intelligence report with:
- Risk score (0-100)
- Behavioral analysis
- Transaction patterns
- Red flags detection
- Human-readable AI summary

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JS, Chart.js, jsPDF |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI Model | Groq AI (llama-3.3-70b-versatile) |
| Blockchain | Etherscan V2 API |
| Web3 | MetaMask Integration |

---

## ✨ Features

- 🔍 **Real-time Wallet Analysis** — instant on-chain data from Etherscan V2
- 🤖 **AI Risk Scoring** — Groq AI analyzes behavior and returns 0-100 risk score
- 📊 **Transaction Chart** — visual bar chart of transaction history by date
- ⚖️ **Wallet Comparison** — compare two wallets side by side with winner
- 📄 **PDF Report Export** — download branded intelligence report via jsPDF
- 🕐 **Search History** — last 5 wallets saved locally, click to reload
- 🦊 **MetaMask Connect** — one click connects your own wallet and auto-analyzes
- ⚡ **MongoDB Caching** — repeat lookups are instant, zero API calls
- 🚩 **Red Flags Detection** — automatically flags suspicious behavior
- 🏷️ **Wallet Profiling** — tags like DeFi User, NFT Trader, High Volume etc.

---

## 🏗️ Architecture
```
User → Frontend (HTML/JS)
          ↓
     Express API (Node.js)
          ↓
    ┌─────┴──────┐
    ↓            ↓
Etherscan V2   Groq AI
(balance+txs)  (analysis)
    ↓            ↓
    └─────┬──────┘
          ↓
      MongoDB
      (cache)
          ↓
      Response
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Groq API Key
- Etherscan API Key

### Backend
```bash
cd server
npm install
```

Create `.env` file in `/server`:
```
MONGO_URI=your_mongodb_uri
GROQ_API_KEY=your_groq_key
ETHERSCAN_API_KEY=your_etherscan_key
PORT=5000
```
```bash
node index.js
```

### Frontend
```bash
cd client
npm install
npm run dev
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/wallet/analyze` | Analyze any ETH wallet |

### Request
```json
{
  "address": "0x742d35Cc6634C0532925a3b8D4C9C7b3a1d4E5f"
}
```

### Response
```json
{
  "balance": "1.234",
  "totalTransactions": 156,
  "riskScore": 23,
  "riskLevel": "LOW",
  "summary": "AI generated analysis...",
  "tags": ["DeFi User", "Long Term Holder"],
  "redFlags": [],
  "cached": false
}
```

---

## 👥 Team
Built with ❤️ during Web3 Hackathon 2026