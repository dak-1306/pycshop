import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";

// Environment configuration - fallback for development
const getApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.location) {
    return window.location.hostname === "localhost"
      ? "http://localhost:5002"
      : "/api";
  }
  return "http://localhost:5002";
};

const API_BASE_URL = getApiBaseUrl();

// Component hiển thị gallery hình ảnh với pagination hiện đại
const ProductImageGallery = React.memo(({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState(new Set());

  // Memoize product images processing
  const images = useMemo(() => {
    if (!product) return [];

    // Try images array first
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images
        .map((img) => {
          const imageUrl =
            typeof img === "string" ? img : img.Url || img.url || img.ImageURL;
          if (!imageUrl) return null;
          return imageUrl.startsWith("http")
            ? imageUrl
            : `${API_BASE_URL}${imageUrl}`;
        })
        .filter(Boolean);
    }

    // Fallback to single image
    if (product.image) {
      return [
        product.image.startsWith("http")
          ? product.image
          : `${API_BASE_URL}${product.image}`,
      ];
    }

    return [];
  }, [product]);

  const handleImageError = (index) => {
    setImageErrors((prev) => new Set([...prev, index]));
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
        <div className="text-center p-8">
          <svg
            className="w-20 h-20 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-gray-400 font-medium text-lg">Chưa có hình ảnh</p>
          <p className="text-gray-300 text-sm mt-1">
            Hãy thêm hình ảnh cho sản phẩm
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <div className="relative aspect-square bg-white rounded-2xl shadow-sm border overflow-hidden group">
        <img
          src={images[currentImageIndex]}
          alt={`${product?.name || "Product"} - Hình ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            // Prevent infinite loop by checking if already using fallback
            if (!e.target.src.includes("/placeholder-product.png")) {
              e.target.src = "/images/placeholder-product.png";
              handleImageError(currentImageIndex);
            }
          }}
        />

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium shadow-lg">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Navigation Arrows - Only show on hover */}
        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev > 0 ? prev - 1 : images.length - 1
                )
              }
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentImageIndex((prev) =>
                  prev < images.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <svg
                className="w-5 h-5 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Modern Pagination với Dots */}
      {images.length > 1 && (
        <div className="flex justify-center space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                currentImageIndex === index
                  ? "bg-blue-500 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Preview (chỉ hiện khi có > 3 ảnh) */}
      {images.length > 3 && (
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                currentImageIndex === index
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  if (!e.target.src.includes("/placeholder-product.png")) {
                    e.target.src = "/images/placeholder-product.png";
                    handleImageError(index);
                  }
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

ProductImageGallery.displayName = "ProductImageGallery";

ProductImageGallery.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    images: PropTypes.array,
    image: PropTypes.string,
  }),
};

export default ProductImageGallery;
