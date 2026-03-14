import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://api.etherscan.io/v2/api';
const CHAIN_ID = 1; // Ethereum mainnet

export async function getTransactions(address) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      chainid: CHAIN_ID,
      module: 'account',
      action: 'txlist',
      address,
      startblock: 0,
      endblock: 99999999,
      page: 1,
      offset: 20,
      sort: 'desc',
      apikey: process.env.ETHERSCAN_API_KEY,
    }
  });

  if (data.status !== '1') throw new Error('Invalid address or no transactions found');
  return data.result;
}

export async function getBalance(address) {
  const { data } = await axios.get(BASE_URL, {
    params: {
      chainid: CHAIN_ID,
      module: 'account',
      action: 'balance',
      address,
      tag: 'latest',
      apikey: process.env.ETHERSCAN_API_KEY,
    }
  });

  const balanceEth = (parseInt(data.result) / 1e18).toFixed(4);
  return balanceEth;
}