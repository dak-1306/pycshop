import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import { productService } from "../../../lib/services/productService.js";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get("keyword") || "";

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState({
    priceRange: "",
    customPriceMin: "",
    customPriceMax: "",
    sortBy: "newest",
    rating: "",
    location: "",
    selectedCategory: "all"
  });
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    if (keyword) {
      searchProducts(keyword);
      loadCategories();
    }
  }, [keyword]);

  const searchProducts = async (searchKeyword) => {
    try {
      setLoading(true);
      setError(null);

      console.log(`🔍 [SEARCH] Searching for: "${searchKeyword}"`);

      // Call backend search API using productService
      const response = await productService.searchProducts({
        q: searchKeyword,
        page: 1,
        limit: 50,
      });

      if (!response.success) {
        throw new Error(response.message || "Search failed");
      }

      console.log(`✅ [SEARCH] Found ${response.data.length} products`);

      // Transform API data
      const transformedProducts = response.data.map((product) => ({
        id: product.ID_SanPham || product.id,
        name: product.TenSanPham || product.name,
        price: parseFloat(product.Gia || product.price),
        discount: 15, // Mock discount
        originalPrice: product.Gia / (1 - 15 / 100), // Mock original price
        image: product.image_urls
          ? `http://localhost:5002${product.image_urls.split(",")[0]}`
          : "https://via.placeholder.com/200x200/ff6b35/ffffff?text=PycShop",
        rating: parseFloat(product.average_rating) || 0,
        reviews: parseInt(product.review_count) || 0,
        sold: parseInt(product.review_count) || 0,
        category: product.ID_DanhMuc || "other",
        categoryName: product.TenDanhMuc || "Khác",
        brand: "PycShop",
        freeShipping: Math.random() > 0.5, // Mock free shipping
      }));

      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
    } catch (error) {
      console.error("❌ [SEARCH] Error:", error);
      setError(error.message);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productService.getCategories();
      if (response.success && response.data) {
        const categoriesData = [
          { id: "all", name: "Tất cả", count: 0 },
          ...response.data.map((cat) => ({
            id: cat.id,
            name: cat.name,
            count: 0,
          })),
        ];
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("❌ [SEARCH] Error loading categories:", error);
    }
  };

  useEffect(() => {
    let filtered = [...products];

    // Lọc theo danh mục
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => {
        return String(product.category) === String(selectedCategory);
      });
    }

    // Lọc theo giá - chỉ áp dụng nếu người dùng đã nhập giá trị
    if (priceRange.min !== "" || priceRange.max !== "") {
      const parsePrice = (value) => {
        if (value === "" || value === null || value === undefined) return null;
        const parsed = parseFloat(value);
        return isNaN(parsed) || parsed < 0 ? null : parsed;
      };

      const minPrice = parsePrice(priceRange.min) ?? 0;
      const maxPrice = parsePrice(priceRange.max) ?? Infinity;

      // Kiểm tra logic min <= max
      if (minPrice <= maxPrice || maxPrice === Infinity) {
        filtered = filtered.filter((product) => {
          const productPrice = parseFloat(product.price) || 0;
          return productPrice >= minPrice && productPrice <= maxPrice;
        });
      }
    }

    // Lọc theo đánh giá
    if (rating > 0) {
      filtered = filtered.filter((product) => product.rating >= rating);
    }

    // Lọc theo miễn phí ship
    if (shipping === "free") {
      filtered = filtered.filter((product) => product.freeShipping);
    }

    // Sắp xếp
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "sold":
        filtered.sort((a, b) => b.sold - a.sold);
        break;
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount);
        break;
      default:
        // newest - giữ nguyên thứ tự
        break;
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange, rating, shipping, sortBy]);

  // Tối ưu useEffect cho category counts - chỉ chạy khi products thay đổi
  useEffect(() => {
    if (categories.length > 0 && products.length > 0) {
      const newCategoryCounts = {};
      newCategoryCounts["all"] = products.length;
      
      // Đếm sản phẩm cho mỗi category
      products.forEach(product => {
        const catId = String(product.category);
        newCategoryCounts[catId] = (newCategoryCounts[catId] || 0) + 1;
      });
      
      // Chỉ update nếu có thay đổi
      let hasChanges = false;
      const updatedCategories = categories.map((cat) => {
        const newCount = newCategoryCounts[cat.id] || 0;
        if (cat.count !== newCount) {
          hasChanges = true;
        }
        return { ...cat, count: newCount };
      });
      
      if (hasChanges) {
        setCategories(updatedCategories);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    // Sao đầy
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    // Sao nửa
    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    // Sao trống - sửa logic
    const totalFilledStars = fullStars + (hasHalfStar ? 1 : 0);
    const emptyStars = 5 - totalFilledStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star">
          ★
        </span>
      );
    }

    return stars;
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setRating(0);
    setShipping("all");
    setSortBy("newest");
    setPriceError("");
  };

  const validatePriceRange = (min, max) => {
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    
    if (min !== "" && max !== "" && !isNaN(minVal) && !isNaN(maxVal)) {
      if (minVal > maxVal) {
        setPriceError("Giá tối thiểu không thể lớn hơn giá tối đa");
        return false;
      }
    }
    
    if ((min !== "" && isNaN(parseFloat(min))) || (max !== "" && isNaN(parseFloat(max)))) {
      setPriceError("Vui lòng nhập số hợp lệ");
      return false;
    }
    
    setPriceError("");
    return true;
  };

  const handlePriceChange = (type, value) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    validatePriceRange(newPriceRange.min, newPriceRange.max);
  };

  const toggleSidebar = () => {
    if (sidebarVisible) {
      // Khi ẩn: animate sidebar trước, sau đó thay đổi grid
      setSidebarVisible(false);
      setTimeout(() => {
        // Grid layout sẽ thay đổi sau khi sidebar animation hoàn thành
      }, 300);
    } else {
      // Khi hiện: thay đổi grid trước, sau đó animate sidebar
      setSidebarVisible(true);
    }
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
            {/* Sidebar Filters */}
            <div
              className={`sr-sidebar ${sidebarVisible ? "visible" : "hidden"}`}
            >
              <div className="sr-filter-section">
                <h3>Bộ lọc tìm kiếm</h3>
                <button className="sr-clear-filters" onClick={clearFilters}>
                  Xóa tất cả
                </button>
              </div>

              {/* Categories */}
              <div className="sr-filter-section">
                <h4>Danh mục</h4>
                <div className="sr-category-list">
                  {categories.map((category) => (
                    <label key={category.id} className="sr-category-item">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      />
                      <span>
                        {category.name} ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="sr-filter-section">
                <h4>Khoảng giá</h4>
                <div className="sr-price-range">
                  <input
                    type="number"
                    placeholder="₫ TỪ"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange("min", e.target.value)}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="₫ ĐẾN"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange("max", e.target.value)}
                  />
                </div>
                {priceError && (
                  <div className="sr-price-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    {priceError}
                  </div>
                )}
                <div className="sr-price-shortcuts">
                  <button
                    onClick={() => {
                      setPriceRange({ min: "0", max: "100000" });
                      setPriceError("");
                    }}
                  >
                    Dưới 100k
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange({ min: "100000", max: "300000" });
                      setPriceError("");
                    }}
                  >
                    100k - 300k
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange({ min: "300000", max: "500000" });
                      setPriceError("");
                    }}
                  >
                    300k - 500k
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange({ min: "500000", max: "1000000" });
                      setPriceError("");
                    }}
                  >
                    500k - 1tr
                  </button>
                  <button
                    onClick={() => {
                      setPriceRange({ min: "1000000", max: "10000000" });
                      setPriceError("");
                    }}
                  >
                    1tr - 10tr
                  </button>
                  <button 
                    onClick={() => {
                      setPriceRange({ min: "10000000", max: "" });
                      setPriceError("");
                    }}
                  >
                    Trên 10tr
                  </button>
                  <button 
                    onClick={() => {
                      setPriceRange({ min: "", max: "" });
                      setPriceError("");
                    }}
                  >
                    Tất cả
                  </button>
                </div>
              </div>

              {/* Rating */}
              <div className="sr-filter-section">
                <h4>Đánh giá</h4>
                <div className="sr-rating-list">
                  {[5, 4, 3].map((star) => (
                    <label key={star} className="sr-rating-item">
                      <input
                        type="radio"
                        name="rating"
                        value={star}
                        checked={rating === star}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                      />
                      <div className="sr-stars">
                        {renderStars(star)}
                        <span>từ {star} sao</span>
                      </div>
                    </label>
                  ))}
                  <label className="sr-rating-item">
                    <input
                      type="radio"
                      name="rating"
                      value={0}
                      checked={rating === 0}
                      onChange={(e) => setRating(parseInt(e.target.value))}
                    />
                    <span>Tất cả</span>
                  </label>
                </div>
              </div>

              {/* Shipping */}
              <div className="sr-filter-section">
                <h4>Vận chuyển</h4>
                <div className="sr-shipping-list">
                  <label className="sr-shipping-item">
                    <input
                      type="radio"
                      name="shipping"
                      value="all"
                      checked={shipping === "all"}
                      onChange={(e) => setShipping(e.target.value)}
                    />
                    <span>Tất cả</span>
                  </label>
                  <label className="sr-shipping-item">
                    <input
                      type="radio"
                      name="shipping"
                      value="free"
                      checked={shipping === "free"}
                      onChange={(e) => setShipping(e.target.value)}
                    />
                    <span>Miễn phí vận chuyển</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="sr-main-content">
              {/* Sort Bar */}
              <div className="sr-sort-bar">
                <span>Sắp xếp theo</span>
                <div className="sr-sort-options">
                  <button
                    className={sortBy === "newest" ? "active" : ""}
                    onClick={() => setSortBy("newest")}
                  >
                    Mới nhất
                  </button>
                  <button
                    className={sortBy === "sold" ? "active" : ""}
                    onClick={() => setSortBy("sold")}
                  >
                    Bán chạy
                  </button>
                  <button
                    className={sortBy === "price-asc" ? "active" : ""}
                    onClick={() => setSortBy("price-asc")}
                  >
                    Giá thấp đến cao
                  </button>
                  <button
                    className={sortBy === "price-desc" ? "active" : ""}
                    onClick={() => setSortBy("price-desc")}
                  >
                    Giá cao đến thấp
                  </button>
                  <button
                    className={sortBy === "rating" ? "active" : ""}
                    onClick={() => setSortBy("rating")}
                  >
                    Đánh giá cao
                  </button>
                  <button
                    className={sortBy === "discount" ? "active" : ""}
                    onClick={() => setSortBy("discount")}
                  >
                    Khuyến mãi hot
                  </button>
                </div>
              </div>

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
                    <div
                      key={product.id}
                      className="sr-product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="sr-product-image">
                        <img src={product.image} alt={product.name} />
                        {product.discount > 0 && (
                          <div className="sr-discount-badge">
                            -{product.discount}%
                          </div>
                        )}
                        {product.freeShipping && (
                          <div className="sr-shipping-badge">Freeship</div>
                        )}
                      </div>

                      <div className="sr-product-info">
                        <h3 className="sr-product-name">{product.name}</h3>

                        <div className="sr-product-price">
                          <span className="sr-current-price">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice > product.price && (
                            <span className="sr-original-price">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>

                        <div className="sr-product-rating">
                          <div className="sr-stars">
                            {renderStars(product.rating)}
                          </div>
                          <span className="sr-rating-text">
                            ({product.rating})
                          </span>
                        </div>

                        <div className="sr-product-sold">
                          Đã bán {product.sold}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination */}
              {filteredProducts.length > 0 && (
                <div className="sr-pagination">
                  <button className="sr-page-btn">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="sr-page-btn active">1</button>
                  <button className="sr-page-btn">2</button>
                  <button className="sr-page-btn">3</button>
                  <span>...</span>
                  <button className="sr-page-btn">10</button>
                  <button className="sr-page-btn">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
