# 📦 HƯỚNG DẪN CHỌN PHIÊN BẢN NODE.JS

Hướng dẫn chọn và cài đặt phiên bản Node.js phù hợp để tránh lỗi với project này.

---

## ✅ PHIÊN BẢN KHUYẾN NGHỊ

### 🎯 **Node.js 18.x LTS (Khuyến nghị nhất)**

**Phiên bản cụ thể:**
- **Node.js 18.20.4** (LTS - Long Term Support)
- **Node.js 18.19.0** (LTS)
- Hoặc bất kỳ phiên bản **18.20.x** trở lên

**Tại sao:**
- ✅ Được Hardhat 2.19.0 hỗ trợ tốt
- ✅ Tương thích với React 18 và react-scripts 5.0.1
- ✅ Tương thích với Ethers.js 6.9.0
- ✅ LTS - Ổn định và được hỗ trợ dài hạn
- ✅ Không có warning

**Download:**
- https://nodejs.org/en/download/
- Chọn **"LTS"** (Long Term Support)
- Hiện tại: **Node.js 18.20.4 LTS**

---

### 🎯 **Node.js 20.x LTS (Tùy chọn)**

**Phiên bản cụ thể:**
- **Node.js 20.11.0** (LTS)
- Hoặc bất kỳ phiên bản **20.x LTS** trở lên

**Tại sao:**
- ✅ Phiên bản mới nhất LTS
- ✅ Được Hardhat hỗ trợ
- ✅ Tương thích với tất cả dependencies
- ⚠️ Mới hơn, có thể có một số thay đổi nhỏ

**Download:**
- https://nodejs.org/en/download/
- Chọn **"LTS"** (Long Term Support)

---

## ❌ PHIÊN BẢN KHÔNG KHUYẾN NGHỊ

### ⚠️ **Node.js 18.15.0** (Tránh)

**Lý do:**
- ❌ Hardhat hiển thị warning: "not supported by Hardhat"
- ❌ Có thể gây lỗi không mong muốn
- ❌ Không phải LTS version

**Giải pháp:**
- Upgrade lên Node.js 18.20.x hoặc 20.x LTS

---

### ❌ **Node.js < 16.0.0** (Không hỗ trợ)

**Lý do:**
- ❌ React-scripts 5.0.1 yêu cầu Node.js >= 14.0.0
- ❌ Hardhat yêu cầu Node.js >= 16.0.0
- ❌ Ethers.js 6.x yêu cầu Node.js >= 14.0.0

**Giải pháp:**
- Upgrade lên Node.js 18.x hoặc 20.x LTS

---

### ❌ **Node.js 21.x, 22.x** (Tránh)

**Lý do:**
- ⚠️ Phiên bản Current (không phải LTS)
- ⚠️ Có thể có breaking changes
- ⚠️ Chưa được test kỹ với Hardhat

**Giải pháp:**
- Sử dụng LTS version (18.x hoặc 20.x)

---

## 📋 YÊU CẦU TỐI THIỂU

| Component | Yêu cầu Node.js |
|-----------|----------------|
| **Hardhat 2.19.0** | >= 16.0.0 (khuyến nghị >= 18.0.0) |
| **React-scripts 5.0.1** | >= 14.0.0 (khuyến nghị >= 16.0.0) |
| **Ethers.js 6.9.0** | >= 14.0.0 |
| **Project này** | **>= 16.0.0 (khuyến nghị 18.20.x LTS)** |

---

## 🔧 CÁCH CÀI ĐẶT

### Cách 1: Download từ Website (Đơn giản nhất)

1. Truy cập: https://nodejs.org/en/download/
2. Chọn **"LTS"** (Long Term Support)
3. Download installer cho Windows:
   - **Windows 64-bit**: `node-v18.20.4-x64.msi`
   - **Windows 32-bit**: `node-v18.20.4-x86.msi`
4. Chạy installer và làm theo hướng dẫn
5. Kiểm tra cài đặt:
   ```bash
   node --version
   npm --version
   ```

**Kết quả mong đợi:**
```
v18.20.4
10.2.4
```

---

### Cách 2: Sử dụng NVM (Node Version Manager) - Khuyến nghị

NVM cho phép quản lý nhiều phiên bản Node.js và chuyển đổi dễ dàng.

#### Windows: NVM for Windows

1. **Download NVM for Windows:**
   - https://github.com/coreybutler/nvm-windows/releases
   - Download `nvm-setup.exe`

2. **Cài đặt:**
   - Chạy `nvm-setup.exe`
   - Làm theo hướng dẫn

3. **Cài đặt Node.js 18.20.4:**
   ```bash
   nvm install 18.20.4
   nvm use 18.20.4
   ```

4. **Kiểm tra:**
   ```bash
   node --version
   npm --version
   ```

#### Linux/Mac: NVM

1. **Cài đặt NVM:**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   ```

2. **Reload shell:**
   ```bash
   source ~/.bashrc
   # Hoặc
   source ~/.zshrc
   ```

3. **Cài đặt Node.js 18.20.4:**
   ```bash
   nvm install 18.20.4
   nvm use 18.20.4
   ```

4. **Kiểm tra:**
   ```bash
   node --version
   npm --version
   ```

**Lợi ích của NVM:**
- ✅ Dễ dàng chuyển đổi giữa các phiên bản Node.js
- ✅ Có thể cài nhiều phiên bản cùng lúc
- ✅ Không cần uninstall phiên bản cũ

---

## 🔍 KIỂM TRA PHIÊN BẢN HIỆN TẠI

### Kiểm tra Node.js version:

```bash
node --version
```

**Kết quả mong đợi:**
```
v18.20.4
```

### Kiểm tra npm version:

```bash
npm --version
```

**Kết quả mong đợi:**
```
10.2.4
```

---

## 🔄 UPGRADE NODE.JS

### Nếu đang dùng Node.js 18.15.0 hoặc phiên bản cũ:

#### Cách 1: Download và cài đặt mới

1. Download Node.js 18.20.4 LTS từ https://nodejs.org/
2. Chạy installer
3. Installer sẽ tự động thay thế phiên bản cũ

#### Cách 2: Sử dụng NVM (Nếu đã cài)

```bash
# Cài đặt phiên bản mới
nvm install 18.20.4

# Chuyển sang phiên bản mới
nvm use 18.20.4

# Kiểm tra
node --version
```

#### Cách 3: Uninstall và cài lại

1. **Uninstall Node.js cũ:**
   - Windows: Control Panel → Programs → Uninstall Node.js
   - Hoặc dùng uninstaller

2. **Cài đặt Node.js mới:**
   - Download và cài đặt từ https://nodejs.org/

---

## ✅ SAU KHI CÀI ĐẶT

### 1. Kiểm tra cài đặt:

```bash
node --version
npm --version
```

### 2. Xóa node_modules và cài lại dependencies:

```bash
# Xóa node_modules cũ
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force backend/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/node_modules -ErrorAction SilentlyContinue

# Xóa package-lock.json
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force backend/package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Force frontend/package-lock.json -ErrorAction SilentlyContinue

# Cài đặt lại
npm run install-all
```

### 3. Test project:

```bash
# Test compile
npm run compile

# Test chạy
npm run dev
```

---

## 🎯 TÓM TẮT KHUYẾN NGHỊ

### ✅ **Nên dùng:**
- **Node.js 18.20.4 LTS** (Khuyến nghị nhất)
- **Node.js 20.11.0 LTS** (Tùy chọn)

### ❌ **Không nên dùng:**
- Node.js 18.15.0 (có warning)
- Node.js < 16.0.0 (không hỗ trợ)
- Node.js 21.x, 22.x (không phải LTS)

### 📥 **Download:**
- https://nodejs.org/en/download/
- Chọn **"LTS"** (Long Term Support)

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Hardhat was set to use chain id X, but connected to a chain with id Y"

**Nguyên nhân:** Không liên quan đến Node.js version, nhưng có thể do Hardhat config

**Giải pháp:** Xem file `FIX_COMPILE_ERRORS.md`

### Lỗi: "Module not found" sau khi upgrade Node.js

**Giải pháp:**
```bash
# Xóa node_modules và cài lại
npm run install-all
```

### Lỗi: "npm command not found" sau khi cài Node.js

**Giải pháp:**
1. Restart terminal/command prompt
2. Kiểm tra PATH environment variable
3. Thử cài lại Node.js

---

## 📚 TÀI LIỆU THAM KHẢO

- **Node.js Official:** https://nodejs.org/
- **Node.js LTS Schedule:** https://nodejs.org/en/about/releases/
- **Hardhat Documentation:** https://hardhat.org/
- **NVM for Windows:** https://github.com/coreybutler/nvm-windows
- **NVM (Linux/Mac):** https://github.com/nvm-sh/nvm

---

**Chúc bạn thành công! 🚀**

