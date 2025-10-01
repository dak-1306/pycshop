import React from "react";
import "./ProductGrid.css";
import aoThunNam from "../../images/products/ao_thun_nam.png";
import sneakerNu from "../../images/products/sneaker_nu.png";
const ProductGrid = () => {
  // Sample product data (thay thế bằng API call sau này)
  const products = [
    {
      id: 1,
      name: "Áo thun nam basic cotton 100%",
      price: 199000,
      originalPrice: 299000,
      discount: 33,
      image: aoThunNam,
      rating: 4.5,
      sold: 150,
      location: "TP. Hồ Chí Minh",
    },
    {
      id: 2,
      name: "Giày sneaker nữ thời trang",
      price: 450000,
      originalPrice: 600000,
      discount: 25,
      image: sneakerNu,
      rating: 4.8,
      sold: 89,
      location: "Hà Nội",
    },
    {
      id: 3,
      name: "Túi xách nữ da thật cao cấp",
      price: 890000,
      originalPrice: 1200000,
      discount: 26,
      image: aoThunNam,
      rating: 4.7,
      sold: 45,
      location: "Đà Nẵng",
    },
    {
      id: 4,
      name: "Điện thoại smartphone chính hãng",
      price: 5990000,
      originalPrice: 7990000,
      discount: 25,
      image: sneakerNu,
      rating: 4.9,
      sold: 234,
      location: "TP. Hồ Chí Minh",
    },
    {
      id: 5,
      name: "Laptop gaming cao cấp",
      price: 18990000,
      originalPrice: 22990000,
      discount: 17,
      image: aoThunNam,
      rating: 4.6,
      sold: 67,
      location: "Hà Nội",
    },
    {
      id: 6,
      name: "Đồng hồ thông minh smartwatch",
      price: 2490000,
      originalPrice: 3490000,
      discount: 29,
      image: aoThunNam,
      rating: 4.4,
      sold: 123,
      location: "TP. Hồ Chí Minh",
    },
    {
      id: 7,
      name: "Quần jean nam slim fit",
      price: 350000,
      originalPrice: 500000,
      discount: 30,
      image: aoThunNam,
      rating: 4.3,
      sold: 98,
      location: "Cần Thơ",
    },
    {
      id: 8,
      name: "Máy ảnh DSLR chuyên nghiệp",
      price: 12500000,
      originalPrice: 15000000,
      discount: 17,
      image: sneakerNu,
      rating: 4.8,
      sold: 23,
      location: "Hà Nội",
    },
    {
      id: 9,
      name: "Váy nữ dạ hội sang trọng",
      price: 1200000,
      originalPrice: 1800000,
      discount: 33,
      image: sneakerNu,
      rating: 4.5,
      sold: 56,
      location: "TP. Hồ Chí Minh",
    },
    {
      id: 10,
      name: "Tai nghe bluetooth không dây",
      price: 890000,
      originalPrice: 1290000,
      discount: 31,
      image: sneakerNu,
      rating: 4.6,
      sold: 189,
      location: "Đà Nẵng",
    },
    {
      id: 11,
      name: "Kính mát nam nữ UV400",
      price: 299000,
      originalPrice: 599000,
      discount: 50,
      image: aoThunNam,
      rating: 4.2,
      sold: 145,
      location: "Hà Nội",
    },
    {
      id: 12,
      name: "Balo laptop chống nước",
      price: 450000,
      originalPrice: 650000,
      discount: 31,
      image: sneakerNu,
      rating: 4.7,
      sold: 87,
      location: "TP. Hồ Chí Minh",
    },
  ];

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

  const handleProductClick = () => {
    // Hiển thị thông báo cần đăng nhập khi chưa đăng nhập
    alert("Vui lòng đăng nhập để xem chi tiết sản phẩm!");
  };

  return (
    <div className="products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Gợi Ý Hôm Nay</h2>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card"
              onClick={() => handleProductClick()}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.discount > 0 && (
                  <div className="discount-badge">-{product.discount}%</div>
                )}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
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
                    <span className="rating-text">({product.rating})</span>
                  </div>
                  <div className="sold">Đã bán {product.sold}</div>
                </div>
                <div className="product-location">{product.location}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="load-more">
          <button
            className="load-more-btn"
            onClick={() => alert("Vui lòng đăng nhập để xem thêm sản phẩm!")}
          >
            Xem Thêm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
