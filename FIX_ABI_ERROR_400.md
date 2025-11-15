# 🔧 XỬ LÝ LỖI: Failed to load /api/contract/abi (400 Bad Request)

Lỗi này xảy ra khi backend không thể trả về contract ABI. Có 3 nguyên nhân chính:

---

## ❌ NGUYÊN NHÂN 1: Backend chưa ở Blockchain Mode

**Triệu chứng:**
- Lỗi: `Failed to load resource: the server responded with a status of 400 (Bad Request)`
- Backend console hiển thị: `📦 Mode: SIMULATION`

**Giải pháp:**

### Bước 1: Kiểm tra file `.env`

Đảm bảo file `backend/.env` tồn tại và có nội dung:

```env
MODE=blockchain
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NETWORK=localhost
```

**Lưu ý:**
- `MODE=blockchain` (chữ thường, không có khoảng trắng)
- `CONTRACT_ADDRESS` phải là address từ lệnh `npm run deploy:local`
- `NETWORK=localhost`

### Bước 2: Restart Backend

1. Dừng backend (Ctrl+C trong terminal chạy `npm run dev`)
2. Chạy lại:
   ```bash
   npm run dev
   ```

### Bước 3: Kiểm tra Backend Console

Backend console phải hiển thị:
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

**Nếu vẫn thấy `Mode: SIMULATION` → Xem tiếp nguyên nhân 2**

---

## ❌ NGUYÊN NHÂN 2: Contract chưa được Compile

**Triệu chứng:**
- Backend ở blockchain mode nhưng vẫn lỗi 400
- Backend console có thể hiển thị: `⚠️ Contract ABI not found`

**Giải pháp:**

### Bước 1: Compile Contract

```bash
npm run compile
```

**Kết quả mong đợi:**
```
Compiling 1 file with 0.8.19
Compiled 1 Solidity file successfully
```

### Bước 2: Kiểm tra File Artifacts

Đảm bảo file tồn tại:
```
artifacts/contracts/MultisigWallet.sol/MultisigWallet.json
```

**Windows PowerShell:**
```powershell
Test-Path artifacts\contracts\MultisigWallet.sol\MultisigWallet.json
```

**Windows CMD:**
```cmd
dir artifacts\contracts\MultisigWallet.sol\MultisigWallet.json
```

**Linux/Mac:**
```bash
ls artifacts/contracts/MultisigWallet.sol/MultisigWallet.json
```

### Bước 3: Nếu File Không Tồn Tại

Xóa cache và compile lại:

**Windows PowerShell:**
```powershell
Remove-Item -Recurse -Force cache, artifacts -ErrorAction SilentlyContinue
npm run compile
```

**Windows CMD:**
```cmd
rmdir /s /q cache
rmdir /s /q artifacts
npm run compile
```

**Linux/Mac:**
```bash
rm -rf cache artifacts
npm run compile
```

### Bước 4: Restart Backend

Sau khi compile thành công, restart backend:
```bash
# Dừng (Ctrl+C)
npm run dev
```

---

## ❌ NGUYÊN NHÂN 3: Contract chưa được Deploy

**Triệu chứng:**
- Backend ở blockchain mode
- Contract đã được compile
- Nhưng `CONTRACT_ADDRESS` trong `.env` sai hoặc contract chưa được deploy

**Giải pháp:**

### Bước 1: Đảm bảo Hardhat Node đang chạy

Mở **Terminal 1** và chạy:
```bash
npm run node
```

**Giữ terminal này mở!**

### Bước 2: Deploy Contract

Mở **Terminal 2** (terminal mới) và chạy:
```bash
npm run deploy:local
```

**Kết quả mong đợi:**
```
✅ MultisigWallet deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**📝 Copy Contract Address này!**

### Bước 3: Cập nhật `.env`

Mở `backend/.env` và cập nhật `CONTRACT_ADDRESS`:

```env
MODE=blockchain
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NETWORK=localhost
```

(Thay address bằng address từ bước 2)

### Bước 4: Restart Backend

```bash
# Dừng (Ctrl+C)
npm run dev
```

---

## ✅ CHECKLIST KIỂM TRA

Thực hiện theo thứ tự:

- [ ] **Hardhat node đang chạy** (`npm run node` trong Terminal 1)
- [ ] **Contract đã được compile** (`npm run compile` → thấy "Compiled successfully")
- [ ] **File artifacts tồn tại** (`artifacts/contracts/MultisigWallet.sol/MultisigWallet.json`)
- [ ] **Contract đã được deploy** (`npm run deploy:local` → có contract address)
- [ ] **File `backend/.env` tồn tại** và có nội dung đúng:
  - [ ] `MODE=blockchain`
  - [ ] `CONTRACT_ADDRESS=0x...` (đúng address từ deploy)
  - [ ] `NETWORK=localhost`
- [ ] **Backend đã restart** sau khi cấu hình
- [ ] **Backend console hiển thị** `Mode: BLOCKCHAIN`
- [ ] **Frontend có thể load ABI** (không còn lỗi 400)

---

## 🔍 KIỂM TRA NHANH

### 1. Kiểm tra Backend Mode

Mở terminal chạy backend và xem output. Phải thấy:
```
📦 Mode: BLOCKCHAIN
```

Nếu thấy `Mode: SIMULATION` → Xem nguyên nhân 1

### 2. Kiểm tra Contract ABI

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

**Nếu lỗi 400:**
- Backend chưa ở blockchain mode → Xem nguyên nhân 1
- Contract chưa compile → Xem nguyên nhân 2
- Contract chưa deploy → Xem nguyên nhân 3

### 3. Kiểm tra Frontend Console

Mở DevTools (F12) → Console tab. Phải thấy:
```
✅ Connected to MetaMask: 0x...
```

**Nếu thấy lỗi:**
- `Failed to load /api/contract/abi` → Làm theo checklist trên

---

## 🎯 QUY TRÌNH SỬA LỖI ĐẦY ĐỦ

### Bước 1: Setup Blockchain Mode

```bash
# Terminal 1: Chạy Hardhat node
npm run node

# Terminal 2: Compile contract
npm run compile

# Terminal 2: Deploy contract
npm run deploy:local
# Copy contract address từ output

# Terminal 2: Tạo file .env
cd backend
Copy-Item ..\env.example .env
# Hoặc: copy ..\env.example .env (CMD)

# Mở backend/.env và điền:
# MODE=blockchain
# CONTRACT_ADDRESS=<address_từ_deploy>
# NETWORK=localhost
```

### Bước 2: Restart Backend

```bash
# Dừng npm run dev (Ctrl+C)
# Chạy lại
npm run dev
```

### Bước 3: Kiểm tra

1. Backend console: `Mode: BLOCKCHAIN` ✅
2. Browser: `http://localhost:5000/api/contract/abi` → Trả về JSON ✅
3. Frontend: Không còn lỗi 400 ✅

---

## 💡 LƯU Ý QUAN TRỌNG

1. **Hardhat node phải chạy liên tục** khi dùng blockchain mode
2. **Mỗi lần restart Hardhat node**, contract address sẽ thay đổi → Cần deploy lại và cập nhật `.env`
3. **File `.env` phải ở trong thư mục `backend/`**, không phải root
4. **Sau khi thay đổi `.env`**, phải restart backend

---

## 🆘 NẾU VẪN KHÔNG ĐƯỢC

1. **Kiểm tra lại tất cả các bước** trong checklist
2. **Xem backend console** để tìm lỗi cụ thể
3. **Xem browser console** (F12) để tìm lỗi frontend
4. **Kiểm tra Hardhat node** có đang chạy không
5. **Thử restart tất cả:**
   - Dừng Hardhat node (Ctrl+C)
   - Dừng backend (Ctrl+C)
   - Chạy lại từ đầu

---

**Chúc bạn thành công! 🚀**

