import axios from 'axios';

// Sử dụng proxy từ package.json hoặc absolute URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getWalletInfo = async () => {
  const response = await api.get('/wallet/info');
  return response.data;
};

export const createTransaction = async (to, amount, from) => {
  const response = await api.post('/transaction/create', { to, amount, from });
  return response.data;
};

export const signTransaction = async (transactionId, signer) => {
  const response = await api.post('/transaction/sign', { transactionId, signer });
  return response;
};

export const getTransaction = async (transactionId) => {
  const response = await api.get(`/transaction/${transactionId}`);
  return response.data;
};

export const getPendingTransactions = async () => {
  const response = await api.get('/transactions/pending');
  return response.data;
};

export const getExecutedTransactions = async () => {
  const response = await api.get('/transactions/executed');
  return response.data;
};

export const deposit = async (amount) => {
  const response = await api.post('/wallet/deposit', { amount });
  return response.data;
};

