import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './MetaMaskDebug.css';

function MetaMaskDebug() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        setDebugInfo({
          error: 'MetaMask not installed',
          connected: false
        });
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();
      
      // Kiểm tra xem có phải account từ Hardhat node không
      const hardhatAccounts = [
        '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
        '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
        '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
        '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
        '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
        '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
        '0xBcd4042DE499D14e55001CcbB24a551F3b954096'
      ];

      const isHardhatAccount = hardhatAccounts.some(acc => 
        acc.toLowerCase() === address.toLowerCase()
      );

      setDebugInfo({
        connected: true,
        address: address,
        balance: ethers.formatEther(balance),
        balanceWei: balance.toString(),
        network: network.name,
        chainId: network.chainId.toString(),
        isHardhatAccount: isHardhatAccount,
        isCorrectNetwork: network.chainId === 31337n,
        error: null
      });
    } catch (error) {
      setDebugInfo({
        error: error.message,
        connected: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check again when account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkConnection);
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkConnection);
      }
    };
  }, []);

  if (!debugInfo) {
    return (
      <div className="metamask-debug">
        <button onClick={checkConnection} disabled={loading}>
          {loading ? 'Đang kiểm tra...' : '🔍 Kiểm tra MetaMask'}
        </button>
      </div>
    );
  }

  return (
    <div className="metamask-debug">
      <h4>🔍 Debug MetaMask Connection</h4>
      <button onClick={checkConnection} disabled={loading} className="refresh-btn">
        {loading ? 'Đang kiểm tra...' : '🔄 Refresh'}
      </button>

      {debugInfo.error ? (
        <div className="debug-error">
          <strong>❌ Lỗi:</strong> {debugInfo.error}
        </div>
      ) : (
        <div className="debug-info">
          <div className="debug-row">
            <strong>Address:</strong>
            <code>{debugInfo.address}</code>
          </div>
          
          <div className="debug-row">
            <strong>Balance:</strong>
            <span className={parseFloat(debugInfo.balance) > 0 ? 'balance-ok' : 'balance-zero'}>
              {debugInfo.balance} ETH
            </span>
            {parseFloat(debugInfo.balance) === 0 && (
              <span className="warning">⚠️ Balance = 0! Cần import account từ Hardhat node</span>
            )}
          </div>
          
          <div className="debug-row">
            <strong>Network:</strong>
            <span>{debugInfo.network} (Chain ID: {debugInfo.chainId})</span>
            {!debugInfo.isCorrectNetwork && (
              <div>
                <span className="warning">⚠️ Phải là Chain ID: 31337 (Hardhat Local)</span>
                <button 
                  onClick={async () => {
                    try {
                      await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7A69' }], // 31337 in hex
                      });
                    } catch (switchError) {
                      // This error code indicates that the chain has not been added to MetaMask
                      if (switchError.code === 4902) {
                        try {
                          await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                              chainId: '0x7A69', // 31337 in hex
                              chainName: 'Hardhat Local',
                              nativeCurrency: {
                                name: 'Ethereum',
                                symbol: 'ETH',
                                decimals: 18,
                              },
                              rpcUrls: ['http://127.0.0.1:8545'],
                              blockExplorerUrls: null,
                            }],
                          });
                        } catch (addError) {
                          const manualInstructions = `
⚠️ KHÔNG THỂ TỰ ĐỘNG THÊM NETWORK

Vui lòng thêm network thủ công vào MetaMask:

1. Mở MetaMask
2. Click network dropdown (góc trên)
3. Click "Add Network" hoặc "Add a network manually"
4. Điền thông tin:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH
5. Click "Save"

Xem hướng dẫn chi tiết trong file:
THEM_HARDHAT_NETWORK_METAMASK.md

Lỗi: ${addError.message || 'Unknown error'}
                          `;
                          alert(manualInstructions);
                          console.error('Error adding network:', addError);
                        }
                      } else {
                        alert('Không thể chuyển network: ' + switchError.message);
                      }
                    }
                  }}
                  className="switch-network-btn"
                >
                  🔄 Chuyển sang Hardhat Local
                </button>
              </div>
            )}
          </div>
          
          <div className="debug-row">
            <strong>Hardhat Account:</strong>
            <span className={debugInfo.isHardhatAccount ? 'status-ok' : 'status-error'}>
              {debugInfo.isHardhatAccount ? '✅ Đúng' : '❌ Không phải'}
            </span>
            {!debugInfo.isHardhatAccount && (
              <div className="help-box">
                <p>💡 Import account với private key:</p>
                <code>0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d</code>
              </div>
            )}
          </div>

          {parseFloat(debugInfo.balance) === 0 && debugInfo.isHardhatAccount && (
            <div className="help-box">
              <p><strong>⚠️ Vấn đề:</strong> Account đúng nhưng balance = 0</p>
              <p><strong>Giải pháp:</strong></p>
              <ol>
                <li>Đảm bảo Hardhat node đang chạy: <code>npm run node</code></li>
                <li>
                  Đảm bảo đang ở network "Hardhat Local" (Chain ID: 31337)
                  {!debugInfo.isCorrectNetwork && (
                    <span> - <strong>Click nút "🔄 Chuyển sang Hardhat Local" ở trên!</strong></span>
                  )}
                </li>
                <li>Refresh MetaMask (đóng và mở lại extension)</li>
                <li>Restart Hardhat node và import lại account</li>
              </ol>
            </div>
          )}

          {!debugInfo.isCorrectNetwork && (
            <div className="help-box">
              <p><strong>⚠️ Vấn đề:</strong> Đang ở network sai (Chain ID: {debugInfo.chainId})</p>
              <p><strong>Giải pháp:</strong></p>
              <ol>
                <li>Click nút <strong>"🔄 Chuyển sang Hardhat Local"</strong> ở trên để tự động chuyển network</li>
                <li><strong>Nếu nút không hoạt động:</strong> Thêm network thủ công:
                  <ul>
                    <li>Mở MetaMask → Click network dropdown → "Add Network"</li>
                    <li>Điền: Network Name = "Hardhat Local", RPC URL = "http://127.0.0.1:8545", Chain ID = "31337", Currency = "ETH"</li>
                    <li>Xem file <code>THEM_HARDHAT_NETWORK_METAMASK.md</code> để có hướng dẫn chi tiết</li>
                  </ul>
                </li>
                <li>Hoặc thủ công: Mở MetaMask → Click network dropdown → Chọn "Hardhat Local" (nếu đã có)</li>
                <li>Đảm bảo Hardhat node đang chạy: <code>npm run node</code></li>
              </ol>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MetaMaskDebug;

