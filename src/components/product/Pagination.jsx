import React from "react";

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalItems,
  itemsPerPage = 10,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 mt-8">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 font-medium">
          Hiển thị{" "}
          <span className="font-bold text-orange-600">
            {startItem}-{endItem}
          </span>{" "}
          của <span className="font-bold">{totalItems}</span> sản phẩm
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            disabled={currentPage === 1}
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
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-11 h-11 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                    currentPage === page
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105 ring-2 ring-orange-200"
                      : "text-gray-600 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:text-gray-800 shadow-sm hover:shadow-md"
                  }`}
                  title={`Trang ${page}`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            className="group p-3 text-gray-600 hover:text-white bg-gray-100 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl disabled:text-gray-300 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            disabled={currentPage === totalPages}
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
};

export default Pagination;
