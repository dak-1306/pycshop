import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/components/buyer/ProductGrid.css";
import { productService } from "../../lib/services/productService.js";

const ProductGrid = ({ products: externalProducts }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use external products if provided, otherwise load all products
  useEffect(() => {
    if (externalProducts) {
      setProducts(externalProducts);
      setLoading(false);
    } else {
      loadAllProducts();
    }
  }, [externalProducts]);

  // Load all products for home page
  const loadAllProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await productService.getAllProducts({
        limit: 20,
        sortBy: "newest",
      });

      if (response.success) {
        setProducts(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error(response.message || "Không thể tải sản phẩm");
      }
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          </div>
          <div className="products-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          </div>
          <div className="products-error">
            <p>{error}</p>
            <button onClick={loadAllProducts} className="retry-btn">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
          </div>
          <div className="no-products">
            <p>Hiện tại chưa có sản phẩm nào.</p>
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
            {externalProducts ? "Sản Phẩm" : "Sản Phẩm Nổi Bật"}
          </h2>
          <div className="products-count">
            {products.length} sản phẩm
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <div
              key={product.ID_SanPham}
              className="product-card"
              onClick={() => handleProductClick(product.ID_SanPham)}
            >
              <div className="product-image">
                <img
                  src={
                    product.HinhAnh ||
                    "/images/products/placeholder.jpg"
                  }
                  alt={product.TenSanPham}
                  onError={(e) => {
                    e.target.src = "/images/products/placeholder.jpg";
                  }}
                />
                {product.PhanTramGiam > 0 && (
                  <div className="discount-badge">
                    -{product.PhanTramGiam}%
                  </div>
                )}
              </div>

              <div className="product-info">
                <h3 className="product-name">{product.TenSanPham}</h3>
                <p className="product-description">
                  {product.MoTa?.substring(0, 60)}
                  {product.MoTa?.length > 60 ? "..." : ""}
                </p>

                <div className="product-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`star ${
                          index < Math.round(product.DiemDanhGia || 0)
                            ? "filled"
                            : ""
                        }`}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                  <span className="rating-count">
                    ({product.SoLuongDanhGia || 0})
                  </span>
                </div>

                <div className="product-price">
                  {product.PhanTramGiam > 0 ? (
                    <>
                      <span className="original-price">
                        {formatPrice(product.Gia)}
                      </span>
                      <span className="sale-price">
                        {formatPrice(
                          product.Gia * (1 - product.PhanTramGiam / 100)
                        )}
                      </span>
                    </>
                  ) : (
                    <span className="current-price">
                      {formatPrice(product.Gia)}
                    </span>
                  )}
                </div>

                <div className="product-shop">
                  <span>{product.TenShop || "Shop"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;