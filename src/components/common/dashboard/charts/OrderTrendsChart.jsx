import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ChartWrapper from "./ChartWrapper";
import {
  normalizeChartData,
  chartContainerClass,
  chartHeaderClass,
  chartTitleClass,
  chartLegendClass,
  chartLegendItemClass,
  chartFooterClass,
} from "../../../../lib/utils";
import { CHART_COLORS } from "../../../../lib/constants";

const OrderTrendsChart = React.memo(
  ({
    data = [],
    title = "Xu hướng đơn hàng",
    subtitle,
    chartOptions = {},
    variant = "seller",
    isLoading = false,
    error = null,
    height = 320,
    options = {}, // Legacy support
    onDetailClick = null,
    onChartClick,
  }) => {
    // Normalize and validate data
    const chartData = useMemo(() => normalizeChartData(data, "orders"), [data]);

    // Custom tooltip component
    const CustomTooltip = useMemo(
      () =>
        ({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{`Tháng ${label}`}</p>
                <p className="text-green-600">
                  {`Đơn hàng: ${payload[0].value.toLocaleString("vi-VN")}`}
                </p>
                {variant === "admin" && (
                  <p className="text-gray-500 text-sm">Tất cả cửa hàng</p>
                )}
              </div>
            );
          }
          return null;
        },
      [variant]
    );

    // Merge chart options
    const finalChartOptions = useMemo(
      () => ({
        xKey: "month",
        yKey: "value",
        color: chartOptions.color || CHART_COLORS.orders,
        customTooltip: CustomTooltip,
        height: chartOptions.height || height,
        margin: { top: 20, right: 30, left: 20, bottom: 5 },
        ...options, // Legacy support
        ...chartOptions, // New config system
      }),
      [options, chartOptions, CustomTooltip, height]
    );

    // Error state
    if (error) {
      return (
        <div className={chartContainerClass}>
          <div className={chartHeaderClass}>
            <h3 className={chartTitleClass}>{title}</h3>
          </div>
          <div className="h-64 flex items-center justify-center bg-red-50 rounded-lg border-2 border-dashed border-red-200">
            <div className="text-center">
              <span className="text-red-500 text-sm">
                ⚠️ Không thể tải dữ liệu biểu đồ
              </span>
              <p className="text-red-400 text-xs mt-1">
                Đang hiển thị dữ liệu mẫu
              </p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={chartContainerClass}>
        <div className={chartHeaderClass}>
          <div>
            <h3 className={chartTitleClass}>{title}</h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className={chartLegendClass}>
              <div className={chartLegendItemClass}>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Số đơn hàng</span>
              </div>
            </div>
            {(onDetailClick || onChartClick) && (
              <button
                onClick={onDetailClick || onChartClick}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Chi tiết →
              </button>
            )}
          </div>
        </div>

        <ChartWrapper
          type="line"
          data={chartData}
          options={finalChartOptions}
          height={finalChartOptions.height}
          title={title}
          isLoading={isLoading}
        />

        <div className={chartFooterClass}>
          <span>Line Chart</span>
          <span>Dữ liệu thời gian thực</span>
        </div>
      </div>
    );
  }
);

OrderTrendsChart.displayName = "OrderTrendsChart";

OrderTrendsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  chartOptions: PropTypes.object,
  variant: PropTypes.oneOf(["admin", "seller"]),
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.object, // Legacy support
  onDetailClick: PropTypes.func,
  onChartClick: PropTypes.func,
};

export default OrderTrendsChart;
