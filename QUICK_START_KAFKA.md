# 🚀 Quick Start với Kafka

## Cách chạy nhanh nhất:

### Trên Windows:

```bash
# Cách 1: Dùng file .bat (Khuyên dùng)
start-with-kafka.bat

# Cách 2: Dùng npm scripts
npm run kafka-start
# Đợi 30 giây
npm run backend-with-kafka

# Terminal mới
npm run dev
```

### Trên Mac/Linux:

```bash
npm run kafka-start && sleep 30 && npm run backend-with-kafka
# Terminal mới
npm run dev
```

## Dừng hệ thống:

```bash
# Windows
stop-kafka.bat

# Mac/Linux
npm run kafka-stop
```

## Kiểm tra Kafka hoạt động:

1. Vào http://localhost:8080 (Kafka UI)
2. Tạo đánh giá sản phẩm
3. Xem topic `shop-rating-updates` có message mới
