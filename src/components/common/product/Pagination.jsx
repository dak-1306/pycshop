import React, { useMemo } from "react";
import PropTypes from "prop-types";

const Pagination = React.memo(
  ({
    currentPage = 1,
    setCurrentPage,
    totalItems = 0,
    itemsPerPage = 10,
    variant = "default", // "admin" | "default"
  }) => {
    // Memoize calculations to prevent unnecessary re-renders
    const paginationData = useMemo(() => {
      const safeTotalItems = Math.max(0, totalItems);
      const safeCurrentPage = Math.max(1, currentPage);
      const safeItemsPerPage = Math.max(1, itemsPerPage);

      const totalPages = Math.ceil(safeTotalItems / safeItemsPerPage);
      const startItem =
        safeTotalItems > 0 ? (safeCurrentPage - 1) * safeItemsPerPage + 1 : 0;
      const endItem =
        safeTotalItems > 0
          ? Math.min(safeCurrentPage * safeItemsPerPage, safeTotalItems)
          : 0;

      return {
        totalPages,
        startItem,
        endItem,
        safeTotalItems,
        safeCurrentPage,
      };
    }, [currentPage, totalItems, itemsPerPage]);

    // Memoize visible pages calculation
    const visiblePages = useMemo(() => {
      const { totalPages, safeCurrentPage } = paginationData;
      const maxVisiblePages = 5;

      let startPage = Math.max(
        1,
        safeCurrentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      // Adjust startPage if we're near the end
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    }, [paginationData]);

    const { totalPages, startItem, endItem, safeTotalItems, safeCurrentPage } =
      paginationData;

    // Early return if no items
    if (safeTotalItems === 0) {
      return null;
    }

    const handlePrevPage = () => {
      if (setCurrentPage && safeCurrentPage > 1) {
        setCurrentPage(safeCurrentPage - 1);
      }
    };

    const handleNextPage = () => {
      if (setCurrentPage && safeCurrentPage < totalPages) {
        setCurrentPage(safeCurrentPage + 1);
      }
    };

    const handlePageClick = (page) => {
      if (setCurrentPage && page !== safeCurrentPage) {
        setCurrentPage(page);
      }
    };

    // Admin variant with blue theme
    if (variant === "admin") {
      return (
        <div className="bg-white rounded-xl shadow-lg border p-6 mt-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium flex items-center gap-2">
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Hiển thị{" "}
              <span className="font-bold text-blue-600">
                {startItem}-{endItem}
              </span>{" "}
              của <span className="font-bold">{safeTotalItems}</span> mục
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevPage}
                className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-xl disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                disabled={safeCurrentPage === 1}
                title="Trang trước"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex space-x-1">
                {visiblePages.map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                      safeCurrentPage === page
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-105 ring-2 ring-blue-200"
                        : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-800 shadow-sm hover:shadow-md"
                    }`}
                    title={`Trang ${page}`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNextPage}
                className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-xl disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
                disabled={safeCurrentPage === totalPages}
                title="Trang sau"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-0.5 duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Default variant with orange theme (seller)
    return (
      <div className="bg-white rounded-xl shadow-lg border p-6 mt-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            Hiển thị{" "}
            <span className="font-bold text-orange-600">
              {startItem}-{endItem}
            </span>{" "}
            của <span className="font-bold">{safeTotalItems}</span> sản phẩm
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              disabled={safeCurrentPage === 1}
              title="Trang trước"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-0.5 duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex space-x-1">
              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                    safeCurrentPage === page
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105 ring-2 ring-orange-200"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-800 shadow-sm hover:shadow-md"
                  }`}
                  title={`Trang ${page}`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              disabled={safeCurrentPage === totalPages}
              title="Trang sau"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-0.5 duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
);

Pagination.displayName = "Pagination";

Pagination.propTypes = {
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func.isRequired,
  totalItems: PropTypes.number,
  itemsPerPage: PropTypes.number,
  variant: PropTypes.oneOf(["admin", "default"]),
};

export default Pagination;
