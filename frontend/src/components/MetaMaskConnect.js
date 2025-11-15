import React, { useState, useEffect } from 'react';
import web3Service from '../services/web3Service';
import './MetaMaskConnect.css';

function MetaMaskConnect({ onConnect, onDisconnect, contractAddress, contractABI }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Kiểm tra xem đã kết nối chưa
    checkConnection();

    // Lắng nghe sự kiện thay đổi account
    web3Service.onAccountsChanged((accounts) => {
      if (accounts.length === 0) {
        handleDisconnect();
      } else {
        checkConnection();
      }
    });

    // Lắng nghe sự kiện thay đổi network
    web3Service.onChainChanged(() => {
      window.location.reload();
    });
  }, []);

  const checkConnection = async () => {
    if (!web3Service.isMetaMaskInstalled()) {
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        await handleConnect();
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const handleConnect = async () => {
    setLoading(true);
    setError('');

    try {
      const addr = await web3Service.connectMetaMask();
      setAddress(addr);
      setConnected(true);

      // Set contract nếu có
      if (contractAddress && contractABI) {
        web3Service.setContract(contractAddress, contractABI);
      }

      if (onConnect) {
        onConnect(addr);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error connecting to MetaMask:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    setConnected(false);
    setAddress('');
    if (onDisconnect) {
      onDisconnect();
    }
  };

  if (!web3Service.isMetaMaskInstalled()) {
    return (
      <div className="metamask-notice">
        <p>⚠️ MetaMask is not installed.</p>
        <a 
          href="https://metamask.io/download/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="install-link"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return (
    <div className="metamask-connect">
      {!connected ? (
        <button 
          onClick={handleConnect} 
          disabled={loading}
          className="connect-button"
        >
          {loading ? 'Connecting...' : '🔗 Connect MetaMask'}
        </button>
      ) : (
        <div className="connected-info">
          <div className="address-display">
            <span className="label">Connected:</span>
            <span className="address">{address.substring(0, 6)}...{address.substring(38)}</span>
          </div>
          <div className="switch-account-hint" style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
            💡 Để ký với account khác: Mở MetaMask → Click account icon → Chọn account khác
          </div>
          <button onClick={handleDisconnect} className="disconnect-button">
            Disconnect
          </button>
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default MetaMaskConnect;

