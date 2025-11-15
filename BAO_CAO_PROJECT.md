# 📋 BÁO CÁO CHI TIẾT PROJECT MULTISIG WALLET

**Sinh viên:** NGUYỄN ĐĂNG DUY  
**MSSV:** 22810310021  
**Lớp:** D17CNPM1  
**Ngày:** 2024

---

## 📌 MỤC LỤC

1. [Tổng quan Project](#tổng-quan-project)
2. [Kiến trúc Hệ thống](#kiến-trúc-hệ-thống)
3. [Chi tiết từng File](#chi-tiết-từng-file)
4. [Luồng Hoạt động](#luồng-hoạt-động)
5. [Công nghệ sử dụng](#công-nghệ-sử-dụng)

---

## 🎯 TỔNG QUAN PROJECT

### Mô tả
Multisig Wallet là ứng dụng blockchain cho phép quản lý ví với nhiều chủ sở hữu (10 owners). Giao dịch chỉ được thực hiện khi có đủ số lượng chữ ký yêu cầu (4 chữ ký). Project hỗ trợ 2 chế độ:

1. **Simulation Mode**: Mô phỏng logic multisig không cần blockchain
2. **Blockchain Mode**: Sử dụng smart contract trên Ethereum (Hardhat local network)

### Tính năng chính
- ✅ Quản lý ví với 10 owners
- ✅ Yêu cầu 4 chữ ký để thực hiện giao dịch
- ✅ Tự động execute khi đủ chữ ký
- ✅ Tích hợp MetaMask
- ✅ Giao diện ReactJS hiện đại

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   App.js     │  │  Components  │  │   Services   │     │
│  │              │  │  - WalletInfo│  │  - api.js    │     │
│  │ Main Logic   │  │  - CreateTx  │  │  - web3Svc   │     │
│  │ State Mgmt   │  │  - TxList    │  │              │     │
│  │              │  │  - MetaMask  │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP API / MetaMask
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     BACKEND (Node.js/Express)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  server.js   │  │  multisig    │  │  blockchain  │     │
│  │              │  │  Wallet.js   │  │  Service.js  │     │
│  │  API Routes  │  │  (Simulation)│  │  (Blockchain)│     │
│  │  CORS        │  │              │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (Blockchain Mode only)
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  BLOCKCHAIN (Hardhat/Ethereum)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        MultisigWallet.sol (Smart Contract)           │   │
│  │  - submitTransaction()                               │   │
│  │  - confirmTransaction()                              │   │
│  │  - executeTransaction()                              │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 CHI TIẾT TỪNG FILE

### 🌐 ROOT LEVEL FILES

#### 1. `package.json` (Root)
**Chức năng:** Quản lý dependencies và scripts cho toàn bộ project

**Nội dung chính:**
- **Scripts:**
  - `dev`: Chạy đồng thời frontend và backend
  - `server`: Chạy backend server
  - `client`: Chạy frontend React app
  - `install-all`: Cài đặt dependencies cho tất cả modules
  - `compile`: Compile Solidity contracts
  - `test`: Chạy Hardhat tests
  - `deploy:local`: Deploy contract lên Hardhat local network
  - `deploy:sepolia`: Deploy contract lên Sepolia testnet
  - `node`: Chạy Hardhat local node
  - `check-balance`: Kiểm tra balance của accounts

- **Dependencies:**
  - `ethers@^6.9.0`: Thư viện tương tác với Ethereum blockchain
  - `concurrently@^8.2.2`: Chạy nhiều commands cùng lúc

- **DevDependencies:**
  - `hardhat@^2.19.0`: Development framework cho Ethereum
  - `@nomicfoundation/hardhat-toolbox@^4.0.0`: Hardhat plugins
  - `dotenv@^16.3.1`: Quản lý environment variables

#### 2. `hardhat.config.js`
**Chức năng:** Cấu hình Hardhat cho blockchain development

**Nội dung:**
- **Solidity Compiler:**
  - Version: `0.8.19`
  - Optimizer: enabled với 200 runs

- **Networks:**
  - `hardhat`: Local network (Chain ID: 31337)
  - `localhost`: Kết nối với Hardhat node (Chain ID: 31337)
  - `sepolia`: Sepolia testnet (Chain ID: 11155111)
  - `goerli`: Goerli testnet (Chain ID: 5) - deprecated

- **Paths:**
  - Sources: `./contracts`
  - Tests: `./test`
  - Cache: `./cache`
  - Artifacts: `./artifacts`

#### 3. `env.example`
**Chức năng:** Template file cho environment variables

**Nội dung:**
```env
MODE=blockchain              # 'simulation' hoặc 'blockchain'
CONTRACT_ADDRESS=0x...       # Địa chỉ contract sau khi deploy
NETWORK=localhost            # Network: localhost, sepolia, etc.
```

**Lưu ý:** Copy file này thành `backend/.env` và điền giá trị thực tế

#### 4. `README.md`
**Chức năng:** Hướng dẫn sử dụng project

**Nội dung:**
- Mô tả project
- Hướng dẫn cài đặt
- Hướng dẫn chạy (simulation mode và blockchain mode)
- Cấu trúc project
- API endpoints

---

### 🔷 CONTRACTS/ (Smart Contracts)

#### 1. `contracts/MultisigWallet.sol`
**Chức năng:** Smart contract chính cho multisig wallet trên Ethereum

**Cấu trúc:**

**State Variables:**
- `owners[]`: Mảng địa chỉ các owners
- `isOwner[address]`: Mapping kiểm tra owner
- `numConfirmationsRequired`: Số chữ ký tối thiểu (4)
- `transactions[]`: Mảng các giao dịch
- `isConfirmed[txIndex][owner]`: Mapping kiểm tra owner đã ký chưa

**Modifiers:**
- `onlyOwner`: Chỉ owner mới được gọi
- `txExists`: Transaction phải tồn tại
- `notExecuted`: Transaction chưa được thực hiện
- `notConfirmed`: Owner chưa ký transaction này

**Functions:**

1. **`constructor(address[] _owners, uint _numConfirmationsRequired)`**
   - Khởi tạo contract với danh sách owners và số chữ ký yêu cầu
   - Validate: owners không trùng, required <= số owners

2. **`receive() external payable`**
   - Nhận ETH gửi vào contract
   - Emit event `Deposit`

3. **`submitTransaction(address _to, uint _value, bytes _data)`**
   - Owner tạo transaction mới
   - Tự động ký (confirm) transaction
   - Trả về transaction index
   - Emit event `SubmitTransaction`

4. **`confirmTransaction(uint _txIndex)`**
   - Owner ký (confirm) transaction
   - Tăng `numConfirmations`
   - Emit event `ConfirmTransaction`

5. **`executeTransaction(uint _txIndex)`**
   - Thực hiện transaction khi đủ chữ ký
   - Chỉ owner mới được gọi
   - Yêu cầu: `numConfirmations >= numConfirmationsRequired`
   - Gửi ETH đến địa chỉ nhận
   - Emit event `ExecuteTransaction`

6. **`revokeConfirmation(uint _txIndex)`**
   - Hủy chữ ký đã ký trước đó
   - Giảm `numConfirmations`

7. **`getOwners() returns (address[] memory)`**
   - Trả về danh sách owners

8. **`getTransactionCount() returns (uint)`**
   - Trả về tổng số transactions

9. **`getTransaction(uint _txIndex)`**
   - Trả về thông tin transaction:
     - `to`: Địa chỉ nhận
     - `value`: Số lượng ETH
     - `data`: Data
     - `executed`: Đã thực hiện chưa
     - `numConfirmations`: Số chữ ký hiện tại

10. **`isTransactionConfirmed(uint _txIndex, address _owner) returns (bool)`**
    - Kiểm tra owner đã ký transaction chưa

**Events:**
- `Deposit`: Khi có ETH gửi vào contract
- `SubmitTransaction`: Khi tạo transaction mới
- `ConfirmTransaction`: Khi owner ký transaction
- `ExecuteTransaction`: Khi thực hiện transaction
- `RevokeConfirmation`: Khi hủy chữ ký

---

### ⚙️ BACKEND/ (Node.js Backend)

#### 1. `backend/server.js`
**Chức năng:** Express server chính, xử lý API requests

**Cấu trúc:**

**Initialization:**
```javascript
// Load .env file
require('dotenv').config({ path: path.join(__dirname, '.env') })

// Chọn mode: 'simulation' hoặc 'blockchain'
const MODE = process.env.MODE || 'simulation'

// Khởi tạo wallet (simulation mode)
const wallet = new MultisigWallet([...owners], 4)

// Khởi tạo blockchain service (blockchain mode)
let blockchainService = null
if (MODE === 'blockchain') {
  blockchainService = new BlockchainService()
}
```

**Middleware:**
- `cors()`: Cho phép cross-origin requests
- `bodyParser.json()`: Parse JSON request body

**Helper Functions:**

1. **`getWalletInfo()`**
   - Trả về thông tin ví dựa trên mode hiện tại
   - Simulation: Lấy từ `multisigWallet.js`
   - Blockchain: Lấy từ `blockchainService.js`

**API Routes:**

1. **`GET /api/wallet/info`**
   - Trả về: owners, requiredSignatures, balance, pendingTransactions, executedTransactions, mode, contractAddress

2. **`GET /api/mode`**
   - Trả về: mode hiện tại và trạng thái kết nối blockchain

3. **`GET /api/contract/abi`**
   - Trả về: Contract ABI và address (chỉ blockchain mode)

4. **`POST /api/transaction/create`**
   - Tạo transaction mới
   - Simulation: Dùng `wallet.createTransaction()`
   - Blockchain: Dùng `blockchainService.createTransaction()`

5. **`POST /api/transaction/sign`**
   - Ký transaction
   - Simulation: Dùng `wallet.signTransaction()`
   - Blockchain: Dùng `blockchainService.signTransaction()`

6. **`POST /api/transaction/execute`**
   - Thực hiện transaction (chỉ blockchain mode)
   - Dùng `blockchainService.executeTransaction()`

7. **`GET /api/transaction/:id`**
   - Lấy thông tin transaction cụ thể

8. **`GET /api/transactions/pending`**
   - Lấy danh sách transactions đang chờ

9. **`GET /api/transactions/executed`**
   - Lấy danh sách transactions đã thực hiện

10. **`POST /api/wallet/deposit`**
    - Nạp tiền vào ví (chỉ simulation mode)
    - Blockchain mode: Gửi ETH trực tiếp đến contract

**Server:**
- Port: 5000 (hoặc từ `process.env.PORT`)
- Log thông tin mode, owners, required signatures khi start

#### 2. `backend/multisigWallet.js`
**Chức năng:** Logic multisig wallet cho simulation mode (không dùng blockchain)

**Class: `MultisigWallet`**

**Properties:**
- `owners`: Array các owners
- `requiredSignatures`: Số chữ ký tối thiểu (4)
- `balance`: Số dư ví (1000 tokens mặc định)
- `pendingTransactions`: Map lưu transactions đang chờ
- `executedTransactions`: Array lưu transactions đã thực hiện
- `transactionCounter`: Counter tạo ID cho transactions

**Methods:**

1. **`isOwner(address)`**
   - Kiểm tra address có phải owner không

2. **`getOwners()`**
   - Trả về danh sách owners

3. **`getRequiredSignatures()`**
   - Trả về số chữ ký yêu cầu

4. **`getBalance()`**
   - Trả về số dư ví

5. **`createTransaction(to, amount, from)`**
   - Tạo transaction mới
   - Validate: owner, amount > 0, đủ balance
   - Tự động ký bởi người tạo
   - Trả về transaction object

6. **`signTransaction(transactionId, signer)`**
   - Owner ký transaction
   - Validate: owner, chưa ký, transaction tồn tại
   - Nếu đủ chữ ký → Tự động execute
   - Trả về kết quả

7. **`executeTransaction(transactionId)`**
   - Thực hiện transaction
   - Validate: đủ chữ ký, đủ balance
   - Trừ balance, thêm vào executedTransactions
   - Trả về kết quả

8. **`getTransaction(transactionId)`**
   - Lấy thông tin transaction

9. **`getPendingTransactions()`**
   - Trả về danh sách transactions đang chờ

10. **`getExecutedTransactions()`**
    - Trả về danh sách transactions đã thực hiện

11. **`deposit(amount)`**
    - Nạp tiền vào ví (tăng balance)

#### 3. `backend/blockchainService.js`
**Chức năng:** Service tương tác với smart contract trên blockchain

**Class: `BlockchainService`**

**Properties:**
- `provider`: Ethers.js provider (kết nối với blockchain)
- `contract`: Ethers.js contract instance
- `contractAddress`: Địa chỉ contract
- `network`: Network hiện tại (localhost, sepolia)
- `abi`: Contract ABI

**Methods:**

1. **`initializeProvider()`**
   - Khởi tạo provider dựa trên network
   - Localhost: `http://127.0.0.1:8545`
   - Sepolia: RPC URL từ env

2. **`loadContractABI()`**
   - Load ABI từ artifacts sau khi compile
   - Path: `artifacts/contracts/MultisigWallet.sol/MultisigWallet.json`

3. **`setContractAddress(address)`**
   - Set contract address và khởi tạo contract instance

4. **`isConnected()`**
   - Kiểm tra đã kết nối blockchain chưa

5. **`getWalletInfo()`**
   - Lấy thông tin từ smart contract:
     - Owners
     - Required signatures
     - Balance
     - Pending transactions (chưa executed)
     - Executed transactions (đã executed)

6. **`createTransaction(to, amount, fromPrivateKey)`**
   - Tạo transaction trên blockchain
   - Dùng private key để sign transaction
   - Gọi `submitTransaction()` trong contract
   - Trả về transaction ID và hash

7. **`signTransaction(transactionId, signerPrivateKey)`**
   - Ký transaction trên blockchain
   - Gọi `confirmTransaction()` trong contract
   - Trả về kết quả và kiểm tra có đủ chữ ký để execute không

8. **`executeTransaction(transactionId, signerPrivateKey)`**
   - Thực hiện transaction trên blockchain
   - Gọi `executeTransaction()` trong contract
   - Trả về transaction hash

9. **`getTransaction(transactionId)`**
   - Lấy thông tin transaction từ contract

10. **`isTransactionConfirmed(transactionId, ownerAddress)`**
    - Kiểm tra owner đã ký transaction chưa
    - Gọi `isTransactionConfirmed()` trong contract

#### 4. `backend/package.json`
**Chức năng:** Quản lý dependencies cho backend

**Dependencies:**
- `express@^4.18.2`: Web framework
- `cors@^2.8.5`: Cross-origin resource sharing
- `body-parser@^1.20.2`: Parse request body
- `ethers@^6.9.0`: Ethereum library
- `dotenv@^16.3.1`: Environment variables

**DevDependencies:**
- `nodemon@^3.0.1`: Auto-restart server khi code thay đổi

**Scripts:**
- `start`: Chạy server với Node.js
- `dev`: Chạy server với nodemon (auto-reload)

---

### 🎨 FRONTEND/ (React Frontend)

#### 1. `frontend/src/App.js`
**Chức năng:** Component chính của ứng dụng, quản lý state và logic chính

**State Variables:**
- `walletInfo`: Thông tin ví (owners, balance, transactions)
- `loading`: Trạng thái loading
- `selectedOwner`: Owner được chọn trong dropdown (simulation mode)
- `depositAmount`: Số tiền muốn nạp
- `metaMaskAddress`: Địa chỉ MetaMask đang kết nối
- `contractABI`: Contract ABI từ backend
- `contractAddress`: Địa chỉ contract
- `isBlockchainMode`: Đang ở blockchain mode hay không

**Hooks:**
- `useEffect`: Load wallet info khi mount, refresh mỗi 3 giây
- `useCallback`: Memoize functions để tránh re-render

**Functions:**

1. **`loadContractABI()`**
   - Load contract ABI từ `/api/contract/abi`
   - Set contract trong `web3Service` nếu có

2. **`loadWalletInfo()`**
   - Load thông tin ví từ `/api/wallet/info`
   - Detect mode và set state tương ứng

3. **`handleMetaMaskConnect(address)`**
   - Xử lý khi MetaMask kết nối
   - Load contract ABI và setup web3Service

4. **`handleMetaMaskDisconnect()`**
   - Xử lý khi MetaMask disconnect
   - Clear contract address và ABI

5. **`handleCreateTransaction(to, amount)`**
   - Tạo transaction mới
   - Blockchain mode: Dùng `web3Service.createTransaction()` (MetaMask)
   - Simulation mode: Dùng API backend

6. **`handleSignTransaction(transactionId)`**
   - Ký transaction
   - Blockchain mode: Dùng `web3Service.signTransaction()` (MetaMask)
   - Nếu đủ chữ ký → Tự động execute
   - Simulation mode: Dùng API backend

7. **`handleExecuteTransaction(transactionId)`**
   - Thực hiện transaction (blockchain mode)
   - Dùng `web3Service.executeTransaction()`
   - Refresh wallet info sau khi execute

8. **`handleDeposit()`**
   - Nạp tiền vào ví
   - Blockchain mode: Gửi ETH trực tiếp đến contract qua MetaMask
   - Simulation mode: Dùng API backend

9. **`getErrorMessage(error)`**
   - Parse error message từ JSON-RPC response
   - Trả về thông báo lỗi rõ ràng

**Render:**
- Header với thông tin sinh viên
- MetaMaskDebug component (debug connection)
- MetaMaskConnect component
- Owner selector (simulation mode)
- WalletInfo component
- Deposit section (khác nhau theo mode)
- CreateTransaction component
- TransactionList component

#### 2. `frontend/src/components/WalletInfo.js`
**Chức năng:** Hiển thị thông tin ví

**Props:**
- `walletInfo`: Object chứa thông tin ví

**Hiển thị:**
- Số dư ví (ETH hoặc tokens tùy mode)
- Số chữ ký yêu cầu
- Tổng số owners
- Số giao dịch đang chờ
- Danh sách owners (dạng badges)

**Styling:** `WalletInfo.css`

#### 3. `frontend/src/components/CreateTransaction.js`
**Chức năng:** Form tạo transaction mới

**Props:**
- `onCreateTransaction(to, amount)`: Callback khi tạo transaction
- `balance`: Số dư hiện tại (validate)

**State:**
- `to`: Địa chỉ nhận
- `amount`: Số tiền

**Validation:**
- Địa chỉ nhận không được trống
- Số tiền > 0 và <= balance

**Styling:** `CreateTransaction.css`

#### 4. `frontend/src/components/TransactionList.js`
**Chức năng:** Hiển thị danh sách transactions (pending và executed)

**Props:**
- `pendingTransactions`: Array transactions đang chờ
- `executedTransactions`: Array transactions đã thực hiện
- `onSignTransaction(transactionId)`: Callback khi ký transaction
- `onExecuteTransaction(transactionId)`: Callback khi execute transaction
- `selectedOwner`: Owner được chọn (simulation mode)
- `owners`: Danh sách owners
- `metaMaskAddress`: MetaMask address (blockchain mode)
- `contractAddress`: Contract address
- `contractABI`: Contract ABI

**State:**
- `confirmedTransactions`: Object tracking owner đã ký transaction nào

**Logic:**

1. **`canSign(transaction)`**
   - Kiểm tra owner hiện tại có thể ký transaction không
   - Blockchain mode: Check với contract `isTransactionConfirmed()`
   - Simulation mode: Check với `signatures` array

2. **`getSignatureProgress(transaction)`**
   - Trả về chuỗi "X/Y" (X = số chữ ký hiện tại, Y = yêu cầu)
   - Blockchain mode: Dùng `numConfirmations`
   - Simulation mode: Dùng `signatures.length`

3. **`useEffect`**
   - Auto-check confirmation status mỗi 3 giây (blockchain mode)
   - Clear state khi đổi owner

**Render:**
- Section "Giao dịch đang chờ chữ ký"
  - Mỗi transaction hiển thị: ID, status, to, amount, signature progress
  - Button "Ký giao dịch" nếu có thể ký
  - Button "Thực hiện giao dịch" nếu đủ chữ ký
  - Message "Đã ký" nếu đã ký hoặc đủ chữ ký

- Section "Giao dịch đã thực hiện"
  - Mỗi transaction hiển thị: ID, status, to, amount, thời gian, confirmations

**Styling:** `TransactionList.css`

#### 5. `frontend/src/components/MetaMaskConnect.js`
**Chức năng:** Component kết nối MetaMask

**Props:**
- `onConnect(address)`: Callback khi kết nối thành công
- `onDisconnect()`: Callback khi disconnect
- `contractAddress`: Contract address
- `contractABI`: Contract ABI

**State:**
- `connected`: Đã kết nối chưa
- `address`: Địa chỉ MetaMask
- `loading`: Đang kết nối
- `error`: Lỗi nếu có

**Functions:**
- `checkConnection()`: Kiểm tra đã kết nối chưa (khi mount)
- `handleConnect()`: Xử lý kết nối MetaMask
- `handleDisconnect()`: Xử lý disconnect

**Events:**
- `accountsChanged`: Khi đổi account trong MetaMask
- `chainChanged`: Khi đổi network trong MetaMask

**Render:**
- Button "Connect MetaMask" nếu chưa kết nối
- Hiển thị address và button "Disconnect" nếu đã kết nối
- Hint về cách switch account

**Styling:** `MetaMaskConnect.css`

#### 6. `frontend/src/components/MetaMaskDebug.js`
**Chức năng:** Component debug thông tin MetaMask connection

**Props:** Không có (tự động check)

**State:**
- `debugInfo`: Object chứa thông tin debug (address, balance, network, chainId)
- `loading`: Đang check

**Functions:**
- `checkConnection()`: Check connection và hiển thị thông tin

**Hiển thị:**
- Address hiện tại
- Balance (ETH)
- Network (name và Chain ID)
- Hardhat Account check (có phải account từ Hardhat node không)
- Warnings nếu có vấn đề:
  - Balance = 0
  - Wrong network (Chain ID không phải 31337)
  - Wrong account

**Features:**
- Button "Chuyển sang Hardhat Local" tự động chuyển network
- Tự động thêm network vào MetaMask nếu chưa có

**Styling:** `MetaMaskDebug.css`

#### 7. `frontend/src/services/api.js`
**Chức năng:** API client cho backend communication (simulation mode)

**Functions:**

1. **`getWalletInfo()`**
   - GET `/api/wallet/info`
   - Trả về thông tin ví

2. **`createTransaction(to, amount, from)`**
   - POST `/api/transaction/create`
   - Tạo transaction mới

3. **`signTransaction(transactionId, signer)`**
   - POST `/api/transaction/sign`
   - Ký transaction

4. **`getTransaction(transactionId)`**
   - GET `/api/transaction/:id`
   - Lấy thông tin transaction

5. **`getPendingTransactions()`**
   - GET `/api/transactions/pending`
   - Lấy danh sách pending transactions

6. **`getExecutedTransactions()`**
   - GET `/api/transactions/executed`
   - Lấy danh sách executed transactions

7. **`deposit(amount)`**
   - POST `/api/wallet/deposit`
   - Nạp tiền vào ví (simulation mode)

#### 8. `frontend/src/services/web3Service.js`
**Chức năng:** Service tương tác với MetaMask và Smart Contract

**Class: `Web3Service`**

**Properties:**
- `provider`: Ethers.js BrowserProvider
- `signer`: Ethers.js signer (từ MetaMask)
- `contract`: Ethers.js contract instance
- `contractAddress`: Contract address
- `contractABI`: Contract ABI

**Methods:**

1. **`isMetaMaskInstalled()`**
   - Kiểm tra MetaMask đã cài đặt chưa

2. **`connectMetaMask()`**
   - Kết nối với MetaMask
   - Request accounts permission
   - Tạo provider và signer
   - Trả về address

3. **`getCurrentAddress()`**
   - Lấy địa chỉ account hiện tại

4. **`setContract(contractAddress, contractABI)`**
   - Set contract address và ABI
   - Tạo contract instance với signer

5. **`isOwner(address)`**
   - Kiểm tra address có phải owner không
   - Gọi `contract.isOwner(address)`

6. **`isTransactionConfirmed(transactionId, ownerAddress)`**
   - Kiểm tra owner đã ký transaction chưa
   - Gọi `contract.isTransactionConfirmed()`

7. **`createTransaction(to, amount)`**
   - Tạo transaction trên blockchain
   - Gọi `contract.submitTransaction()`
   - Parse transaction ID từ event
   - Trả về transaction ID và hash

8. **`signTransaction(transactionId)`**
   - Pre-check: owner, chưa executed, chưa confirmed
   - Ký transaction: Gọi `contract.confirmTransaction()`
   - Check có đủ chữ ký để execute không
   - Trả về result với `canExecute` flag

9. **`executeTransaction(transactionId)`**
   - Thực hiện transaction
   - Gọi `contract.executeTransaction()`
   - Trả về transaction hash

10. **`onAccountsChanged(callback)`**
    - Lắng nghe khi đổi account trong MetaMask
    - Reconnect và setup lại contract

11. **`onChainChanged(callback)`**
    - Lắng nghe khi đổi network trong MetaMask
    - Reload page

**Export:**
- Singleton instance: `export default new Web3Service()`

#### 9. `frontend/src/index.js`
**Chức năng:** Entry point của React app

**Nội dung:**
- Import React và ReactDOM
- Import App component
- Import CSS
- Render App vào root element

#### 10. `frontend/src/App.css`
**Chức năng:** Styles chính cho App component

**Styles:**
- Layout, colors, gradients
- Component styles
- Responsive design

#### 11. `frontend/src/index.css`
**Chức năng:** Global styles

**Styles:**
- Reset CSS
- Base typography
- Global variables

#### 12. `frontend/package.json`
**Chức năng:** Quản lý dependencies cho frontend

**Dependencies:**
- `react@^18.2.0`: React library
- `react-dom@^18.2.0`: React DOM renderer
- `react-scripts@^5.0.1`: Create React App scripts
- `axios@^1.6.0`: HTTP client
- `ethers@^6.9.0`: Ethereum library
- `web-vitals@^3.5.0`: Web performance metrics

**Scripts:**
- `start`: Development server
- `build`: Production build
- `test`: Run tests
- `eject`: Eject from CRA (không nên dùng)

**Proxy:**
- `http://localhost:5000`: Proxy API requests đến backend

#### 13. `frontend/public/index.html`
**Chức năng:** HTML template cho React app

**Nội dung:**
- Meta tags
- Title: "Multisig Wallet - Ví đa chữ ký"
- Root div cho React render

---

### 📜 SCRIPTS/ (Deployment Scripts)

#### 1. `scripts/deploy.js`
**Chức năng:** Script deploy smart contract lên blockchain

**Logic:**
1. Lấy signers từ Hardhat (10 accounts đầu tiên)
2. Cấu hình:
   - Owners: 10 addresses từ Hardhat accounts
   - `numConfirmationsRequired`: 4
3. Deploy contract với constructor parameters
4. Verify deployment:
   - Check owners count
   - Check required confirmations
   - Check balance
5. In thông tin deployment (address, owners, config)

**Usage:**
```bash
npm run deploy:local    # Deploy lên Hardhat local
npm run deploy:sepolia  # Deploy lên Sepolia testnet
```

#### 2. `scripts/checkBalance.js`
**Chức năng:** Script kiểm tra balance của accounts và contract

**Logic:**
1. Lấy 10 accounts đầu tiên từ Hardhat
2. Kiểm tra balance của mỗi account (mặc định 10000 ETH)
3. Kiểm tra balance của contract (nếu đã deploy)
4. In ra console

**Usage:**
```bash
npm run check-balance
```

---

### 🧪 TEST/ (Tests)

#### 1. `test/MultisigWallet.test.js`
**Chức năng:** Unit tests cho smart contract

**Framework:** Hardhat + Chai

**Test Cases:**

1. **Deployment Tests:**
   - Should set the right owners
   - Should set the right number of required confirmations

2. **Transaction Tests:**
   - Should create transaction
   - Should confirm transaction
   - Should execute transaction when enough confirmations
   - Should not execute transaction without enough confirmations
   - Should revert if non-owner tries to execute
   - Should revert if trying to confirm twice

3. **Edge Cases:**
   - Invalid owners
   - Invalid required confirmations
   - Transaction not found

**Usage:**
```bash
npm test
```

---

### 🎨 CSS FILES

Tất cả các CSS files trong `frontend/src/components/`:

- **`WalletInfo.css`**: Styles cho component hiển thị thông tin ví
- **`CreateTransaction.css`**: Styles cho form tạo transaction
- **`TransactionList.css`**: Styles cho danh sách transactions
- **`MetaMaskConnect.css`**: Styles cho component kết nối MetaMask
- **`MetaMaskDebug.css`**: Styles cho component debug MetaMask

**Đặc điểm:**
- Gradient backgrounds
- Card-based layout
- Responsive design
- Hover effects
- Color-coded status badges

---

## 🔄 LUỒNG HOẠT ĐỘNG

### Simulation Mode

```
1. User chọn Owner từ dropdown
2. User tạo transaction → POST /api/transaction/create
   → Backend: wallet.createTransaction()
   → Transaction được tạo và tự động ký bởi người tạo
   → Trả về transaction ID
3. User khác ký transaction → POST /api/transaction/sign
   → Backend: wallet.signTransaction()
   → Nếu đủ 4 chữ ký → Tự động execute
   → Trả về kết quả
4. Frontend refresh wallet info mỗi 3 giây
   → GET /api/wallet/info
   → Hiển thị transactions mới nhất
```

### Blockchain Mode

```
1. User kết nối MetaMask → web3Service.connectMetaMask()
   → MetaMask popup request permission
   → Get address và tạo provider/signer
2. Frontend load contract ABI → GET /api/contract/abi
   → Set contract trong web3Service
3. User tạo transaction → web3Service.createTransaction()
   → MetaMask popup confirm transaction
   → Smart contract: submitTransaction()
   → Transaction được tạo và owner tự động ký
   → Trả về transaction ID
4. User khác (switch account) ký transaction → web3Service.signTransaction()
   → Pre-check: owner, chưa executed, chưa confirmed
   → MetaMask popup confirm
   → Smart contract: confirmTransaction()
   → Nếu đủ 4 chữ ký → Tự động execute
   → Smart contract: executeTransaction()
   → ETH được gửi đến địa chỉ nhận
5. Frontend refresh wallet info mỗi 3 giây
   → GET /api/wallet/info
   → Backend: blockchainService.getWalletInfo()
   → Smart contract: getTransaction(), getOwners(), etc.
   → Hiển thị transactions mới nhất
```

### Auto-Execute Flow

```
Khi owner thứ 4 ký transaction:
1. signTransaction() được gọi
2. Smart contract confirmTransaction() → numConfirmations = 4
3. Check: numConfirmations >= requiredNum (4 >= 4) → canExecute = true
4. Tự động gọi executeTransaction()
5. Smart contract executeTransaction() → Gửi ETH
6. Transaction chuyển sang executed
7. Frontend refresh → Transaction hiển thị trong "Đã thực hiện"
```

---

## 💻 CÔNG NGHỆ SỬ DỤNG

### Frontend
- **React 18**: UI framework
- **Ethers.js 6.9**: Tương tác với Ethereum blockchain
- **Axios**: HTTP client cho API calls
- **CSS3**: Styling với gradients và animations

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **Ethers.js 6.9**: Tương tác với smart contract
- **Dotenv**: Environment variables management

### Blockchain
- **Solidity 0.8.19**: Smart contract language
- **Hardhat 2.19**: Development framework
- **Ethereum**: Blockchain network (local/testnet)

### Tools
- **MetaMask**: Browser wallet
- **Nodemon**: Auto-reload backend
- **Concurrently**: Run multiple processes

---

## 📊 CẤU HÌNH MẶC ĐỊNH

- **Owners**: 10 addresses (Hardhat test accounts)
- **Required Signatures**: 4
- **Initial Balance**: 1000 tokens (simulation) / 0 ETH (blockchain)
- **Hardhat Node**: Chain ID 31337, Port 8545

---

## 🔐 BẢO MẬT

### Simulation Mode
- Dữ liệu lưu trong memory (không persistent)
- Không có bảo mật thực sự (chỉ demo)

### Blockchain Mode
- Smart contract đảm bảo:
  - Chỉ owners mới có thể tạo/ký transactions
  - Cần đủ chữ ký mới execute được
  - Không thể ký lại transaction đã ký
  - Không thể execute transaction đã executed
- MetaMask bảo vệ private keys (không bao giờ expose)

---

## 📝 KẾT LUẬN

Project Multisig Wallet là một ứng dụng blockchain hoàn chỉnh với:

✅ **Frontend ReactJS** hiện đại, thân thiện  
✅ **Backend Node.js/Express** linh hoạt (2 modes)  
✅ **Smart Contract Solidity** đảm bảo tính bảo mật  
✅ **Tích hợp MetaMask** cho blockchain interactions  
✅ **Auto-execute** khi đủ chữ ký  
✅ **Documentation** đầy đủ  

Project đã được tối ưu, gọn gàng và sẵn sàng để sử dụng!

---

**Người thực hiện:** NGUYỄN ĐĂNG DUY - 22810310021 - D17CNPM1

