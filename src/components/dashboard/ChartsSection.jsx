import React from "react";

const ChartsSection = () => {
  const charts = [
    {
      id: "revenue",
      title: "Biểu đồ cột doanh thu theo tháng",
      type: "bar",
      placeholder: "Biểu đồ cột doanh thu theo tháng",
    },
    {
      id: "products",
      title: "Phân tích sản phẩm",
      type: "pie",
      placeholder: "Biểu đồ tròn\nphân loại sản phẩm",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="bg-white rounded-xl p-6 shadow-sm border"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {chart.title}
          </h3>

          {chart.type === "bar" ? (
            <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
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
                </div>
                <p className="text-gray-500 text-sm">{chart.placeholder}</p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-xs whitespace-pre-line">
                      {chart.placeholder}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Future enhancement: Add real chart integration */}
          <div className="mt-4 text-center">
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              📊 Tích hợp biểu đồ thực tế
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartsSection;
