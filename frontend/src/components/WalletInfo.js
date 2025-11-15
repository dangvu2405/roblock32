import React from 'react';
import './WalletInfo.css';

function WalletInfo({ walletInfo }) {
  if (!walletInfo) return null;

  return (
    <div className="wallet-info">
      <h2>Thông tin ví</h2>
      <div className="info-grid">
        <div className="info-card">
          <div className="info-label">Số dư</div>
          <div className="info-value balance">{walletInfo.balance} tokens</div>
        </div>
        <div className="info-card">
          <div className="info-label">Số chữ ký yêu cầu</div>
          <div className="info-value">{walletInfo.requiredSignatures}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Tổng số owners</div>
          <div className="info-value">{walletInfo.owners?.length || 0}</div>
        </div>
        <div className="info-card">
          <div className="info-label">Giao dịch đang chờ</div>
          <div className="info-value">{walletInfo.pendingTransactions?.length || 0}</div>
        </div>
      </div>
      
      <div className="owners-list">
        <h3>Danh sách Owners:</h3>
        <div className="owners-grid">
          {walletInfo.owners?.map((owner, index) => (
            <div key={index} className="owner-badge">
              {owner}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WalletInfo;

