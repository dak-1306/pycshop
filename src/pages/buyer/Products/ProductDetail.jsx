import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/buyers/Header";
import Footer from "../../../components/buyers/Footer";
import ReviewForm from "../../../components/buyers/ReviewForm";
import ReviewList from "../../../components/buyers/ReviewList";
import { productService } from "../../../services/productService";
import { useAuth } from "../../../context/AuthContext";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // State management
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState(null);
  const [userReviewStatus, setUserReviewStatus] = useState({
    hasReviewed: false,
    loading: true,
  });

  // // Mock data for demo (replace with real API calls)
  // const mockProduct = {
  //   id: 1,
  //   name: "iPhone 14 Pro Max 256GB - Chính hãng VN/A",
  //   images: [
  //     "https://via.placeholder.com/400x400/ff6b35/ffffff?text=iPhone+14+Pro",
  //     "https://via.placeholder.com/400x400/333333/ffffff?text=Back+View",
  //     "https://via.placeholder.com/400x400/666666/ffffff?text=Side+View",
  //     "https://via.placeholder.com/400x400/999999/ffffff?text=Accessories",
  //   ],
  //   price: 27990000,
  //   originalPrice: 32990000,
  //   discount: 15,
  //   rating: 4.8,
  //   reviewCount: 2847,
  //   soldCount: 1520,
  //   stock: 45,
  //   variants: [
  //     {
  //       name: "Màu sắc",
  //       options: [
  //         "Tím Deep Purple",
  //         "Vàng Gold",
  //         "Bạc Silver",
  //         "Đen Space Black",
  //       ],
  //     },
  //     {
  //       name: "Dung lượng",
  //       options: ["128GB", "256GB", "512GB", "1TB"],
  //     },
  //   ],
  //   description: `
  //     <h3>Đặc điểm nổi bật</h3>
  //     <ul>
  //       <li>Màn hình Dynamic Island mới lạ, thú vị</li>
  //       <li>Camera chính 48MP, zoom quang học 3x</li>
  //       <li>Chip A16 Bionic mạnh mẽ, hiệu năng vượt trội</li>
  //       <li>Pin cải thiện, sạc nhanh 20W</li>
  //       <li>Khung viền titanium cao cấp, bền bỉ</li>
  //     </ul>

  //     <h3>Thông số kỹ thuật</h3>
  //     <ul>
  //       <li>Màn hình: 6.7 inch, Super Retina XDR OLED</li>
  //       <li>Chip: A16 Bionic</li>
  //       <li>Camera sau: 48MP + 12MP + 12MP</li>
  //       <li>Camera trước: 12MP</li>
  //       <li>Pin: 4323 mAh</li>
  //       <li>Hệ điều hành: iOS 16</li>
  //     </ul>
  //   `,
  //   shop: {
  //     id: 1,
  //     name: "PycShop Official Store",
  //     avatar: "🏪",
  //     rating: 4.9,
  //     followers: 125000,
  //     products: 2847,
  //     responseRate: 98,
  //     responseTime: "trong vài phút",
  //   },
  // };

  const mockSimilarProducts = [
    {
      id: 2,
      name: "iPhone 14 Pro 128GB",
      image:
        "https://via.placeholder.com/200x200/ff6b35/ffffff?text=iPhone+14+Pro",
      price: 24990000,
    },
    {
      id: 3,
      name: "iPhone 14 Plus 256GB",
      image:
        "https://via.placeholder.com/200x200/ff6b35/ffffff?text=iPhone+14+Plus",
      price: 22990000,
    },
    {
      id: 4,
      name: "iPhone 13 Pro Max 256GB",
      image:
        "https://via.placeholder.com/200x200/ff6b35/ffffff?text=iPhone+13+Pro",
      price: 25990000,
    },
    {
      id: 5,
      name: "Samsung Galaxy S23 Ultra",
      image:
        "https://via.placeholder.com/200x200/ff6b35/ffffff?text=Galaxy+S23",
      price: 28990000,
    },
  ];

  // Load product data
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Loading product with ID: ${id}`);

        // Fetch product data from API via productService
        const response = await productService.getProductById(id);

        if (response.success && response.data) {
          const productData = response.data;

          // Calculate original price based on discount formula
          // P(original) = P(current) / (1 - discount%/100)
          const discountPercent = 15; // Mock discount rate - you can get this from productData if available
          const currentPrice = parseFloat(productData.price);
          const originalPrice = currentPrice / (1 - discountPercent / 100);

          // Transform API data to component format
          const transformedProduct = {
            id: productData.id,
            name: productData.name,
            description: productData.description || "Không có mô tả chi tiết.",
            price: currentPrice,
            originalPrice: originalPrice,
            discount: discountPercent,
            rating: productData.average_rating || 0,
            reviewCount: productData.review_count || 0,
            soldCount: productData.review_count || 0, // Use review count as sold count
            stock: productData.stock_quantity || 0,
            images:
              productData.images && productData.images.length > 0
                ? productData.images.map(
                    (img) => `../../../../microservice/product_service${img}`
                  )
                : [
                    "https://via.placeholder.com/400x400/ff6b35/ffffff?text=No+Image",
                  ],
            category: productData.category,
            categoryId: productData.category_id,
            shop: {
              id: productData.shop_id || 1,
              name: productData.shop_name || "PycShop Store",
              avatar: "🏪",
              rating: productData.shop_average_rating || 0,
              followers: 1000, // Mock data
              products: productData.shop_product_count || 0,
              responseRate: 98,
              responseTime: "trong vài phút",
            },
            variants: [], // Mock variants for now - can be expanded later
          };

          setProduct(transformedProduct);
          console.log("Product loaded successfully:", transformedProduct);

          // Load similar products from API
          try {
            const similarResponse = await productService.getSimilarProducts(
              id,
              4
            );
            if (similarResponse.success && similarResponse.data) {
              const transformedSimilarProducts = similarResponse.data.map(
                (item) => ({
                  id: item.id,
                  name: item.name,
                  price: item.price,
                  image: item.image
                    ? `../../../../microservice/product_service${item.image}`
                    : "https://via.placeholder.com/200x200/ff6b35/ffffff?text=PycShop",
                  rating: item.rating,
                })
              );
              setSimilarProducts(transformedSimilarProducts);
              console.log(
                "Similar products loaded:",
                transformedSimilarProducts
              );
            }
          } catch (similarError) {
            console.error("Error loading similar products:", similarError);
            // Keep mock similar products as fallback
            setSimilarProducts(mockSimilarProducts);
          }

          setLoading(false);
        } else {
          throw new Error(response.message || "Product not found");
        }
      } catch (error) {
        console.error("Error loading product:", error);
        setError(error.message || "Không thể tải thông tin sản phẩm");
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id

  // Check if user has reviewed this product
  useEffect(() => {
    const checkUserReview = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) {
        setUserReviewStatus({ hasReviewed: false, loading: false });
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5000/api/reviews/check/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setUserReviewStatus({
            hasReviewed: data.hasReviewed,
            loading: false,
            review: data.review,
          });
        } else {
          setUserReviewStatus({ hasReviewed: false, loading: false });
        }
      } catch (error) {
        console.error("Error checking user review:", error);
        setUserReviewStatus({ hasReviewed: false, loading: false });
      }
    };

    if (id) {
      checkUserReview();
    }
  }, [id]);

  // Utility functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="pd-star">
          {i <= rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  // Event handlers
  const handleImageSelect = (index) => {
    setSelectedImage(index);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantSelect = (variantName, option) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: option,
    }));
  };

  const handleAddToCart = () => {
    // Add to cart logic
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    // Buy now logic
    alert("Chuyển đến trang thanh toán!");
  };

  const handleSimilarProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleViewShop = () => {
    if (product?.shop?.id) {
      navigate(`/shop/${product.shop.id}`);
    }
  };

  const handleShowReviewForm = () => {
    if (!isAuthenticated || !user) {
      alert("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }
    setShowReviewForm(true);
  };

  const handleCloseReviewForm = () => {
    setShowReviewForm(false);
  };

  const handleReviewSubmitted = (review) => {
    setNewReview(review);
    setUserReviewStatus({ hasReviewed: true, loading: false, review: review });
    setShowReviewForm(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="pd-loading-container">
          <div className="pd-loading-spinner"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="pd-container">
          <div className="pd-error-message">
            <h2>Có lỗi xảy ra</h2>
            <p>{error}</p>
            <button onClick={() => navigate("/")}>Về trang chủ</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Product not found - only show this if not loading and no error
  if (!loading && !error && !product) {
    return (
      <div className="product-detail-page">
        <Header />
        <div className="pd-container">
          <div className="pd-error-message">
            <h2>Không tìm thấy sản phẩm</h2>
            <button onClick={() => navigate("/")}>Về trang chủ</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Only render main component if we have a product
  if (!product) {
    return null;
  }

  return (
    <div className="product-detail-page">
      <Header />
      <div className="pd-container">
        {/* Breadcrumb */}
        <div className="pd-breadcrumb">
          <span onClick={() => navigate("/")}>Trang chủ</span>
          <span className="pd-breadcrumb-separator">&gt;</span>
          <span onClick={() => navigate("/products")}>Sản phẩm</span>
          <span className="pd-breadcrumb-separator">&gt;</span>
          <span>{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="pd-main">
          <div className="pd-content">
            {/* Product Images */}
            <div className="pd-images">
              <div className="pd-main-image">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x400/ff6b35/ffffff?text=PycShop";
                  }}
                />
                <div className="pd-image-zoom-indicator">
                  <i className="fas fa-search"></i> Hover để phóng to
                </div>
              </div>
              <div className="pd-thumbnail-list">
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={`pd-thumbnail ${
                      index === selectedImage ? "active" : ""
                    }`}
                    onClick={() => handleImageSelect(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/60x60/ff6b35/ffffff?text=P";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="pd-info">
              <h1 className="pd-title">{product.name}</h1>

              {/* Rating and Stats */}
              <div className="pd-rating">
                <div className="pd-rating-stars">
                  {renderStars(Math.floor(product.rating))}
                  <span className="pd-rating-text">{product.rating}</span>
                </div>
                <span className="pd-rating-count">
                  ({product.reviewCount} đánh giá)
                </span>
                <span className="pd-sold-count">
                  Đã bán {product.soldCount}
                </span>
              </div>

              {/* Price */}
              <div className="pd-price">
                <span className="pd-current-price">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="pd-original-price">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="pd-discount-badge">
                      -{product.discount}%
                    </span>
                  </>
                )}
              </div>

              {/* Product Variants */}
              <div className="pd-options">
                {product.variants.map((variant, index) => (
                  <div key={index} className="pd-option-group">
                    <label className="pd-option-label">{variant.name}</label>
                    <div className="pd-option-list">
                      {variant.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`pd-option-item ${
                            selectedVariants[variant.name] === option
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleVariantSelect(variant.name, option)
                          }
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quantity and Purchase */}
              <div className="pd-purchase-section">
                <div className="pd-quantity-selector">
                  <span className="pd-quantity-label">Số lượng</span>
                  <div className="pd-quantity-controls">
                    <button
                      className="pd-quantity-btn"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="pd-quantity-input"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        if (value >= 1 && value <= product.stock) {
                          setQuantity(value);
                        }
                      }}
                      min="1"
                      max={product.stock}
                    />
                    <button
                      className="pd-quantity-btn"
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <span className="pd-stock-info">
                    {product.stock} sản phẩm có sẵn
                  </span>
                </div>

                <div className="pd-action-buttons">
                  <button className="pd-btn-add-cart" onClick={handleAddToCart}>
                    <div className="cart-button-content">
                      <i className="fas fa-shopping-cart"></i>
                      <span>Thêm vào giỏ hàng</span>
                    </div>
                  </button>
                  <button className="pd-btn-buy-now" onClick={handleBuyNow}>
                    Mua ngay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Information */}
        <div className="pd-shop-info">
          <div className="pd-shop-header">
            <div
              className="pd-shop-avatar"
              onClick={handleViewShop}
              style={{ cursor: "pointer" }}
            >
              {product.shop.avatar}
            </div>
            <div className="pd-shop-details">
              <h3 onClick={handleViewShop} style={{ cursor: "pointer" }}>
                {product.shop.name}
              </h3>
              <div className="pd-shop-stats">
                <span>
                  <i className="fas fa-star"></i> {product.shop.rating}
                </span>
                <span>
                  <i className="fas fa-users"></i>{" "}
                  {product.shop.followers.toLocaleString()} người theo dõi
                </span>
                <span>
                  <i className="fas fa-box"></i> {product.shop.products} sản
                  phẩm
                </span>
                <span>
                  <i className="fas fa-comments"></i> Tỷ lệ phản hồi:{" "}
                  {product.shop.responseRate}%
                </span>
              </div>
            </div>
          </div>
          <div className="pd-shop-actions">
            <button className="pd-btn-view-shop" onClick={handleViewShop}>
              <i className="fas fa-eye"></i> Xem shop
            </button>
            <button className="pd-btn-follow-shop">
              <i className="fas fa-plus"></i> Theo dõi
            </button>
          </div>
        </div>

        {/* Product Description */}
        <div className="pd-description">
          <h2 className="pd-description-title">Chi tiết sản phẩm</h2>
          <div
            className="pd-description-content"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>

        {/* Review Section */}
        <div className="pd-review-section">
          <div className="pd-review-header">
            <h2>Đánh giá sản phẩm</h2>
            {!userReviewStatus.loading && !userReviewStatus.hasReviewed && (
              <button
                className="pd-btn-write-review"
                onClick={handleShowReviewForm}
              >
                <i className="fas fa-star"></i>
                Viết đánh giá
              </button>
            )}
            {userReviewStatus.hasReviewed && (
              <div className="pd-review-status">
                <i className="fas fa-check-circle"></i>
                Bạn đã đánh giá sản phẩm này
              </div>
            )}
          </div>

          <ReviewList productId={id} newReview={newReview} />
        </div>

        {/* Similar Products */}
        <div className="pd-similar-products">
          <h2 className="pd-similar-title">Sản phẩm tương tự</h2>
          <div className="pd-similar-grid">
            {similarProducts.map((item) => (
              <div
                key={item.id}
                className="pd-similar-item"
                onClick={() => handleSimilarProductClick(item.id)}
              >
                <div className="pd-similar-image">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/200x200/ff6b35/ffffff?text=PycShop";
                    }}
                  />
                </div>
                <div className="pd-similar-info">
                  <div className="pd-similar-name">{item.name}</div>
                  <div className="pd-similar-price">
                    {formatPrice(item.price)}
                  </div>
                  {item.rating > 0 && (
                    <div className="pd-similar-rating">
                      <span className="pd-similar-rating-stars">
                        {renderStars(Math.floor(item.rating))}
                      </span>
                      <span className="pd-similar-rating-text">
                        ({item.rating.toFixed(1)})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productId={id}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={handleCloseReviewForm}
        />
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
