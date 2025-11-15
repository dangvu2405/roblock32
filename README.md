# Multisig Wallet - Ví đa chữ ký

**Sinh viên:** NGUYỄN ĐĂNG DUY  
**MSSV:** 22810310021  
**Lớp:** D17CNPM1

## Mô tả dự án

Dự án Multisig Wallet (Ví đa chữ ký) là một ứng dụng blockchain cho phép quản lý ví với nhiều chủ sở hữu. Giao dịch chỉ được thực hiện khi đủ số lượng chữ ký xác nhận từ các owners.

## Tính năng

- ✅ Quản lý ví với nhiều owners
- ✅ Tạo giao dịch mới
- ✅ Ký giao dịch (sign transaction)
- ✅ Chỉ thực hiện giao dịch khi đủ số chữ ký yêu cầu
- ✅ Theo dõi giao dịch đang chờ và đã thực hiện
- ✅ Giao diện ReactJS hiện đại và thân thiện
- ✅ Backend Node.js với logic multisig

## Công nghệ sử dụng

### Frontend
- ReactJS 18
- Axios (HTTP client)
- CSS3 với gradient và animations

### Backend
- Node.js
- Express.js
- Crypto (built-in Node.js)

## Hướng dẫn cài đặt và chạy project trên máy khác

### Yêu cầu hệ thống

- **Node.js:** phiên bản 14.x trở lên
- **npm:** phiên bản 6.x trở lên (hoặc yarn)
- **Git:** để clone repository

### Bước 1: Clone project từ GitHub

```bash
git clone https://github.com/dangvu2405/roblock32.git
cd roblock32
```

### Bước 2: Cài đặt dependencies

#### Cách 1: Cài đặt tất cả cùng lúc (Khuyến nghị)
```bash
npm run install-all
```

Lệnh này sẽ tự động cài đặt dependencies cho:
- Root project
- Backend
- Frontend

#### Cách 2: Cài đặt từng phần thủ công

```bash
# 1. Cài đặt dependencies cho root project
npm install

# 2. Cài đặt dependencies cho backend
cd backend
npm install

# 3. Cài đặt dependencies cho frontend
cd ../frontend
npm install

# 4. Quay về thư mục gốc
cd ..
```

### Bước 3: Chạy ứng dụng

#### Cách 1: Chạy cả frontend và backend cùng lúc (Khuyến nghị)

Mở một terminal và chạy:
```bash
npm run dev
```

Lệnh này sẽ tự động khởi động:
- Backend server trên `http://localhost:5000`
- Frontend development server trên `http://localhost:3000`

#### Cách 2: Chạy riêng biệt (2 terminal)

**Terminal 1 - Backend:**
```bash
npm run server
# hoặc
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run client
# hoặc
cd frontend
npm start
```

### Bước 4: Truy cập ứng dụng

Sau khi chạy thành công:
- **Frontend:** Mở trình duyệt và truy cập `http://localhost:3000`
- **Backend API:** `http://localhost:5000/api`

### Xử lý lỗi thường gặp

#### Lỗi: Port đã được sử dụng

Nếu port 3000 hoặc 5000 đã được sử dụng:

**Backend (port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
# Tìm PID và kill process
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Frontend (port 3000):**
- React sẽ tự động hỏi bạn có muốn dùng port khác không
- Hoặc set biến môi trường: `PORT=3001 npm start`

#### Lỗi: Module not found

Nếu gặp lỗi "Cannot find module", hãy cài đặt lại dependencies:
```bash
# Xóa node_modules và package-lock.json
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# Cài đặt lại
npm run install-all
```

#### Lỗi: EACCES permission denied

Trên Linux/Mac, có thể cần quyền sudo:
```bash
sudo npm install
```

Hoặc sử dụng nvm để quản lý Node.js version.

## Cấu trúc project

```
multisig-wallet/
├── backend/
│   ├── server.js              # Express server
│   ├── multisigWallet.js      # Logic multisig wallet
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── WalletInfo.js
│   │   │   ├── CreateTransaction.js
│   │   │   └── TransactionList.js
│   │   ├── services/
│   │   │   └── api.js         # API calls
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── package.json
└── README.md
```

## Cách sử dụng

1. **Khởi động ứng dụng:**
   - Backend chạy trên `http://localhost:5000`
   - Frontend chạy trên `http://localhost:3000`

2. **Chọn Owner:**
   - Chọn một owner từ dropdown ở đầu trang

3. **Tạo giao dịch:**
   - Nhập địa chỉ nhận và số tiền
   - Click "Tạo giao dịch"
   - Giao dịch sẽ được tạo và chờ các owners khác ký

4. **Ký giao dịch:**
   - Xem danh sách giao dịch đang chờ
   - Click "Ký giao dịch" nếu bạn chưa ký
   - Khi đủ số chữ ký yêu cầu, giao dịch sẽ tự động được thực hiện

5. **Nạp tiền (Demo):**
   - Sử dụng chức năng "Nạp tiền vào ví" để thêm số dư

## API Endpoints

### Wallet
- `GET /api/wallet/info` - Lấy thông tin ví
- `POST /api/wallet/deposit` - Nạp tiền vào ví

### Transactions
- `POST /api/transaction/create` - Tạo giao dịch mới
- `POST /api/transaction/sign` - Ký giao dịch
- `GET /api/transaction/:id` - Lấy thông tin giao dịch
- `GET /api/transactions/pending` - Lấy danh sách giao dịch đang chờ
- `GET /api/transactions/executed` - Lấy danh sách giao dịch đã thực hiện

## Cấu hình mặc định

- **Owners:** `['0xOwner1', '0xOwner2', '0xOwner3', '0xOwner4', '0xOwner5', '0xOwner6', '0xOwner7', '0xOwner8', '0xOwner9', '0xOwner10']` (10 owners)
- **Số chữ ký yêu cầu:** `4`
- **Số dư ban đầu:** `1000 tokens`

Bạn có thể thay đổi cấu hình này trong file `backend/server.js`:

```javascript
const wallet = new MultisigWallet(
  ['0xOwner1', '0xOwner2', ...], // Danh sách owners
  4 // Số chữ ký tối thiểu
);
```

## Kiểm tra cài đặt

Sau khi cài đặt, bạn có thể kiểm tra:

1. **Kiểm tra Node.js và npm:**
```bash
node --version
npm --version
```

2. **Kiểm tra backend đang chạy:**
```bash
curl http://localhost:5000/api/wallet/info
# Hoặc mở trình duyệt: http://localhost:5000/api/wallet/info
```

3. **Kiểm tra frontend:**
- Mở trình duyệt: `http://localhost:3000`
- Nếu thấy giao diện Multisig Wallet, đã thành công!

## Lưu ý

- Đây là một ứng dụng demo, không kết nối với blockchain thực
- Dữ liệu được lưu trong memory, sẽ mất khi restart server
- Để sử dụng trong production, cần tích hợp với blockchain thực (Ethereum, etc.)

## License

MIT

