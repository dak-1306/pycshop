import React, { useMemo } from "react";
import PropTypes from "prop-types";
import RevenueChart from "./RevenueChart";
import OrderTrendsChart from "./OrderTrendsChart";
import UserAnalyticsChart from "./UserAnalyticsChart";
import ChartLoadingPlaceholder from "../ChartLoadingPlaceholder";

const SharedChartsSection = React.memo(
  ({
    chartData = {},
    isLoading = false,
    error = null,
    variant = "seller", // "admin" | "seller"
    onChartDetailClick = null,
  }) => {
    // Extract chart data with fallbacks
    const { revenue = [], orders = [], userAnalytics = [] } = chartData;

    // Chart configurations based on variant
    const chartConfigs = useMemo(() => {
      if (variant === "admin") {
        return [
          {
            id: "revenue",
            component: RevenueChart,
            data: revenue,
            title: "Doanh thu hệ thống theo tháng",
            props: { onDetailClick: () => onChartDetailClick?.("revenue") },
          },
          {
            id: "userAnalytics",
            component: UserAnalyticsChart,
            data: userAnalytics,
            title: "Phân tích người dùng",
            props: {
              onDetailClick: () => onChartDetailClick?.("userAnalytics"),
            },
          },
          {
            id: "orders",
            component: OrderTrendsChart,
            data: orders,
            title: "Xu hướng đơn hàng",
            props: { onDetailClick: () => onChartDetailClick?.("orders") },
          },
        ];
      } else {
        return [
          {
            id: "revenue",
            component: RevenueChart,
            data: revenue,
            title: "Doanh thu theo tháng",
            props: { onDetailClick: () => onChartDetailClick?.("revenue") },
          },
          {
            id: "orders",
            component: OrderTrendsChart,
            data: orders,
            title: "Đơn hàng theo tháng",
            props: { onDetailClick: () => onChartDetailClick?.("orders") },
          },
        ];
      }
    }, [variant, revenue, orders, userAnalytics, onChartDetailClick]);

    // Grid layout based on variant
    const gridClass =
      variant === "admin"
        ? "grid grid-cols-1 xl:grid-cols-2 gap-6"
        : "grid grid-cols-1 lg:grid-cols-2 gap-6";

    // Loading state
    if (isLoading) {
      return (
        <div className="space-y-8 mb-8">
          <div className={gridClass}>
            {chartConfigs.map((config) => (
              <ChartLoadingPlaceholder
                key={config.id}
                title={config.title}
                type={
                  config.id === "userAnalytics"
                    ? "pie"
                    : config.id === "orders"
                    ? "line"
                    : "bar"
                }
              />
            ))}
          </div>

          {/* Additional charts for admin */}
          {variant === "admin" && (
            <>
              <div className={gridClass}>
                <ChartLoadingPlaceholder
                  title="Hiệu suất danh mục"
                  type="bar"
                />
              </div>
              <div className="grid grid-cols-1 gap-6">
                <ChartLoadingPlaceholder
                  title="Hoạt động người dùng"
                  type="area"
                />
              </div>
            </>
          )}
        </div>
      );
    }

    // Error state with fallback data
    if (error) {
      return (
        <div className="mb-8">
          <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-orange-600">⚠️</span>
              <h3 className="text-orange-800 font-semibold">
                Dữ liệu biểu đồ không khả dụng
              </h3>
            </div>
            <p className="text-orange-700 text-sm mt-1">
              Hiển thị dữ liệu mẫu. Kết nối lại để xem dữ liệu thực.
            </p>
          </div>
          <div className="space-y-8">
            <div className={gridClass}>
              {chartConfigs.map((config) => {
                const ChartComponent = config.component;
                return (
                  <ChartComponent
                    key={config.id}
                    data={config.data}
                    title={config.title}
                    error={error}
                    {...config.props}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // Normal render
    return (
      <div className="space-y-8 mb-8">
        {/* Main charts grid */}
        <div className={gridClass}>
          {chartConfigs.map((config) => {
            const ChartComponent = config.component;
            return (
              <ChartComponent
                key={config.id}
                data={config.data}
                title={config.title}
                isLoading={isLoading}
                {...config.props}
              />
            );
          })}
        </div>

        {/* Additional charts for admin variant */}
        {variant === "admin" && (
          <>
            {/* Category Performance Chart */}
            <div className={gridClass}>
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hiệu suất danh mục
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Doanh số</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">Doanh thu</span>
                    </div>
                  </div>
                </div>
                <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      Biểu đồ hiệu suất danh mục
                    </p>
                    <button className="mt-3 text-blue-600 hover:text-blue-700 text-xs font-medium">
                      Tích hợp biểu đồ
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Bar Chart</span>
                  <span>Dữ liệu thời gian thực</span>
                </div>
              </div>
            </div>

            {/* User Activity Chart - Full width */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Hoạt động người dùng theo thời gian
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Người dùng online
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Phiên hoạt động
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      Biểu đồ hoạt động người dùng
                    </p>
                    <button className="mt-3 text-blue-600 hover:text-blue-700 text-xs font-medium">
                      Tích hợp biểu đồ
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>Area Chart</span>
                  <span>Cập nhật mỗi 5 phút</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);

SharedChartsSection.displayName = "SharedChartsSection";

SharedChartsSection.propTypes = {
  chartData: PropTypes.shape({
    revenue: PropTypes.array,
    orders: PropTypes.array,
    userAnalytics: PropTypes.array,
    userActivity: PropTypes.array,
    categoryPerformance: PropTypes.array,
    products: PropTypes.array,
  }),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  variant: PropTypes.oneOf(["admin", "seller"]),
  onChartDetailClick: PropTypes.func,
};

export default SharedChartsSection;
