# Multisig Wallet - Ví đa chữ ký

**Sinh viên:** NGUYỄN ĐĂNG DUY  
**MSSV:** 22810310021  
**Lớp:** D17CNPM1

## Mô tả

Multisig Wallet là ứng dụng blockchain cho phép quản lý ví với nhiều chủ sở hữu. Giao dịch chỉ được thực hiện khi đủ số lượng chữ ký yêu cầu.

## Tính năng

- ✅ Quản lý ví với 10 owners
- ✅ Yêu cầu 4 chữ ký để thực hiện giao dịch
- ✅ Tự động execute khi đủ chữ ký
- ✅ Hỗ trợ simulation mode và blockchain mode
- ✅ Tích hợp MetaMask
- ✅ Giao diện ReactJS

## Công nghệ

- **Frontend:** ReactJS 18, Ethers.js
- **Backend:** Node.js, Express.js
- **Blockchain:** Hardhat, Solidity
- **Wallet:** MetaMask

## Cài đặt

```bash
# Clone repository
git clone https://github.com/dangvu2405/roblock32.git
cd roblock32

# Cài đặt dependencies
npm run install-all
```

## Chạy ứng dụng

### ⚡ Quick Start (Simulation Mode)

```bash
npm run dev
```

Mở trình duyệt: http://localhost:3000

### 📖 Hướng dẫn chi tiết

**👉 Xem file [HUONG_DAN_CHAY_PROJECT.md](HUONG_DAN_CHAY_PROJECT.md) để có hướng dẫn đầy đủ:**
- ✅ Cài đặt từng bước chi tiết
- ✅ Chạy Simulation Mode
- ✅ Chạy Blockchain Mode với MetaMask
- ✅ Troubleshooting các lỗi thường gặp
- ✅ Checklist kiểm tra

### 🔗 Blockchain Mode (Tóm tắt)

1. Chạy Hardhat node: `npm run node`
2. Deploy contract: `npm run deploy:local`
3. Cấu hình `backend/.env`:
   ```
   MODE=blockchain
   CONTRACT_ADDRESS=<address_từ_deploy>
   NETWORK=localhost
   ```
4. Chạy app: `npm run dev`
5. Setup MetaMask (xem hướng dẫn chi tiết trong file trên)

## Cấu trúc project

```
multisig-wallet/
├── backend/          # Backend server
├── frontend/         # React frontend
├── contracts/        # Solidity smart contracts
├── scripts/          # Deployment scripts
└── test/             # Tests
```

## Sử dụng

1. **Tạo giao dịch:** Nhập địa chỉ nhận và số tiền
2. **Ký giao dịch:** Các owners ký transaction
3. **Tự động execute:** Khi đủ 4 chữ ký, transaction tự động thực hiện

## API Endpoints

- `GET /api/wallet/info` - Thông tin ví
- `POST /api/transaction/create` - Tạo giao dịch
- `POST /api/transaction/sign` - Ký giao dịch
- `GET /api/mode` - Kiểm tra mode hiện tại
- `GET /api/contract/abi` - Lấy contract ABI

## License

MIT
