# Hướng dẫn Seller - PycShop

## Tổng quan

Hệ thống Seller đã được cập nhật với kiến trúc microservices mới, bao gồm:

### 🏗️ Kiến trúc Microservices

- **API Gateway** (Port 5000): Điều phối tất cả requests
- **Auth Service** (Port 5001): Xử lý đăng nhập/đăng ký
- **Product Service** (Port 5002): Quản lý sản phẩm
- **Shop Service** (Port 5003): Quản lý thông tin shop
- **Frontend** (Port 5174): Giao diện React

## 🚀 Khởi chạy hệ thống

### 1. Database

Đảm bảo MySQL đang chạy và có database `pycshop`

### 2. Khởi chạy Microservices (theo thứ tự)

```bash
# Terminal 1: API Gateway
cd microservice/api_gateway
node index.js

# Terminal 2: Auth Service
cd microservice/auth_service
node app.js

# Terminal 3: Product Service
cd microservice/product_service
node app.js

# Terminal 4: Shop Service
cd microservice/shop_service
node server.js

# Terminal 5: Frontend
npm run dev
```

## 👤 Workflow Seller

### 1. Đăng ký & Trở thành Seller

1. Đăng ký tài khoản buyer thông thường
2. Đăng nhập và chọn "Trở thành Seller"
3. **Điền đầy đủ thông tin shop bắt buộc:**
   - Tên shop
   - Mô tả shop
   - Danh mục kinh doanh
   - Địa chỉ
   - Số điện thoại

⚠️ **Lưu ý**: Phải điền đủ tất cả thông tin mới thành công

### 2. Dashboard Seller

Sau khi trở thành seller, truy cập Dashboard với các thao tác nhanh:

- 🏪 **Thông tin Shop**: Xem & chỉnh sửa thông tin shop
- 📦 **Quản lý sản phẩm**: Thêm, sửa, xóa sản phẩm
- 📋 **Đơn hàng**: Xử lý đơn hàng
- 📊 **Thống kê**: Doanh thu & báo cáo

### 3. Quản lý Shop (`/seller/shop-info`)

- **Xem thông tin shop**: Hiển thị tất cả thông tin hiện tại
- **Chỉnh sửa**: Click "Chỉnh sửa" để cập nhật thông tin
- **Validation**: Form sẽ kiểm tra tính hợp lệ trước khi lưu

### 4. Quản lý Sản phẩm (`/seller/manage-products`)

#### 📸 Upload ảnh sản phẩm

- **Tối đa 15 ảnh** cho mỗi sản phẩm
- Định dạng hỗ trợ: JPG, PNG, JPEG
- Preview ảnh trước khi upload
- Có thể xóa từng ảnh riêng lẻ

#### ➕ Thêm sản phẩm mới

1. Click "Thêm sản phẩm"
2. Điền thông tin: tên, mô tả, giá, category, stock
3. Upload ảnh (tối đa 15 tấm)
4. Click "Lưu" để tạo sản phẩm

#### ✏️ Chỉnh sửa sản phẩm

- Có thể sửa: tên, mô tả, giá, category, ảnh
- **Không thể sửa số lượng tồn kho** trong form chỉnh sửa
- Sử dụng chức năng "Restock" riêng để thêm hàng

#### 📦 Thêm hàng (Restock)

1. Click "Restock" trên sản phẩm cần thêm hàng
2. Nhập số lượng muốn thêm
3. Click "Thêm hàng" để cập nhật stock

#### 🔍 Tìm kiếm & Lọc

- Tìm kiếm theo tên sản phẩm
- Lọc theo category
- Sắp xếp theo: tên, giá, ngày tạo
- Phân trang với navigation

#### 🗑️ Xóa sản phẩm

- Click "Xóa" và xác nhận để xóa sản phẩm
- Dữ liệu sẽ bị xóa vĩnh viễn

## 🔧 Technical Features

### Frontend Components

- **ShopInfo.jsx**: Quản lý thông tin shop
- **ManageProducts.jsx**: Quản lý sản phẩm với upload ảnh
- **BecomeSeller.jsx**: Form trở thành seller với validation
- **Dashboard.jsx**: Trang chủ seller với quick actions

### API Services

- **shopService.js**: Wrapper cho tất cả shop & product APIs
- Hỗ trợ authentication tự động
- Error handling toàn diện

### Microservices

- **Shop Service**: Xử lý logic shop riêng biệt
- **Product Service**: Quản lý sản phẩm & upload ảnh
- **Auth Service**: Xử lý authentication

## 🚨 Lưu ý quan trọng

1. **Validation nghiêm ngặt**: Tất cả form đều có validation
2. **Upload ảnh giới hạn**: Tối đa 15 ảnh/sản phẩm
3. **Stock management**: Không sửa stock trong edit, dùng restock
4. **Authentication**: Cần login để truy cập seller functions
5. **Error handling**: Hiển thị thông báo lỗi chi tiết

## 🔄 Testing Workflow

1. Đăng ký tài khoản mới
2. Trở thành seller với đầy đủ thông tin
3. Thêm sản phẩm với ảnh
4. Test chức năng restock
5. Chỉnh sửa thông tin shop
6. Test search/filter products

Hệ thống đã sẵn sàng để sử dụng! 🎉
