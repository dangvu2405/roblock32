# 📖 HƯỚNG DẪN CHẠY PROJECT MULTISIG WALLET TRÊN MÁY KHÁC

**Sinh viên:** NGUYỄN ĐĂNG DUY - 22810310021 - D17CNPM1

---

## 📋 MỤC LỤC

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt Project](#cài-đặt-project)
3. [Chạy Simulation Mode (Đơn giản nhất)](#chạy-simulation-mode)
4. [Chạy Blockchain Mode (Nâng cao)](#chạy-blockchain-mode)
5. [Troubleshooting](#troubleshooting)

---

## 💻 YÊU CẦU HỆ THỐNG

### Bắt buộc
- **Node.js**: Phiên bản 14.x trở lên (khuyến nghị 16.x hoặc 18.x)
- **npm**: Phiên bản 6.x trở lên (hoặc yarn)
- **Git**: Để clone repository
- **Trình duyệt**: Chrome, Firefox, Edge (có hỗ trợ MetaMask)

### Tùy chọn (cho Blockchain Mode)
- **MetaMask Extension**: Cài đặt trong trình duyệt
- **Hardhat**: Đã được cài đặt tự động qua npm

---

## 📥 CÀI ĐẶT PROJECT

### Bước 1: Clone Repository

```bash
git clone https://github.com/dangvu2405/roblock32.git
cd roblock32
```

### Bước 2: Cài đặt Dependencies

**Cách 1: Cài đặt tất cả cùng lúc (Khuyến nghị)**

```bash
npm run install-all
```

Lệnh này sẽ tự động cài đặt dependencies cho:
- Root project
- Backend
- Frontend

**Cách 2: Cài đặt từng phần**

```bash
# 1. Root project
npm install

# 2. Backend
cd backend
npm install
cd ..

# 3. Frontend
cd frontend
npm install
cd ..
```

### Bước 3: Kiểm tra cài đặt

```bash
# Kiểm tra Node.js
node --version

# Kiểm tra npm
npm --version

# Kiểm tra dependencies đã cài đặt
ls node_modules        # Root
ls backend/node_modules # Backend
ls frontend/node_modules # Frontend
```

---

## 🚀 CHẠY SIMULATION MODE

**Simulation Mode** là chế độ đơn giản nhất, không cần blockchain, chỉ mô phỏng logic multisig.

### Bước 1: Chạy ứng dụng

Mở terminal và chạy:

```bash
npm run dev
```

Lệnh này sẽ tự động khởi động:
- ✅ Backend server trên `http://localhost:5000`
- ✅ Frontend development server trên `http://localhost:3000`

### Bước 2: Truy cập ứng dụng

Mở trình duyệt và truy cập:
```
http://localhost:3000
```

### Bước 3: Sử dụng

1. **Chọn Owner**: Chọn một owner từ dropdown ở đầu trang
2. **Tạo giao dịch**: Nhập địa chỉ nhận và số tiền → Click "Tạo giao dịch"
3. **Ký giao dịch**: 
   - Chọn owner khác từ dropdown
   - Click "Ký giao dịch" trên transaction
   - Khi đủ 4 chữ ký → Tự động execute
4. **Xem kết quả**: Transaction chuyển sang "Giao dịch đã thực hiện"

### ✅ Hoàn thành!

Simulation mode đã sẵn sàng sử dụng. Không cần cấu hình thêm.

---

## ⛓️ CHẠY BLOCKCHAIN MODE

**Blockchain Mode** sử dụng smart contract thực trên Hardhat local network.

### Bước 1: Chạy Hardhat Node

Mở **Terminal 1** và chạy:

```bash
npm run node
```

Bạn sẽ thấy output:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts:
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
...
```

**⚠️ QUAN TRỌNG:** Giữ terminal này mở, không đóng!

### Bước 2: Deploy Smart Contract

Mở **Terminal 2** (terminal mới) và chạy:

```bash
npm run deploy:local
```

Bạn sẽ thấy output:
```
✅ MultisigWallet deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Lưu lại Contract Address này!**

### Bước 3: Cấu hình Backend

Tạo file `backend/.env`:

```bash
# Windows
cd backend
copy env.example .env

# Linux/Mac
cd backend
cp env.example .env
```

Mở file `backend/.env` và điền:

```env
MODE=blockchain
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NETWORK=localhost
```

**Lưu ý:** Thay `CONTRACT_ADDRESS` bằng address từ bước 2 nếu khác.

### Bước 4: Compile Smart Contract

Trong **Terminal 2**:

```bash
npm run compile
```

### Bước 5: Chạy Backend và Frontend

Trong **Terminal 2** (hoặc Terminal 3):

```bash
npm run dev
```

Bạn sẽ thấy:
```
✅ Blockchain connected
✅ Contract initialized at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
🚀 Server running on port 5000
📦 Mode: BLOCKCHAIN
```

### Bước 6: Setup MetaMask

#### 6.1. Cài đặt MetaMask

1. Truy cập: https://metamask.io/download/
2. Cài đặt extension cho trình duyệt
3. Tạo hoặc import wallet

#### 6.2. Thêm Hardhat Network

1. Mở MetaMask
2. Click vào network dropdown (góc trên, hiện "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Điền thông tin:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
5. Click "Save"
6. Chuyển sang network "Hardhat Local"

#### 6.3. Import Test Account

1. Mở MetaMask
2. Click account icon (góc trên phải)
3. Click "Import Account"
4. Chọn "Private Key"
5. Paste private key này:
   ```
   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```
6. Click "Import"

**Thông tin account:**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Balance: 10000 ETH (trên Hardhat Local network)

### Bước 7: Kết nối MetaMask với Frontend

1. Mở trình duyệt: `http://localhost:3000`
2. Click button "🔗 Connect MetaMask"
3. MetaMask sẽ hiện popup → Click "Connect"
4. Chọn account vừa import → Click "Next" → "Connect"

### Bước 8: Gửi ETH vào Contract

1. Trong frontend, tìm phần "Gửi ETH vào Contract"
2. Nhập số ETH (ví dụ: `10`)
3. Click "Gửi ETH qua MetaMask"
4. MetaMask popup → Click "Confirm"
5. Đợi transaction được mined

### Bước 9: Sử dụng

1. **Tạo transaction**: Nhập địa chỉ nhận và số ETH → Click "Tạo giao dịch"
2. **Ký transaction**: 
   - Switch sang account khác trong MetaMask (nếu cần)
   - Click "Ký giao dịch"
   - Khi đủ 4 chữ ký → Tự động execute
3. **Xem kết quả**: Transaction chuyển sang "Đã thực hiện"

### ✅ Hoàn thành Blockchain Mode!

---

## 🔧 TROUBLESHOOTING

### Lỗi: Port đã được sử dụng

**Lỗi:** `Error: listen EADDRINUSE: address already in use :::5000`

**Giải pháp:**

**Windows:**
```bash
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay <PID> bằng số từ lệnh trên)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Tìm và kill process
lsof -ti:5000 | xargs kill -9
```

**Hoặc đổi port:**
```bash
# Trong backend/.env
PORT=5001
```

### Lỗi: Module not found

**Lỗi:** `Cannot find module 'xxx'`

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Cài đặt lại
npm run install-all
```

### Lỗi: Hardhat node không chạy

**Lỗi:** `Error: connect ECONNREFUSED 127.0.0.1:8545`

**Giải pháp:**
1. Đảm bảo Hardhat node đang chạy: `npm run node`
2. Kiểm tra port 8545 không bị block bởi firewall
3. Thử restart Hardhat node

### Lỗi: Warning Node.js version không được hỗ trợ

**Lỗi:** `WARNING: You are currently using Node.js v18.15.0, which is not supported by Hardhat`

**Giải pháp:**

**Cách 1: Bỏ qua warning (Khuyến nghị)**
- Warning này thường không ảnh hưởng đến việc compile và chạy
- Hardhat vẫn hoạt động bình thường với Node.js 18.x
- Có thể tiếp tục sử dụng

**Cách 2: Update Hardhat (Nếu gặp lỗi thực sự)**
```bash
npm install --save-dev hardhat@latest
```

**Cách 3: Downgrade Node.js (Nếu cần)**
- Cài đặt Node.js 16.x hoặc 20.x từ https://nodejs.org/
- Sử dụng nvm (Node Version Manager) để quản lý nhiều phiên bản Node.js

### Lỗi: "Nothing to compile"

**Lỗi:** `Nothing to compile` khi chạy `npm run compile`

**Nguyên nhân:**
1. File contract không tồn tại trong thư mục `contracts/`
2. Đã compile rồi và không có thay đổi
3. Hardhat cache đang lưu trữ bản compile cũ

**Giải pháp:**

**Bước 1: Kiểm tra file contract**
```bash
# Kiểm tra xem file contract có tồn tại không
dir contracts
# Hoặc trên Linux/Mac:
ls contracts
```

Nếu không có file `MultisigWallet.sol`, cần:
1. Kiểm tra lại khi clone repository
2. Đảm bảo file `contracts/MultisigWallet.sol` có trong project

**Bước 2: Force compile lại**
```bash
# Xóa cache và artifacts
rm -rf cache artifacts
# Hoặc trên Windows PowerShell:
Remove-Item -Recurse -Force cache, artifacts

# Compile lại
npm run compile
```

**Bước 3: Kiểm tra hardhat.config.js**
Đảm bảo trong `hardhat.config.js` có:
```javascript
paths: {
  sources: "./contracts",
  tests: "./test",
  cache: "./cache",
  artifacts: "./artifacts",
}
```

**Bước 4: Nếu vẫn không được, kiểm tra lại cấu trúc project**
```bash
# Cấu trúc đúng phải là:
roblock32/
├── contracts/
│   └── MultisigWallet.sol  ← File này phải có
├── hardhat.config.js
├── package.json
└── ...
```

### Lỗi: Contract không tìm thấy

**Lỗi:** `Contract not found` hoặc `Contract ABI not found`

**Giải pháp:**
```bash
# 1. Xóa cache và compile lại
rm -rf cache artifacts
npm run compile

# 2. Kiểm tra artifacts đã được tạo
dir artifacts\contracts
# Hoặc trên Linux/Mac:
ls artifacts/contracts

# 3. Deploy lại contract
npm run deploy:local

# 4. Cập nhật CONTRACT_ADDRESS trong backend/.env
```

### Lỗi: MetaMask không kết nối được

**Lỗi:** MetaMask hiện "This network cannot be added"

**Giải pháp:**
1. Đảm bảo Hardhat node đang chạy
2. Kiểm tra RPC URL: `http://127.0.0.1:8545`
3. Kiểm tra Chain ID: `31337`
4. Thử refresh MetaMask (đóng và mở lại extension)

### Lỗi: Balance = 0 trong MetaMask

**Nguyên nhân:** Account chưa được import đúng hoặc sai network

**Giải pháp:**
1. Đảm bảo đang ở network "Hardhat Local" (Chain ID: 31337)
2. Import lại account với private key đúng:
   ```
   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```
3. Refresh MetaMask (đóng và mở lại)

### Lỗi: Backend vẫn ở Simulation Mode

**Nguyên nhân:** File `.env` chưa được load đúng

**Giải pháp:**
1. Kiểm tra file `backend/.env` tồn tại
2. Kiểm tra nội dung:
   ```
   MODE=blockchain
   CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   NETWORK=localhost
   ```
3. Restart backend server

### Lỗi: Frontend không load được

**Giải pháp:**
1. Kiểm tra backend đang chạy: `http://localhost:5000/api/wallet/info`
2. Kiểm tra frontend đang chạy: `http://localhost:3000`
3. Clear browser cache và refresh
4. Kiểm tra console (F12) để xem lỗi cụ thể

---

## 📝 CHECKLIST CHẠY PROJECT

### Simulation Mode
- [ ] Đã clone repository
- [ ] Đã cài đặt dependencies (`npm run install-all`)
- [ ] Đã chạy `npm run dev`
- [ ] Frontend mở được tại `http://localhost:3000`
- [ ] Có thể tạo và ký transaction

### Blockchain Mode
- [ ] Đã cài đặt dependencies
- [ ] Đã compile contract (`npm run compile`)
- [ ] Hardhat node đang chạy (`npm run node`)
- [ ] Đã deploy contract (`npm run deploy:local`)
- [ ] Đã tạo `backend/.env` với cấu hình đúng
- [ ] Đã cài đặt MetaMask
- [ ] Đã thêm Hardhat Local network vào MetaMask
- [ ] Đã import test account vào MetaMask
- [ ] MetaMask hiển thị 10000 ETH
- [ ] Đã kết nối MetaMask với frontend
- [ ] Có thể gửi ETH vào contract
- [ ] Có thể tạo và ký transaction trên blockchain

---

## 🎯 QUY TRÌNH TEST ĐẦY ĐỦ

### Test Simulation Mode

1. Chạy `npm run dev`
2. Mở `http://localhost:3000`
3. Chọn Owner #1 → Tạo transaction
4. Chọn Owner #2 → Ký transaction (2/4)
5. Chọn Owner #3 → Ký transaction (3/4)
6. Chọn Owner #4 → Ký transaction (4/4) → Tự động execute
7. Kiểm tra transaction chuyển sang "Đã thực hiện"

### Test Blockchain Mode

1. Setup đầy đủ theo hướng dẫn trên
2. Import 4 accounts vào MetaMask:
   - Account #1: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
   - Account #2: `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
   - Account #3: `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`
   - Account #4: `0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a`
3. Connect Account #1 → Gửi 10 ETH vào contract
4. Tạo transaction với Account #1
5. Switch sang Account #2 → Ký transaction (2/4)
6. Switch sang Account #3 → Ký transaction (3/4)
7. Switch sang Account #4 → Ký transaction (4/4) → Tự động execute
8. Kiểm tra transaction chuyển sang "Đã thực hiện"

---

## 💡 LƯU Ý QUAN TRỌNG

1. **Hardhat Node phải chạy liên tục** khi dùng blockchain mode
2. **Contract Address** phải đúng trong `backend/.env`
3. **Network phải đúng** trong MetaMask (Hardhat Local, Chain ID: 31337)
4. **Private keys chỉ dùng cho test**, không dùng trên mainnet
5. **Mỗi lần restart Hardhat node**, contract address có thể thay đổi → Cần deploy lại

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Console logs trong terminal
2. Browser console (F12)
3. Network tab trong browser DevTools
4. MetaMask console logs

---

**Chúc bạn thành công! 🎉**

