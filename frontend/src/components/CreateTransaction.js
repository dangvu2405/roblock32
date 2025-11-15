import React, { useState } from 'react';
import './CreateTransaction.css';

function CreateTransaction({ onCreateTransaction, balance }) {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!to || !amount) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const amountNum = parseFloat(amount);
    if (amountNum <= 0) {
      alert('Số tiền phải lớn hơn 0');
      return;
    }

    if (amountNum > balance) {
      alert('Số dư không đủ');
      return;
    }

    onCreateTransaction(to, amountNum);
    setTo('');
    setAmount('');
  };

  return (
    <div className="create-transaction">
      <h2>Tạo giao dịch mới</h2>
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label>Địa chỉ nhận:</label>
          <input
            type="text"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="0x..."
            required
          />
        </div>
        <div className="form-group">
          <label>Số tiền:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Tạo giao dịch
        </button>
      </form>
    </div>
  );
}

export default CreateTransaction;

