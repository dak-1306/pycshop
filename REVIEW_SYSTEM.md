# PycShop Review System

Hệ thống đánh giá sản phẩm hoàn chỉnh với Kafka messaging cho PycShop.

## 🏗️ Kiến trúc

### Services

- **Review Service** (Port 5005): Quản lý đánh giá sản phẩm
- **Shop Rating Consumer**: Kafka consumer cập nhật rating shop
- **API Gateway**: Route các API calls đến review service

### Database

- Sử dụng bảng `danhgiasanpham` có sẵn trong database `pycshop`
- Cập nhật cột `DanhGiaTB` trong bảng `cuahang` qua Kafka

### Message Queue

- **Kafka Topic**: `shop-rating-update`
- **Event**: `REVIEW_CREATED` - được gửi khi có đánh giá mới
- **Consumer**: Tự động tính và cập nhật rating shop

## 🚀 Cài đặt và Chạy

### Prerequisites

```bash
# Cài đặt dependencies cho Review Service
cd microservice/danhgia_service
npm install

# Đảm bảo Kafka đang chạy (nếu có)
# Nếu không có Kafka, hệ thống vẫn hoạt động nhưng không có auto-update shop rating
```

### Khởi chạy

```bash
# Chạy script tự động
./start-review-system.sh

# Hoặc chạy thủ công
cd microservice/danhgia_service
npm start

# Chạy Kafka consumer (optional)
node shopRatingConsumer.js
```

## 📝 API Endpoints

### Qua API Gateway (http://localhost:5000)

#### Tạo đánh giá mới

```
POST /api/reviews
Headers: Authorization: Bearer <token>
Body: {
  "productId": 1,
  "rating": 5,
  "comment": "Sản phẩm rất tốt!"
}
```

#### Lấy danh sách đánh giá sản phẩm

```
GET /api/products/:productId/reviews?page=1&limit=10
```

#### Kiểm tra đánh giá của user

```
GET /api/reviews/check/:productId
Headers: Authorization: Bearer <token>
```

### Direct Service (http://localhost:5005)

Same endpoints nhưng access trực tiếp vào service.

## 🎨 Frontend Components

### Đã tạo

- `ReviewForm.jsx`: Form để người dùng đánh giá
- `ReviewList.jsx`: Hiển thị danh sách đánh giá
- `reviewService.js`: Service layer cho API calls
- CSS files cho styling

### Tích hợp vào ProductDetail.jsx

- Nút "Viết đánh giá"
- Hiển thị danh sách đánh giá
- Check trạng thái đã đánh giá của user

## 🔄 Luồng hoạt động

1. **User tạo đánh giá**:

   - Frontend gửi POST request với token
   - API Gateway verify token và forward đến Review Service
   - Review Service lưu vào database
   - Gửi Kafka message với shop ID

2. **Cập nhật shop rating**:

   - Kafka Consumer nhận message
   - Tính trung bình rating từ tất cả sản phẩm của shop
   - Cập nhật cột `DanhGiaTB` trong bảng `cuahang`

3. **Hiển thị đánh giá**:
   - Frontend load danh sách đánh giá
   - Phân trang và hiển thị user info
   - Real-time update khi có đánh giá mới

## 🛠️ Configuration

### Environment Variables (.env)

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pycshop
JWT_SECRET=your-secret-key-here
KAFKA_BROKERS=localhost:9092
PORT=5005
```

### Database Schema

Sử dụng bảng có sẵn:

- `danhgiasanpham`: Lưu đánh giá
- `cuahang`: Cập nhật cột `DanhGiaTB`
- `sanpham`: Link product với shop
- `nguoidung`: Thông tin user đánh giá

## 🔧 Troubleshooting

### Lỗi thường gặp

1. **Port 5005 đã được sử dụng**: Stop service khác hoặc đổi port
2. **Kafka connection failed**: Check Kafka running, service vẫn hoạt động không có auto-update
3. **JWT token invalid**: Check JWT_SECRET khớp với auth service
4. **Database connection failed**: Check MySQL running và credentials

### Logs

- Review Service: Console logs với timestamp
- Kafka Consumer: Logs khi process messages
- API Gateway: Proxy logs cho review routes

## 📊 Monitoring

### Health Check

```
GET http://localhost:5005/health
```

### Service Status

```bash
# Check processes
ps aux | grep "node.*danhgia_service"
ps aux | grep "shopRatingConsumer"

# Check ports
lsof -i :5005
```

## 🔮 Tương lai

### Planned Features

- Review images upload
- Review helpful votes
- Shop response to reviews
- Review analytics dashboard
- Email notifications for new reviews

### Performance Optimization

- Database indexing for review queries
- Caching for frequently accessed reviews
- Batch processing for shop rating updates
- Rate limiting for review creation
