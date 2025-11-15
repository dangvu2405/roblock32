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

## Cài đặt

### 1. Cài đặt dependencies

```bash
npm run install-all
```

Hoặc cài đặt từng phần:

```bash
# Root
npm install

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Chạy ứng dụng

#### Chạy cả frontend và backend cùng lúc:
```bash
npm run dev
```

#### Hoặc chạy riêng biệt:

**Backend:**
```bash
npm run server
# hoặc
cd backend
npm run dev
```

**Frontend:**
```bash
npm run client
# hoặc
cd frontend
npm start
```

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

- **Owners:** `['0xOwner1', '0xOwner2', '0xOwner3']`
- **Số chữ ký yêu cầu:** `2`
- **Số dư ban đầu:** `1000 tokens`

Bạn có thể thay đổi cấu hình này trong file `backend/server.js`.

## Lưu ý

- Đây là một ứng dụng demo, không kết nối với blockchain thực
- Dữ liệu được lưu trong memory, sẽ mất khi restart server
- Để sử dụng trong production, cần tích hợp với blockchain thực (Ethereum, etc.)

## License

MIT

