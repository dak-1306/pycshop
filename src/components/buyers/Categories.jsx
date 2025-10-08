import React, { useState, useEffect } from "react";
import "./Categories.css";
import { productService } from "../../services/productService";

const Categories = ({ selectedCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category icons mapping
  const categoryIcons = {
    "Thời Trang Nam": "👔",
    "Thời Trang Nữ": "👗",
    "Điện Thoại & Phụ Kiện": "📱",
    "Máy Tính & Laptop": "💻",
    "Máy Ảnh & Máy Quay Phim": "📷",
    "Đồng Hồ": "⌚",
    "Giày Dép Nam": "👞",
    "Giày Dép Nữ": "👠",
    "Túi Ví Nam": "🎒",
    "Túi Ví Nữ": "👜",
    "Thiết Bị Điện Tử": "🔌",
    "Ô Tô & Xe Máy & Xe Đạp": "🚗",
    "Nhà Cửa & Đời Sống": "🏠",
    "Sắc Đẹp": "💄",
    "Sức Khỏe": "🏥",
    "Giải Trí & Sở Thích": "🎮",
    "Mẹ & Bé": "👶",
    "Nhà Sách Online": "📚",
    "Bách Hóa Online": "🛒",
  };

  // Load categories from API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getCategories();

      if (response.success) {
        const transformedCategories = response.data.map((category) => ({
          ID_DanhMuc: category.ID_DanhMuc,
          TenDanhMuc: category.TenDanhMuc,
          icon: categoryIcons[category.TenDanhMuc] || "📦",
        }));

        setCategories(transformedCategories);
      } else {
        throw new Error(response.message || "Failed to load categories");
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      setError("Không thể tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If clicking the same category, deselect it
      onCategorySelect(null);
    } else {
      onCategorySelect(categoryId);
    }
  };

  if (loading) {
    return (
      <div className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Danh Mục</h2>
          </div>
          <div className="categories-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải danh mục...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Danh Mục</h2>
          </div>
          <div className="categories-error">
            <p>{error}</p>
            <button onClick={loadCategories} className="retry-btn">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Danh Mục</h2>
          {selectedCategory && (
            <button
              className="clear-filter-btn"
              onClick={() => onCategorySelect(null)}
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
        <div className="categories-grid">
          {categories.map((category) => (
            <div
              key={category.ID_DanhMuc}
              className={`category-card ${
                selectedCategory === category.ID_DanhMuc ? "active" : ""
              }`}
              onClick={() => handleCategoryClick(category.ID_DanhMuc)}
            >
              <div className="category-icon">
                <span>{category.icon}</span>
              </div>
              <div className="category-info">
                <div className="category-name">{category.TenDanhMuc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
