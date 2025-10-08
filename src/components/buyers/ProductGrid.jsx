import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductGrid.css";
import { productService } from "../../services/productService";

const ProductGrid = ({ searchQuery, selectedCategory, onCategorySelect }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load products function
  const loadProducts = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      const params = {
        page: pageNum,
        limit: 20,
        sortBy: "created_date",
        sortOrder: "DESC",
      };

      // Add search query if exists
      if (searchQuery && searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      // Add category filter if selected
      if (selectedCategory) {
        params.category = selectedCategory;
      }

      console.log("Loading products with params:", params);

      const response = await productService.getProducts(params);

      if (response.success) {
        const transformedProducts = response.data.map((product) => ({
          id: product.ID_SanPham,
          name: product.TenSanPham,
          price: parseFloat(product.Gia),
          image: product.image_urls
            ? product.image_urls.split(",")[0]
            : "https://via.placeholder.com/300x300/ff6b35/ffffff?text=PycShop",
          rating: parseFloat(product.average_rating) || 0,
          sold: product.review_count || 0,
          location: product.shop_location || "TP.HCM",
          category: product.TenDanhMuc,
          stock: product.TonKho,
        }));

        if (reset || pageNum === 1) {
          setProducts(transformedProducts);
        } else {
          setProducts((prev) => [...prev, ...transformedProducts]);
        }

        // Check if there are more products
        setHasMore(response.pagination.hasNext);
        setPage(pageNum);
      } else {
        throw new Error(response.message || "Failed to load products");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      if (pageNum === 1) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load and reload when search/category changes
  useEffect(() => {
    loadProducts(1, true);
  }, [searchQuery, selectedCategory]);

  // Load more products
  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      loadProducts(page + 1, false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="star filled">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
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

  // Loading state
  if (loading) {
    return (
      <div className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {searchQuery
                ? `Kết quả tìm kiếm: "${searchQuery}"`
                : "Gợi Ý Hôm Nay"}
            </h2>
          </div>
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Có lỗi xảy ra</h2>
          </div>
          <div className="error-container">
            <p>{error}</p>
            <button className="retry-btn" onClick={() => loadProducts(1, true)}>
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No products found
  if (products.length === 0) {
    return (
      <div className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {searchQuery
                ? `Không tìm thấy sản phẩm cho "${searchQuery}"`
                : "Không có sản phẩm"}
            </h2>
          </div>
          <div className="no-products">
            <p>
              {searchQuery
                ? "Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả"
                : "Hiện tại chưa có sản phẩm nào được hiển thị"}
            </p>
            {searchQuery && (
              <button
                className="clear-search-btn"
                onClick={() => onCategorySelect && onCategorySelect(null)}
              >
                Xem tất cả sản phẩm
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            {searchQuery
              ? `Kết quả tìm kiếm: "${searchQuery}" `
              : selectedCategory
              ? `Danh mục: ${products[0]?.category || "Sản phẩm"} `
              : `Gợi Ý Hôm Nay `}
          </h2>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="product-image">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x300/ff6b35/ffffff?text=PycShop";
                  }}
                />
                {product.discount > 0 && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
                {product.stock === 0 && (
                  <div className="out-of-stock-badge">Hết hàng</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name" title={product.name}>
                  {product.name}
                </h3>
                <div className="product-price">
                  <span className="current-price">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="original-price">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="product-meta">
                  <div className="rating">
                    <div className="stars">{renderStars(product.rating)}</div>
                    <span className="rating-text">
                      ({product.rating.toFixed(1)})
                    </span>
                  </div>
                  <div className="sold">
                    {product.sold > 0
                      ? `${product.sold} đánh giá`
                      : "Chưa có đánh giá"}
                  </div>
                </div>
                <div className="product-location">{product.location}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="load-more">
            <button
              className={`load-more-btn ${isLoadingMore ? "loading" : ""}`}
              onClick={handleLoadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? (
                <>
                  <div className="loading-spinner small"></div>
                  Đang tải...
                </>
              ) : (
                "Xem Thêm"
              )}
            </button>
          </div>
        )}

        {/* No more products message */}
        {!hasMore && products.length > 0 && (
          <div className="no-more-products">
            <p>Đã hiển thị tất cả sản phẩm</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
