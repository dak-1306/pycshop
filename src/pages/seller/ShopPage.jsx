import React, { useState, useEffect } from "react";
import SellerLayout from "../../components/layout/SellerLayout";

const ShopPage = () => {
  const [shopInfo] = useState({
    name: "TÊN CỦA SHOP",
    description: "MÔ tả ngắn",
    avatar: null, // Placeholder for shop avatar
  });

  const [products, setProducts] = useState([]);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call for products data
    setProducts([
      {
        id: 1,
        name: "Tên sản phẩm",
        price: "Giá VNĐ",
        image: null,
        status: "Còn hàng",
        statusType: "available",
      },
      {
        id: 2,
        name: "Tên sản phẩm",
        price: "Giá VNĐ",
        image: null,
        status: "Hết hàng",
        statusType: "out-of-stock",
      },
      {
        id: 3,
        name: "Tên sản phẩm",
        price: "Giá VNĐ",
        image: null,
        status: "Hết hàng",
        statusType: "out-of-stock",
      },
      {
        id: 4,
        name: "Tên sản phẩm",
        price: "Giá VNĐ",
        image: null,
        status: "Hết hàng",
        statusType: "out-of-stock",
      },
    ]);
  }, []);

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case "available":
        return "text-green-600";
      case "out-of-stock":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleAddProduct = () => {
    // Handle add new product
    console.log("Add new product");
  };

  const handleEditProduct = (productId) => {
    // Handle edit product
    console.log("Edit product:", productId);
  };

  const handleDeleteProduct = (productId) => {
    // Handle delete product
    console.log("Delete product:", productId);
  };

  return (
    <SellerLayout title="Shop Page">
      <div className="min-h-screen bg-gray-100">
        {/* Shop Header Section */}
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
              <div className="text-center flex-1">
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
                    <div className="text-2xl font-bold text-gray-800">24</div>
                    <div className="text-sm text-gray-600">Sản phẩm</div>
                  </div>
                  <div className="w-px h-12 bg-gray-400"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">4.8</div>
                    <div className="text-sm text-gray-600">Đánh giá</div>
                  </div>
                  <div className="w-px h-12 bg-gray-400"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">1.2k</div>
                    <div className="text-sm text-gray-600">Theo dõi</div>
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
                  <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium shadow-lg">
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

        {/* Action Buttons */}
        <div className="px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={handleAddProduct}
            className="w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex items-center justify-center shadow-md transition-colors"
            title="Thêm sản phẩm mới"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
          <button
            className="w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center shadow-md transition-colors"
            title="Xuất dữ liệu"
          >
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </button>
        </div>

        {/* Products Grid */}
        <div className="px-6 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-sm border overflow-hidden"
              >
                {/* Product Image */}
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v1.007a1 1 0 00.293.707L3 7.414V15a2 2 0 002 2h10a2 2 0 002-2V7.414l.707-.707A1 1 0 0018 6.007V5a2 2 0 00-2-2H4zm2 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 3a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 text-center">
                    {product.name}
                  </h3>
                  <p className="text-red-600 text-sm text-center mb-2">
                    {product.price}
                  </p>
                  <p
                    className={`text-sm text-center font-medium mb-3 ${getStatusColor(
                      product.statusType
                    )}`}
                  >
                    {product.status}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => handleEditProduct(product.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
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
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default ShopPage;
