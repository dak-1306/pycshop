import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProductRating } from "../common/ui/StarRating";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import "../../styles/components/buyer/ProductCard.css";

const ProductCard = ({ product, onClick }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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
    ...product, // Override with actual product data if available
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
            className={`btn-add-cart ${isAddingToCart ? "loading" : ""}`}
            disabled={isAddingToCart || safeProduct.stock === 0}
            onClick={async (e) => {
              e.stopPropagation();

              // Check if user is logged in
              if (!isAuthenticated) {
                showError("Vui lòng đăng nhập để thêm vào giỏ hàng!");
                navigate("/login");
                return;
              }

              // Check stock
              if (safeProduct.stock === 0) {
                showError("Sản phẩm đã hết hàng!");
                return;
              }

              setIsAddingToCart(true);

              try {
                // Prepare product data for cart service
                const productData = {
                  id: safeProduct.id,
                  name: safeProduct.name,
                  price: safeProduct.price,
                  image: safeProduct.image,
                  description: safeProduct.description || "",
                };

                // Use CartContext addToCart method (handles realtime updates)
                await addToCart(safeProduct.id, 1, productData);

                // Show success toast
                showSuccess(`Đã thêm "${safeProduct.name}" vào giỏ hàng!`);
              } catch (error) {
                console.error("Error adding to cart:", error);
                showError(
                  error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!"
                );
              } finally {
                setIsAddingToCart(false);
              }
            }}
          >
            {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
          <button
            className="btn-buy-now"
            onClick={(e) => {
              e.stopPropagation();
              // Buy now logic - redirect to product detail for more options
              navigate(`/product/${safeProduct.id}`, {
                state: { buyNow: true },
              });
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
