# 📊 Dashboard Seller - PycShop

## 🎯 Tổng quan

Dashboard của seller được thiết kế theo giao diện hiện đại với TailwindCSS, bao gồm:

- ✅ Header với logo và tên shop
- ✅ Sidebar navigation
- ✅ Stats cards (Đơn hàng, Doanh thu, Sản phẩm, Khách hàng mới)
- ✅ Biểu đồ placeholder
- ✅ Bảng đơn hàng gần đây
- ✅ Responsive design

## 🚀 Cách chạy Dashboard

### Option 1: Chạy Dashboard standalone

```bash
# Thay đổi entry point
cp src/main-seller.jsx src/main.jsx
npm run dev
```

### Option 2: Tích hợp vào App chính

```jsx
import Dashboard from "./pages/seller/Dashboard";

// Sử dụng trong routing
<Route path="/seller/dashboard" element={<Dashboard />} />;
```

## 🎨 Cấu trúc Component

### 1. SellerLayout.jsx

- 📍 `src/components/layout/SellerLayout.jsx`
- 🎯 Layout chung cho tất cả trang seller
- 🔧 Props: `children`, `title`
- 📱 Responsive sidebar với menu items

### 2. Dashboard.jsx

- 📍 `src/pages/seller/Dashboard.jsx`
- 🎯 Trang dashboard chính của seller
- 📊 Hiển thị thống kê và dữ liệu quan trọng

## 📋 Features đã implement

### Stats Cards

```jsx
// 4 cards chính
- Đơn hàng (Orders) - Orange theme
- Doanh thu hôm nay (Revenue) - Green theme
- Sản phẩm đang bán (Products) - Blue theme
- Khách hàng mới (New Customers) - Purple theme
```

### Navigation Menu

```jsx
- Dashboard (active)
- Đơn hàng (Orders)
- Sản phẩm (Products)
- Thống kê (Analytics)
- Khách hàng (Customers)
- Cài đặt (Settings)
```

### Data Display

```jsx
// Bảng đơn hàng với:
- Mã đơn hàng
- Khách hàng
- Sản phẩm
- Trạng thái (có màu sắc)
- Ngày đặt
```

## 🎨 Design System

### Colors

```css
Header: bg-green-700 (giống thiết kế)
Cards: bg-orange-50, bg-green-50, bg-blue-50, bg-purple-50
Text: text-gray-900, text-gray-600, text-gray-500
```

### Layout

```css
Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 (responsive)
Spacing: p-8, gap-6, mb-8
Rounded: rounded-xl, rounded-lg
Shadow: shadow-sm, shadow-lg
```

### Icons

```jsx
// Sử dụng Heroicons
- Orders: Shopping bag icon
- Revenue: Dollar icon
- Products: Home icon
- Customers: Users icon
```

## 📊 Dữ liệu mẫu

### Stats

```javascript
{
  orders: 1254,        // Đơn hàng
  revenue: 12450000,   // Doanh thu (VNĐ)
  products: 320,       // Sản phẩm
  newCustomers: 45     // Khách hàng mới
}
```

### Orders Data

```javascript
[
  {
    id: "#DH001",
    customer: "Nguyễn Văn A",
    product: "iPhone 15 Pro",
    status: "Đang giao",
    date: "28/09/2024",
  },
  // ... more orders
];
```

## 🔧 Customization

### Thay đổi màu sắc

```jsx
// Trong tailwind.config.js
theme: {
  extend: {
    colors: {
      'shop-primary': '#15803d',  // Green
      'shop-secondary': '#ea580c', // Orange
    }
  }
}
```

### Thêm menu item mới

```jsx
// Trong SellerLayout.jsx
const menuItems = [
  // ... existing items
  {
    id: "reports",
    name: "Báo cáo",
    icon: "reports",
    href: "/seller/reports",
  },
];
```

### Thêm stat card mới

```jsx
// Trong Dashboard.jsx
<div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-indigo-600 text-sm font-medium mb-1">Doanh số tháng</p>
      <p className="text-3xl font-bold text-indigo-700">{monthlyRevenue}</p>
      <p className="text-indigo-500 text-xs">₫</p>
    </div>
    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
      {/* Icon here */}
    </div>
  </div>
</div>
```

## 🎯 Next Steps

### 1. Thêm chức năng thực tế

- [ ] Kết nối API thật
- [ ] Charts thực tế (Chart.js, Recharts)
- [ ] Pagination cho bảng
- [ ] Filters và search

### 2. Tối ưu UX

- [ ] Loading states
- [ ] Error handling
- [ ] Toast notifications
- [ ] Skeleton loading

### 3. Thêm trang khác

- [ ] Orders management
- [ ] Products management
- [ ] Analytics page
- [ ] Settings page

## 📱 Responsive Design

```css
// Breakpoints
sm: 640px   - Mobile
md: 768px   - Tablet
lg: 1024px  - Laptop
xl: 1280px  - Desktop
2xl: 1536px - Large Desktop
```

## 🛠️ Dependencies

```json
{
  "react": "^19.1.1",
  "tailwindcss": "^3.2.7",
  "react-router-dom": "^6.8.1"
}
```

Dashboard đã được thiết kế theo đúng mockup với giao diện chuyên nghiệp và responsive! 🎉
