import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import { useChat } from "../../../context/ChatContext";
import { shopService } from "../../../lib/services/shopServiceBuyer";
import "./ShopProfile.css";

const ShopProfile = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { openChat } = useChat();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [error, setError] = useState(null);

  // Load shop data and products
  useEffect(() => {
    loadShopData();
  }, [shopId]);

  const renderStars = (rating = 0) => {
    const safeRating = rating || 0;
    const stars = [];
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

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

    const emptyStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="star">
          ★
        </span>
      );
    }

    return stars;
  };

  // Load products from product service using shop ID
  const loadProductsByShopId = async (shopId, lastId = null, limit = 8) => {
    try {
      console.log(
        `Loading products for shop ${shopId}, lastId: ${lastId}, limit: ${limit}`
      );

      // Sử dụng direct fetch đến product service endpoint
      const params = new URLSearchParams();
      params.append("limit", limit.toString());
      if (lastId) {
        params.append("last_id", lastId.toString());
      }

      const response = await fetch(
        `http://localhost:5000/products/shop/${shopId}?${params}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Lỗi khi tải sản phẩm");
      }

      return {
        success: true,
        data: data.data || [],
      };
    } catch (error) {
      console.error("Error loading products by shop ID:", error);
      return {
        success: false,
        message: error.message,
        data: [],
      };
    }
  };

  const loadShopData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(`Loading shop data for shopId: ${shopId}`);

      // Lấy thông tin shop từ shop service
      const shopResponse = await shopService.getShopDetail(shopId);

      if (!shopResponse.success || !shopResponse.data) {
        throw new Error(shopResponse.message || "Không thể tải thông tin shop");
      }

      const shopData = shopResponse.data.shop; // Transform shop data
      const transformedShop = {
        id: shopData.ID_CuaHang,
        name: shopData.TenCuaHang,
        avatar: "🏪", // Default avatar since no avatar in DB
        rating: parseFloat(shopData.DanhGiaTB),
        followers: "12.3k",
        phone: shopData.SoDienThoaiCH || "Chưa cập nhật",
        products: shopData.product_count,
        responseRate: 98,
        responseTime: "trong vài phút",
        joinDate: shopData.NgayCapNhat,
        location: shopData.DiaChiCH,
        isFollowing: false, // Mock data - cần API để check
        badges: shopData.badges
          ? shopData.badges.split(",")
          : ["Trusted Seller"],
        categoryName: shopData.category_name,
      };

      // Lấy sản phẩm từ product service
      const productsResponse = await loadProductsByShopId(shopId, null, 8);
      console.log("Products response:", productsResponse);
      let transformedProducts = [];
      if (productsResponse.success && productsResponse.data) {
        transformedProducts = productsResponse.data.map((product) => ({
          id: product.ID_SanPham,
          name: product.TenSanPham,
          image: product.image_urls
            ? `../../../microservice/product_service${product.image_urls
                .split(",")[0]
                .trim()}`
            : "https://via.placeholder.com/200x200/ff6b35/ffffff?text=PycShop",
          price: parseFloat(product.Gia),
          originalPrice: product.Gia * 1.2, // Giả sử giá gốc cao hơn 20%
          discount: 20,
          sold: product.review_count || 0, // Số đánh giá thực từ DB
          rating: parseFloat(product.average_rating) || 0, // Đánh giá thực từ DB
          location: product.shop_location,
        }));
      }

      setShop(transformedShop);
      setProducts(transformedProducts);
      setHasMoreProducts(transformedProducts.length >= 8);

      console.log("Shop data loaded:", transformedShop);
      console.log("Products loaded:", transformedProducts.length);
    } catch (error) {
      console.error("Error loading shop data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (!shop || loadingMore || !hasMoreProducts) return;

    try {
      setLoadingMore(true);

      const lastProductId =
        products.length > 0 ? products[products.length - 1].id : null;

      console.log(`Loading more products with lastId: ${lastProductId}`);

      // Sử dụng product service để load thêm sản phẩm
      const response = await loadProductsByShopId(shopId, lastProductId, 8);

      if (response.success && response.data) {
        const newProducts = response.data.map((product) => ({
          id: product.ID_SanPham,
          name: product.TenSanPham,
          image: product.image_urls
            ? `../../../microservice/product_service${product.image_urls
                .split(",")[0]
                .trim()}`
            : "https://via.placeholder.com/200x200/ff6b35/ffffff?text=PycShop",
          price: parseFloat(product.Gia),
          originalPrice: product.original_price
            ? parseFloat(product.original_price)
            : null,
          discount: product.discount_percent || 0,
          sold: product.review_count || 0, // Số đánh giá thực từ DB
          rating: parseFloat(product.average_rating), // Đánh giá thực từ DB
          location: product.shop_location,
        }));

        setProducts((prev) => [...prev, ...newProducts]);
        setHasMoreProducts(newProducts.length >= 8);

        console.log(`Loaded ${newProducts.length} more products`);
      } else {
        setHasMoreProducts(false);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
      setHasMoreProducts(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleFollowShop = () => {
    setShop((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
  };

  const handleChatClick = () => {
    if (!shop) {
      console.log("Shop data not loaded yet");
      return;
    }

    console.log("Opening chat for shop:", shop);
    openChat({
      shopId: shop.id,
      shopName: shop.name,
      shopAvatar: shop.avatar,
    });
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "0";
    const number = Number(num);

    if (number >= 1000000) {
      return (number / 1000000).toFixed(1).replace(".", ",") + " triệu";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1).replace(".", ",") + " nghìn";
    }
    return new Intl.NumberFormat("vi-VN").format(number);
  };

  if (loading) {
    return (
      <div className="shop-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin shop...</p>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="shop-not-found">
        <i className="fas fa-store-slash"></i>
        <h3>Không tìm thấy shop</h3>
        <p>Shop này có thể đã bị xóa hoặc không tồn tại</p>
        <button onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="shop-profile">
        {/* Shop Info */}
        <div className="shop-info-section">
          <div className="shop-container">
            <div className="shop-header">
              <div className="shop-avatar">
                <img src={shop.avatar} alt={shop.name} />
              </div>
              <div className="shop-details">
                <div className="shop-main-info">
                  <h1 className="shop-name">{shop.name}</h1>
                  <div className="shop-badges">
                    {shop.badges.map((badge, index) => (
                      <span key={index} className="shop-badge">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="shop-stats">
                  <div className="stat-item">
                    <span className="stat-label">Đánh giá</span>
                    <div className="stat-value">
                      <span className="rating">{shop.rating}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${
                              i < Math.floor(shop.rating) ? "filled" : ""
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Sản phẩm</span>
                    <span className="stat-value">
                      {formatNumber(shop.products)}
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Người theo dõi</span>
                    <span className="stat-value">{shop.followers}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Tỷ lệ phản hồi</span>
                    <span className="stat-value">{shop.responseRate}%</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Thời gian phản hồi</span>
                    <span className="stat-value">{shop.responseTime}</span>
                  </div>
                </div>
              </div>
              <div className="shop-actions">
                <button
                  className={`follow-btn ${
                    shop.isFollowing ? "following" : ""
                  }`}
                  onClick={handleFollowShop}
                >
                  <i
                    className={`fas ${
                      shop.isFollowing ? "fa-check" : "fa-plus"
                    }`}
                  ></i>
                  {shop.isFollowing ? "Đang theo dõi" : "Theo dõi"}
                </button>
                <button className="chat-btn" onClick={handleChatClick}>
                  <i className="fas fa-comment"></i>
                  Chat ngay
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Navigation */}
        <div className="shop-nav">
          <div className="shop-container">
            <div className="nav-tabs">
              <button
                className={`nav-tab ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                Tất cả sản phẩm
              </button>
              <button
                className={`nav-tab ${activeTab === "info" ? "active" : ""}`}
                onClick={() => setActiveTab("info")}
              >
                Thông tin shop
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="shop-content">
          <div className="shop-container">
            {activeTab === "all" && (
              <div className="products-section">
                {/* Sort Options */}
                <div className="sort-bar">
                  <span>Sắp xếp theo:</span>
                  <div className="sort-options">
                    <button
                      className={`sort-btn ${
                        sortBy === "newest" ? "active" : ""
                      }`}
                      onClick={() => setSortBy("newest")}
                    >
                      Mới nhất
                    </button>
                    <button
                      className={`sort-btn ${
                        sortBy === "best-selling" ? "active" : ""
                      }`}
                      onClick={() => setSortBy("best-selling")}
                    >
                      Bán chạy
                    </button>
                    <button
                      className={`sort-btn ${
                        sortBy === "price-low" ? "active" : ""
                      }`}
                      onClick={() => setSortBy("price-low")}
                    >
                      Giá thấp đến cao
                    </button>
                    <button
                      className={`sort-btn ${
                        sortBy === "price-high" ? "active" : ""
                      }`}
                      onClick={() => setSortBy("price-high")}
                    >
                      Giá cao đến thấp
                    </button>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="shop-products-grid">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="shop-product-card"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="shop-product-image">
                        <img src={product.image} alt={product.name} />
                        {product.discount > 0 && (
                          <div className="shop-discount-badge">
                            -{product.discount}%
                          </div>
                        )}
                      </div>
                      <div className="shop-product-info">
                        <h3 className="shop-product-name">{product.name}</h3>
                        <div className="shop-product-price">
                          <span className="shop-current-price">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && product.discount > 0 && (
                            <span className="shop-original-price">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="shop-product-meta">
                          <div className="shop-product-rating">
                            <div className="shop-stars">
                              {renderStars(product.rating)}
                            </div>
                            <span className="shop-rating-text">
                              ({product.rating.toFixed(1)})
                            </span>
                          </div>
                          <span className="shop-product-sold">
                            {product.sold > 0
                              ? `${formatNumber(product.sold)} đánh giá`
                              : "Chưa có đánh giá"}
                          </span>
                        </div>
                        <div className="shop-product-location">
                          <i className="fas fa-map-marker-alt"></i>
                          {product.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Nút xem thêm */}
                {hasMoreProducts && (
                  <div className="shop-load-more">
                    <button
                      className="load-more-btn"
                      onClick={loadMoreProducts}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <>
                          <i className="fas fa-spinner fa-spin"></i>
                          Đang tải...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-plus"></i>
                          Xem thêm sản phẩm
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "info" && (
              <div className="shop-info-content">
                <div className="info-card">
                  <h3>Thông tin shop</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Tên shop:</span>
                      <span className="info-value">{shop.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Địa chỉ:</span>
                      <span className="info-value">{shop.location}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Ngày tham gia:</span>
                      <span className="info-value">
                        {new Date(shop.joinDate).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Số điện thoại:</span>
                      <span className="info-value">{shop.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopProfile;
