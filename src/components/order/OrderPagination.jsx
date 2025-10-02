import React from "react";

const OrderPagination = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage = 10,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 mt-6">
      <div className="flex items-center justify-center space-x-3">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
          disabled={currentPage === 1}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <div className="flex space-x-2">
          {[...Array(Math.min(totalPages, 5))].map((_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
          disabled={currentPage === totalPages}
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="text-center mt-3 text-sm text-gray-600">
        Trang {currentPage} / {totalPages} - Tổng {totalItems} đơn hàng
      </div>
    </div>
  );
};

export default OrderPagination;
