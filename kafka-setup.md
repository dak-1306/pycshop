# Hướng dẫn cài đặt Apache Kafka trên Windows

## Bước 1: Tải và cài đặt Java

- Tải Java JDK 8+ từ https://www.oracle.com/java/technologies/downloads/
- Cài đặt và thiết lập JAVA_HOME trong System Environment Variables

## Bước 2: Tải Apache Kafka

1. Truy cập https://kafka.apache.org/downloads
2. Tải phiên bản Scala 2.13 (binary downloads)
3. Giải nén vào thư mục C:\kafka

## Bước 3: Khởi động Zookeeper

Mở Command Prompt với quyền Administrator và chạy:

```cmd
cd C:\kafka
bin\windows\zookeeper-server-start.bat config\zookeeper.properties
```

## Bước 4: Khởi động Kafka Server

Mở Command Prompt mới và chạy:

```cmd
cd C:\kafka
bin\windows\kafka-server-start.bat config\server.properties
```

## Bước 5: Tạo topic cho shop ratings

```cmd
cd C:\kafka
bin\windows\kafka-topics.bat --create --topic shop-ratings --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

## Bước 6: Kiểm tra topic

```cmd
bin\windows\kafka-topics.bat --list --bootstrap-server localhost:9092
```

## Lưu ý:

- Zookeeper phải chạy trước Kafka Server
- Kafka sẽ chạy trên port 9092 (mặc định)
- Để dừng: Ctrl+C trong các Command Prompt windows
