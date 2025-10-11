# 🚀 Hướng dẫn chạy PycShop với Kafka

## Yêu cầu hệ thống

- **Node.js** (v16+)
- **Docker Desktop** (để chạy Kafka)
- **MySQL** (đang chạy với database pycshop)

## 📋 Các bước chạy hệ thống

### Bước 1: Cài đặt Docker Desktop

1. Tải về Docker Desktop: https://www.docker.com/products/docker-desktop/
2. Cài đặt và khởi động Docker Desktop
3. Đảm bảo Docker đang chạy (icon Docker ở system tray màu xanh)

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Khởi động Kafka (Docker)

```bash
# Khởi động Kafka và Zookeeper
npm run kafka-start

# Kiểm tra logs (optional)
npm run kafka-logs
```

**Đợi 30-60 giây** để Kafka khởi động hoàn toàn.

### Bước 4: Khởi động toàn bộ hệ thống

```bash
# Khởi động backend services + Kafka consumer
npm run backend-with-kafka
```

**HOẶC** dùng lệnh tự động (khởi động Kafka + Backend):

```bash
# Tự động khởi động Kafka rồi backend (Windows)
npm run kafka-start && timeout 30 && npm run backend-with-kafka
```

### Bước 5: Khởi động Frontend (Terminal mới)

```bash
npm run dev
```

## 🌐 Truy cập ứng dụng

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:5000
- **Kafka UI**: http://localhost:8080 (quản lý Kafka)

## 🛑 Dừng hệ thống

```bash
# Dừng backend services (Ctrl+C trong terminal backend)

# Dừng Kafka
npm run kafka-stop
```

## 📊 Kiểm tra Kafka hoạt động

1. Truy cập Kafka UI: http://localhost:8080
2. Tạo một đánh giá sản phẩm
3. Kiểm tra topic `shop-rating-updates` có message mới
4. Kiểm tra bảng `cuahang` có cập nhật rating tự động

## 🔧 Các lệnh hữu ích

```bash
# Chỉ khởi động backend (không Kafka)
npm run backend

# Chỉ khởi động Kafka consumer
npm run kafka-consumer

# Xem logs Kafka
npm run kafka-logs

# Khởi động Kafka
npm run kafka-start

# Dừng Kafka
npm run kafka-stop

# Chạy fullstack (frontend + backend)
npm run fullstack
```

## ⚠️ Xử lý sự cố

### Kafka không kết nối được

1. Kiểm tra Docker Desktop đang chạy
2. Đợi đủ thời gian để Kafka khởi động (30-60s)
3. Restart Kafka:
   ```bash
   npm run kafka-stop
   npm run kafka-start
   ```

### Port đã được sử dụng

- Kafka: 9092
- Zookeeper: 2181
- Kafka UI: 8080

Đảm bảo các port này không bị chiếm dụng.

### Review Service không connect Kafka

Hệ thống sẽ tự động fallback và hoạt động bình thường, chỉ mất tính năng auto-update shop rating.

## 🎯 Tính năng Kafka

Khi Kafka hoạt động:

1. **Tạo đánh giá mới** → Gửi message vào Kafka
2. **Kafka Consumer** → Nhận message và tính toán rating trung bình
3. **Auto-update** → Cập nhật rating vào bảng `cuahang`
4. **Real-time** → Shop rating được cập nhật tự động

---

**🎉 Chúc bạn chạy thành công!**
