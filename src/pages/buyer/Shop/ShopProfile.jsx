import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import { useChatWidget } from "../../../context/ChatContext";
import { PLACEHOLDER_IMAGES } from "../../../utils/placeholderImages";
import "./ShopProfile.css";

const ShopProfile = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const { openChat } = useChatWidget();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    // Mock data cho shop
    const mockShop = {
      id: shopId,
      name: "PycShop Electronics",
      avatar: PLACEHOLDER_IMAGES.avatar100,
      description: "Chuyên cung cấp các sản phẩm điện tử chất lượng cao",
      rating: 4.8,
      totalReviews: 1250,
      followers: 15430,
      products: 324,
      responseRate: 98,
      responseTime: "trong vài phút",
      joinDate: "2021-03-15",
      location: "TP. Hồ Chí Minh",
      isFollowing: false,
      badges: ["Mall", "Preferred Seller", "Fast Shipping"],
    };

    // Mock data cho sản phẩm
    const mockProducts = [
      {
        id: 1,
        name: "iPhone 15 Pro Max 256GB",
        image: PLACEHOLDER_IMAGES.product200,
        price: 29990000,
        originalPrice: 32990000,
        discount: 9,
        sold: 150,
        rating: 4.9,
        location: "TP. Hồ Chí Minh",
      },
      {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        image: PLACEHOLDER_IMAGES.product200,
        price: 27990000,
        originalPrice: 30990000,
        discount: 10,
        sold: 89,
        rating: 4.8,
        location: "TP. Hồ Chí Minh",
      },
      {
        id: 3,
        name: "MacBook Air M3 13 inch",
        image: PLACEHOLDER_IMAGES.product200,
        price: 28990000,
        originalPrice: 31990000,
        discount: 9,
        sold: 45,
        rating: 4.9,
        location: "TP. Hồ Chí Minh",
      },
      {
        id: 4,
        name: "iPad Pro 11 inch M4",
        image: PLACEHOLDER_IMAGES.product200,
        price: 21990000,
        originalPrice: 24990000,
        discount: 12,
        sold: 67,
        rating: 4.7,
        location: "TP. Hồ Chí Minh",
      },
      {
        id: 5,
        name: "AirPods Pro 3rd Gen",
        image: PLACEHOLDER_IMAGES.product200,
        price: 5990000,
        originalPrice: 6990000,
        discount: 14,
        sold: 234,
        rating: 4.8,
        location: "TP. Hồ Chí Minh",
      },
      {
        id: 6,
        name: "Apple Watch Series 9",
        image: PLACEHOLDER_IMAGES.product200,
        price: 8990000,
        originalPrice: 9990000,
        discount: 10,
        sold: 123,
        rating: 4.6,
        location: "TP. Hồ Chí Minh",
      },
    ];

    // Giả lập API call
    setTimeout(() => {
      setShop(mockShop);
      setProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, [shopId]);

  const handleFollowShop = () => {
    setShop((prev) => ({
      ...prev,
      isFollowing: !prev.isFollowing,
      followers: prev.isFollowing ? prev.followers - 1 : prev.followers + 1,
    }));
  };

  const handleChatClick = () => {
    if (!shop) {
      console.log('Shop data not loaded yet');
      return;
    }
    
    console.log('Opening chat for shop:', shop);
    openChat({
      shopId: shop.id,
      shopName: shop.name,
      shopAvatar: shop.avatar
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
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num.toString();
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
                        {[...Array(1)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${
                              i < Math.floor(shop.rating) ? "filled" : ""
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="review-count">
                        ({formatNumber(shop.totalReviews)} đánh giá)
                      </span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Sản phẩm</span>
                    <span className="stat-value">{shop.products}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Người theo dõi</span>
                    <span className="stat-value">
                      {formatNumber(shop.followers)}
                    </span>
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
                          {product.originalPrice && (
                            <span className="shop-original-price">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <div className="shop-product-meta">
                          <div className="shop-product-rating">
                            <div className="shop-stars">
                              {[...Array(5)].map((_, i) => (
                                <i
                                  key={i}
                                  className={`fas fa-star ${
                                    i < Math.floor(product.rating)
                                      ? "filled"
                                      : ""
                                  }`}
                                ></i>
                              ))}
                            </div>
                            <span className="shop-rating-text">
                              ({product.rating})
                            </span>
                          </div>
                          <span className="shop-product-sold">
                            Đã bán {product.sold}
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
                      <span className="info-label">Mô tả:</span>
                      <span className="info-value">{shop.description}</span>
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
