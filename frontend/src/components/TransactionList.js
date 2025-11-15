import React from 'react';
import { ethers } from 'ethers';
import './TransactionList.css';

function TransactionList({ 
  pendingTransactions, 
  executedTransactions, 
  onSignTransaction,
  onExecuteTransaction,
  selectedOwner,
  owners,
  metaMaskAddress,
  contractAddress,
  contractABI
}) {
  const [confirmedTransactions, setConfirmedTransactions] = React.useState({});

  // Xác định owner hiện tại để check: trong blockchain mode dùng metaMaskAddress, trong simulation mode dùng selectedOwner
  const currentOwner = metaMaskAddress || selectedOwner;

  // Check xem transaction đã được confirm bởi owner hiện tại chưa
  React.useEffect(() => {
    // Clear state khi đổi owner
    setConfirmedTransactions({});

    if (contractAddress && contractABI && pendingTransactions.length > 0 && currentOwner) {
      const checkConfirmations = async () => {
        // Blockchain mode: check với contract
        if (metaMaskAddress && window.ethereum) {
          try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            
            const checks = {};
            for (const tx of pendingTransactions) {
              if (tx.numConfirmations !== undefined) {
                try {
                  // Check với owner hiện tại (metaMaskAddress trong blockchain mode)
                  const isConfirmed = await contract.isTransactionConfirmed(tx.id, currentOwner);
                  checks[tx.id] = isConfirmed;
                } catch (error) {
                  console.error(`Error checking confirmation for tx ${tx.id}:`, error);
                  checks[tx.id] = false;
                }
              }
            }
            setConfirmedTransactions(checks);
          } catch (error) {
            console.error('Error checking confirmations:', error);
          }
        }
        // Simulation mode: check với signatures array (không cần async)
        else if (!metaMaskAddress) {
          const checks = {};
          for (const tx of pendingTransactions) {
            if (tx.signatures && Array.isArray(tx.signatures)) {
              checks[tx.id] = tx.signatures.includes(currentOwner);
            } else {
              checks[tx.id] = false;
            }
          }
          setConfirmedTransactions(checks);
        }
      };

      checkConfirmations();
      // Refresh mỗi 3 giây (chỉ trong blockchain mode)
      if (metaMaskAddress && window.ethereum) {
        const interval = setInterval(checkConfirmations, 3000);
        return () => clearInterval(interval);
      }
    }
  }, [currentOwner, metaMaskAddress, contractAddress, contractABI, pendingTransactions, selectedOwner]);

  const canSign = (transaction) => {
    // Blockchain mode: check qua contract với owner hiện tại
    if (transaction.numConfirmations !== undefined) {
      // Nếu có MetaMask, chỉ cho phép ký nếu đang dùng MetaMask account
      if (metaMaskAddress) {
        // Nếu đã check và owner đã confirm, không cho ký
        if (confirmedTransactions[transaction.id] === true) {
          return false;
        }
        // Nếu chưa check hoặc chưa confirm, và chưa đủ confirmations, cho phép ký
        const numConfirmations = parseInt(transaction.numConfirmations) || 0;
        const required = parseInt(transaction.requiredSignatures) || 2;
        return numConfirmations < required;
      }
      // Nếu không có MetaMask, không thể ký trong blockchain mode
      return false;
    }
    // Simulation mode: có signatures array, check với selectedOwner
    if (transaction.signatures && Array.isArray(transaction.signatures)) {
      return !transaction.signatures.includes(currentOwner);
    }
    return false;
  };

  const getSignatureProgress = (transaction) => {
    // Blockchain mode: dùng numConfirmations
    if (transaction.numConfirmations !== undefined) {
      const numConfirmations = parseInt(transaction.numConfirmations) || 0;
      const required = parseInt(transaction.requiredSignatures) || 2;
      return `${numConfirmations}/${required}`;
    }
    // Simulation mode: dùng signatures array
    if (transaction.signatures && Array.isArray(transaction.signatures)) {
      return `${transaction.signatures.length}/${transaction.requiredSignatures || 2}`;
    }
    // Fallback
    return '0/2';
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
                  {tx.from && (
                    <div className="detail-row">
                      <span className="label">Từ:</span>
                      <span className="value">{tx.from}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Chữ ký:</span>
                    <span className="value signatures">
                      {getSignatureProgress(tx)}
                    </span>
                  </div>
                  <div className="signatures-list">
                    <strong>Đã ký:</strong>
                    <div className="signers">
                      {tx.signatures && Array.isArray(tx.signatures) ? (
                        tx.signatures.map((sig, idx) => (
                          <span key={idx} className="signer-badge">
                            {sig}
                          </span>
                        ))
                      ) : (
                        <span className="signer-badge">
                          {tx.numConfirmations || 0} confirmations
                        </span>
                      )}
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
                {!canSign(tx) && tx.numConfirmations !== undefined && (() => {
                  const numConfirmations = parseInt(tx.numConfirmations) || 0;
                  const required = parseInt(tx.requiredSignatures) || 2;
                  const hasEnoughSignatures = numConfirmations >= required;
                  const isConfirmedByCurrent = confirmedTransactions[tx.id] === true;
                  
                  if (hasEnoughSignatures && onExecuteTransaction && metaMaskAddress) {
                    return (
                      <button
                        onClick={() => onExecuteTransaction(tx.id)}
                        className="execute-btn"
                        style={{
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          width: '100%',
                          marginTop: '10px'
                        }}
                      >
                        ✅ Thực hiện giao dịch (Đã đủ {numConfirmations}/{required} chữ ký)
                      </button>
                    );
                  }
                  
                  return (
                    <div className="already-signed">
                      {isConfirmedByCurrent
                        ? `✅ ${currentOwner === metaMaskAddress ? 'Bạn' : 'Owner này'} đã ký giao dịch này`
                        : hasEnoughSignatures
                        ? `✅ Đã đủ chữ ký (${numConfirmations}/${required})${metaMaskAddress ? '' : ' - Cần kết nối MetaMask để thực hiện'}`
                        : metaMaskAddress 
                        ? 'Cần kết nối MetaMask để ký'
                        : 'Bạn đã ký giao dịch này'}
                    </div>
                  );
                })()}
                {!canSign(tx) && !tx.numConfirmations && (
                  <div className="already-signed">
                    Bạn đã ký giao dịch này
                  </div>
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
                  <span className={`status-badge ${tx.status || (tx.executed ? 'executed' : 'failed')}`}>
                    {tx.status === 'executed' || tx.executed ? '✅ Đã thực hiện' : '❌ Thất bại'}
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
                      {tx.executedAt || tx.createdAt 
                        ? new Date(tx.executedAt || tx.createdAt).toLocaleString('vi-VN')
                        : 'Vừa xong'}
                    </span>
                  </div>
                  <div className="signatures-list">
                    <strong>Đã ký bởi:</strong>
                    <div className="signers">
                      {tx.signatures && Array.isArray(tx.signatures) ? (
                        tx.signatures.map((sig, idx) => (
                          <span key={idx} className="signer-badge">
                            {sig}
                          </span>
                        ))
                      ) : (
                        <span className="signer-badge">
                          {tx.numConfirmations || 0} confirmations
                        </span>
                      )}
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

