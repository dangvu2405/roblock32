import React from 'react';
import './TransactionList.css';

function TransactionList({ 
  pendingTransactions, 
  executedTransactions, 
  onSignTransaction,
  selectedOwner,
  owners 
}) {
  const canSign = (transaction) => {
    return !transaction.signatures.includes(selectedOwner);
  };

  const getSignatureProgress = (transaction) => {
    return `${transaction.signatures.length}/${transaction.requiredSignatures || 2}`;
  };

  return (
    <div className="transaction-list">
      <div className="pending-section">
        <h2>Giao dịch đang chờ chữ ký ({pendingTransactions.length})</h2>
        {pendingTransactions.length === 0 ? (
          <div className="empty-state">Không có giao dịch nào đang chờ</div>
        ) : (
          <div className="transactions-grid">
            {pendingTransactions.map((tx) => (
              <div key={tx.id} className="transaction-card pending">
                <div className="transaction-header">
                  <span className="tx-id">ID: {tx.id.substring(0, 8)}...</span>
                  <span className="status-badge pending">Đang chờ</span>
                </div>
                <div className="transaction-details">
                  <div className="detail-row">
                    <span className="label">Đến:</span>
                    <span className="value">{tx.to}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Số tiền:</span>
                    <span className="value amount">{tx.amount} tokens</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Từ:</span>
                    <span className="value">{tx.from}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Chữ ký:</span>
                    <span className="value signatures">
                      {getSignatureProgress(tx)}
                    </span>
                  </div>
                  <div className="signatures-list">
                    <strong>Đã ký:</strong>
                    <div className="signers">
                      {tx.signatures.map((sig, idx) => (
                        <span key={idx} className="signer-badge">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {canSign(tx) && (
                  <button
                    onClick={() => onSignTransaction(tx.id)}
                    className="sign-btn"
                  >
                    Ký giao dịch
                  </button>
                )}
                {!canSign(tx) && (
                  <div className="already-signed">Bạn đã ký giao dịch này</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="executed-section">
        <h2>Giao dịch đã thực hiện ({executedTransactions.length})</h2>
        {executedTransactions.length === 0 ? (
          <div className="empty-state">Chưa có giao dịch nào được thực hiện</div>
        ) : (
          <div className="transactions-grid">
            {executedTransactions.map((tx) => (
              <div key={tx.id} className="transaction-card executed">
                <div className="transaction-header">
                  <span className="tx-id">ID: {tx.id.substring(0, 8)}...</span>
                  <span className={`status-badge ${tx.status}`}>
                    {tx.status === 'executed' ? 'Đã thực hiện' : 'Thất bại'}
                  </span>
                </div>
                <div className="transaction-details">
                  <div className="detail-row">
                    <span className="label">Đến:</span>
                    <span className="value">{tx.to}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Số tiền:</span>
                    <span className="value amount">{tx.amount} tokens</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Thời gian:</span>
                    <span className="value">
                      {new Date(tx.executedAt || tx.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="signatures-list">
                    <strong>Đã ký bởi:</strong>
                    <div className="signers">
                      {tx.signatures.map((sig, idx) => (
                        <span key={idx} className="signer-badge">
                          {sig}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TransactionList;

