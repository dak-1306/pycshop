# 🛍️ PyCShop - E-commerce Platform

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933.svg)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://mysql.com/)
[![Kafka](https://img.shields.io/badge/Apache%20Kafka-2.8-000?style=flat&logo=apachekafka)](https://kafka.apache.org/)

A modern, scalable e-commerce platform built with microservices architecture, featuring seller dashboards, admin management, and real-time messaging.

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

- Microservices architecture
- **Real-time notifications** with Kafka + WebSocket
- JWT authentication & authorization
- File upload handling (Multer)
- Rate limiting and security (Helmet)
- Responsive design (Tailwind CSS)
- Multi-seller order management
- Event-driven architecture

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   API Gateway   │
│     (Vite)      │◄──►│   (Express)     │
└─────────────────┘    └─────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐
            │Auth Service│ │Product│ │Admin │
            │ (Express)  │ │Service│ │Service│
            └────────────┘ └───────┘ └───────┘
                    │         │         │
            ┌───────▼───┐ ┌───▼───┐ ┌───▼───┐
            │Shop Service│ │Review │ │Kafka │
            │ (Express)  │ │Service│ │Queue │
            └────────────┘ └───────┘ └───────┘
                              │
                       ┌──────▼──────┐
                       │   MySQL DB  │
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

## 🚀 Real-time Notifications

For detailed setup and usage of the real-time notification system, see [REALTIME_SETUP.md](./REALTIME_SETUP.md).

### Quick Start Real-time

```bash
npm run start:full-realtime
```

This will start:

- ✅ Kafka + Zookeeper
- ✅ All microservices with real-time features
- ✅ WebSocket server (port 5008)
- ✅ React frontend

## 📁 Project Structure

```
pycshop/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page components
│   ├── services/                 # API service layer
│   ├── hooks/                    # Custom React hooks
│   └── constants/                # Application constants
├── microservice/                 # Backend microservices
│   ├── api_gateway/              # API Gateway service
│   ├── auth_service/             # Authentication service
│   ├── product_service/          # Product management service
│   ├── admin_service/            # Admin panel service
│   ├── shop_service/             # Seller dashboard service
│   └── danhgia_service/          # Review service
├── scripts/                      # Utility scripts
├── public/                       # Static assets
└── docker-compose-kafka.yml      # Kafka infrastructure
```

## 🛠️ Available Scripts

### Development

| Command             | Description                       |
| ------------------- | --------------------------------- |
| `npm run dev`       | Start frontend development server |
| `npm run build`     | Build for production              |
| `npm run backend`   | Start all microservices           |
| `npm run fullstack` | Start frontend + backend          |

### Real-time System

| Command                          | Description                            |
| -------------------------------- | -------------------------------------- |
| `npm run start:full-realtime`    | **🚀 Start complete real-time system** |
| `npm run backend-realtime`       | Start backend with real-time features  |
| `npm run start:backend-realtime` | Start Kafka + backend real-time        |

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

## 🔧 Configuration

Create `.env` files in each microservice directory with the following variables:

```env
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pycshop

# JWT
JWT_SECRET=your_jwt_secret

# Kafka
KAFKA_BROKERS=localhost:9092

# Services
PORT=5000
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

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **dak-1306** - _Initial work_ - [GitHub](https://github.com/dak-1306)

## 🙏 Acknowledgments

- React & Vite for the frontend framework
- Express.js for backend services
- Apache Kafka for messaging
- MySQL for database
- All contributors and open-source projects used

---

<div align="center">
  <p>Made with ❤️ for modern e-commerce</p>
</div>
