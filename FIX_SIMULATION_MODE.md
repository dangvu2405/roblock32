# ✅ GIẢI THÍCH: SIMULATION MODE vs BLOCKCHAIN MODE

## 📌 Tình huống hiện tại

Khi bạn chạy `npm run dev`, bạn thấy:
```
⚠️ .env file not found
📦 Mode: SIMULATION
```

**Đây KHÔNG PHẢI LỖI!** Đây là chế độ mặc định của project.

---

## 🎯 2 CHẾ ĐỘ HOẠT ĐỘNG

### 1️⃣ SIMULATION MODE (Mặc định - Đang chạy)

**Đặc điểm:**
- ✅ Không cần blockchain
- ✅ Không cần Hardhat node
- ✅ Không cần MetaMask
- ✅ Chạy ngay được
- ✅ Mô phỏng logic multisig trong memory

**Khi nào dùng:**
- Test nhanh tính năng
- Demo đơn giản
- Không cần giao dịch thật trên blockchain

**Cách sử dụng:**
1. Chạy `npm run dev`
2. Mở `http://localhost:3000`
3. Chọn owner từ dropdown
4. Tạo và ký transaction
5. Khi đủ 4 chữ ký → Tự động execute

**→ Nếu bạn chỉ muốn test nhanh, tiếp tục sử dụng chế độ này!**

---

### 2️⃣ BLOCKCHAIN MODE (Nâng cao)

**Đặc điểm:**
- ⛓️ Sử dụng smart contract thật
- 🔗 Cần Hardhat node chạy
- 🦊 Cần MetaMask
- 💰 Giao dịch thật trên blockchain local

**Khi nào dùng:**
- Test với blockchain thật
- Demo tính năng blockchain
- Học cách tương tác với smart contract

**Cách chuyển sang Blockchain Mode:**

#### Bước 1: Tạo file `.env` trong thư mục `backend/`

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

#### Bước 2: Mở file `backend/.env` và điền thông tin

```env
MODE=blockchain
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NETWORK=localhost
```

**Lưu ý:** `CONTRACT_ADDRESS` phải là address từ lệnh `npm run deploy:local`

#### Bước 3: Chạy Hardhat node (Terminal 1)

```bash
npm run node
```

Giữ terminal này mở!

#### Bước 4: Deploy contract (Terminal 2)

```bash
npm run compile
npm run deploy:local
```

Copy `CONTRACT_ADDRESS` từ output và cập nhật vào `backend/.env`

#### Bước 5: Restart backend

Dừng `npm run dev` (Ctrl+C) và chạy lại:
```bash
npm run dev
```

Bây giờ bạn sẽ thấy:
```
✅ Loaded .env file
📦 Mode: BLOCKCHAIN
```

---

## ❓ TÔI NÊN DÙNG CHẾ ĐỘ NÀO?

### Dùng SIMULATION MODE nếu:
- ✅ Bạn chỉ muốn test nhanh
- ✅ Bạn không cần blockchain thật
- ✅ Bạn muốn demo đơn giản
- ✅ Bạn chưa setup Hardhat/MetaMask

### Dùng BLOCKCHAIN MODE nếu:
- ⛓️ Bạn muốn test với blockchain thật
- 🔗 Bạn muốn học cách tương tác với smart contract
- 🦊 Bạn đã setup Hardhat và MetaMask
- 💰 Bạn muốn thấy transaction thật trên blockchain

---

## ✅ KẾT LUẬN

**Tình huống hiện tại của bạn:**
- Backend đang chạy ở **SIMULATION MODE** ✅
- Đây là **CHẾ ĐỘ MẶC ĐỊNH** và **HOẠT ĐỘNG BÌNH THƯỜNG** ✅
- Bạn có thể sử dụng ngay mà không cần làm gì thêm ✅

**Nếu muốn chuyển sang Blockchain Mode:**
- Làm theo các bước ở trên
- Xem thêm file `HUONG_DAN_CHAY_PROJECT.md` phần "Chạy Blockchain Mode"

---

## 🎯 CHECKLIST

### Simulation Mode (Hiện tại)
- [x] Backend đang chạy
- [x] Mode: SIMULATION
- [ ] Frontend mở được tại `http://localhost:3000`
- [ ] Có thể tạo transaction
- [ ] Có thể ký transaction
- [ ] Transaction tự động execute khi đủ 4 chữ ký

### Blockchain Mode (Nếu muốn chuyển)
- [ ] Đã tạo `backend/.env`
- [ ] Đã chạy Hardhat node
- [ ] Đã compile contract
- [ ] Đã deploy contract
- [ ] Đã cập nhật `CONTRACT_ADDRESS` trong `.env`
- [ ] Đã restart backend
- [ ] Backend hiển thị "Mode: BLOCKCHAIN"
- [ ] Đã setup MetaMask
- [ ] Đã kết nối MetaMask với frontend

---

**Chúc bạn thành công! 🎉**

