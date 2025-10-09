import React, { useState } from "react";

// Component hiển thị gallery hình ảnh với pagination hiện đại
const ProductImageGallery = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Get product images
  const getProductImages = () => {
    if (!product) return [];

    console.log("[ProductImageGallery] Product data:", product);

    // Try images array first
    if (
      product.images &&
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      const imageUrls = product.images
        .map((img) => {
          const imageUrl =
            typeof img === "string" ? img : img.Url || img.url || img.ImageURL;
          if (!imageUrl) return null;
          return imageUrl.startsWith("http")
            ? imageUrl
            : `http://localhost:5002${imageUrl}`;
        })
        .filter(Boolean);

      console.log("[ProductImageGallery] Found images array:", imageUrls);
      return imageUrls;
    }

    // Fallback to single image
    if (product.image) {
      console.log("[ProductImageGallery] Using single image:", product.image);
      return [product.image];
    }

    console.log("[ProductImageGallery] No images found");
    return [];
  };

  const images = getProductImages();

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
          alt={`${product.name} - Hình ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.target.src = "/images/placeholder-product.png";
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
                  e.target.src = "/images/placeholder-product.png";
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ProductDetailModal = ({ isOpen, onClose, product, onEdit, onDelete }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Chi tiết sản phẩm
              </h2>
              <p className="text-gray-500 text-sm">
                Thông tin chi tiết và hình ảnh sản phẩm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors group"
          >
            <svg
              className="w-5 h-5 text-gray-600 group-hover:text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - Scrollable với custom scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div className="p-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div className="space-y-6">
                <ProductImageGallery product={product} />
              </div>

              {/* Right Column - Product Info */}
              <div className="space-y-6">
                {/* Product Name & Category */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200">
                      {product.category}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600 text-sm">
                      ID: #{product.id}
                    </span>
                  </div>
                </div>

                {/* Price & Stock */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Giá bán</p>
                      <p className="text-3xl font-bold text-green-600">
                        {product.price}₫
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Tồn kho</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {product.quantity}
                      </p>
                      <p className="text-sm text-gray-500">sản phẩm</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Trạng thái</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.status === "active" ||
                          product.status === "Còn hàng"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : product.status === "out_of_stock" ||
                              product.status === "Hết hàng"
                            ? "bg-red-100 text-red-800 border border-red-200"
                            : "bg-gray-100 text-gray-800 border border-gray-200"
                        }`}
                      >
                        {product.status === "active" ||
                        product.status === "Còn hàng"
                          ? "Còn hàng"
                          : product.status === "out_of_stock" ||
                            product.status === "Hết hàng"
                          ? "Hết hàng"
                          : "Ngừng bán"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Mô tả sản phẩm
                  </h3>
                  <div className="prose prose-sm text-gray-700">
                    <p className="leading-relaxed">
                      {product.description ||
                        "Chưa có mô tả cho sản phẩm này. Hãy thêm mô tả để khách hàng hiểu rõ hơn về sản phẩm."}
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">
                      #{product.id}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Mã SP</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                    <div className="text-2xl">
                      {product.quantity > 0 ? "📦" : "❌"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Kho hàng</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                    <div className="text-2xl">⭐</div>
                    <div className="text-xs text-gray-500 mt-1">Đánh giá</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-3xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Cập nhật lần cuối:{" "}
              {product.created_date
                ? new Date(product.created_date).toLocaleDateString("vi-VN")
                : "Không xác định"}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-colors"
              >
                Đóng
              </button>

              {onEdit && (
                <button
                  onClick={() => onEdit(product)}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span>Chỉnh sửa</span>
                </button>
              )}

              {onDelete && (
                <button
                  onClick={() => onDelete(product)}
                  className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors flex items-center space-x-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span>Xóa</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
