import React from "react";
import FeaturedProductsPagination from "./FeaturedProductsPagination";

const FeaturedProducts = ({
  products,
  formatPrice,
  getStatusColor,
  onAddProduct,
  onViewProduct,
  loading = false,
  error = null,
  // Pagination props
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  // Helper function to get product image URL
  const getProductImageUrl = (product) => {
    console.log("Getting image for product:", product);

    // Check if product has images
    if (!product.images || product.images.length === 0) {
      console.log("No images found for product:", product.name);
      return null;
    }

    console.log("Product images:", product.images);

    // Use featured image or first image
    const featuredImage =
      product.images.find((img) => img.is_featured || img.IsFeatured) ||
      product.images[0];

    console.log("Selected image:", featuredImage);

    // Handle different image URL formats
    let imageUrl =
      featuredImage.Url ||
      featuredImage.image_url ||
      featuredImage.ImageURL ||
      featuredImage.url;

    if (!imageUrl) {
      console.log("No image URL found in:", featuredImage);
      return null;
    }

    // Ensure URL starts with /uploads if it's a relative path
    if (!imageUrl.startsWith("http") && !imageUrl.startsWith("/")) {
      imageUrl = `/uploads/${imageUrl}`;
    }

    const fullUrl = imageUrl.startsWith("http")
      ? `../../../../microservice/product_service${imageUrl}`
      : `http://localhost:5002${imageUrl}`;
    console.log("Final image URL:", fullUrl);

    return fullUrl;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          Sản phẩm nổi bật
          {loading && (
            <div className="ml-2 w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </h2>
        <div className="text-sm text-gray-600">
          Trang {currentPage || 1} / {totalPages || 1}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">{error}</span>
          </div>
          <p className="text-sm text-red-600 mt-1">
            Đang sử dụng dữ liệu mẫu để hiển thị giao diện.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.slice(0, 4).map((product) => {
          const imageUrl = getProductImageUrl(product);

          return (
            <div
              key={product.id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Product Image */}
              <div
                className="relative w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden cursor-pointer"
                onClick={() => {
                  console.log("View product details:", product);
                  if (typeof onViewProduct === "function") {
                    onViewProduct(product);
                  }
                }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain hover:object-cover group-hover:scale-105 transition-all duration-300 bg-white"
                    style={{ objectPosition: "center" }}
                    onError={(e) => {
                      console.log("Image failed to load:", imageUrl);
                      e.target.style.display = "none";
                      e.target.parentElement.querySelector(
                        ".fallback-placeholder"
                      ).style.display = "flex";
                    }}
                    onLoad={() => {
                      console.log("Image loaded successfully:", imageUrl);
                    }}
                  />
                ) : null}

                {/* Fallback placeholder */}
                <div
                  className={`fallback-placeholder absolute inset-0 flex items-center justify-center ${
                    imageUrl ? "hidden" : "flex"
                  }`}
                >
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 text-gray-400 mx-auto mb-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-xs text-gray-500">Chưa có ảnh</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full shadow-sm ${getStatusColor(
                      product.status
                    )}`}
                  >
                    {product.status}
                  </span>
                </div>

                {/* Stock Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm px-2 py-1 text-xs font-medium rounded-full text-gray-700 shadow-sm">
                    SL: {product.stock_quantity || product.quantity || 0}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors">
                  {product.name}
                </h4>

                <div className="flex items-center justify-between mb-2">
                  <p className="text-lg font-bold text-red-600">
                    {formatPrice(product.price)}
                  </p>

                  {product.original_price &&
                    product.original_price > product.price && (
                      <p className="text-xs text-gray-400 line-through">
                        {formatPrice(product.original_price)}
                      </p>
                    )}
                </div>

                {/* Category */}
                {product.category_name && (
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {product.category_name}
                  </p>
                )}

                {/* Action Button */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs text-gray-600">
                      {product.average_rating
                        ? `${product.average_rating.toFixed(1)}`
                        : "0.0"}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("View details clicked for:", product);
                      if (typeof onViewProduct === "function") {
                        onViewProduct(product);
                      }
                    }}
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-orange-50 px-2 py-1 rounded"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center py-16 px-6">
          <div className="relative mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-12 h-12 text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 9h.01M15 9h.01M9 15h.01M15 15h.01"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có sản phẩm nào
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Hãy thêm sản phẩm đầu tiên để khách hàng có thể tìm thấy và mua hàng
            từ shop của bạn
          </p>

          <button
            onClick={() => {
              console.log("FeaturedProducts - Add product clicked");
              onAddProduct && onAddProduct();
            }}
            className="relative px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 mx-auto overflow-hidden"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Thêm sản phẩm đầu tiên
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-20 transition-opacity"></div>
          </button>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Miễn phí đăng bán
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Dễ dàng quản lý
            </div>
          </div>
        </div>
      )}

      {/* Pagination - only show when there are products */}
      {products && products.length > 0 && totalPages > 1 && (
        <FeaturedProductsPagination
          currentPage={currentPage || 1}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      )}
    </div>
  );
};

export default FeaturedProducts;
