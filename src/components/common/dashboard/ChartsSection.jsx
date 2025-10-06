import React from "react";

const ChartsSection = ({ variant = "seller" }) => {
  // Admin charts configuration
  const adminCharts = [
    {
      id: "systemRevenue",
      title: "Doanh thu hệ thống theo tháng",
      type: "bar",
      placeholder: "Biểu đồ cột doanh thu toàn hệ thống",
    },
    {
      id: "userAnalytics",
      title: "Phân tích người dùng",
      type: "pie",
      placeholder: "Biểu đồ tròn\nphân loại người dùng",
    },
    {
      id: "orderTrends",
      title: "Xu hướng đơn hàng",
      type: "line",
      placeholder: "Biểu đồ đường\nxu hướng đơn hàng",
    },
    {
      id: "categoryPerformance",
      title: "Hiệu suất danh mục",
      type: "bar",
      placeholder: "Biểu đồ cột\nhiệu suất danh mục",
    },
  ];

  // Seller charts configuration
  const sellerCharts = [
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

  const charts = variant === "admin" ? adminCharts : sellerCharts;
  const gridCols =
    variant === "admin"
      ? "grid-cols-1 xl:grid-cols-2"
      : "grid-cols-1 lg:grid-cols-2";

  const renderChartIcon = (type) => {
    switch (type) {
      case "bar":
        return (
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
        );
      case "pie":
        return (
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
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
        );
      case "line":
        return (
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
              d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
          </svg>
        );
      default:
        return (
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
        );
    }
  };

  return (
    <div className={`grid ${gridCols} gap-6 mb-8`}>
      {charts.map((chart) => (
        <div
          key={chart.id}
          className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {chart.title}
            </h3>
            {variant === "admin" && (
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Chi tiết
              </button>
            )}
          </div>

          <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-lg flex items-center justify-center shadow-sm">
                {renderChartIcon(chart.type)}
              </div>
              <p className="text-gray-500 text-sm whitespace-pre-line">
                {chart.placeholder}
              </p>
              <button className="mt-3 text-blue-600 hover:text-blue-700 text-xs font-medium">
                Tích hợp biểu đồ
              </button>
            </div>
          </div>

          {/* Chart type indicator */}
          <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
            <span className="capitalize">{chart.type} chart</span>
            <span>Dữ liệu thời gian thực</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChartsSection;
