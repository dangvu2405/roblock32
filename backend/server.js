// Load environment variables first
const path = require('path');
const fs = require('fs');
const envPath = path.join(__dirname, '.env');

// Load .env file
if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('✅ Loaded .env file from:', envPath);
} else {
  console.warn('⚠️ .env file not found at:', envPath);
}

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const MultisigWallet = require('./multisigWallet');
const BlockchainService = require('./blockchainService');

const app = express();
const PORT = process.env.PORT || 5000;

// Chọn mode: 'simulation' hoặc 'blockchain'
const MODE = process.env.MODE || 'simulation';

// Debug: Log environment variables
console.log('🔍 Environment check:');
console.log('  MODE:', MODE);
console.log('  CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS || 'not set');
console.log('  NETWORK:', process.env.NETWORK || 'not set');

app.use(cors());
app.use(bodyParser.json());

// Khởi tạo wallet (simulation mode)
const wallet = new MultisigWallet(
  ['0xOwner1', '0xOwner2', '0xOwner3', '0xOwner4', '0xOwner5', '0xOwner6', '0xOwner7', '0xOwner8', '0xOwner9', '0xOwner10'],
  4
);

// Khởi tạo blockchain service (blockchain mode)
let blockchainService = null;
if (MODE === 'blockchain') {
  try {
    blockchainService = new BlockchainService();
    
    // Set contract address nếu có trong env
    if (process.env.CONTRACT_ADDRESS) {
      blockchainService.setContractAddress(process.env.CONTRACT_ADDRESS);
      console.log('✅ Blockchain mode enabled');
      console.log(`Contract address: ${process.env.CONTRACT_ADDRESS}`);
    } else {
      console.log('⚠️ Blockchain mode enabled but no CONTRACT_ADDRESS set');
      console.log('💡 Deploy contract first: npm run deploy:local or npm run deploy:sepolia');
    }
  } catch (error) {
    console.error('❌ Error initializing blockchain service:', error);
    console.log('⚠️ Falling back to simulation mode');
  }
}

// Helper function để lấy wallet info
async function getWalletInfo() {
  if (MODE === 'blockchain' && blockchainService && blockchainService.isConnected()) {
    const info = await blockchainService.getWalletInfo();
    return {
      ...info,
      mode: 'blockchain'
    };
  } else {
    return {
      owners: wallet.getOwners(),
      requiredSignatures: wallet.getRequiredSignatures(),
      balance: wallet.getBalance(),
      pendingTransactions: wallet.getPendingTransactions(),
      executedTransactions: wallet.getExecutedTransactions(),
      mode: 'simulation',
      contractAddress: null
    };
  }
}

// API: Lấy thông tin ví
app.get('/api/wallet/info', async (req, res) => {
  try {
    const info = await getWalletInfo();
    res.json(info);
  } catch (error) {
    console.error('Error getting wallet info:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Set contract address (chỉ dùng khi deploy contract mới)
app.post('/api/blockchain/set-contract', (req, res) => {
  if (MODE !== 'blockchain') {
    return res.status(400).json({ error: 'Blockchain mode not enabled' });
  }

  const { contractAddress } = req.body;
  if (!contractAddress) {
    return res.status(400).json({ error: 'contractAddress required' });
  }

  try {
    blockchainService.setContractAddress(contractAddress);
    res.json({ 
      success: true, 
      message: `Contract address set to ${contractAddress}` 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Tạo giao dịch mới
app.post('/api/transaction/create', async (req, res) => {
  const { to, amount, from, privateKey } = req.body;
  
  if (!to || !amount) {
    return res.status(400).json({ error: 'Missing required fields: to, amount' });
  }

  try {
    if (MODE === 'blockchain' && blockchainService && blockchainService.isConnected()) {
      // Blockchain mode: cần private key để ký
      if (!privateKey) {
        return res.status(400).json({ 
          error: 'Private key required for blockchain mode. Use MetaMask in frontend.' 
        });
      }

      const result = await blockchainService.createTransaction(to, amount, privateKey);
      res.json({
        success: true,
        transactionId: result.transactionId,
        txHash: result.txHash,
        message: 'Transaction created on blockchain. Waiting for signatures...'
      });
    } else {
      // Simulation mode
      if (!from) {
        return res.status(400).json({ error: 'Missing required field: from' });
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
    }
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Ký giao dịch
app.post('/api/transaction/sign', async (req, res) => {
  const { transactionId, signer, privateKey } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: 'Missing required field: transactionId' });
  }

  try {
    if (MODE === 'blockchain' && blockchainService && blockchainService.isConnected()) {
      // Blockchain mode: cần private key
      if (!privateKey) {
        return res.status(400).json({ 
          error: 'Private key required for blockchain mode. Use MetaMask in frontend.' 
        });
      }

      const result = await blockchainService.signTransaction(transactionId, privateKey);
      res.json(result);
    } else {
      // Simulation mode
      if (!signer) {
        return res.status(400).json({ error: 'Missing required field: signer' });
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
    }
  } catch (error) {
    console.error('Error signing transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Thực hiện giao dịch (blockchain mode)
app.post('/api/transaction/execute', async (req, res) => {
  if (MODE !== 'blockchain' || !blockchainService || !blockchainService.isConnected()) {
    return res.status(400).json({ error: 'Execute only available in blockchain mode' });
  }

  const { transactionId, privateKey } = req.body;

  if (!transactionId || !privateKey) {
    return res.status(400).json({ error: 'Missing required fields: transactionId, privateKey' });
  }

  try {
    const result = await blockchainService.executeTransaction(transactionId, privateKey);
    res.json(result);
  } catch (error) {
    console.error('Error executing transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy thông tin giao dịch
app.get('/api/transaction/:id', async (req, res) => {
  try {
    if (MODE === 'blockchain' && blockchainService && blockchainService.isConnected()) {
      const transaction = await blockchainService.getTransaction(req.params.id);
      res.json(transaction);
    } else {
      const transaction = wallet.getTransaction(req.params.id);
      if (transaction) {
        res.json(transaction);
      } else {
        res.status(404).json({ error: 'Transaction not found' });
      }
    }
  } catch (error) {
    console.error('Error getting transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy tất cả giao dịch đã thực hiện
app.get('/api/transactions/executed', async (req, res) => {
  try {
    const info = await getWalletInfo();
    res.json(info.executedTransactions || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Lấy tất cả giao dịch đang chờ
app.get('/api/transactions/pending', async (req, res) => {
  try {
    const info = await getWalletInfo();
    res.json(info.pendingTransactions || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API: Nạp tiền vào ví (demo - chỉ simulation mode)
app.post('/api/wallet/deposit', (req, res) => {
  if (MODE === 'blockchain') {
    return res.status(400).json({ 
      error: 'Deposit not available in blockchain mode. Send ETH directly to contract address.' 
    });
  }

  const { amount } = req.body;
  wallet.deposit(amount);
  res.json({ 
    success: true, 
    balance: wallet.getBalance(),
    message: `Deposited ${amount} tokens`
  });
});

// API: Lấy mode hiện tại
app.get('/api/mode', (req, res) => {
  res.json({ 
    mode: MODE,
    blockchainConnected: MODE === 'blockchain' && blockchainService && blockchainService.isConnected()
  });
});

// API: Lấy contract ABI (cho frontend)
app.get('/api/contract/abi', (req, res) => {
  if (MODE !== 'blockchain' || !blockchainService) {
    return res.status(400).json({ error: 'Blockchain mode not enabled' });
  }

  try {
    const path = require('path');
    const fs = require('fs');
    const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'MultisigWallet.sol', 'MultisigWallet.json');
    
    if (fs.existsSync(artifactsPath)) {
      const artifact = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));
      res.json({ 
        abi: artifact.abi,
        contractAddress: blockchainService.contractAddress || process.env.CONTRACT_ADDRESS
      });
    } else {
      res.status(404).json({ error: 'Contract ABI not found. Run "npm run compile" first.' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📦 Mode: ${MODE.toUpperCase()}`);
  console.log(`👥 Multisig Wallet initialized with ${wallet.getOwners().length} owners`);
  console.log(`✍️ Required signatures: ${wallet.getRequiredSignatures()}`);
  
  if (MODE === 'blockchain') {
    if (blockchainService && blockchainService.isConnected()) {
      console.log(`✅ Blockchain connected`);
      console.log(`📍 Contract: ${process.env.CONTRACT_ADDRESS || 'Not set'}`);
    } else {
      console.log(`⚠️ Blockchain mode but not connected`);
    }
  }
  console.log('');
});
