# 🚀 PyCShop Quick Start Guide

## Các lệnh đơn giản để khởi động ứng dụng:

### 🎯 Khởi động toàn bộ hệ thống (Frontend + Backend + Kafka)

```bash
npm run start:full
```

### 🔧 Chỉ khởi động Backend + Kafka (không có Frontend)

```bash
npm run start:backend
```

### 🌐 Chỉ khởi động Frontend + Backend (không có Kafka)

```bash
npm run fullstack
```

### ⚙️ Khởi động từng bước:

#### Bước 1: Khởi động Kafka

```bash
npm run kafka:start
```

#### Bước 2: Đợi Kafka sẵn sàng (tự động)

```bash
npm run start:kafka
```

#### Bước 3: Khởi động Backend với Kafka

```bash
npm run backend-with-kafka
```

#### Bước 4: Khởi động Frontend (terminal mới)

```bash
npm run dev
```

## 🛑 Dừng services:

```bash
# Dừng Kafka
npm run kafka:stop

# Hoặc dừng tất cả
npm run stop
```

## 🔍 Giám sát Kafka:

```bash
# Xem logs của Kafka
npm run kafka:logs

# Mở Kafka UI (Windows)
npm run kafka:ui
```

## 🌐 URLs sau khi khởi động:

- **Frontend**: http://localhost:5173
- **API Gateway**: http://localhost:5000
- **Kafka UI**: http://localhost:8080
- **Product Service**: http://localhost:5002
- **Shop Service**: http://localhost:5003
- **Review Service**: http://localhost:5005

## ⚡ Kafka Scripts có sẵn:

| Script                  | Mô tả                          |
| ----------------------- | ------------------------------ |
| `npm run kafka:start`   | Khởi động Kafka containers     |
| `npm run kafka:stop`    | Dừng Kafka containers          |
| `npm run kafka:logs`    | Xem logs của Kafka             |
| `npm run kafka:ui`      | Mở Kafka UI                    |
| `npm run start:kafka`   | Khởi động Kafka + đợi sẵn sàng |
| `npm run start:backend` | Kafka + Backend                |
| `npm run start:full`    | Kafka + Backend + Frontend     |

## 📝 Lưu ý:

- ✅ Tất cả scripts đều cross-platform (Windows/Mac/Linux)
- ✅ Không cần file .bat hay .sh
- ✅ Lần đầu khởi động Kafka sẽ mất 10-15 giây
- ✅ Kafka consumer sẽ tự động tạo topic nếu chưa tồn tại
- ⚠️ Nếu gặp lỗi port conflict, chạy `npm run stop` trước
