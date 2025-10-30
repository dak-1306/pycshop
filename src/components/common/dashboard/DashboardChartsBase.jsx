import React, { useMemo } from "react";
import PropTypes from "prop-types";
import RevenueChart from "./charts/RevenueChart";
import OrderTrendsChart from "./charts/OrderTrendsChart";
import UserAnalyticsChart from "./charts/UserAnalyticsChart";
import { DASHBOARD_CHART_CONFIGS } from "../../../lib/constants/chartConstants";

const DashboardChartsBase = ({
  variant = "seller",
  chartData = {},
  onChartClick,
  isLoading = false,
  error = null,
}) => {
  // Get chart component based on type
  const getChartComponent = (type) => {
    const components = {
      revenue: RevenueChart,
      orders: OrderTrendsChart,
      userAnalytics: UserAnalyticsChart,
    };
    return components[type];
  };

  // Configuration-driven chart rendering
  const chartConfigs = useMemo(() => {
    const configs = DASHBOARD_CHART_CONFIGS[variant] || [];

    return configs
      .map((config) => ({
        ...config,
        component: getChartComponent(config.type),
        data: chartData[config.dataKey] || [],
        isVisible: config.permissions.includes(variant),
      }))
      .filter((config) => config.isVisible && config.component);
  }, [variant, chartData]);

  // Error state
  if (error) {
    return (
      <div className="dashboard-charts-error bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2">
          <span className="text-red-600">⚠️</span>
          <h3 className="text-red-800 font-semibold">Lỗi tải biểu đồ</h3>
        </div>
        <p className="text-red-700 text-sm mt-1">{error}</p>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    const loadingGridClasses =
      variant === "admin"
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        : "grid grid-cols-1 md:grid-cols-2 gap-6";

    const loadingItems = variant === "admin" ? [1, 2, 3] : [1, 2];

    return (
      <div className={`dashboard-charts-loading ${loadingGridClasses}`}>
        {loadingItems.map((i) => (
          <div
            key={i}
            className={`bg-white rounded-xl p-6 shadow-sm border animate-pulse ${
              variant === "admin" && i === 1
                ? "md:col-span-2 lg:col-span-2"
                : variant === "admin" && i === 3
                ? "md:col-span-2 lg:col-span-3"
                : variant === "seller"
                ? "col-span-2"
                : "col-span-1"
            }`}
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div
              className={`bg-gray-200 rounded ${
                variant === "admin" && (i === 1 || i === 3) ? "h-80" : "h-64"
              }`}
            ></div>
          </div>
        ))}
      </div>
    );
  }

  // No charts configured
  if (chartConfigs.length === 0) {
    return (
      <div className="dashboard-charts-empty bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          Không có biểu đồ nào được cấu hình cho {variant}
        </p>
      </div>
    );
  }

  // Dynamic grid classes based on variant
  const getGridClasses = () => {
    if (variant === "admin") {
      return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8";
    } else {
      return "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8";
    }
  };

  return (
    <div className="dashboard-charts-base">
      <div className={getGridClasses()}>
        {chartConfigs.map(({ id, component: ChartComponent, ...config }) => {
          if (!ChartComponent) return null;

          return (
            <div key={id} className={config.containerClass || "col-span-1"}>
              <ChartComponent
                {...config}
                data={config.data}
                isLoading={isLoading}
                onChartClick={() => onChartClick?.(id)}
                variant={variant}
                error={error}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

DashboardChartsBase.propTypes = {
  variant: PropTypes.oneOf(["admin", "seller"]).isRequired,
  chartData: PropTypes.object.isRequired,
  onChartClick: PropTypes.func,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
};

DashboardChartsBase.displayName = "DashboardChartsBase";

export default React.memo(DashboardChartsBase);
