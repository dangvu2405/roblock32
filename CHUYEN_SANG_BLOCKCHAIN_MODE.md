# ⛓️ HƯỚNG DẪN CHUYỂN SANG BLOCKCHAIN MODE

Hướng dẫn chi tiết từng bước để chuyển từ Simulation Mode sang Blockchain Mode.

---

## 📋 YÊU CẦU TRƯỚC KHI BẮT ĐẦU

- ✅ Đã cài đặt Node.js và npm
- ✅ Đã clone project và cài đặt dependencies (`npm run install-all`)
- ✅ Đã cài đặt MetaMask extension trong trình duyệt (tùy chọn, có thể làm sau)

---

## 🚀 CÁC BƯỚC THỰC HIỆN

### BƯỚC 1: Chạy Hardhat Node

Mở **Terminal 1** (PowerShell hoặc CMD) và chạy:

```bash
npm run node
```

**Kết quả mong đợi:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts:
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (10000 ETH)
...
```

**⚠️ QUAN TRỌNG:** 
- Giữ terminal này **MỞ** và **KHÔNG ĐÓNG**
- Hardhat node phải chạy liên tục khi dùng blockchain mode

---

### BƯỚC 2: Compile Smart Contract

Mở **Terminal 2** (terminal mới) và chạy:

```bash
npm run compile
```

**Kết quả mong đợi:**
```
Compiling 1 file with 0.8.19
Compiled 1 Solidity file successfully
```

Nếu thấy warning về Node.js version, có thể bỏ qua.

---

### BƯỚC 3: Deploy Smart Contract

Vẫn trong **Terminal 2**, chạy:

```bash
npm run deploy:local
```

**Kết quả mong đợi:**
```
Deploying MultisigWallet...
Network: localhost
Note: Hardhat local node uses Chain ID 31337

Deploying with account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
Account balance: 10000000000000000000000

Configuration:
Owners: [10 addresses...]
Required confirmations: 4

✅ MultisigWallet deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**📝 QUAN TRỌNG:** 
- **Copy Contract Address** (ví dụ: `0x5FbDB2315678afecb367f032d93F642f64180aa3`)
- Address này sẽ khác nhau mỗi lần deploy
- Bạn sẽ cần address này ở bước tiếp theo

---

### BƯỚC 4: Tạo File `.env` cho Backend

**Windows PowerShell:**
```powershell
cd backend
Copy-Item ..\env.example .env
```

**Windows CMD:**
```cmd
cd backend
copy ..\env.example .env
```

**Linux/Mac:**
```bash
cd backend
cp ../env.example .env
```

---

### BƯỚC 5: Cấu hình File `.env`

Mở file `backend/.env` bằng Notepad hoặc editor bất kỳ và điền:

```env
MODE=blockchain
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NETWORK=localhost
```

**⚠️ LƯU Ý:**
- Thay `CONTRACT_ADDRESS` bằng address bạn copy từ **Bước 3**
- Đảm bảo không có khoảng trắng thừa
- Đảm bảo `MODE=blockchain` (chữ thường)

**Ví dụ nếu contract address của bạn là `0x1234...`:**
```env
MODE=blockchain
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NETWORK=localhost
```

---

### BƯỚC 6: Restart Backend và Frontend

**Nếu đang chạy `npm run dev`, dừng lại (Ctrl+C) và chạy lại:**

Trong **Terminal 2** (hoặc Terminal 3 mới):

```bash
npm run dev
```

**Kết quả mong đợi:**
```
✅ Loaded .env file from: F:\roblock32-main\backend\.env
🔍 Environment check:
  MODE: blockchain
  CONTRACT_ADDRESS: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  NETWORK: localhost

✅ Blockchain connected
✅ Contract initialized at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
🚀 Server running on port 5000
📦 Mode: BLOCKCHAIN
```

**✅ Nếu thấy "Mode: BLOCKCHAIN" → Bạn đã thành công!**

---

### BƯỚC 7: Setup MetaMask (Nếu chưa có)

#### 7.1. Cài đặt MetaMask

1. Truy cập: https://metamask.io/download/
2. Cài đặt extension cho trình duyệt (Chrome, Firefox, Edge)
3. Tạo wallet mới hoặc import wallet hiện có

#### 7.2. Thêm Hardhat Local Network

1. Mở MetaMask extension
2. Click vào network dropdown (góc trên, hiện "Ethereum Mainnet" hoặc network khác)
3. Click "Add Network" → "Add a network manually"
4. Điền thông tin:
   - **Network Name:** `Hardhat Local`
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency Symbol:** `ETH`
5. Click "Save"
6. Chuyển sang network "Hardhat Local" (click vào network dropdown và chọn "Hardhat Local")

#### 7.3. Import Test Account

1. Mở MetaMask
2. Click vào account icon (góc trên phải, hình tròn)
3. Click "Import Account"
4. Chọn "Private Key"
5. Paste private key này:
   ```
   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```
6. Click "Import"

**Thông tin account:**
- **Address:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Balance:** 10000 ETH (trên Hardhat Local network)
- **Vai trò:** Owner #1 trong multisig wallet

**Lưu ý:** Account này đã được thêm vào contract khi deploy, nên bạn có thể dùng ngay để ký transaction.

---

### BƯỚC 8: Kết nối MetaMask với Frontend

1. Mở trình duyệt và truy cập: `http://localhost:3000`
2. Tìm button "🔗 Connect MetaMask" (ở đầu trang)
3. Click button
4. MetaMask sẽ hiện popup → Click "Connect"
5. Chọn account vừa import → Click "Next" → "Connect"

**Kết quả:**
- Frontend sẽ hiển thị địa chỉ MetaMask đã kết nối
- Bạn sẽ thấy phần "Gửi ETH vào Contract"

---

### BƯỚC 9: Gửi ETH vào Contract (Tùy chọn)

Để test giao dịch, bạn cần có ETH trong contract:

1. Trong frontend, tìm phần "Gửi ETH vào Contract"
2. Nhập số ETH (ví dụ: `10`)
3. Click "Gửi ETH qua MetaMask"
4. MetaMask popup → Click "Confirm"
5. Đợi transaction được mined (vài giây)

**Kết quả:**
- Balance của contract sẽ tăng
- Bạn có thể thấy balance mới trong phần "Thông tin ví"

---

### BƯỚC 10: Test Tạo và Ký Transaction

1. **Tạo transaction:**
   - Nhập địa chỉ nhận (ví dụ: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`)
   - Nhập số ETH (ví dụ: `1`)
   - Click "Tạo giao dịch"
   - MetaMask popup → Click "Confirm"

2. **Ký transaction:**
   - Transaction sẽ xuất hiện trong phần "Giao dịch đang chờ chữ ký"
   - Click "Ký giao dịch"
   - MetaMask popup → Click "Confirm"
   - Lặp lại với 3 owners khác (tổng 4 chữ ký)

3. **Tự động execute:**
   - Khi đủ 4 chữ ký, transaction sẽ **TỰ ĐỘNG** execute
   - Transaction chuyển sang phần "Giao dịch đã thực hiện"

---

## ✅ CHECKLIST HOÀN THÀNH

- [ ] Hardhat node đang chạy (Terminal 1)
- [ ] Đã compile contract thành công
- [ ] Đã deploy contract và copy address
- [ ] Đã tạo file `backend/.env`
- [ ] Đã cấu hình `MODE=blockchain` và `CONTRACT_ADDRESS` trong `.env`
- [ ] Backend hiển thị "Mode: BLOCKCHAIN"
- [ ] Đã cài đặt MetaMask
- [ ] Đã thêm Hardhat Local network vào MetaMask
- [ ] Đã import test account vào MetaMask
- [ ] MetaMask hiển thị 10000 ETH
- [ ] Đã kết nối MetaMask với frontend
- [ ] Có thể tạo transaction
- [ ] Có thể ký transaction
- [ ] Transaction tự động execute khi đủ 4 chữ ký

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Contract not found" hoặc "Contract ABI not found"

**Giải pháp:**
```bash
# 1. Xóa cache và compile lại
Remove-Item -Recurse -Force cache, artifacts -ErrorAction SilentlyContinue
npm run compile

# 2. Deploy lại contract
npm run deploy:local

# 3. Cập nhật CONTRACT_ADDRESS trong backend/.env
```

### Lỗi: Backend vẫn hiển thị "Mode: SIMULATION"

**Giải pháp:**
1. Kiểm tra file `backend/.env` tồn tại
2. Kiểm tra nội dung file:
   ```
   MODE=blockchain
   CONTRACT_ADDRESS=0x...
   NETWORK=localhost
   ```
3. Đảm bảo không có khoảng trắng thừa
4. Restart backend (Ctrl+C và chạy lại `npm run dev`)

### Lỗi: "connect ECONNREFUSED 127.0.0.1:8545"

**Giải pháp:**
- Đảm bảo Hardhat node đang chạy (Terminal 1)
- Kiểm tra port 8545 không bị block bởi firewall

### Lỗi: MetaMask không kết nối được

**Giải pháp:**
1. Đảm bảo Hardhat node đang chạy
2. Kiểm tra network trong MetaMask là "Hardhat Local"
3. Kiểm tra Chain ID là 31337
4. Refresh MetaMask (đóng và mở lại extension)

---

## 🎉 HOÀN THÀNH!

Bây giờ bạn đã chạy project ở **BLOCKCHAIN MODE** thành công!

**Khác biệt với Simulation Mode:**
- ✅ Giao dịch được thực hiện trên blockchain thật (local)
- ✅ Có thể xem transaction hash trong MetaMask
- ✅ Cần MetaMask để ký transaction
- ✅ Balance thay đổi thật trên blockchain

**Lưu ý:**
- Mỗi lần restart Hardhat node, contract address sẽ thay đổi
- Cần deploy lại contract và cập nhật `CONTRACT_ADDRESS` trong `.env`
- Hardhat node phải chạy liên tục khi dùng blockchain mode

---

**Chúc bạn thành công! 🚀**

