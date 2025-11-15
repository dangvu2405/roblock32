# 🔧 SỬA LỖI: Failed to load resource: 400 (Bad Request) - /api/contract/abi

Lỗi này xảy ra khi frontend không thể lấy contract ABI từ backend.

---

## 🔍 NGUYÊN NHÂN

Lỗi `400 (Bad Request)` khi truy cập `/api/contract/abi` có thể do:

1. **Backend chưa ở Blockchain Mode** - Vẫn đang ở Simulation Mode
2. **Contract chưa được compile** - File `artifacts/contracts/MultisigWallet.sol/MultisigWallet.json` không tồn tại
3. **BlockchainService chưa được khởi tạo** - Backend không thể load ABI

---

## ✅ GIẢI PHÁP TỪNG BƯỚC

### BƯỚC 1: Kiểm tra Backend Mode

Mở terminal đang chạy backend và kiểm tra output:

**Nếu thấy:**
```
📦 Mode: SIMULATION
```

**→ Backend đang ở Simulation Mode, cần chuyển sang Blockchain Mode!**

**Nếu thấy:**
```
📦 Mode: BLOCKCHAIN
✅ Contract ABI loaded
✅ Contract initialized at: 0x...
```

**→ Backend đã ở Blockchain Mode, chuyển sang Bước 2**

---

### BƯỚC 2: Chuyển sang Blockchain Mode (Nếu chưa)

#### 2.1. Kiểm tra file `.env`

Kiểm tra file `backend/.env` có tồn tại và có nội dung đúng:

```bash
# Windows PowerShell
cd backend
Get-Content .env
```

**Nội dung phải có:**
```env
MODE=blockchain
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NETWORK=localhost
```

**Nếu file không tồn tại hoặc sai:**

1. Tạo file `.env`:
   ```powershell
   cd backend
   Copy-Item ..\env.example .env
   ```

2. Mở file `backend/.env` và điền:
   ```env
   MODE=blockchain
   CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   NETWORK=localhost
   ```

   **Lưu ý:** Thay `CONTRACT_ADDRESS` bằng address từ lệnh `npm run deploy:local`

#### 2.2. Restart Backend

1. Dừng backend (Ctrl+C trong terminal đang chạy `npm run dev`)
2. Chạy lại:
   ```bash
   npm run dev
   ```

3. Kiểm tra output có:
   ```
   ✅ Loaded .env file
   📦 Mode: BLOCKCHAIN
   ✅ Contract ABI loaded
   ✅ Contract initialized at: 0x...
   ```

---

### BƯỚC 3: Compile Contract (Nếu chưa)

Kiểm tra file artifacts có tồn tại:

```bash
# Windows PowerShell
Test-Path artifacts\contracts\MultisigWallet.sol\MultisigWallet.json

# Hoặc
dir artifacts\contracts\MultisigWallet.sol
```

**Nếu file không tồn tại:**

1. Compile contract:
   ```bash
   npm run compile
   ```

2. Kiểm tra kết quả:
   ```
   Compiling 1 file with 0.8.19
   Compiled 1 Solidity file successfully
   ```

3. Kiểm tra file đã được tạo:
   ```bash
   dir artifacts\contracts\MultisigWallet.sol
   ```

   Phải thấy file `MultisigWallet.json`

---

### BƯỚC 4: Deploy Contract (Nếu chưa)

Nếu chưa deploy contract:

1. **Đảm bảo Hardhat node đang chạy** (Terminal 1):
   ```bash
   npm run node
   ```

2. **Deploy contract** (Terminal 2):
   ```bash
   npm run deploy:local
   ```

3. **Copy Contract Address** từ output:
   ```
   ✅ MultisigWallet deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```

4. **Cập nhật `backend/.env`**:
   ```env
   MODE=blockchain
   CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   NETWORK=localhost
   ```

5. **Restart backend** (Ctrl+C và chạy lại `npm run dev`)

---

### BƯỚC 5: Kiểm tra Backend Logs

Sau khi restart, kiểm tra backend logs có:

```
✅ Loaded .env file from: F:\roblock32-main\backend\.env
🔍 Environment check:
  MODE: blockchain
  CONTRACT_ADDRESS: 0x5FbDB2315678afecb367f032d93F642f64180aa3
  NETWORK: localhost

✅ Connected to local Hardhat node
✅ Contract ABI loaded
✅ Contract initialized at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
🚀 Server running on port 5000
📦 Mode: BLOCKCHAIN
```

**Nếu thiếu bất kỳ dòng nào → Có vấn đề, xem Troubleshooting bên dưới**

---

### BƯỚC 6: Test API Endpoint

Mở trình duyệt và truy cập:
```
http://localhost:5000/api/contract/abi
```

**Kết quả mong đợi:**
```json
{
  "abi": [...],
  "contractAddress": "0x5FbDB2315678afecb367f032d93F642f64180aa3"
}
```

**Nếu vẫn lỗi 400:**
- Kiểm tra lại Bước 1-5
- Xem Troubleshooting bên dưới

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Blockchain mode not enabled"

**Nguyên nhân:** Backend vẫn ở Simulation Mode

**Giải pháp:**
1. Kiểm tra `backend/.env` có `MODE=blockchain`
2. Restart backend
3. Kiểm tra logs có "Mode: BLOCKCHAIN"

### Lỗi: "Contract ABI not found"

**Nguyên nhân:** File artifacts không tồn tại

**Giải pháp:**
```bash
# 1. Xóa cache và compile lại
Remove-Item -Recurse -Force cache, artifacts -ErrorAction SilentlyContinue
npm run compile

# 2. Kiểm tra file đã được tạo
Test-Path artifacts\contracts\MultisigWallet.sol\MultisigWallet.json
```

### Lỗi: "Contract not initialized"

**Nguyên nhân:** Contract address chưa được set hoặc sai

**Giải pháp:**
1. Deploy lại contract: `npm run deploy:local`
2. Copy contract address mới
3. Cập nhật `backend/.env` với address mới
4. Restart backend

### Lỗi: "Cannot connect to Hardhat node"

**Nguyên nhân:** Hardhat node chưa chạy

**Giải pháp:**
1. Mở Terminal 1 và chạy: `npm run node`
2. Đảm bảo output có: `Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/`
3. Giữ terminal này mở

### Lỗi: Frontend vẫn không load được ABI

**Nguyên nhân:** Cache browser hoặc frontend chưa refresh

**Giải pháp:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh trang (Ctrl+F5)
3. Kiểm tra browser console (F12) xem có lỗi gì khác không
4. Restart frontend (Ctrl+C và chạy lại `npm run dev`)

---

## ✅ CHECKLIST

- [ ] Backend đang chạy (`npm run dev`)
- [ ] Backend logs hiển thị "Mode: BLOCKCHAIN"
- [ ] File `backend/.env` tồn tại và có `MODE=blockchain`
- [ ] Contract đã được compile (`npm run compile`)
- [ ] File `artifacts/contracts/MultisigWallet.sol/MultisigWallet.json` tồn tại
- [ ] Hardhat node đang chạy (`npm run node`)
- [ ] Contract đã được deploy (`npm run deploy:local`)
- [ ] `CONTRACT_ADDRESS` trong `.env` đúng với address từ deploy
- [ ] Backend logs hiển thị "Contract ABI loaded" và "Contract initialized"
- [ ] API endpoint `http://localhost:5000/api/contract/abi` trả về JSON (không phải 400)
- [ ] Frontend có thể load ABI (không còn lỗi 400 trong console)

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi sửa xong:

1. **Backend logs:**
   ```
   📦 Mode: BLOCKCHAIN
   ✅ Contract ABI loaded
   ✅ Contract initialized at: 0x...
   ```

2. **API endpoint hoạt động:**
   - `http://localhost:5000/api/contract/abi` trả về JSON với ABI

3. **Frontend console:**
   - Không còn lỗi `Failed to load resource: 400`
   - Có thể ký transaction thành công

---

## 💡 LƯU Ý

- **Mỗi lần restart Hardhat node**, contract address sẽ thay đổi
- **Cần deploy lại contract** và cập nhật `CONTRACT_ADDRESS` trong `.env`
- **Hardhat node phải chạy liên tục** khi dùng blockchain mode
- **Backend phải restart** sau khi thay đổi `.env`

---

**Chúc bạn thành công! 🚀**

