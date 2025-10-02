import React from "react";

const ProductTable = ({
  products,
  onViewProduct,
  onEditProduct,
  onDeleteProduct,
  getStatusColor,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Danh sách sản phẩm
        </h3>
      </div>
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Ảnh
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Tên sản phẩm
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Giá
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Số lượng
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Danh mục
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={`transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:shadow-md transform hover:-translate-y-0.5 ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
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
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {product.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.price}₫</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.quantity}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{product.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    product.status
                  )}`}
                >
                  {product.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center gap-2">
                  {/* View Button */}
                  <button
                    onClick={() => onViewProduct(product.id)}
                    className="group relative p-2 text-green-600 hover:text-white bg-green-50 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
                    title="Xem chi tiết sản phẩm"
                  >
                    <svg
                      className="w-5 h-5 transition-transform group-hover:scale-110 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      👁️ Xem chi tiết
                    </div>
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => onEditProduct(product.id)}
                    className="group relative p-2 text-blue-600 hover:text-white bg-blue-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
                    title="Chỉnh sửa sản phẩm"
                  >
                    <svg
                      className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      ✏️ Chỉnh sửa
                    </div>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => onDeleteProduct(product.id)}
                    className="group relative p-2 text-red-600 hover:text-white bg-red-50 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 shadow-sm hover:shadow-lg"
                    title="Xóa sản phẩm"
                  >
                    <svg
                      className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      🗑️ Xóa
                    </div>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
