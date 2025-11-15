import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';
import WalletInfo from './components/WalletInfo';
import CreateTransaction from './components/CreateTransaction';
import TransactionList from './components/TransactionList';
import MetaMaskConnect from './components/MetaMaskConnect';
import MetaMaskDebug from './components/MetaMaskDebug';
import { getWalletInfo, createTransaction, signTransaction, deposit } from './services/api';
import web3Service from './services/web3Service';

function App() {
  const [walletInfo, setWalletInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOwner, setSelectedOwner] = useState('0xOwner1');
  const [depositAmount, setDepositAmount] = useState('');
  const [metaMaskAddress, setMetaMaskAddress] = useState('');
  const [contractABI, setContractABI] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [isBlockchainMode, setIsBlockchainMode] = useState(false);

  // Load contract ABI từ backend
  const loadContractABI = useCallback(async () => {
    try {
      // Load ABI từ API
      const response = await fetch('/api/contract/abi');
      if (response.ok) {
        const data = await response.json();
        setContractABI(data.abi);
        if (data.contractAddress) {
          setContractAddress(data.contractAddress);
        }
      }
    } catch (error) {
      console.error('Error loading contract ABI:', error);
      // Không có ABI cũng không sao, sẽ dùng simulation mode
    }
  }, []);

  const loadWalletInfo = useCallback(async () => {
    try {
      const info = await getWalletInfo();
      setWalletInfo(info);
      
      // Kiểm tra mode
      if (info.mode === 'blockchain' || info.contractAddress) {
        setIsBlockchainMode(true);
        setContractAddress(prev => prev || info.contractAddress || '');
      } else {
        setIsBlockchainMode(false);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading wallet info:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWalletInfo();
    loadContractABI();
    const interval = setInterval(loadWalletInfo, 3000); // Refresh every 3 seconds
    return () => clearInterval(interval);
  }, [loadWalletInfo, loadContractABI]);

  const handleMetaMaskConnect = async (address) => {
    setMetaMaskAddress(address);
    try {
      // Load contract ABI và address từ backend
      const response = await fetch('/api/contract/abi');
      if (response.ok) {
        const data = await response.json();
        setContractABI(data.abi);
        if (data.contractAddress) {
          setContractAddress(data.contractAddress);
          // Set contract trong web3Service
          web3Service.setContract(data.contractAddress, data.abi);
        }
      }
    } catch (error) {
      console.error('Error setting up contract:', error);
    }
  };

  const handleMetaMaskDisconnect = () => {
    setMetaMaskAddress('');
    setContractAddress('');
  };

  const handleCreateTransaction = async (to, amount) => {
    try {
      // Nếu MetaMask đã kết nối và có contract, dùng MetaMask trực tiếp
      if (metaMaskAddress && contractAddress && contractABI) {
        // Set contract nếu chưa set
        if (!web3Service.contract) {
          web3Service.setContract(contractAddress, contractABI);
        }
        
        // Tạo giao dịch qua MetaMask
        const result = await web3Service.createTransaction(to, amount);
        alert(`Giao dịch đã được tạo trên blockchain!\nTransaction Hash: ${result.txHash}\nTransaction ID: ${result.transactionId}`);
        await loadWalletInfo();
      } else {
        // Fallback: dùng API backend (simulation mode hoặc backend sẽ xử lý)
        await createTransaction(to, amount, selectedOwner);
        await loadWalletInfo();
        alert('Giao dịch đã được tạo! Đang chờ chữ ký...');
      }
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.error || error.message));
    }
  };

  // Helper function để parse error message
  const getErrorMessage = (error) => {
    let errorMessage = error.message || error.response?.data?.error || 'Có lỗi xảy ra';
    
    // Parse error từ JSON-RPC response
    if (error.info && error.info.error) {
      const rpcError = error.info.error;
      if (rpcError.message) {
        errorMessage = rpcError.message;
        // Parse revert reason nếu có
        if (rpcError.data) {
          try {
            const data = typeof rpcError.data === 'string' ? JSON.parse(rpcError.data) : rpcError.data;
            if (data.message) {
              errorMessage = data.message;
            }
          } catch (e) {
            // Ignore parse error
          }
        }
      }
    }
    
    return errorMessage;
  };

  const handleExecuteTransaction = async (transactionId) => {
    try {
      if (!metaMaskAddress || !contractAddress || !contractABI) {
        alert('⚠️ Cần kết nối MetaMask để thực hiện giao dịch');
        return;
      }

      if (!web3Service.contract) {
        web3Service.setContract(contractAddress, contractABI);
      }

      const result = await web3Service.executeTransaction(transactionId);
      alert(`✅ Giao dịch đã được thực hiện thành công!\nTransaction Hash: ${result.txHash}\n${result.message}`);
      await loadWalletInfo();
    } catch (error) {
      let errorMessage = getErrorMessage(error);

      // Kiểm tra các lỗi phổ biến
      if (errorMessage.includes('not owner')) {
        errorMessage = '⚠️ Bạn không phải là owner của ví này.';
      } else if (errorMessage.includes('cannot execute tx')) {
        errorMessage = '⚠️ Chưa đủ chữ ký để thực hiện giao dịch.';
      } else if (errorMessage.includes('tx already executed')) {
        errorMessage = '⚠️ Giao dịch đã được thực hiện rồi.';
      } else if (errorMessage.includes('tx failed')) {
        errorMessage = '⚠️ Giao dịch thất bại khi thực hiện. Có thể contract không đủ ETH.';
      } else if (errorMessage.includes('Internal JSON-RPC error')) {
        errorMessage = '⚠️ Lỗi kết nối blockchain. Vui lòng kiểm tra:\n- Contract có đủ ETH không\n- Hardhat node đang chạy\n- Network đúng (Hardhat Local)';
      }

      alert('Lỗi: ' + errorMessage);
      console.error('Error executing transaction:', error);
    }
  };

  const handleSignTransaction = async (transactionId) => {
    try {
      // Nếu MetaMask đã kết nối và có contract, dùng MetaMask trực tiếp
      if (metaMaskAddress && contractAddress && contractABI) {
        // Set contract nếu chưa set
        if (!web3Service.contract) {
          web3Service.setContract(contractAddress, contractABI);
        }
        
        // Ký giao dịch qua MetaMask
        const result = await web3Service.signTransaction(transactionId);
        
        // Nếu đủ chữ ký, tự động execute luôn - BẤT KỲ OWNER NÀO cũng có thể execute
        if (result.canExecute) {
          try {
            console.log(`✅ Đủ chữ ký (${result.numConfirmations}/${result.requiredSignatures})! Tự động execute transaction ${result.transactionId}...`);
            
            // Tự động execute ngay trong cùng flow, không cần quay lại account đầu tiên
            // Bất kỳ owner nào ký chữ ký cuối cùng đều có thể execute
            const executeResult = await web3Service.executeTransaction(result.transactionId);
            
            console.log('✅ Execute thành công:', executeResult);
            alert(`🎉 Giao dịch đã được thực hiện thành công!\n\n✅ Đủ ${result.numConfirmations}/${result.requiredSignatures} chữ ký\n📝 Ký giao dịch: ${result.txHash}\n⚡ Thực hiện giao dịch: ${executeResult.txHash}\n\nGiao dịch sẽ tự động chuyển sang phần "Đã thực hiện".`);
            
            // Refresh ngay sau khi execute
            await loadWalletInfo();
            // Refresh lại một lần nữa sau 1 giây để đảm bảo transaction chuyển sang executed
            setTimeout(async () => {
              await loadWalletInfo();
            }, 1000);
          } catch (executeError) {
            // Nếu execute lỗi, vẫn thông báo đã ký thành công
            const executeErrorMessage = getErrorMessage(executeError);
            console.error('❌ Lỗi khi execute:', executeError);
            
            // Kiểm tra xem có phải lỗi "already executed" không
            if (executeErrorMessage.includes('already executed') || executeErrorMessage.includes('tx already executed')) {
              // Nếu đã execute rồi (có thể bởi owner khác), chỉ thông báo thành công
              alert(`✅ Giao dịch đã được thực hiện thành công (bởi owner khác)!\n\nĐã ký: ${result.txHash}\n\nGiao dịch sẽ tự động chuyển sang phần "Đã thực hiện".`);
              await loadWalletInfo();
              setTimeout(async () => {
                await loadWalletInfo();
              }, 1000);
            } else {
              // Lỗi thực sự (ví dụ: contract không đủ ETH)
              alert(`✅ Đã ký giao dịch (${result.numConfirmations}/${result.requiredSignatures})!\n\n⚠️ Lỗi khi thực hiện giao dịch:\n${executeErrorMessage}\n\n💡 Bạn có thể thử lại bằng button "Thực hiện giao dịch" ở trên.`);
              await loadWalletInfo();
            }
          }
        } else {
          // Chưa đủ chữ ký
          alert(`✅ Đã ký giao dịch trên blockchain!\nTransaction Hash: ${result.txHash}\n\n${result.message}`);
          await loadWalletInfo();
        }
      } else {
        // Fallback: dùng API backend
        const result = await signTransaction(transactionId, selectedOwner);
        await loadWalletInfo();
        if (result.data.success) {
          alert(result.data.message || 'Đã ký giao dịch thành công!');
        }
      }
    } catch (error) {
      // Xử lý lỗi cụ thể
      let errorMessage = getErrorMessage(error);
      
      // Kiểm tra các lỗi phổ biến
      if (errorMessage.includes('already confirmed') || errorMessage.includes('tx already confirmed')) {
        errorMessage = '⚠️ Bạn đã ký giao dịch này rồi. Không thể ký lại.';
      } else if (errorMessage.includes('đã được thực hiện') || errorMessage.includes('already executed') || errorMessage.includes('tx already executed')) {
        errorMessage = '⚠️ Giao dịch đã được thực hiện rồi. Không thể ký thêm.';
      } else if (errorMessage.includes('not owner')) {
        errorMessage = '⚠️ Bạn không phải là owner của ví này. Vui lòng kiểm tra lại account trong MetaMask.';
      } else if (errorMessage.includes('is not an owner')) {
        errorMessage = '⚠️ Account hiện tại không phải là owner của ví này. Vui lòng switch sang account khác.';
      } else if (errorMessage.includes('tx not found') || errorMessage.includes('tx does not exist') || errorMessage.includes('does not exist')) {
        errorMessage = '⚠️ Giao dịch không tồn tại. Có thể transaction ID không đúng.';
      } else if (errorMessage.includes('executed') || errorMessage.includes('thực hiện')) {
        errorMessage = '⚠️ Giao dịch đã được thực hiện rồi.';
      } else if (errorMessage.includes('Internal JSON-RPC error') || errorMessage.includes('could not coalesce error')) {
        // Lỗi Internal JSON-RPC thường là do smart contract revert
        errorMessage = '⚠️ Lỗi khi ký giao dịch. Có thể:\n\n' +
          '1. ✅ Bạn đã ký giao dịch này rồi\n' +
          '2. ✅ Giao dịch đã được thực hiện\n' +
          '3. ✅ Account không phải owner\n' +
          '4. ✅ Transaction không tồn tại\n\n' +
          '💡 Vui lòng refresh trang và kiểm tra lại trạng thái giao dịch.';
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('denied')) {
        errorMessage = '⚠️ Bạn đã từ chối transaction trong MetaMask.';
      }
      
      alert('Lỗi: ' + errorMessage);
      console.error('Error signing transaction:', error);
    }
  };

  const handleDeposit = async () => {
    if (isBlockchainMode) {
      // Trong blockchain mode, gửi ETH trực tiếp đến contract
      if (!metaMaskAddress || !contractAddress) {
        alert('Vui lòng kết nối MetaMask và đảm bảo contract đã được load');
        return;
      }
      
      if (!depositAmount || parseFloat(depositAmount) <= 0) {
        alert('Vui lòng nhập số tiền hợp lệ');
        return;
      }
      
      try {
        // Gửi ETH trực tiếp đến contract qua MetaMask
        if (!window.ethereum) {
          throw new Error('MetaMask not installed');
        }
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        const tx = await signer.sendTransaction({
          to: contractAddress,
          value: ethers.parseEther(depositAmount.toString())
        });
        
        alert(`Đang gửi ${depositAmount} ETH đến contract...\nTransaction Hash: ${tx.hash}\n\nVui lòng đợi transaction được mined...`);
        
        const receipt = await tx.wait();
        alert(`✅ Gửi ETH thành công!\nTransaction Hash: ${receipt.hash}\nBlock Number: ${receipt.blockNumber}`);
        
        setDepositAmount('');
        await loadWalletInfo();
      } catch (error) {
        alert('Lỗi: ' + error.message);
        console.error('Error sending ETH:', error);
      }
    } else {
      // Simulation mode
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
        <MetaMaskDebug />
        
        <MetaMaskConnect
          onConnect={handleMetaMaskConnect}
          onDisconnect={handleMetaMaskDisconnect}
          contractAddress={contractAddress || walletInfo?.contractAddress}
          contractABI={contractABI}
        />

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
          {isBlockchainMode && metaMaskAddress && (
            <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
              💡 Đang ký với: <code>{metaMaskAddress.substring(0, 10)}...</code><br/>
              💡 Để ký với owner khác: Mở MetaMask → Click account icon → Chọn account khác (xem hướng dẫn trong <code>HOW_TO_SIGN_WITH_DIFFERENT_ACCOUNTS.md</code>)
            </div>
          )}
          {isBlockchainMode && !metaMaskAddress && (
            <div style={{ fontSize: '0.85em', color: '#ff9800', marginTop: '5px' }}>
              ⚠️ Cần kết nối MetaMask để ký giao dịch trong blockchain mode
            </div>
          )}
        </div>

        <WalletInfo walletInfo={walletInfo} />

        {isBlockchainMode ? (
          <div className="deposit-section blockchain">
            <h3>Gửi ETH vào Contract</h3>
            <p className="info-text">
              Trong blockchain mode, bạn cần gửi ETH trực tiếp đến contract address:
            </p>
            <div className="contract-address">
              <strong>Contract Address:</strong>
              <code>{contractAddress || walletInfo?.contractAddress || 'Loading...'}</code>
            </div>
            <div className="deposit-form">
              <input
                type="number"
                placeholder="Số ETH"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                min="0"
                step="0.001"
              />
              <button onClick={handleDeposit} disabled={!metaMaskAddress}>
                {metaMaskAddress ? 'Gửi ETH qua MetaMask' : 'Kết nối MetaMask trước'}
              </button>
            </div>
            <p className="help-text">
              💡 Hoặc gửi ETH trực tiếp từ MetaMask đến contract address trên
            </p>
          </div>
        ) : (
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
        )}

        <CreateTransaction 
          onCreateTransaction={handleCreateTransaction}
          balance={walletInfo?.balance}
        />

               <TransactionList
                 pendingTransactions={walletInfo?.pendingTransactions || []}
                 executedTransactions={walletInfo?.executedTransactions || []}
                 onSignTransaction={handleSignTransaction}
                 onExecuteTransaction={handleExecuteTransaction}
                 selectedOwner={selectedOwner}
                 owners={walletInfo?.owners || []}
                 metaMaskAddress={metaMaskAddress}
                 contractAddress={contractAddress}
                 contractABI={contractABI}
               />
      </div>
    </div>
  );
}

export default App;

