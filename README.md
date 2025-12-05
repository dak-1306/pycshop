# 🛍️ PyCShop - E-commerce Platform

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://mysql.com/)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-2.8-000?style=flat&logo=apachekafka)](https://kafka.apache.org/)
[![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-green.svg)](https://socket.io/)
[![Redis](https://img.shields.io/badge/Redis-6.2-DC382D.svg)](https://redis.io/)

**PyCShop** là một nền tảng thương mại điện tử hiện đại, mạnh mẽ được xây dựng với kiến trúc microservices, tích hợp đầy đủ tính năng real-time messaging, thông báo tức thì, và giao diện người dùng đẹp mắt với tông màu xanh lá đặc trưng.

## ✨ Features

### 🏪 Seller Dashboard

- Product management (CRUD operations)
- Order management and tracking
- Sales analytics and reporting
- Inventory management
- Customer communication

### 👨‍💼 Admin Panel

- User management
- System-wide analytics
- Content moderation
- Platform configuration

### 🛒 Customer Experience

- Product browsing and search
- Shopping cart and checkout
- Order tracking
- Review and rating system
- Real-time notifications

### 🔧 Technical Features

- **Microservices Architecture** - Kiến trúc phân tán linh hoạt
- **Real-time Notifications** - Kafka + WebSocket + Redis
- **Modern Chat System** - Chat box với UI/UX hiện đại, Font Awesome icons
- **Event-Driven Architecture** - Xử lý sự kiện bất đồng bộ
- **JWT Authentication** - Xác thực và phân quyền an toàn
- **File Upload System** - Xử lý upload hình ảnh, tài liệu
- **Responsive Design** - Tailwind CSS với mobile-first approach
- **Multi-seller Support** - Hỗ trợ đa người bán trong cùng đơn hàng
- **Glass Morphism UI** - Giao diện hiện đại với hiệu ứng kính mờ
- **Rate Limiting & Security** - Bảo mật với Helmet, CORS, input validation

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   API Gateway   │    │  WebSocket      │
│  (Vite + Vite)  │◄──►│   (Express)     │◄──►│  Server (5008)  │
│  Chat Widget    │    │   Port 5000     │    │  Real-time      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                    ┌─────────┼─────────┐             │
                    │         │         │             │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐        │
            │Auth Service│ │Product│ │User   │        │
            │ (5001)     │ │(5002) │ │(5009) │        │
            └────────────┘ └───────┘ └───────┘        │
                    │         │         │             │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐ ┌──────▼──────┐
            │Shop Service│ │Order  │ │Chat   │ │ Notification│
            │ (5003)     │ │(5007) │ │(5004) │ │ Service     │
            └────────────┘ └───────┘ └───────┘ └─────────────┘
                    │         │         │             │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐        │
            │Cart Service│ │Review │ │Promo  │ ┌──────▼──────┐
            │ (5005)     │ │(5006) │ │(5010) │ │Apache Kafka │
            └────────────┘ └───────┘ └───────┘ │+ Zookeeper  │
                              │                 │Event Stream │
                       ┌──────▼──────┐          └─────────────┘
                       │   MySQL DB  │          ┌─────────────┐
                       │   PycShop   │          │   Redis     │
                       └─────────────┘          │   Cache     │
                                               └─────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- Docker & Docker Compose (for Kafka)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/dak-1306/pycshop.git
   cd pycshop
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup database**

   ```bash
   npm run setup-db
   ```

4. **Start Kafka infrastructure**

   ```bash
   npm run kafka:start
   ```

5. **Start the full application with real-time notifications**

   ```bash
   npm run start:full-realtime
   ```

   Or for standard mode:

   ```bash
   npm run start:full
   ```

The application will be available at:

- Frontend: http://localhost:5173
- API Gateway: http://localhost:5000
- WebSocket Server: http://localhost:5008
- Kafka UI: http://localhost:8080

## 🚀 Real-time System

### 💬 Modern Chat System

- **GlobalChatWidget** với UI/UX hiện đại
- **PycShop Theme** - Tông màu xanh lá (#297d4e) đặc trưng
- **Font Awesome Icons** - Thay thế emoji với icons chuyên nghiệp
- **Glass Morphism Effects** - Hiệu ứng kính mờ và gradient
- **Responsive Design** - Tối ưu cho desktop, tablet, mobile
- **Real-time Messaging** - Chat tức thì với WebSocket
- **Typing Indicators** - Hiển thị khi đang soạn tin nhắn
- **File & Media Upload** - Gửi hình ảnh, tệp tin, sticker

### 🔔 Real-time Notifications

- **Kafka Event Streaming** - Xử lý sự kiện bất đồng bộ
- **WebSocket Server** - Thông báo real-time (port 5008)
- **Multi-seller Orders** - Chia đơn hàng theo từng người bán
- **Order Status Updates** - Cập nhật trạng thái đơn hàng tức thì
- **Redis Caching** - Cache session và data tạm thời

### Quick Start Real-time

```bash
# Start full system with real-time features
npm run start:full-realtime
```

This will start:

- ✅ **Kafka + Zookeeper** - Event streaming infrastructure
- ✅ **Redis Cache** - Session and data caching
- ✅ **All Microservices** - Complete backend system
- ✅ **WebSocket Server** - Real-time communication (port 5008)
- ✅ **React Frontend** - Modern UI with chat widget (port 5173)
- ✅ **Kafka UI Monitor** - Development monitoring (port 8080)

## 📁 Project Structure

```
pycshop/
├── 📂 src/                               # Frontend React Application
│   ├── 🧩 components/                   # Reusable UI components
│   │   ├── admin/                       # Admin dashboard components
│   │   ├── buyers/                      # Buyer interface components
│   │   ├── common/                      # Shared components
│   │   │   └── GlobalChatWidget/        # 💬 Modern chat system
│   │   ├── layout/                      # Layout components
│   │   └── seller/                      # Seller dashboard components
│   ├── 📄 pages/                        # Page components
│   ├── 🔧 services/                     # API service layer
│   ├── 🎣 hooks/                        # Custom React hooks
│   ├── 🎨 styles/                       # CSS stylesheets
│   │   └── components/                  # Component-specific styles
│   ├── 🖼️ images/                       # Static images
│   └── 📊 context/                      # React contexts
│       ├── AuthContext.jsx              # Authentication state
│       ├── CartContext.jsx              # Shopping cart state
│       ├── ChatContext.jsx              # Chat system state
│       └── LanguageContext.jsx          # Internationalization
│
├── 🏗️ microservice/                     # Backend Microservices
│   ├── 🚪 api_gateway/ (5000)           # API Gateway service
│   ├── 🔐 auth_service/ (5001)          # Authentication & JWT
│   ├── 📦 product_service/ (5002)       # Product management
│   ├── 🏪 shop_service/ (5003)          # Seller dashboard
│   ├── 💬 chat_service/ (5004)          # Chat & messaging
│   ├── 🛒 cart_service/ (5005)          # Shopping cart
│   ├── ⭐ danhgia_service/ (5006)       # Reviews & ratings
│   ├── 📋 order_service/ (5007)         # Order management
│   ├── 🔔 notification_service/ (5008)  # Real-time notifications
│   ├── 👤 user_service/ (5009)          # User management
│   ├── 🎁 promotion_service/ (5010)     # Promotions & discounts
│   ├── 👨‍💼 admin_service/               # Admin management
│   ├── 📊 db/                           # Database schemas & migrations
│   └── 🔄 shared/                       # Shared utilities
│       ├── kafka/                       # Kafka event handlers
│       └── websocket/                   # WebSocket utilities
│
├── 📜 scripts/                          # Development & deployment scripts
├── 🖼️ public/                           # Static assets
├── 🐳 Infrastructure Files              # Docker & Configuration
│   ├── docker-compose-kafka.yml        # Kafka + Zookeeper
│   ├── docker-compose-redis.yml        # Redis cache
│   ├── docker-compose-full.yml         # Complete infrastructure
│   └── package.json                    # NPM scripts & dependencies
│
└── 📚 Documentation                     # Project documentation
    ├── README.md                        # Main documentation
    ├── REALTIME_SETUP.md               # Real-time system guide
    ├── CHATBOX_DESIGN.md               # Chat UI/UX documentation
    └── GLOBALCHATWIDGET_UPDATE.md      # Chat widget updates
```

### 🎯 Key Features by Directory

**Frontend (`src/`)**

- ⚛️ React 19+ với Vite build system
- 🎨 Tailwind CSS cho responsive design
- 💬 Modern chat widget với Font Awesome icons
- 🔄 Context API cho state management
- 📱 Mobile-first responsive design

**Backend (`microservice/`)**

- 🏗️ Microservices với Express.js
- 🔔 Real-time với Kafka + WebSocket
- 🔐 JWT authentication & authorization
- 📊 MySQL database với optimized queries
- 🚀 Redis caching cho performance

## 🛠️ Available Scripts

### Development

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start frontend development server |
| `npm run build`     | Build for production              |
| `npm run backend`   | Start all microservices           |
| `npm run fullstack` | Start frontend + backend          |

### 🔔 Real-time System

| Command                          | Description                            |
| -------------------------------- | -------------------------------------- |
| `npm run start:full-realtime`    | **🚀 Start complete real-time system** |
| `npm run backend-realtime`       | Start backend with real-time features  |
| `npm run start:backend-realtime` | Start Kafka + backend real-time        |

### 💬 Chat System Development

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev:chat`   | Develop chat components      |
| `npm run test:chat`  | Test chat functionality      |
| `npm run build:chat` | Build optimized chat widgets |

### Infrastructure

| Command                  | Description                        |
| ------------------------ | ---------------------------------- |
| `npm run kafka:start`    | Start Kafka infrastructure         |
| `npm run kafka:stop`     | Stop Kafka infrastructure          |
| `npm run kafka:ui`       | Open Kafka UI monitor              |
| `npm run services:start` | Start all services (Kafka + Redis) |

### Database

| Command               | Description                   |
| --------------------- | ----------------------------- |
| `npm run setup-db`    | Initialize database schema    |
| `npm run optimize-db` | Optimize database performance |

### �️ Environment Configuration

**Frontend (.env)**

```env
# API Endpoints
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5008
VITE_KAFKA_UI_URL=http://localhost:8080

# Features
VITE_ENABLE_CHAT=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_DEBUG_MODE=false
```

**Backend Services (.env)**

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pycshop
DB_PORT=3306

# Authentication
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your_refresh_secret

# Kafka Configuration
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=pycshop-service
KAFKA_GROUP_ID=pycshop-consumers

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# WebSocket
WEBSOCKET_SERVER_URL=http://localhost:5008
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Service Ports
PORT=5000                    # API Gateway
AUTH_SERVICE_PORT=5001       # Authentication
PRODUCT_SERVICE_PORT=5002    # Product Management
SHOP_SERVICE_PORT=5003       # Seller Dashboard
CHAT_SERVICE_PORT=5004       # Chat System
CART_SERVICE_PORT=5005       # Shopping Cart
REVIEW_SERVICE_PORT=5006     # Reviews & Ratings
ORDER_SERVICE_PORT=5007      # Order Management
NOTIFICATION_SERVICE_PORT=5008 # Real-time Notifications
USER_SERVICE_PORT=5009       # User Management
PROMOTION_SERVICE_PORT=5010  # Promotions & Discounts

# File Upload
UPLOAD_MAX_SIZE=10MB
UPLOAD_ALLOWED_TYPES=jpg,jpeg,png,gif,pdf,doc,docx
UPLOAD_PATH=./uploads
```

**Docker Infrastructure**

```yaml
# docker-compose-full.yml sẽ start:
services:
  - Apache Kafka + Zookeeper (ports: 9092, 2181)
  - Redis Cache (port: 6379)
  - Kafka UI Monitor (port: 8080)
  - MySQL Database (port: 3306)
```

## 📡 API Documentation

### Authentication Endpoints

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh token

### Product Endpoints

- `GET /products` - Get products with pagination
- `POST /seller/products` - Create product (Seller)
- `PUT /seller/products/:id` - Update product (Seller)
- `DELETE /seller/products/:id` - Delete product (Seller)

### Order Endpoints

- `GET /seller/orders` - Get seller orders
- `PUT /seller/orders/:id/status` - Update order status

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Input validation and sanitization
- SQL injection prevention

## 📊 Database Schema

The application uses MySQL with the following main tables:

- `nguoidung` - Users
- `cuahang` - Shops/Sellers
- `sanpham` - Products
- `donhang` - Orders
- `chitietdonhang` - Order details
- `danhgia` - Reviews

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### 🧪 Test Scripts

```bash
# Unit Testing
npm run test              # Frontend component tests
npm run test:backend      # Backend API tests
npm run test:coverage     # Coverage reports

# Integration Testing
npm run test:e2e          # End-to-end với Playwright
npm run test:api          # API integration tests
npm run test:realtime     # Real-time feature tests

# Performance Testing
npm run test:performance  # Load testing với Artillery
npm run test:websocket    # WebSocket stress testing
npm run lighthouse        # Frontend performance audit
```

## � Monitoring & Analytics

### 🔍 Development Monitoring

**Kafka UI Dashboard:** http://localhost:8080

- Monitor topics: `order-events`, `notification-events`
- Track message throughput và consumer lag
- Debug event flow problems

**Database Performance:**

```sql
-- Monitor slow queries
SHOW PROCESSLIST;
SHOW FULL PROCESSLIST;

-- Check table performance
EXPLAIN SELECT * FROM donhang WHERE nguoidung_id = 1;
```

**WebSocket Monitoring:**

- Browser DevTools → Network → WS tab
- Real-time connection status
- Message payload inspection

### 📈 Production Monitoring

**Recommended Tools:**

- **APM**: New Relic hoặc DataDog cho application monitoring
- **Logging**: Winston + ELK Stack (Elasticsearch, Logstash, Kibana)
- **Metrics**: Prometheus + Grafana cho system metrics
- **Uptime**: Pingdom hoặc UptimeRobot cho service availability

## 🚀 Deployment Guide

### 📦 Production Build

```bash
# Build optimized frontend
npm run build

# Build Docker images
docker-compose -f docker-compose-prod.yml build

# Deploy với environment variables
docker-compose -f docker-compose-prod.yml up -d
```

### 🔒 Security Checklist

**Backend Security:**

- ✅ JWT tokens với proper expiration
- ✅ Password hashing với bcrypt (12+ rounds)
- ✅ Input validation với Joi/Yup
- ✅ SQL injection prevention với parameterized queries
- ✅ Rate limiting với Redis storage
- ✅ HTTPS enforced trong production
- ✅ CORS properly configured
- ✅ File upload validation & sanitization

**Frontend Security:**

- ✅ XSS protection với DOMPurify
- ✅ CSP (Content Security Policy) headers
- ✅ Secure cookie settings
- ✅ Environment variables properly scoped

## 📚 Additional Documentation

- **[Real-time Setup Guide](./REALTIME_SETUP.md)** - Complete real-time system setup
- **[Chat System Design](./CHATBOX_DESIGN.md)** - Modern chat UI/UX documentation
- **[GlobalChatWidget Updates](./GLOBALCHATWIDGET_UPDATE.md)** - Latest chat improvements
- **[Database Schema](./microservice/db/pycshop.sql)** - Complete database structure
- **[API Documentation](./docs/api.md)** - REST API endpoints reference

## � Mobile App Development

**Future Roadmap:**

- 📱 **React Native App** - iOS & Android mobile applications
- 🔔 **Push Notifications** - Firebase Cloud Messaging integration
- 📍 **Location Services** - Geolocation cho delivery tracking
- 💳 **Mobile Payments** - Apple Pay & Google Pay integration
- 📷 **Camera Integration** - Product scanning & AR preview

## 🌍 Internationalization (i18n)

**Supported Languages:**

- 🇻🇳 **Tiếng Việt** (Primary)
- 🇺🇸 **English** (Secondary)
- 🇨🇳 **中文** (Planned)

**Implementation:**

- React-i18next cho frontend translations
- Database multilingual content support
- RTL language support ready

## 📝 License & Legal

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Open Source Libraries:**

- Frontend: React, Vite, Tailwind CSS, Socket.IO Client
- Backend: Express.js, MySQL2, Kafkajs, Socket.IO Server
- Infrastructure: Apache Kafka, Redis, Docker

## 👥 Contributors & Maintainers

**Core Team:**

- **[dak-1306](https://github.com/dak-1306)** - _Project Lead & Full-stack Developer_
- **Contributors Welcome!** - See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines

**Getting Involved:**

1. 🍴 Fork the repository
2. 🌟 Star the project if you find it useful
3. 🐛 Report issues or suggest features
4. 💻 Submit pull requests with improvements
5. 📢 Share with the community

## 🙏 Acknowledgments & Credits

**Technology Stack:**

- ⚛️ **React Team** - For the amazing frontend framework
- ⚡ **Vite Team** - For lightning-fast build tooling
- 📡 **Apache Kafka** - For robust event streaming
- 🚀 **Express.js** - For reliable backend framework
- 🎨 **Tailwind CSS** - For utility-first CSS framework
- 💬 **Socket.IO** - For real-time communication
- 🗄️ **MySQL** - For reliable database management

**Special Thanks:**

- 🎨 **Font Awesome** - For beautiful icon library
- 🌐 **Open Source Community** - For inspiration and tools
- 👥 **Beta Testers** - For valuable feedback and bug reports
- 📚 **Documentation Contributors** - For helping improve guides

---

<div align="center">
  <h3>🛍️ PycShop - Modern E-commerce Platform</h3>
  <p>Built with ❤️ for scalable, real-time shopping experiences</p>
  <p>
    <a href="https://github.com/dak-1306/pycshop">🌟 Star on GitHub</a> •
    <a href="#-quick-start">🚀 Quick Start</a> •
    <a href="#-real-time-system">💬 Real-time Features</a> •
    <a href="./CONTRIBUTING.md">🤝 Contributing</a>
  </p>
  
  <p>
    <img src="https://img.shields.io/badge/Made%20with-React-61DAFB?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Powered%20by-Kafka-000?style=for-the-badge&logo=apachekafka" alt="Kafka" />
    <img src="https://img.shields.io/badge/Real--time-WebSocket-00D2B8?style=for-the-badge&logo=socketdotio" alt="WebSocket" />
  </p>
</div>

## 🐛 Troubleshooting & FAQ

### 🚨 Common Issues

**Kafka không khởi động được:**

```bash
# Solution 1: Clean và restart
npm run kafka:stop
docker system prune -f
npm run kafka:start

# Solution 2: Check ports
netstat -tulpn | grep :9092
netstat -tulpn | grep :2181
```

**WebSocket connection failed:**

```bash
# Check WebSocket server
curl -I http://localhost:5008
# Verify JWT token trong browser DevTools
# Check CORS settings trong notification service
```

**Database connection errors:**

```bash
# Verify MySQL service
sudo systemctl status mysql
# Test connection
mysql -u root -p -e "USE pycshop; SHOW TABLES;"
```

**Frontend build issues:**

```bash
# Clear cache và reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 🔄 Development Workflow

**Recommended Development Flow:**

1. **Start Infrastructure**: `npm run kafka:start`
2. **Wait for Kafka**: Wait 15 seconds for full startup
3. **Start Backend**: `npm run backend-realtime`
4. **Start Frontend**: `npm run dev` (in separate terminal)
5. **Open Kafka UI**: `npm run kafka:ui` (for monitoring)

**Testing Real-time Features:**

1. Login as seller và buyer (different browsers)
2. Place order từ buyer account
3. Check real-time notification trên seller dashboard
4. Update order status từ seller
5. Verify buyer receives notification instantly

### 🚀 Performance Optimization

**Frontend Optimization:**

- ✅ **Code Splitting**: React.lazy() cho route-based splitting
- ✅ **Image Optimization**: WebP format với fallback
- ✅ **Bundle Analysis**: `npm run build:analyze`
- ✅ **Service Workers**: Caching strategies cho offline support
- ✅ **CDN Integration**: Static assets từ CDN

**Backend Optimization:**

- ✅ **Database Indexing**: Optimized queries với proper indexes
- ✅ **Redis Caching**: Session storage và query result caching
- ✅ **Connection Pooling**: MySQL connection pools
- ✅ **Rate Limiting**: API rate limiting với Redis
- ✅ **Load Balancing**: Nginx reverse proxy cho production

**Kafka Optimization:**

```bash
# Monitor Kafka performance
docker exec pycshop-kafka kafka-run-class.sh kafka.tools.ConsumerPerformance \
  --bootstrap-server localhost:9092 \
  --topic order-events \
  --messages 1000

# Optimize Kafka settings cho development
# - batch.size: 16384
# - linger.ms: 5
# - compression.type: lz4
```

## 🧪 Testing Strategy
