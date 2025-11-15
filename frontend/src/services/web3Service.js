import { ethers } from 'ethers';

/**
 * Service để tương tác với MetaMask và Smart Contract
 */
class Web3Service {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.contractAddress = null;
    this.contractABI = null;
  }

  /**
   * Kiểm tra xem MetaMask đã cài đặt chưa
   */
  isMetaMaskInstalled() {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  }

  /**
   * Kết nối với MetaMask
   */
  async connectMetaMask() {
    if (!this.isMetaMaskInstalled()) {
      throw new Error('MetaMask is not installed. Please install MetaMask extension.');
    }

    try {
      // Yêu cầu kết nối
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      // Tạo provider và signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();
      
      const address = await this.signer.getAddress();
      console.log('✅ Connected to MetaMask:', address);
      
      return address;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      throw error;
    }
  }

  /**
   * Lấy địa chỉ account hiện tại
   */
  async getCurrentAddress() {
    if (!this.signer) {
      await this.connectMetaMask();
    }
    return await this.signer.getAddress();
  }

  /**
   * Set contract address và ABI
   */
  setContract(contractAddress, contractABI) {
    this.contractAddress = contractAddress;
    this.contractABI = contractABI;
    
    if (this.signer && contractAddress && contractABI) {
      this.contract = new ethers.Contract(contractAddress, contractABI, this.signer);
      console.log('✅ Contract initialized:', contractAddress);
    }
  }

  /**
   * Tạo giao dịch mới trên blockchain
   */
  async createTransaction(to, amount) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Please set contract address and ABI.');
    }

    try {
      const value = ethers.parseEther(amount.toString());
      const tx = await this.contract.submitTransaction(to, value, '0x');
      
      console.log('Transaction submitted, waiting for confirmation...');
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
   * Kiểm tra xem address có phải owner không
   */
  async isOwner(address) {
    if (!this.contract) {
      return false;
    }

    try {
      return await this.contract.isOwner(address);
    } catch (error) {
      console.error('Error checking owner:', error);
      return false;
    }
  }

  /**
   * Kiểm tra xem owner đã ký giao dịch chưa
   */
  async isTransactionConfirmed(transactionId, ownerAddress) {
    if (!this.contract) {
      return false;
    }

    try {
      return await this.contract.isTransactionConfirmed(transactionId, ownerAddress);
    } catch (error) {
      console.error('Error checking confirmation:', error);
      return false;
    }
  }

  /**
   * Ký giao dịch
   */
  async signTransaction(transactionId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      // Kiểm tra xem account hiện tại có phải owner không
      const currentAddress = await this.getCurrentAddress();
      const isOwner = await this.isOwner(currentAddress);
      
      if (!isOwner) {
        throw new Error(`Address ${currentAddress} is not an owner of this wallet.`);
      }

      // Kiểm tra transaction trước khi ký
      try {
        const transaction = await this.contract.getTransaction(transactionId);
        
        // Kiểm tra transaction đã executed chưa
        if (transaction.executed) {
          throw new Error('Giao dịch đã được thực hiện rồi. Không thể ký thêm.');
        }
        
        // Kiểm tra xem owner hiện tại đã ký chưa
        const alreadyConfirmed = await this.isTransactionConfirmed(transactionId, currentAddress);
        
        if (alreadyConfirmed) {
          throw new Error('Bạn đã ký giao dịch này rồi. Không thể ký lại.');
        }
      } catch (preCheckError) {
        // Nếu lỗi trong pre-check, throw lại
        if (preCheckError.message.includes('đã') || preCheckError.message.includes('already')) {
          throw preCheckError;
        }
        // Nếu là lỗi khác (có thể transaction không tồn tại), vẫn thử confirm
        console.warn('Pre-check warning:', preCheckError.message);
      }

      // Thực hiện confirm transaction
      const tx = await this.contract.confirmTransaction(transactionId);
      const receipt = await tx.wait();

      // Lấy thông tin transaction sau khi ký
      const transaction = await this.contract.getTransaction(transactionId);
      const required = await this.contract.numConfirmationsRequired();

      const numConfirmations = Number(transaction.numConfirmations);
      const requiredNum = Number(required);

      const result = {
        success: true,
        txHash: receipt.hash,
        numConfirmations: transaction.numConfirmations.toString(),
        requiredSignatures: required.toString(),
        transactionId: transactionId,
      };

      // Kiểm tra xem có đủ chữ ký để execute không
      // Đảm bảo so sánh số, không phải string
      // Sau khi ký chữ ký thứ 4, ngay lập tức đủ điều kiện execute
      if (numConfirmations >= requiredNum && !transaction.executed) {
        result.canExecute = true;
        result.message = `Đủ ${numConfirmations}/${requiredNum} chữ ký! Tự động thực hiện giao dịch...`;
        console.log(`✅ Đủ chữ ký: ${numConfirmations}/${requiredNum}, sẵn sàng execute transaction ${transactionId}`);
      } else if (transaction.executed) {
        result.message = `Giao dịch đã được thực hiện rồi.`;
      } else {
        result.message = `Đã ký. ${numConfirmations}/${requiredNum} chữ ký.`;
      }

      return result;
    } catch (error) {
      console.error('Error signing transaction:', error);
      
      // Cải thiện error message bằng cách parse revert reason
      let errorMessage = error.message || 'Có lỗi xảy ra khi ký giao dịch';
      
      // Parse error từ ethers.js
      if (error.reason) {
        errorMessage = error.reason;
      } else if (error.info && error.info.error) {
        const rpcError = error.info.error;
        if (rpcError.message) {
          errorMessage = rpcError.message;
        }
      }
      
      // Tạo error mới với message rõ ràng hơn
      const enhancedError = new Error(errorMessage);
      enhancedError.originalError = error;
      throw enhancedError;
    }
  }

  /**
   * Thực hiện giao dịch
   */
  async executeTransaction(transactionId) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const tx = await this.contract.executeTransaction(transactionId);
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
   * Lắng nghe sự kiện khi account thay đổi
   */
  onAccountsChanged(callback) {
    if (!this.isMetaMaskInstalled()) {
      return;
    }

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length === 0) {
        // User disconnected
        this.signer = null;
        this.contract = null;
      } else {
        // Account changed, reconnect
        this.connectMetaMask().then(() => {
          if (this.contractAddress && this.contractABI) {
            this.setContract(this.contractAddress, this.contractABI);
          }
        });
      }
      callback(accounts);
    });
  }

  /**
   * Lắng nghe sự kiện khi network thay đổi
   */
  onChainChanged(callback) {
    if (!this.isMetaMaskInstalled()) {
      return;
    }

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
      callback(chainId);
    });
  }
}

// Export singleton instance
const web3Service = new Web3Service();
export default web3Service;

