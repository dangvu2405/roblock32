const { ethers } = require('ethers');
require('dotenv').config();

/**
 * Service để tương tác với Smart Contract trên blockchain
 */
class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.contractAddress = process.env.CONTRACT_ADDRESS || null;
    this.network = process.env.NETWORK || 'localhost';
    this.abi = null;
    
    this.initializeProvider();
    this.loadContractABI();
  }

  /**
   * Khởi tạo provider kết nối với blockchain
   */
  initializeProvider() {
    try {
      if (this.network === 'localhost' || this.network === 'hardhat') {
        // Kết nối với Hardhat local node
        this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
        console.log('✅ Connected to local Hardhat node');
      } else if (this.network === 'sepolia') {
        // Kết nối với Sepolia testnet
        const rpcUrl = process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        console.log('✅ Connected to Sepolia testnet');
      } else {
        // Fallback về localhost
        this.provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
        console.log('⚠️ Using localhost as fallback');
      }
    } catch (error) {
      console.error('❌ Error initializing provider:', error);
      this.provider = null;
    }
  }

  /**
   * Load ABI từ artifacts (sau khi compile)
   */
  loadContractABI() {
    try {
      // Đường dẫn tương đối từ backend đến artifacts
      const path = require('path');
      const fs = require('fs');
      const artifactsPath = path.join(__dirname, '..', 'artifacts', 'contracts', 'MultisigWallet.sol', 'MultisigWallet.json');
      
      if (fs.existsSync(artifactsPath)) {
        const artifact = JSON.parse(fs.readFileSync(artifactsPath, 'utf8'));
        this.abi = artifact.abi;
        console.log('✅ Contract ABI loaded');
      } else {
        console.warn('⚠️ Contract ABI not found. Run "npm run compile" first.');
      }
    } catch (error) {
      console.error('❌ Error loading ABI:', error.message);
    }
  }

  /**
   * Set contract address và khởi tạo contract instance
   */
  setContractAddress(address) {
    this.contractAddress = address;
    if (this.abi && this.provider) {
      this.contract = new ethers.Contract(address, this.abi, this.provider);
      console.log(`✅ Contract initialized at: ${address}`);
    }
  }

  /**
   * Kiểm tra xem đã kết nối blockchain chưa
   */
  isConnected() {
    return this.provider !== null && this.contract !== null;
  }

  /**
   * Lấy thông tin ví từ blockchain
   */
  async getWalletInfo() {
    if (!this.isConnected()) {
      throw new Error('Blockchain not connected. Please deploy contract first.');
    }

    try {
      const owners = await this.contract.getOwners();
      const requiredSignatures = await this.contract.numConfirmationsRequired();
      const balance = await this.contract.getBalance();
      const transactionCount = await this.contract.getTransactionCount();

      // Lấy pending transactions
      const pendingTransactions = [];
      for (let i = 0; i < transactionCount; i++) {
        const tx = await this.contract.getTransaction(i);
        if (!tx.executed) {
          pendingTransactions.push({
            id: i.toString(),
            to: tx.to,
            amount: ethers.formatEther(tx.value),
            executed: tx.executed,
            numConfirmations: tx.numConfirmations.toString(),
            requiredSignatures: requiredSignatures.toString(),
          });
        }
      }

      // Lấy executed transactions
      const executedTransactions = [];
      for (let i = 0; i < transactionCount; i++) {
        const tx = await this.contract.getTransaction(i);
        if (tx.executed) {
          executedTransactions.push({
            id: i.toString(),
            to: tx.to,
            amount: ethers.formatEther(tx.value),
            executed: tx.executed,
            status: 'executed', // Thêm status để frontend hiển thị đúng
            numConfirmations: tx.numConfirmations.toString(),
            executedAt: new Date().toISOString(), // Thêm timestamp
          });
        }
      }

      return {
        owners: owners,
        requiredSignatures: requiredSignatures.toString(),
        balance: ethers.formatEther(balance),
        pendingTransactions: pendingTransactions,
        executedTransactions: executedTransactions,
        contractAddress: this.contractAddress,
        network: this.network,
      };
    } catch (error) {
      console.error('Error getting wallet info:', error);
      throw error;
    }
  }

  /**
   * Tạo giao dịch mới (cần signer với private key)
   */
  async createTransaction(to, amount, fromPrivateKey) {
    if (!this.isConnected()) {
      throw new Error('Blockchain not connected');
    }

    try {
      const signer = new ethers.Wallet(fromPrivateKey, this.provider);
      const contractWithSigner = this.contract.connect(signer);
      
      const value = ethers.parseEther(amount.toString());
      const tx = await contractWithSigner.submitTransaction(to, value, '0x');
      
      const receipt = await tx.wait();
      
      // Tìm transaction index từ events
      const submitEvent = receipt.logs.find(log => {
        try {
          const parsed = this.contract.interface.parseLog(log);
          return parsed && parsed.name === 'SubmitTransaction';
        } catch {
          return false;
        }
      });

      if (submitEvent) {
        const parsed = this.contract.interface.parseLog(submitEvent);
        return {
          success: true,
          transactionId: parsed.args.txIndex.toString(),
          txHash: receipt.hash,
        };
      }

      return {
        success: true,
        transactionId: null,
        txHash: receipt.hash,
      };
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw error;
    }
  }

  /**
   * Ký giao dịch (cần signer với private key)
   */
  async signTransaction(transactionId, signerPrivateKey) {
    if (!this.isConnected()) {
      throw new Error('Blockchain not connected');
    }

    try {
      const signer = new ethers.Wallet(signerPrivateKey, this.provider);
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.confirmTransaction(transactionId);
      const receipt = await tx.wait();

      // Kiểm tra xem có đủ chữ ký để execute không
      const transaction = await this.contract.getTransaction(transactionId);
      const required = await this.contract.numConfirmationsRequired();

      const result = {
        success: true,
        txHash: receipt.hash,
        numConfirmations: transaction.numConfirmations.toString(),
        requiredSignatures: required.toString(),
      };

      // Nếu đủ chữ ký, có thể execute
      if (transaction.numConfirmations >= required && !transaction.executed) {
        result.canExecute = true;
        result.message = `Transaction has enough signatures (${transaction.numConfirmations}/${required}). Ready to execute.`;
      } else {
        result.message = `Transaction signed. ${transaction.numConfirmations}/${required} signatures.`;
      }

      return result;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }

  /**
   * Thực hiện giao dịch (cần signer với private key)
   */
  async executeTransaction(transactionId, signerPrivateKey) {
    if (!this.isConnected()) {
      throw new Error('Blockchain not connected');
    }

    try {
      const signer = new ethers.Wallet(signerPrivateKey, this.provider);
      const contractWithSigner = this.contract.connect(signer);
      
      const tx = await contractWithSigner.executeTransaction(transactionId);
      const receipt = await tx.wait();

      return {
        success: true,
        txHash: receipt.hash,
        message: 'Transaction executed successfully',
      };
    } catch (error) {
      console.error('Error executing transaction:', error);
      throw error;
    }
  }

  /**
   * Lấy thông tin một giao dịch
   */
  async getTransaction(transactionId) {
    if (!this.isConnected()) {
      throw new Error('Blockchain not connected');
    }

    try {
      const tx = await this.contract.getTransaction(transactionId);
      const required = await this.contract.numConfirmationsRequired();

      return {
        id: transactionId.toString(),
        to: tx.to,
        amount: ethers.formatEther(tx.value),
        executed: tx.executed,
        numConfirmations: tx.numConfirmations.toString(),
        requiredSignatures: required.toString(),
        data: tx.data,
      };
    } catch (error) {
      console.error('Error getting transaction:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra xem owner đã ký giao dịch chưa
   */
  async isTransactionConfirmed(transactionId, ownerAddress) {
    if (!this.isConnected()) {
      return false;
    }

    try {
      return await this.contract.isTransactionConfirmed(transactionId, ownerAddress);
    } catch (error) {
      console.error('Error checking confirmation:', error);
      return false;
    }
  }
}

module.exports = BlockchainService;

