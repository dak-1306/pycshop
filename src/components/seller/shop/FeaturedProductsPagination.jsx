import React from "react";

const FeaturedProductsPagination = ({
  currentPage,
  setCurrentPage,
  totalPages,
}) => {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center mt-6">
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          className="group p-2 text-gray-500 hover:text-orange-600 bg-white hover:bg-orange-50 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-orange-200"
          disabled={currentPage === 1}
          title="Trang trước"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Page Numbers */}
        <div className="flex space-x-1">
          {(() => {
            const maxVisiblePages = 3; // Compact for featured products
            let startPage = Math.max(
              1,
              currentPage - Math.floor(maxVisiblePages / 2)
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

            return pages.map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg font-medium text-sm transition-all duration-200 border ${
                  currentPage === page
                    ? "bg-orange-500 text-white border-orange-500 shadow-md scale-105"
                    : "text-gray-600 hover:bg-orange-50 hover:text-orange-600 border-gray-200 hover:border-orange-200 bg-white"
                }`}
                title={`Trang ${page}`}
              >
                {page}
              </button>
            ));
          })()}
        </div>

        {/* Next Button */}
        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          className="group p-2 text-gray-500 hover:text-orange-600 bg-white hover:bg-orange-50 rounded-lg disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-orange-200"
          disabled={currentPage === totalPages}
          title="Trang sau"
        >
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Page Info */}
      <div className="ml-4 text-sm text-gray-500">
        {currentPage} / {totalPages}
      </div>
    </div>
  );
};

export default FeaturedProductsPagination;
