import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import ProductCard from "../../../components/buyers/ProductCard";
import { productService } from "../../../lib/services/productService";
import "./CategoryProducts.css";

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceRange: "",
    customPriceMin: "",
    customPriceMax: "",
    sortBy: "newest",
    rating: "",
    location: "",
  });

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

  useEffect(() => {
    if (categoryId) {
      loadCategoryData();
      loadCategoryProducts();
    }
  }, [categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (categoryId) {
      loadCategoryProducts();
    }
  }, [filters, categoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadCategoryData = async () => {
    try {
      const response = await productService.getCategories();
      if (response.success) {
        const foundCategory = response.data.find(
          (cat) => cat.ID_DanhMuc === parseInt(categoryId)
        );
        if (foundCategory) {
          setCategory({
            ...foundCategory,
            icon: categoryIcons[foundCategory.TenDanhMuc] || "📦",
          });
        }
      }
    } catch (err) {
      console.error("Error loading category data:", err);
    }
  };

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build filter parameters
      const filterParams = {
        ...filters,
      };

      // Handle price range - predefined or custom
      if (filters.priceRange) {
        const [min, max] = filters.priceRange.split('-');
        filterParams.minPrice = min;
        filterParams.maxPrice = max;
        delete filterParams.priceRange;
      } else if (filters.customPriceMin || filters.customPriceMax) {
        if (filters.customPriceMin) filterParams.minPrice = filters.customPriceMin;
        if (filters.customPriceMax) filterParams.maxPrice = filters.customPriceMax;
      }

      // Clean up custom price fields from params
      delete filterParams.customPriceMin;
      delete filterParams.customPriceMax;

      // Handle rating filter
      if (filters.rating) {
        filterParams.minRating = filters.rating;
      }

      // Handle location filter  
      if (filters.location) {
        filterParams.location = filters.location;
      }

      const response = await productService.getProductsByCategory(
        categoryId,
        filterParams
      );

      if (response.success) {
        // Transform the data to match ProductCard expected format
        const transformedProducts = response.data.map((product) => ({
          id: product.ID_SanPham || product.id,
          name: product.TenSanPham || product.name,
          price: parseFloat(product.Gia || product.price || 0),
          image: product.image_urls
            ? `../../../microservice/product_service${product.image_urls
                .split(",")[0]
                .trim()}`
            : product.HinhAnh || product.image || "",
          rating: parseFloat(product.average_rating || product.DiemDanhGia || product.rating || 0),
          sold: parseInt(product.review_count || product.SoLuongDanhGia || product.sold || 0),
          location: product.shop_location || product.DiaChi || product.location || "TP.HCM",
          category: product.TenDanhMuc || product.category,
          stock: parseInt(product.TonKho || product.stock || 0),
          discount: parseFloat(product.PhanTramGiam || product.discount || 0),
          originalPrice: product.PhanTramGiam > 0 ? parseFloat(product.Gia || product.price || 0) : null,
        }));
        
        setProducts(transformedProducts);
      } else {
        throw new Error(response.message || "Không thể tải sản phẩm");
      }
    } catch (err) {
      console.error("Error loading category products:", err);
      setError("Không thể tải sản phẩm của danh mục này");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (!categoryId) {
    return (
      <div className="category-products-page">
        <Header />
        <div className="error-page">
          <h2>Danh mục không hợp lệ</h2>
          <button onClick={() => navigate("/")} className="back-home-btn">
            Về trang chủ
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="category-products-page">
      <Header />
      
      {/* Breadcrumb */}
      <div className="breadcrumb-section">
        <div className="container">
          <nav className="breadcrumb">
            <span onClick={() => navigate("/")} className="breadcrumb-link">
              Trang chủ
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {category?.TenDanhMuc || "Danh mục"}
            </span>
          </nav>
        </div>
      </div>

      {/* Category Header - Simplified */}
      <div className="category-header-simple">
        <div className="container">
          <h1 className="category-title">
            {category?.TenDanhMuc || "Danh mục"}
          </h1>
          <span className="product-count">{products.length} sản phẩm</span>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div className="main-content">
        <div className="container">
          <div className="content-layout">
            {/* Sidebar Filters */}
            <aside className="filters-sidebar">
              <div className="filters-header">
                <h3>Bộ lọc tìm kiếm</h3>
                <button 
                  onClick={() => setFilters({
                    priceRange: "",
                    customPriceMin: "",
                    customPriceMax: "",
                    sortBy: "newest",
                    rating: "",
                    location: "",
                  })}
                  className="clear-all-btn"
                >
                  🗑️ Xóa tất cả
                </button>
              </div>

              {/* Sort Filter */}
              <div className="filter-section">
                <label className="filter-label">Sắp xếp theo</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange({ sortBy: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Bán chạy</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <label className="filter-label">Khoảng giá</label>
                <select
                  value={filters.priceRange}
                  onChange={(e) => {
                    handleFilterChange({ 
                      priceRange: e.target.value,
                      customPriceMin: "", 
                      customPriceMax: "" 
                    });
                  }}
                  className="filter-select"
                >
                  <option value="">Tất cả</option>
                  <option value="0-100000">Dưới 100k</option>
                  <option value="100000-200000">100k - 200k</option>
                  <option value="200000-500000">200k - 500k</option>
                  <option value="500000-1000000">500k - 1tr</option>
                  <option value="1000000-2000000">1tr - 2tr</option>
                  <option value="2000000-5000000">2tr - 5tr</option>
                  <option value="5000000-10000000">5tr - 10tr</option>
                  <option value="10000000-999999999">Trên 10tr</option>
                  <option value="custom">Tự chọn</option>
                </select>

                {/* Custom Price Range */}
                {filters.priceRange === "custom" && (
                  <div className="custom-price-section">
                    <div className="custom-price-range">
                      <input
                        type="number"
                        placeholder="Từ"
                        value={filters.customPriceMin}
                        onChange={(e) => handleFilterChange({ customPriceMin: e.target.value })}
                        className="price-input"
                        min="0"
                      />
                      <span className="price-separator">-</span>
                      <input
                        type="number"
                        placeholder="Đến"
                        value={filters.customPriceMax}
                        onChange={(e) => handleFilterChange({ customPriceMax: e.target.value })}
                        className="price-input"
                        min="0"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Rating Filter */}
              <div className="filter-section">
                <label className="filter-label">Đánh giá</label>
                <div className="rating-filter">
                  <div 
                    key="rating-all"
                    className={`rating-option ${filters.rating === "" ? "active" : ""}`}
                    onClick={() => handleFilterChange({ rating: "" })}
                  >
                    Tất cả
                  </div>
                  <div 
                    key="rating-5"
                    className={`rating-option ${filters.rating === "5" ? "active" : ""}`}
                    onClick={() => handleFilterChange({ rating: "5" })}
                  >
                    <span className="stars-display">★★★★★</span>
                  </div>
                  <div 
                    key="rating-4"
                    className={`rating-option ${filters.rating === "4" ? "active" : ""}`}
                    onClick={() => handleFilterChange({ rating: "4" })}
                  >
                    <span className="stars-display">★★★★☆</span>
                    <span className="rating-text">trở lên</span>
                  </div>
                  <div 
                    key="rating-3"
                    className={`rating-option ${filters.rating === "3" ? "active" : ""}`}
                    onClick={() => handleFilterChange({ rating: "3" })}
                  >
                    <span className="stars-display">★★★☆☆</span>
                    <span className="rating-text">trở lên</span>
                  </div>
                  <div 
                    key="rating-2"
                    className={`rating-option ${filters.rating === "2" ? "active" : ""}`}
                    onClick={() => handleFilterChange({ rating: "2" })}
                  >
                    <span className="stars-display">★★☆☆☆</span>
                    <span className="rating-text">trở lên</span>
                  </div>
                  <div 
                    key="rating-1"
                    className={`rating-option ${filters.rating === "1" ? "active" : ""}`}
                    onClick={() => handleFilterChange({ rating: "1" })}
                  >
                    <span className="stars-display">★☆☆☆☆</span>
                    <span className="rating-text">trở lên</span>
                  </div>
                </div>
              </div>

              {/* Location Filter */}
              <div className="filter-section">
                <label className="filter-label">Nơi bán</label>
                <select
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange({ location: e.target.value })
                  }
                  className="filter-select"
                >
                  <option value="">Tất cả</option>
                  <option value="TP.HCM">🏙️ TP.HCM</option>
                  <option value="Hà Nội">🏛️ Hà Nội</option>
                  <option value="Đà Nẵng">🏖️ Đà Nẵng</option>
                  <option value="Cần Thơ">🌾 Cần Thơ</option>
                  <option value="Hải Phòng">⚓ Hải Phòng</option>
                  <option value="Khác">📍 Khác</option>
                </select>
              </div>
            </aside>

            {/* Main Products Section */}
            <main className="products-main">
              {loading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Đang tải sản phẩm...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <h3>Có lỗi xảy ra</h3>
                  <p>{error}</p>
                  <button className="retry-btn" onClick={loadCategoryProducts}>
                    Thử lại
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="no-products">
                  <h3>Không có sản phẩm</h3>
                  <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn</p>
                </div>
              ) : (
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryProducts;