import React from "react";
import "./Categories.css";

const Categories = () => {
  const categories = [
    { id: 1, name: "Thời Trang Nam", icon: "👔" },
    { id: 2, name: "Thời Trang Nữ", icon: "👗" },
    { id: 3, name: "Điện Thoại & Phụ Kiện", icon: "📱" },
    { id: 4, name: "Máy Tính & Laptop", icon: "💻" },
    { id: 5, name: "Máy Ảnh & Máy Quay Phim", icon: "📷" },
    { id: 6, name: "Đồng Hồ", icon: "⌚" },
    { id: 7, name: "Giày Dép Nam", icon: "👞" },
    { id: 8, name: "Giày Dép Nữ", icon: "👠" },
    { id: 9, name: "Túi Ví Nam", icon: "🎒" },
    { id: 10, name: "Túi Ví Nữ", icon: "👜" },
    { id: 11, name: "Thiết Bị Điện Tử", icon: "🔌" },
    { id: 12, name: "Ô Tô & Xe Máy & Xe Đạp", icon: "🚗" },
    { id: 13, name: "Nhà Cửa & Đời Sống", icon: "🏠" },
    { id: 14, name: "Sắc Đẹp", icon: "💄" },
    { id: 15, name: "Sức Khỏe", icon: "🏥" },
    { id: 16, name: "Giải Trí & Sở Thích", icon: "🎮" },
    { id: 18, name: "Mẹ & Bé", icon: "👶" },
    { id: 19, name: "Nhà Sách Online", icon: "📚" },
    { id: 20, name: "Bách Hóa Online", icon: "🛒" },
  ];

  return (
    <div className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-titlee">Danh Mục</h2>
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category.id} className="category-item">
              <div className="category-icon">
                <span>{category.icon}</span>
              </div>
              <div className="category-name">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
