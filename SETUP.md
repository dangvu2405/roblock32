# Hướng dẫn cài đặt chi tiết - Multisig Wallet

## 📋 Mục lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt Node.js](#cài-đặt-nodejs)
3. [Clone project](#clone-project)
4. [Cài đặt dependencies](#cài-đặt-dependencies)
5. [Chạy project](#chạy-project)
6. [Troubleshooting](#troubleshooting)

## 🔧 Yêu cầu hệ thống

### Windows
- Windows 10/11
- Node.js 14.x trở lên
- npm 6.x trở lên
- Git

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install nodejs npm git
```

### macOS
```bash
# Sử dụng Homebrew
brew install node git
```

## 📥 Cài đặt Node.js

### Windows
1. Truy cập: https://nodejs.org/
2. Tải bản LTS (Long Term Support)
3. Cài đặt và làm theo hướng dẫn
4. Kiểm tra:
```bash
node --version
npm --version
```

### Linux
```bash
# Sử dụng nvm (khuyến nghị)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
nvm use --lts
```

### macOS
```bash
# Sử dụng Homebrew
brew install node
```

## 📦 Clone project

### Bước 1: Mở Terminal/Command Prompt

**Windows:**
- Mở PowerShell hoặc Command Prompt
- Hoặc Git Bash

**Linux/Mac:**
- Mở Terminal

### Bước 2: Clone repository

```bash
git clone https://github.com/dangvu2405/roblock32.git
cd roblock32
```

## 📚 Cài đặt dependencies

### Cách 1: Tự động (Khuyến nghị)

```bash
npm run install-all
```

Lệnh này sẽ cài đặt tất cả dependencies cho:
- ✅ Root project
- ✅ Backend (Node.js)
- ✅ Frontend (ReactJS)

### Cách 2: Thủ công từng bước

```bash
# 1. Cài đặt root dependencies
npm install

# 2. Cài đặt backend dependencies
cd backend
npm install
cd ..

# 3. Cài đặt frontend dependencies
cd frontend
npm install
cd ..
```

**Thời gian cài đặt:** Khoảng 2-5 phút tùy tốc độ internet

## 🚀 Chạy project

### Cách 1: Chạy cả 2 server cùng lúc (Dễ nhất)

Mở **1 terminal** và chạy:

```bash
npm run dev
```

Bạn sẽ thấy:
```
Server running on port 5000
Multisig Wallet initialized with 10 owners
Required signatures: 4
Compiled successfully!
```

### Cách 2: Chạy riêng biệt (2 terminal)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# hoặc
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Truy cập ứng dụng

Sau khi chạy thành công:
- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:5000/api

Trình duyệt sẽ tự động mở `http://localhost:3000`

## 🔍 Kiểm tra hoạt động

### 1. Kiểm tra Backend

Mở trình duyệt hoặc dùng curl:
```bash
# Windows PowerShell
curl http://localhost:5000/api/wallet/info

# Linux/Mac
curl http://localhost:5000/api/wallet/info
```

Kết quả mong đợi:
```json
{
  "owners": ["0xOwner1", "0xOwner2", ...],
  "requiredSignatures": 4,
  "balance": 1000,
  "pendingTransactions": [],
  "executedTransactions": []
}
```

### 2. Kiểm tra Frontend

- Mở: http://localhost:3000
- Bạn sẽ thấy giao diện Multisig Wallet
- Có thể chọn owner và tạo giao dịch

## 🐛 Troubleshooting

### Lỗi: Port đã được sử dụng

**Windows:**
```powershell
# Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay <PID> bằng số thực tế)
taskkill /PID <PID> /F

# Tương tự cho port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Kill process trên port 5000
lsof -ti:5000 | xargs kill -9

# Kill process trên port 3000
lsof -ti:3000 | xargs kill -9
```

### Lỗi: Module not found

```bash
# Xóa tất cả node_modules
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Xóa package-lock.json
rm -f package-lock.json
rm -f backend/package-lock.json
rm -f frontend/package-lock.json

# Cài đặt lại
npm run install-all
```

### Lỗi: npm ERR! code EACCES

**Linux/Mac:**
```bash
# Không dùng sudo với npm (khuyến nghị)
# Thay vào đó, fix quyền:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Hoặc sử dụng nvm
```

### Lỗi: Cannot find module 'express'

```bash
cd backend
npm install express cors body-parser
cd ../frontend
npm install
```

### Frontend không kết nối được Backend

1. Kiểm tra backend đang chạy: http://localhost:5000/api/wallet/info
2. Kiểm tra file `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = '/api'; // Đúng
   // KHÔNG dùng: 'http://localhost:5000/api'
   ```
3. Đảm bảo `frontend/package.json` có:
   ```json
   "proxy": "http://localhost:5000"
   ```

### React app không tự động mở trình duyệt

Mở thủ công: http://localhost:3000

### Lỗi: ENOENT: no such file or directory

Đảm bảo bạn đang ở đúng thư mục:
```bash
# Kiểm tra cấu trúc thư mục
ls
# Phải thấy: backend/, frontend/, package.json, README.md
```

## 📝 Scripts có sẵn

Trong `package.json` root:

```bash
npm run install-all  # Cài đặt tất cả dependencies
npm run dev          # Chạy cả backend và frontend
npm run server       # Chỉ chạy backend
npm run client       # Chỉ chạy frontend
```

## ✅ Checklist sau khi cài đặt

- [ ] Node.js đã cài đặt (`node --version`)
- [ ] npm đã cài đặt (`npm --version`)
- [ ] Đã clone repository thành công
- [ ] Đã chạy `npm run install-all` không lỗi
- [ ] Backend chạy trên port 5000
- [ ] Frontend chạy trên port 3000
- [ ] Có thể truy cập http://localhost:3000
- [ ] API trả về dữ liệu tại http://localhost:5000/api/wallet/info

## 🆘 Cần hỗ trợ?

Nếu gặp vấn đề, hãy:
1. Kiểm tra lại các bước trong hướng dẫn
2. Xem phần Troubleshooting
3. Kiểm tra console/terminal để xem lỗi cụ thể
4. Đảm bảo đã cài đặt đúng phiên bản Node.js (14.x trở lên)

## 📞 Thông tin liên hệ

**Sinh viên:** NGUYỄN ĐĂNG DUY  
**MSSV:** 22810310021  
**Lớp:** D17CNPM1  
**Repository:** https://github.com/dangvu2405/roblock32.git

