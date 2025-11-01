import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/buyer/ProductCard.css";

const ProductCard = ({ product, onClick }) => {
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) {
      return "0đ";
    }
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(price)
      .replace("₫", "đ");
  };

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

  // Ensure product has default values to prevent undefined errors
  const safeProduct = {
    id: product?.id || 0,
    name: product?.name || "Sản phẩm",
    price: product?.price || 0,
    image: product?.image || "",
    rating: product?.rating || 0,
    sold: product?.sold || 0,
    location: product?.location || "Việt Nam",
    discount: product?.discount || 0,
    originalPrice: product?.originalPrice || null,
    stock: product?.stock || 0,
    ...product // Override with actual product data if available
  };

  const handleClick = () => {
    if (onClick) {
      onClick(safeProduct.id);
    } else {
      navigate(`/product/${safeProduct.id}`);
    }
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        <img
          src={safeProduct.image}
          alt={safeProduct.name}
          onError={(e) => {
            // Prevent infinite loop by checking if already using fallback
            if (!e.target.src.includes("data:image")) {
              e.target.src =
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23ff6b35'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='20' fill='white'%3EPycShop%3C/text%3E%3C/svg%3E";
            }
          }}
        />
        {safeProduct.discount > 0 && (
          <div className="discount-badge">-{safeProduct.discount}%</div>
        )}
        {safeProduct.stock === 0 && (
          <div className="out-of-stock-badge">Hết hàng</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name" title={safeProduct.name}>
          {safeProduct.name}
        </h3>
        <div className="product-price">
          <span className="current-price">
            {formatPrice(safeProduct.price)}
          </span>
          {safeProduct.originalPrice && (
            <span className="original-price">
              {formatPrice(safeProduct.originalPrice)}
            </span>
          )}
        </div>
        <div className="product-meta">
          <div className="rating">
            <div className="stars">{renderStars(safeProduct.rating)}</div>
            <span className="rating-text">
              ({safeProduct.rating.toFixed(1)})
            </span>
          </div>
          <div className="sold">
            {safeProduct.sold > 0
              ? `${safeProduct.sold} đánh giá`
              : "Chưa có đánh giá"}
          </div>
        </div>
        <div className="product-location">{safeProduct.location}</div>
        
        {/* Action Buttons */}
        <div className="product-card-actions">
          <button 
            className="btn-add-cart"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic here
              const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
              const existingItem = cartItems.find(item => item.id === safeProduct.id);
              
              if (existingItem) {
                existingItem.quantity += 1;
              } else {
                cartItems.push({
                  id: safeProduct.id,
                  name: safeProduct.name,
                  price: safeProduct.price,
                  quantity: 1,
                  image: safeProduct.image,
                  variant: 'Mặc định'
                });
              }
              
              localStorage.setItem('cartItems', JSON.stringify(cartItems));
              alert('Đã thêm vào giỏ hàng!');
            }}
          >
            Thêm vào giỏ
          </button>
          <button 
            className="btn-buy-now"
            onClick={(e) => {
              e.stopPropagation();
              // Buy now logic - redirect to checkout with this product
              const cartItem = {
                id: safeProduct.id,
                name: safeProduct.name,
                price: safeProduct.price,
                quantity: 1,
                image: safeProduct.image,
                variant: 'Mặc định'
              };
              navigate('/checkout', { state: { cartItems: [cartItem] } });
            }}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;