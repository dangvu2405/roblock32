const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const MultisigWallet = require('./multisigWallet');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Khởi tạo ví multisig với các owners và số chữ ký tối thiểu
const wallet = new MultisigWallet(
  ['0xOwner1', '0xOwner2', '0xOwner3', '0xOwner4', '0xOwner5', '0xOwner6', '0xOwner7', '0xOwner8', '0xOwner9', '0xOwner10'], // Danh sách owners (10 người)
  4 // Số chữ ký tối thiểu để thực hiện giao dịch
);

// API: Lấy thông tin ví
app.get('/api/wallet/info', (req, res) => {
  res.json({
    owners: wallet.getOwners(),
    requiredSignatures: wallet.getRequiredSignatures(),
    balance: wallet.getBalance(),
    pendingTransactions: wallet.getPendingTransactions(),
    executedTransactions: wallet.getExecutedTransactions()
  });
});

// API: Tạo giao dịch mới
app.post('/api/transaction/create', (req, res) => {
  const { to, amount, from } = req.body;
  
  if (!to || !amount || !from) {
    return res.status(400).json({ error: 'Missing required fields: to, amount, from' });
  }

  if (!wallet.isOwner(from)) {
    return res.status(403).json({ error: 'Not an owner of this wallet' });
  }

  const txId = wallet.createTransaction(to, amount, from);
  res.json({ 
    success: true, 
    transactionId: txId,
    message: 'Transaction created. Waiting for signatures...'
  });
});

// API: Ký giao dịch
app.post('/api/transaction/sign', (req, res) => {
  const { transactionId, signer } = req.body;

  if (!transactionId || !signer) {
    return res.status(400).json({ error: 'Missing required fields: transactionId, signer' });
  }

  if (!wallet.isOwner(signer)) {
    return res.status(403).json({ error: 'Not an owner of this wallet' });
  }

  const result = wallet.signTransaction(transactionId, signer);
  
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// API: Lấy thông tin giao dịch
app.get('/api/transaction/:id', (req, res) => {
  const transaction = wallet.getTransaction(req.params.id);
  
  if (transaction) {
    res.json(transaction);
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// API: Lấy tất cả giao dịch đã thực hiện
app.get('/api/transactions/executed', (req, res) => {
  res.json(wallet.getExecutedTransactions());
});

// API: Lấy tất cả giao dịch đang chờ
app.get('/api/transactions/pending', (req, res) => {
  res.json(wallet.getPendingTransactions());
});

// API: Nạp tiền vào ví (demo)
app.post('/api/wallet/deposit', (req, res) => {
  const { amount } = req.body;
  wallet.deposit(amount);
  res.json({ 
    success: true, 
    balance: wallet.getBalance(),
    message: `Deposited ${amount} tokens`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Multisig Wallet initialized with ${wallet.getOwners().length} owners`);
  console.log(`Required signatures: ${wallet.getRequiredSignatures()}`);
});

