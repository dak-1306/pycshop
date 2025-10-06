import React from "react";

const FeaturedProducts = ({
  products,
  formatPrice,
  getStatusColor,
  onAddProduct,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Sản phẩm nổi bật
        </h2>
        <a
          href="/seller/manage-product"
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          Xem tất cả →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.slice(0, 4).map((product) => (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 line-clamp-1">
                {product.name}
              </h4>
              <p className="text-sm text-red-600 font-medium">
                {formatPrice(product.price)}
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                  product.status
                )}`}
              >
                {product.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-gray-500">Chưa có sản phẩm nào</p>
          <button
            onClick={onAddProduct}
            className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
          >
            Thêm sản phẩm đầu tiên
          </button>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
