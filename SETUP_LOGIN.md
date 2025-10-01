# Hướng dẫn Setup và Test chức năng Đăng nhập

## 🎯 Đã tích hợp thành công

Chức năng đăng nhập đã được tích hợp hoàn chỉnh với database XAMPP:

### ✅ Các thay đổi đã thực hiện:

1. **AuthService** (`src/services/authService.js`)
   - Tạo service xử lý API đăng nhập/đăng ký
   - Lưu token và user info vào localStorage
   - Xử lý logout

2. **AuthContext** (`src/context/AuthContext.jsx`)
   - Cập nhật để lưu trữ user state
   - Tự động load user từ localStorage khi app khởi động
   - Quản lý token và user info

3. **Login Component** (`src/pages/auth/Login.jsx`)
   - Gọi API backend thực tế
   - Hiển thị loading state và error message
   - Chuyển hướng về trang chủ sau khi đăng nhập thành công

4. **Header Component** (`src/components/buyers/Header.jsx`)
   - Đã sẵn sàng hiển thị thông tin user khi đã đăng nhập
   - Có dropdown menu với các tùy chọn
   - Chức năng đăng xuất

## 🚀 Cách chạy ứng dụng

### 1. Khởi động XAMPP
- Mở XAMPP Control Panel
- Start **Apache** và **MySQL**
- Import database từ file `microservice/db/pycshop.sql` vào phpMyAdmin (nếu chưa làm)

### 2. Khởi động Backend và Frontend
```bash
npm run fullstack
```

Lệnh này sẽ chạy:
- Frontend (Vite): `http://localhost:5173`
- Auth Service: `http://localhost:5001`
- API Gateway: `http://localhost:5000`

### 3. Hoặc chạy riêng lẻ:

**Backend:**
```bash
npm run backend
```

**Frontend:**
```bash
npm run dev
```

## 🧪 Test Đăng nhập

### Tài khoản test có sẵn trong database:

#### 1. **Buyer Account** (Người mua)
- **Email:** `test@gmail.com`
- **Password:** Bạn cần reset password hoặc dùng password đã tạo khi register

#### 2. **Seller Account** (Người bán)
- **Email:** `anh@gmail.com`
- **Password:** Bạn cần reset password hoặc dùng password đã tạo khi register

#### 3. **Admin Account** (Quản trị viên)
- **Email:** `dat@gmail.com`
- **Password:** Bạn cần reset password hoặc dùng password đã tạo khi register

> ⚠️ **Lưu ý:** Mật khẩu trong database đã được hash bằng bcrypt. Nếu bạn muốn test, bạn có 2 cách:

### Cách 1: Tạo tài khoản mới qua trang Register
1. Truy cập: `http://localhost:5173/register`
2. Điền đầy đủ thông tin
3. Đăng ký thành công
4. Dùng email/password vừa tạo để đăng nhập

### Cách 2: Reset password trong database
Chạy script SQL này trong phpMyAdmin để set password = "123456":

```sql
-- Set password = "123456" cho tất cả users
UPDATE nguoidung SET MatKhau = '$2b$10$8hFc9/JWgXZxNEgJGq9vCeBsRCzEQwD9xdQU9t6Wg3E.M3Yf2/6wC';
UPDATE admin SET MatKhau = '$2b$10$8hFc9/JWgXZxNEgJGq9vCeBsRCzEQwD9xdQU9t6Wg3E.M3Yf2/6wC';
```

Sau đó test login với password: `123456`

## 🎨 Flow đăng nhập

1. **User nhập email/password** → Submit form
2. **Frontend gọi API** → `POST http://localhost:5000/auth/login`
3. **Backend xác thực** → Kiểm tra database XAMPP
4. **Trả về token + user info** → Lưu vào localStorage
5. **Update AuthContext** → Lưu user state
6. **Redirect về Homepage** → Header hiển thị tên user

## 🔍 Kiểm tra kết quả

### Sau khi đăng nhập thành công:

1. **Header thay đổi:**
   - Nút "Đăng nhập/Đăng ký" → Thay bằng tên user
   - Hiển thị avatar (icon user)
   - Có dropdown menu khi click vào tên

2. **LocalStorage:**
   - Mở DevTools (F12) → Application → Local Storage
   - Sẽ thấy `token` và `user` được lưu

3. **Console logs:**
   - Mở DevTools (F12) → Console
   - Xem các log từ backend và frontend

## 🐛 Troubleshooting

### Lỗi: Cannot connect to database
- Kiểm tra XAMPP MySQL đã chạy chưa
- Kiểm tra file `.env` trong `microservice/auth_service/`
- Đảm bảo database `pycshop` đã được import

### Lỗi: CORS
- Kiểm tra backend đang chạy ở port 5000
- Xem console để biết chi tiết lỗi

### Lỗi: Invalid credentials
- Kiểm tra email/password đúng chưa
- Hoặc tạo tài khoản mới qua trang Register

## 📝 Các endpoint API

- **Login:** `POST /auth/login`
- **Register:** `POST /auth/register`
- **Logout:** `POST /auth/logout`

## 🎯 Next Steps

Sau khi test đăng nhập thành công, bạn có thể:
1. ✅ Tạo trang Profile để hiển thị thông tin user
2. ✅ Implement Protected Routes (chỉ cho user đã đăng nhập)
3. ✅ Thêm chức năng đổi mật khẩu
4. ✅ Thêm chức năng quên mật khẩu
5. ✅ Làm các trang seller/admin dashboard

---

**Happy Coding! 🚀**
