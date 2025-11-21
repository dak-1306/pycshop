# 🚀 Hướng dẫn sử dụng hệ thống thông báo Real-time

## Tổng quan

Hệ thống thông báo real-time sử dụng **Kafka** và **WebSocket** để cung cấp thông báo tức thì giữa người mua và người bán.

## Các tính năng chính

- ✅ Thông báo real-time khi có đơn hàng mới
- ✅ Thông báo khi trạng thái đơn hàng thay đổi
- ✅ Hỗ trợ đơn hàng multi-seller (chia đơn theo từng người bán)
- ✅ WebSocket với xác thực JWT
- ✅ Kafka event streaming giữa các microservices

## 🎯 Khởi động nhanh

### 1. Chạy hệ thống Real-time hoàn chỉnh

```bash
npm run start:full-realtime
```

Lệnh này sẽ:

- Khởi động Kafka và Zookeeper
- Đợi 15 giây cho Kafka khởi động hoàn tất
- Chạy tất cả backend services với real-time
- Chạy frontend React

### 2. Chỉ chạy backend Real-time

```bash
npm run start:backend-realtime
```

### 3. Chỉ chạy backend services (không real-time)

```bash
npm run backend
```

## 🛠️ Quản lý Kafka

### Khởi động Kafka

```bash
npm run kafka:start
```

### Dừng Kafka

```bash
npm run kafka:stop
```

### Xem logs Kafka

```bash
npm run kafka:logs
```

### Mở Kafka UI (để monitor)

```bash
npm run kafka:ui
```

- Truy cập: http://localhost:8080

## 📋 Cấu hình môi trường

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5008
VITE_KAFKA_UI_URL=http://localhost:8080
```

### Order Service (.env)

```env
PORT=5007
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pycshop
JWT_SECRET=your_jwt_secret_key_here
KAFKA_BROKERS=localhost:9092
WEBSOCKET_SERVER_URL=http://localhost:5008
```

### Notification Service (.env)

```env
PORT=5008
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=pycshop
JWT_SECRET=your_jwt_secret_key_here
KAFKA_BROKERS=localhost:9092
```

## 🔍 Kiểm tra hệ thống

### 1. Kiểm tra Kafka Topics

```bash
docker exec pycshop-kafka kafka-topics.sh --bootstrap-server localhost:9092 --list
```

### 2. Kiểm tra WebSocket Server

- WebSocket Server: http://localhost:5008
- Socket.IO endpoint: ws://localhost:5008/socket.io/

### 3. Kiểm tra Services

- Order Service: http://localhost:5007
- Notification Service: http://localhost:5008
- API Gateway: http://localhost:5000

## 📱 Luồng hoạt động Real-time

### Khi người mua đặt hàng:

1. **Frontend** → Gửi đơn hàng đến Order Service
2. **Order Service** → Chia đơn theo seller và lưu database
3. **Order Service** → Gửi event `order.created` lên Kafka
4. **Notification Service** → Nhận event từ Kafka
5. **WebSocket Server** → Push thông báo real-time đến seller
6. **Frontend (Seller)** → Hiện thông báo ngay lập tức

### Khi cập nhật trạng thái đơn hàng:

1. **Seller/Admin** → Cập nhật trạng thái đơn hàng
2. **Order Service** → Gửi event `order.status_updated` lên Kafka
3. **Notification Service** → Nhận event và xử lý
4. **WebSocket Server** → Push thông báo đến buyer
5. **Frontend (Buyer)** → Hiện thông báo real-time

## 🐛 Troubleshooting

### Kafka không khởi động được

```bash
# Dọn dẹp và khởi động lại
npm run kafka:stop
docker system prune -f
npm run kafka:start
```

### WebSocket không kết nối được

1. Kiểm tra port 5008 có bị block không
2. Kiểm tra JWT token có hợp lệ không
3. Xem logs của Notification Service

### Backend services không start

1. Kiểm tra MySQL đã chạy chưa
2. Kiểm tra database `pycshop` đã tồn tại chưa
3. Kiểm tra các port không bị conflict

## 📊 Monitoring

### Kafka UI

- URL: http://localhost:8080
- Monitor topics: `order-events`, `notification-events`
- Xem messages và consumer groups

### Development Tools

- React DevTools cho frontend debugging
- Postman để test API endpoints
- Browser DevTools → Network tab để monitor WebSocket

## 📝 Lưu ý quan trọng

1. **Luôn khởi động Kafka trước** khi chạy backend services
2. **Đợi Kafka khởi động hoàn tất** (khoảng 15 giây) trước khi start services
3. **JWT token phải hợp lệ** để WebSocket kết nối được
4. **Database phải có sẵn** trước khi start services

## 🔧 Scripts hữu ích

```bash
# Development
npm run dev                    # Chỉ frontend
npm run backend               # Chỉ backend (không real-time)
npm run fullstack            # Frontend + Backend (không real-time)

# Real-time
npm run backend-realtime     # Backend với real-time
npm run start:backend-realtime   # Start Kafka + Backend real-time
npm run start:full-realtime  # Start tất cả với real-time

# Infrastructure
npm run kafka:start          # Khởi động Kafka
npm run redis:start          # Khởi động Redis
npm run services:start       # Khởi động tất cả services (Kafka + Redis)

# Monitoring
npm run kafka:ui             # Mở Kafka UI
npm run kafka:logs           # Xem Kafka logs
npm run services:logs        # Xem logs của tất cả services
```

Happy coding! 🎉
