import React, { useState, useEffect } from 'react';
import './App.css';
import WalletInfo from './components/WalletInfo';
import CreateTransaction from './components/CreateTransaction';
import TransactionList from './components/TransactionList';
import { getWalletInfo, createTransaction, signTransaction, deposit } from './services/api';

function App() {
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState('0xOwner1');
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    loadWalletInfo();
    const interval = setInterval(loadWalletInfo, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const loadWalletInfo = async () => {
    try {
      const info = await getWalletInfo();
      setWalletInfo(info);
      setLoading(false);
    } catch (error) {
      console.error('Error loading wallet info:', error);
      setLoading(false);
    }
  };

  const handleCreateTransaction = async (to, amount) => {
    try {
      await createTransaction(to, amount, selectedOwner);
      await loadWalletInfo();
      alert('Giao dịch đã được tạo! Đang chờ chữ ký...');
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleSignTransaction = async (transactionId) => {
    try {
      const result = await signTransaction(transactionId, selectedOwner);
      await loadWalletInfo();
      if (result.data.success) {
        alert(result.data.message || 'Đã ký giao dịch thành công!');
      }
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }
    try {
      await deposit(parseFloat(depositAmount));
      setDepositAmount('');
      await loadWalletInfo();
      alert('Nạp tiền thành công!');
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>🔐 Multisig Wallet - Ví đa chữ ký</h1>
        <p className="student-info">
          Sinh viên: NGUYỄN ĐĂNG DUY - 22810310021 - D17CNPM1
        </p>
      </header>

      <div className="container">
        <div className="owner-selector">
          <label>Chọn Owner hiện tại: </label>
          <select 
            value={selectedOwner} 
            onChange={(e) => setSelectedOwner(e.target.value)}
            className="owner-select"
          >
            {walletInfo?.owners?.map(owner => (
              <option key={owner} value={owner}>{owner}</option>
            ))}
          </select>
        </div>

        <WalletInfo walletInfo={walletInfo} />

        <div className="deposit-section">
          <h3>Nạp tiền vào ví</h3>
          <div className="deposit-form">
            <input
              type="number"
              placeholder="Số tiền"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="0"
              step="0.01"
            />
            <button onClick={handleDeposit}>Nạp tiền</button>
          </div>
        </div>

        <CreateTransaction 
          onCreateTransaction={handleCreateTransaction}
          balance={walletInfo?.balance}
        />

        <TransactionList
          pendingTransactions={walletInfo?.pendingTransactions || []}
          executedTransactions={walletInfo?.executedTransactions || []}
          onSignTransaction={handleSignTransaction}
          selectedOwner={selectedOwner}
          owners={walletInfo?.owners || []}
        />
      </div>
    </div>
  );
}

export default App;

