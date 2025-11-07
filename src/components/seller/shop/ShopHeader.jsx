import React from "react";

const ShopHeader = ({ shopInfo, products = [], onEditShopInfo }) => {
  return (
    <div className="relative bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 px-6 py-12 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-xl"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-white rounded-full blur-xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-12">
          {/* Shop Info */}
          <div className="text-center flex-1 relative">
            <button
              onClick={onEditShopInfo}
              className="absolute top-0 right-0 p-2 text-gray-600 hover:text-orange-600 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Chỉnh sửa thông tin shop"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-800 mb-3 leading-tight">
                {shopInfo.name}
              </h1>
              <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full mb-4"></div>
              <p className="text-gray-700 text-lg font-medium">
                {shopInfo.description}
              </p>
            </div>

            {/* Shop Stats */}
            <div className="flex justify-center space-x-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {products.length}
                </div>
                <div className="text-sm text-gray-600">Sản phẩm</div>
              </div>
              <div className="w-px h-12 bg-gray-400"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">4.8</div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
              <div className="w-px h-12 bg-gray-400"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {products.filter((p) => p.status === "Còn hàng").length}
                </div>
                <div className="text-sm text-gray-600">Còn hàng</div>
              </div>
            </div>
          </div>

          {/* Shop Avatar */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white hover:scale-105 transition-transform duration-300">
                {shopInfo.avatar ? (
                  <img
                    src={shopInfo.avatar}
                    alt="Shop Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 text-orange-500 mx-auto mb-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="text-xs text-gray-500 font-medium">
                      SHOP
                    </div>
                  </div>
                )}
              </div>
              {/* Status Badge */}
              <div className="absolute -bottom-2 -right-2 bg-seller-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
                Online
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex justify-center mt-8 space-x-4">
          <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-2 rounded-full font-medium shadow-md transition-colors flex items-center space-x-2">
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Nhắn tin</span>
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-medium shadow-md transition-colors flex items-center space-x-2">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <span>Theo dõi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader;
