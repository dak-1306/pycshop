import React from "react";
import PropTypes from "prop-types";

const OrderPagination = React.memo(
  ({ currentPage = 1, setCurrentPage, totalItems = 0, itemsPerPage = 10 }) => {
    const safeTotalItems = Math.max(0, totalItems || 0);
    const safeCurrentPage = Math.max(1, currentPage || 1);
    const safeItemsPerPage = Math.max(1, itemsPerPage || 10);

    const totalPages = Math.ceil(safeTotalItems / safeItemsPerPage);

    // Early return if no items
    if (safeTotalItems === 0) {
      return null;
    }

    return (
      <div className="bg-white rounded-xl shadow-sm border p-4 mt-6">
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
            disabled={safeCurrentPage === 1}
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
                    safeCurrentPage === page
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
            onClick={() =>
              setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))
            }
            className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed transition-all"
            disabled={safeCurrentPage === totalPages}
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
          Trang {safeCurrentPage} / {totalPages} - Tổng {safeTotalItems} đơn
          hàng
        </div>
      </div>
    );
  }
);

OrderPagination.displayName = "OrderPagination";

OrderPagination.propTypes = {
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func.isRequired,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
};

export default OrderPagination;
