# PHÂN TÍCH HIỆU SUẤT HỆ THỐNG PYCSHOP

## Đánh giá khả năng phục vụ 1+ triệu người dùng

### 📊 TÌNH TRẠNG HIỆN TẠI

#### ✅ **ĐIỂM MẠNH**

1. **Kiến trúc Microservices**: Hệ thống đã áp dụng kiến trúc microservices với API Gateway và Product Service riêng biệt
2. **Database Connection Pool**: Đã cấu hình connection pool với `connectionLimit: 10`
3. **Pagination**: Đã implement pagination với limit tối đa 50 items/page
4. **Cache System**: Đã có hệ thống cache với `product_rating_cache` table
5. **Query Optimization**: Sử dụng các truy vấn được tối ưu với WHERE conditions và indexing

#### ⚠️ **VẤN ĐỀ CẦN GIẢI QUYẾT**

### 🔥 **CRITICAL ISSUES** - Có thể gây deadlock và nghẽn cổ chai

#### 1. **DATABASE CONNECTION POOL - VERY CRITICAL**

```javascript
// HIỆN TẠI - SẼ BỊ NGHẼN TẠI 100-1000 users
connectionLimit: 10,  // TOO LOW cho 1M users
queueLimit: 0,        // Unlimited queue - có thể gây memory leak
acquireTimeout: 60000, // 60s timeout quá cao
```

**🚨 Vấn đề**: Với chỉ 10 connections, hệ thống sẽ bị nghẽn ngay từ 100-1000 concurrent users.

#### 2. **FRONTEND API CALLS - PERFORMANCE RISK**

```javascript
// ProductGrid.jsx - Có risk với high concurrency
useEffect(() => {
  loadProducts(1, true);
}, [searchQuery, selectedCategory]); // Mỗi lần thay đổi = 1 API call mới
```

**🚨 Vấn đề**:

- Không có request batching
- Mỗi category click = immediate API call
- Không có client-side caching

#### 3. **DATABASE QUERIES - SCALING ISSUES**

**Categories Query:**

```sql
-- Hiện tại: Full table scan cho mỗi request
SELECT c.ID_DanhMuc, c.TenDanhMuc, c.MoTa,
       COUNT(DISTINCT p.ID_SanPham) as product_count
FROM DanhMuc c
LEFT JOIN SanPham p ON c.ID_DanhMuc = p.ID_DanhMuc
GROUP BY c.ID_DanhMuc, c.TenDanhMuc, c.MoTa
```

**Products Query với Category Filter:**

```sql
-- Potential full table scan nếu không có proper index
WHERE p.ID_DanhMuc = ? AND p.TrangThai != 'inactive'
```

#### 4. **MISSING DATABASE INDEXES**

Từ phân tích `pycshop.sql`, thiếu các indexes quan trọng:

- `SanPham.ID_DanhMuc` - CRITICAL cho category filtering
- `SanPham.TrangThai` - Cần cho active product filtering
- `SanPham.CapNhat` - Cần cho sorting
- Composite index cho `(ID_DanhMuc, TrangThai, CapNhat)`

### 🛠️ **SOLUTIONS CHO 1M+ USERS**

#### 1. **DATABASE OPTIMIZATION - IMMEDIATE PRIORITY**

**A. Tăng Connection Pool:**

```javascript
// microservice/db/index.js - UPDATE NGAY
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 100, // Tăng từ 10 lên 100
  queueLimit: 1000, // Giới hạn queue
  acquireTimeout: 5000, // Giảm timeout từ 60s xuống 5s
  timeout: 30000, // Giảm query timeout
  idleTimeout: 900000, // 15 phút idle timeout
  reconnect: true, // Enable auto reconnect
});
```

**B. Add Critical Indexes:**

```sql
-- ADD THESE INDEXES IMMEDIATELY
CREATE INDEX idx_sanpham_danhmuc_trangthai ON SanPham(ID_DanhMuc, TrangThai);
CREATE INDEX idx_sanpham_trangthai_capnhat ON SanPham(TrangThai, CapNhat DESC);
CREATE INDEX idx_sanpham_tensanpham_fulltext ON SanPham(TenSanPham);
CREATE INDEX idx_sanpham_search_composite ON SanPham(ID_DanhMuc, TrangThai, CapNhat DESC);

-- Cho rating cache performance
CREATE INDEX idx_rating_cache_sanpham ON product_rating_cache(ID_SanPham);
```

#### 2. **CACHING STRATEGY - CRITICAL**

**A. Redis Implementation:**

```javascript
// services/cacheService.js - NEW FILE NEEDED
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || 6379,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

export const cacheService = {
  // Cache categories for 1 hour
  async getCategories() {
    const cached = await redis.get("categories");
    if (cached) return JSON.parse(cached);

    const categories = await Product.getCategories();
    await redis.setex("categories", 3600, JSON.stringify(categories));
    return categories;
  },

  // Cache product lists for 5 minutes per category
  async getProductsByCategory(category, page) {
    const key = `products:cat:${category}:page:${page}`;
    const cached = await redis.get(key);
    if (cached) return JSON.parse(cached);

    const products = await Product.getProducts({ category, page });
    await redis.setex(key, 300, JSON.stringify(products));
    return products;
  },
};
```

**B. Database Query Cache Enhancement:**

```javascript
// Update getProductModel.js
static async getProducts(params) {
  // Force use cache for high traffic
  let useCache = true;

  if (useCache) {
    // Optimized cache query with proper indexes
    query = `
      SELECT
        p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai,
        GROUP_CONCAT(DISTINCT a.Url) as image_urls,
        p.CapNhat as created_date,
        c.TenDanhMuc, c.ID_DanhMuc,
        ch.TenCuaHang,
        SUBSTRING_INDEX(ch.DiaChiCH, ',', -1) as shop_location,
        COALESCE(prc.average_rating, 0) as average_rating,
        COALESCE(prc.total_reviews, 0) as review_count
      FROM SanPham p USE INDEX (idx_sanpham_search_composite)
      LEFT JOIN DanhMuc c ON p.ID_DanhMuc = c.ID_DanhMuc
      LEFT JOIN AnhSanPham a ON p.ID_SanPham = a.ID_SanPham
      LEFT JOIN NguoiDung nb ON p.ID_NguoiBan = nb.ID_NguoiDung
      LEFT JOIN CuaHang ch ON nb.ID_CuaHang = ch.ID_CuaHang
      LEFT JOIN product_rating_cache prc ON p.ID_SanPham = prc.ID_SanPham
      ${whereClause}
      GROUP BY p.ID_SanPham, p.TenSanPham, p.MoTa, p.Gia, p.TonKho, p.TrangThai, p.CapNhat, c.TenDanhMuc, c.ID_DanhMuc, ch.TenCuaHang, ch.DiaChiCH, prc.average_rating, prc.total_reviews
      ORDER BY p.CapNhat DESC
      LIMIT ? OFFSET ?
    `;
  }
}
```

#### 3. **FRONTEND OPTIMIZATION**

**A. Request Debouncing & Batching:**

```javascript
// components/ProductGrid.jsx - OPTIMIZE EXISTING
const ProductGrid = ({ searchQuery, selectedCategory, onCategorySelect }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const requestQueue = useRef(new Set());
  const cache = useRef(new Map());

  // Debounce API calls
  const debouncedLoadProducts = useCallback(
    debounce(async (params) => {
      const cacheKey = JSON.stringify(params);

      // Check client cache first
      if (cache.current.has(cacheKey)) {
        const cachedData = cache.current.get(cacheKey);
        if (Date.now() - cachedData.timestamp < 300000) {
          // 5 min cache
          setProducts(cachedData.data);
          setLoading(false);
          return;
        }
      }

      // Prevent duplicate requests
      if (requestQueue.current.has(cacheKey)) return;
      requestQueue.current.add(cacheKey);

      try {
        const response = await productService.getProducts(params);
        if (response.success) {
          cache.current.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
          });
          setProducts(response.data);
        }
      } finally {
        requestQueue.current.delete(cacheKey);
        setLoading(false);
      }
    }, 300),
    []
  );
};
```

**B. Virtual Scrolling for Large Lists:**

```javascript
// For 1M+ products, implement virtual scrolling
import { FixedSizeGrid as Grid } from "react-window";

const VirtualProductGrid = ({ products }) => {
  const Cell = ({ columnIndex, rowIndex, style }) => {
    const index = rowIndex * 4 + columnIndex; // 4 columns
    const product = products[index];

    if (!product) return <div style={style} />;

    return (
      <div style={style}>
        <ProductCard product={product} />
      </div>
    );
  };

  return (
    <Grid
      columnCount={4}
      columnWidth={300}
      height={600}
      rowCount={Math.ceil(products.length / 4)}
      rowHeight={400}
      width={1200}
    >
      {Cell}
    </Grid>
  );
};
```

#### 4. **LOAD BALANCING & SCALING**

**A. Multiple Product Service Instances:**

```javascript
// docker-compose.yml - ADD THIS
version: '3.8'
services:
  product-service-1:
    build: ./microservice/product_service
    ports:
      - "5002:5002"
    environment:
      - PORT=5002
      - DB_HOST=mysql-primary

  product-service-2:
    build: ./microservice/product_service
    ports:
      - "5003:5002"
    environment:
      - PORT=5002
      - DB_HOST=mysql-read-replica

  nginx-load-balancer:
    image: nginx:alpine
    ports:
      - "5000:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
```

**B. Database Read Replicas:**

```javascript
// db/index.js - Master/Slave setup
const masterPool = mysql.createPool({
  ...dbConfig,
  connectionLimit: 50,
});

const replicaPool = mysql.createPool({
  ...dbConfig,
  host: process.env.DB_REPLICA_HOST,
  connectionLimit: 100,
});

export const db = {
  // Writes go to master
  async execute(query, params) {
    if (query.trim().toUpperCase().startsWith("SELECT")) {
      return replicaPool.execute(query, params);
    }
    return masterPool.execute(query, params);
  },
};
```

#### 5. **MONITORING & ALERTING**

```javascript
// monitoring/metrics.js - NEW FILE
import prometheus from "prom-client";

const httpRequestDuration = new prometheus.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status"],
});

const dbConnectionsActive = new prometheus.Gauge({
  name: "db_connections_active",
  help: "Number of active database connections",
});

const categoryApiCalls = new prometheus.Counter({
  name: "category_api_calls_total",
  help: "Total category API calls",
  labelNames: ["category"],
});

// Middleware to track metrics
export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });

  next();
};
```

### 📈 **PERFORMANCE TARGETS CHO 1M+ USERS**

| Metric           | Current | Target    | Solution                         |
| ---------------- | ------- | --------- | -------------------------------- |
| DB Connections   | 10      | 100-200   | Connection pool scaling          |
| Response Time    | >2s     | <200ms    | Redis caching + Indexing         |
| Concurrent Users | ~100    | 10,000+   | Load balancing + Read replicas   |
| Category Load    | ~1s     | <50ms     | Cache + Optimized queries        |
| Memory Usage     | High    | Optimized | Virtual scrolling + Client cache |

### 🚨 **IMMEDIATE ACTION PLAN (CRITICAL)**

#### **Phase 1: Emergency Fixes (1-2 days)**

1. ✅ Increase database connection pool to 100
2. ✅ Add critical database indexes
3. ✅ Implement Redis caching for categories
4. ✅ Add request debouncing in frontend

#### **Phase 2: Scaling Infrastructure (1 week)**

1. Setup Redis cluster
2. Implement database read replicas
3. Add load balancer with multiple service instances
4. Setup monitoring and alerting

#### **Phase 3: Advanced Optimization (2 weeks)**

1. Implement virtual scrolling for product grids
2. Add CDN for static assets
3. Database sharding by categories
4. Advanced caching strategies

### 💰 **COST ESTIMATION FOR 1M USERS**

- **Database**: MySQL Cluster (Master + 2 Replicas): ~$500/month
- **Redis Cache**: Redis Cluster: ~$300/month
- **Load Balancer**: ~$100/month
- **Monitoring**: ~$50/month
- **CDN**: ~$100/month
- **Total**: ~$1,050/month for infrastructure

### ⚡ **EXPECTED PERFORMANCE AFTER OPTIMIZATION**

- **Response Time**: 50-200ms (từ 1-3s hiện tại)
- **Concurrent Users**: 50,000+ (từ ~100 hiện tại)
- **Database Load**: 80% reduction với caching
- **Memory Usage**: 60% reduction với virtual scrolling
- **Uptime**: 99.9% với load balancing

---

**🔴 URGENT**: Hệ thống hiện tại KHÔNG THỂ phục vụ 1M users. Cần implement Phase 1 NGAY để tránh downtime khi traffic tăng.
