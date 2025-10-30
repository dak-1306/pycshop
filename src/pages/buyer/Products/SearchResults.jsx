import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import ProductCard from "../../../components/buyers/ProductCard";
import { productService } from "../../../lib/services/productService.js";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
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
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (keyword) {
      searchProducts(keyword);
    }
  }, [keyword]);

  const searchProducts = async (searchKeyword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.searchProducts({
        q: searchKeyword,
        page: 1,
        limit: 50,
      });

      if (!response.success) {
        throw new Error(response.message || "Search failed");
      }

      // Transform API data
      const transformedProducts = response.data.map((product) => ({
        id: product.ID_SanPham || product.id,
        name: product.TenSanPham || product.name,
        price: parseFloat(product.Gia || product.price),
        discount: 15,
        originalPrice: product.Gia / (1 - 15 / 100),
        image: product.image_urls
          ? `http://localhost:5002${product.image_urls.split(",")[0]}`
          : "https://via.placeholder.com/200x200/ff6b35/ffffff?text=PycShop",
        rating: parseFloat(product.average_rating) || 0,
        reviews: parseInt(product.review_count) || 0,
        sold: parseInt(product.review_count) || 0,
        category: product.ID_DanhMuc || "other",
        categoryName: product.TenDanhMuc || "Khác",
        brand: "PycShop",
        location: product.shop_location || "TP.HCM",
        stock: parseInt(product.TonKho) || 0,
      }));

      setProducts(transformedProducts);
    } catch (error) {
      console.error("❌ [SEARCH] Error:", error);
      setError(error.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Lọc theo giá
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-");
      const minPrice = parseFloat(min) || 0;
      const maxPrice = parseFloat(max) || Infinity;
      filtered = filtered.filter((product) => {
        const productPrice = parseFloat(product.price) || 0;
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    } else if (filters.customPriceMin || filters.customPriceMax) {
      const minPrice = parseFloat(filters.customPriceMin) || 0;
      const maxPrice = parseFloat(filters.customPriceMax) || Infinity;
      filtered = filtered.filter((product) => {
        const productPrice = parseFloat(product.price) || 0;
        return productPrice >= minPrice && productPrice <= maxPrice;
      });
    }

    // Lọc theo đánh giá
    if (filters.rating) {
      const ratingValue = parseFloat(filters.rating);
      filtered = filtered.filter((product) => product.rating >= ratingValue);
    }

    // Lọc theo location
    if (filters.location) {
      filtered = filtered.filter(
        (product) =>
          product.location && product.location.includes(filters.location)
      );
    }

    // Sắp xếp
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        filtered.sort((a, b) => b.sold - a.sold);
        break;
      default:
        // newest - giữ nguyên thứ tự
        break;
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  useEffect(() => {
    applyFilters();
  }, [products, filters, applyFilters]);

  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const clearFilters = () => {
    setFilters({
      priceRange: "",
      customPriceMin: "",
      customPriceMax: "",
      sortBy: "newest",
      rating: "",
      location: "",
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="sr-container">
      <Header />

      <div className="sr-content">
        <div className="sr-header">
          <div className="sr-breadcrumb">
            <span>Kết quả tìm kiếm cho</span>
            <strong>"{keyword}"</strong>
            {!loading && <span>({filteredProducts.length} sản phẩm)</span>}
          </div>

          <button className="sr-filter-toggle" onClick={toggleSidebar}>
            <i
              className={`fas ${sidebarVisible ? "fa-times" : "fa-filter"}`}
            ></i>
            {sidebarVisible ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </button>
        </div>

        {loading ? (
          <div className="sr-loading">
            <div className="loading-spinner"></div>
            <p>Đang tìm kiếm...</p>
          </div>
        ) : error ? (
          <div className="sr-error">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button onClick={() => searchProducts(keyword)}>Thử lại</button>
          </div>
        ) : (
          <div className={`sr-main ${!sidebarVisible ? "sidebar-hidden" : ""}`}>
            {/* Sidebar Filters - Dựa trên CategoryProducts */}
            <div
              className={`sr-sidebar ${sidebarVisible ? "visible" : "hidden"}`}
            >
              <div className="filters-header">
                <h3>Bộ lọc tìm kiếm</h3>
                <button onClick={clearFilters} className="clear-all-btn">
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
                      customPriceMax: "",
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
                        onChange={(e) =>
                          handleFilterChange({ customPriceMin: e.target.value })
                        }
                        className="price-input"
                        min="0"
                      />
                      <span className="price-separator">-</span>
                      <input
                        type="number"
                        placeholder="Đến"
                        value={filters.customPriceMax}
                        onChange={(e) =>
                          handleFilterChange({ customPriceMax: e.target.value })
                        }
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
                    className={`rating-option ${
                      filters.rating === "" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange({ rating: "" })}
                  >
                    Tất cả
                  </div>
                  <div
                    className={`rating-option ${
                      filters.rating === "5" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange({ rating: "5" })}
                  >
                    <span className="stars-display">★★★★★</span>
                  </div>
                  <div
                    className={`rating-option ${
                      filters.rating === "4" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange({ rating: "4" })}
                  >
                    <span className="stars-display">★★★★☆</span>
                    <span className="rating-text">trở lên</span>
                  </div>
                  <div
                    className={`rating-option ${
                      filters.rating === "3" ? "active" : ""
                    }`}
                    onClick={() => handleFilterChange({ rating: "3" })}
                  >
                    <span className="stars-display">★★★☆☆</span>
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
            </div>

            {/* Main Content */}
            <div className="sr-main-content">
              {/* Products Grid */}
              <div className="sr-products-grid">
                {filteredProducts.length === 0 ? (
                  <div className="sr-no-results">
                    <i className="fas fa-search"></i>
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>
                      Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                    </p>
                  </div>
                ) : (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onClick={handleProductClick}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
