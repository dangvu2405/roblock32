const crypto = require('crypto');

class MultisigWallet {
  constructor(owners, requiredSignatures) {
    this.owners = owners;
    this.requiredSignatures = requiredSignatures;
    this.balance = 1000; // Số dư ban đầu (demo)
    this.pendingTransactions = new Map();
    this.executedTransactions = [];
    this.transactionCounter = 0;
  }

  // Kiểm tra xem address có phải là owner không
  isOwner(address) {
    return this.owners.includes(address);
  }

  // Lấy danh sách owners
  getOwners() {
    return this.owners;
  }

  // Lấy số chữ ký tối thiểu
  getRequiredSignatures() {
    return this.requiredSignatures;
  }

  // Lấy số dư
  getBalance() {
    return this.balance;
  }

  // Tạo giao dịch mới
  createTransaction(to, amount, from) {
    if (!this.isOwner(from)) {
      throw new Error('Only owners can create transactions');
    }

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    if (amount > this.balance) {
      throw new Error('Insufficient balance');
    }

    const transactionId = crypto.randomBytes(16).toString('hex');
    const transaction = {
      id: transactionId,
      to: to,
      amount: amount,
      from: from,
      signatures: [from], // Người tạo tự động ký
      requiredSignatures: this.requiredSignatures,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.pendingTransactions.set(transactionId, transaction);
    return transactionId;
  }

  // Ký giao dịch
  signTransaction(transactionId, signer) {
    if (!this.isOwner(signer)) {
      return { success: false, error: 'Not an owner of this wallet' };
    }

    const transaction = this.pendingTransactions.get(transactionId);
    
    if (!transaction) {
      return { success: false, error: 'Transaction not found' };
    }

    if (transaction.status !== 'pending') {
      return { success: false, error: 'Transaction already executed or cancelled' };
    }

    if (transaction.signatures.includes(signer)) {
      return { success: false, error: 'Already signed this transaction' };
    }

    // Thêm chữ ký
    transaction.signatures.push(signer);

    // Kiểm tra xem đã đủ chữ ký chưa
    if (transaction.signatures.length >= this.requiredSignatures) {
      // Thực hiện giao dịch
      return this.executeTransaction(transactionId);
    }

    return {
      success: true,
      message: `Transaction signed. ${transaction.signatures.length}/${this.requiredSignatures} signatures`,
      transaction: transaction
    };
  }

  // Thực hiện giao dịch
  executeTransaction(transactionId) {
    const transaction = this.pendingTransactions.get(transactionId);
    
    if (!transaction) {
      return { success: false, error: 'Transaction not found' };
    }

    if (transaction.signatures.length < this.requiredSignatures) {
      return { success: false, error: 'Not enough signatures' };
    }

    if (transaction.amount > this.balance) {
      transaction.status = 'failed';
      transaction.error = 'Insufficient balance';
      this.pendingTransactions.delete(transactionId);
      this.executedTransactions.push(transaction);
      return { success: false, error: 'Insufficient balance' };
    }

    // Thực hiện giao dịch
    this.balance -= transaction.amount;
    transaction.status = 'executed';
    transaction.executedAt = new Date().toISOString();

    // Chuyển từ pending sang executed
    this.pendingTransactions.delete(transactionId);
    this.executedTransactions.push(transaction);

    return {
      success: true,
      message: 'Transaction executed successfully',
      transaction: transaction,
      newBalance: this.balance
    };
  }

  // Lấy giao dịch theo ID
  getTransaction(transactionId) {
    const pending = this.pendingTransactions.get(transactionId);
    if (pending) return pending;

    const executed = this.executedTransactions.find(tx => tx.id === transactionId);
    return executed || null;
  }

  // Lấy tất cả giao dịch đang chờ
  getPendingTransactions() {
    return Array.from(this.pendingTransactions.values());
  }

  // Lấy tất cả giao dịch đã thực hiện
  getExecutedTransactions() {
    return this.executedTransactions;
  }

  // Nạp tiền vào ví (demo)
  deposit(amount) {
    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }
    this.balance += amount;
  }
}

module.exports = MultisigWallet;

