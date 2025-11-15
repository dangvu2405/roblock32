# 🔧 XỬ LÝ LỖI COMPILE

## ❌ Lỗi 1: Warning Node.js Version

**Lỗi:**
```
WARNING: You are currently using Node.js v18.15.0, which is not supported by Hardhat.
```

### ✅ Giải pháp: **BỎ QUA WARNING**

Warning này **KHÔNG ẢNH HƯỞNG** đến việc compile và chạy project. Hardhat vẫn hoạt động bình thường với Node.js 18.x.

**→ Bạn có thể tiếp tục sử dụng bình thường!**

---

## ❌ Lỗi 2: "Nothing to compile"

**Lỗi:**
```
Nothing to compile
```

### ✅ Giải pháp nhanh:

**Bước 1: Kiểm tra file contract có tồn tại không**

```bash
# Windows PowerShell
dir contracts

# Hoặc Windows CMD
dir contracts

# Linux/Mac
ls contracts
```

**Phải thấy file:** `MultisigWallet.sol`

**Bước 2: Nếu file không có, kiểm tra lại khi clone**

Đảm bảo khi clone repository, thư mục `contracts/` và file `MultisigWallet.sol` đã được tải về.

**Bước 3: Force compile lại**

```bash
# Windows PowerShell
Remove-Item -Recurse -Force cache, artifacts -ErrorAction SilentlyContinue
npm run compile

# Windows CMD
rmdir /s /q cache 2>nul
rmdir /s /q artifacts 2>nul
npm run compile

# Linux/Mac
rm -rf cache artifacts
npm run compile
```

**Bước 4: Kiểm tra kết quả**

Sau khi compile, bạn sẽ thấy:
```
Compiled 1 Solidity file successfully
```

Và thư mục `artifacts/contracts/` sẽ được tạo với file ABI.

---

## ✅ Nếu vẫn không được

### Kiểm tra cấu trúc project:

```
roblock32/
├── contracts/
│   └── MultisigWallet.sol  ← PHẢI CÓ FILE NÀY
├── hardhat.config.js       ← PHẢI CÓ FILE NÀY
├── package.json            ← PHẢI CÓ FILE NÀY
├── scripts/
│   └── deploy.js
└── ...
```

### Nếu thiếu file contract:

1. Kiểm tra lại khi clone repository từ GitHub
2. Đảm bảo clone đầy đủ: `git clone https://github.com/dangvu2405/roblock32.git`
3. Hoặc tải lại file `contracts/MultisigWallet.sol` từ repository

---

## 🎯 Kết quả mong đợi sau khi compile thành công:

```
Compiling 1 file with 0.8.19
Compiled 1 Solidity file successfully
```

Và thư mục `artifacts/contracts/MultisigWallet.sol/` sẽ được tạo với:
- `MultisigWallet.json` (chứa ABI và bytecode)

---

## 💡 Lưu ý

- **Warning Node.js:** Có thể bỏ qua, không ảnh hưởng
- **"Nothing to compile":** Thường do đã compile rồi hoặc thiếu file contract
- **Sau khi compile thành công:** Có thể tiếp tục deploy với `npm run deploy:local`

