# 🔧 HƯỚNG DẪN THÊM HARDHAT LOCAL NETWORK VÀO METAMASK (THỦ CÔNG)

Khi nút "Chuyển sang Hardhat Local" không hoạt động, bạn cần thêm network thủ công vào MetaMask.

---

## 📋 CÁC BƯỚC THỰC HIỆN

### BƯỚC 1: Mở MetaMask

1. Click vào icon MetaMask ở góc trên phải trình duyệt
2. Hoặc click vào extension MetaMask trong thanh toolbar

---

### BƯỚC 2: Mở Network Settings

1. Trong MetaMask, click vào **network dropdown** (góc trên, hiện "Ethereum Mainnet" hoặc network hiện tại)
2. Scroll xuống và click **"Add Network"** hoặc **"Add a network manually"**

**Hoặc:**
1. Click vào **icon Settings** (⚙️) ở góc trên phải
2. Click **"Networks"** trong menu bên trái
3. Click **"Add Network"** hoặc **"Add a network manually"**

---

### BƯỚC 3: Điền Thông Tin Network

Điền các thông tin sau:

| Trường | Giá trị |
|--------|---------|
| **Network Name** | `Hardhat Local` |
| **RPC URL** | `http://127.0.0.1:8545` |
| **Chain ID** | `31337` |
| **Currency Symbol** | `ETH` |
| **Block Explorer URL** | (Để trống hoặc không cần) |

**Lưu ý:**
- **RPC URL** phải chính xác: `http://127.0.0.1:8545` (không có dấu `/` ở cuối)
- **Chain ID** phải là `31337` (số, không phải hex)
- **Currency Symbol** là `ETH` (chữ hoa)

---

### BƯỚC 4: Lưu Network

1. Kiểm tra lại thông tin đã điền
2. Click **"Save"** hoặc **"Add"**
3. MetaMask sẽ tự động chuyển sang network "Hardhat Local"

---

### BƯỚC 5: Kiểm Tra

Sau khi thêm network, bạn sẽ thấy:
- Network dropdown hiển thị "Hardhat Local"
- Chain ID hiển thị là 31337
- Balance có thể hiển thị (nếu đã import account đúng)

---

## ✅ SAU KHI THÊM NETWORK

### Import Test Account (Nếu chưa có)

1. Trong MetaMask, click vào **account icon** (góc trên phải)
2. Click **"Import Account"**
3. Chọn **"Private Key"**
4. Paste private key:
   ```
   0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
   ```
5. Click **"Import"**

**Thông tin account:**
- Address: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- Balance: 10000 ETH (trên Hardhat Local network)
- Đây là Owner #1 trong multisig wallet

---

## 🔍 KIỂM TRA KẾT QUẢ

### 1. Kiểm tra Network

- Mở MetaMask
- Network dropdown phải hiển thị "Hardhat Local"
- Chain ID phải là 31337

### 2. Kiểm tra Account

- Account phải có balance > 0 (10000 ETH)
- Nếu balance = 0, kiểm tra:
  - Hardhat node có đang chạy không (`npm run node`)
  - Đang ở đúng network "Hardhat Local" không
  - Account đã được import đúng chưa

### 3. Kiểm tra trong Frontend

- Mở `http://localhost:3000`
- Click "🔄 Refresh" trong phần Debug MetaMask
- Kiểm tra:
  - Network: `Hardhat Local (Chain ID: 31337)` ✅
  - Balance: `10000.0 ETH` ✅
  - Hardhat Account: `✅ Đúng` ✅

---

## ❌ TROUBLESHOOTING

### Lỗi: "Invalid RPC URL"

**Nguyên nhân:** Hardhat node chưa chạy hoặc RPC URL sai

**Giải pháp:**
1. Đảm bảo Hardhat node đang chạy:
   ```bash
   npm run node
   ```
2. Kiểm tra RPC URL: `http://127.0.0.1:8545` (không có `/` ở cuối)
3. Thử lại

### Lỗi: "Chain ID already exists"

**Nguyên nhân:** Network đã được thêm trước đó

**Giải pháp:**
1. Trong MetaMask, click network dropdown
2. Tìm "Hardhat Local" trong danh sách
3. Click vào để chuyển sang network đó

### Lỗi: Balance vẫn = 0 sau khi thêm network

**Nguyên nhân:** 
- Account chưa được import đúng
- Hardhat node chưa chạy
- Đang ở network sai

**Giải pháp:**
1. Đảm bảo Hardhat node đang chạy
2. Import lại account với private key đúng
3. Đảm bảo đang ở network "Hardhat Local"
4. Refresh MetaMask (đóng và mở lại extension)

### Lỗi: Không thể kết nối với RPC

**Nguyên nhân:** 
- Hardhat node không chạy
- Port 8545 bị block bởi firewall
- RPC URL sai

**Giải pháp:**
1. Kiểm tra Hardhat node:
   ```bash
   npm run node
   ```
2. Kiểm tra output có dòng:
   ```
   Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/
   ```
3. Kiểm tra firewall không block port 8545
4. Thử RPC URL: `http://localhost:8545` (thay vì `127.0.0.1`)

---

## 📸 HÌNH ẢNH MINH HỌA

### Bước 1: Click Network Dropdown
```
[Ethereum Mainnet ▼]
```

### Bước 2: Click "Add Network"
```
[Ethereum Mainnet]
[Sepolia]
[Add Network] ← Click vào đây
```

### Bước 3: Điền Form
```
Network Name:     [Hardhat Local        ]
RPC URL:          [http://127.0.0.1:8545]
Chain ID:         [31337                ]
Currency Symbol:  [ETH                  ]
```

### Bước 4: Click Save
```
[Cancel]  [Save] ← Click Save
```

---

## ✅ CHECKLIST

- [ ] Đã mở MetaMask
- [ ] Đã click "Add Network"
- [ ] Đã điền đúng thông tin:
  - [ ] Network Name: `Hardhat Local`
  - [ ] RPC URL: `http://127.0.0.1:8545`
  - [ ] Chain ID: `31337`
  - [ ] Currency: `ETH`
- [ ] Đã click "Save"
- [ ] MetaMask đã chuyển sang "Hardhat Local"
- [ ] Đã import test account
- [ ] Balance hiển thị > 0
- [ ] Frontend hiển thị đúng network và balance

---

## 🎯 KẾT QUẢ MONG ĐỢI

Sau khi hoàn thành:
- ✅ MetaMask hiển thị network "Hardhat Local"
- ✅ Chain ID: 31337
- ✅ Account có balance 10000 ETH
- ✅ Frontend có thể kết nối và hiển thị đúng thông tin
- ✅ Có thể tạo và ký transaction

---

**Chúc bạn thành công! 🚀**

