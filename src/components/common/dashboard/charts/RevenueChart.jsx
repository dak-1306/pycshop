import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ChartWrapper from "./ChartWrapper";
import {
  formatCurrency,
  formatLargeNumber,
  normalizeChartData,
  chartContainerClass,
  chartHeaderClass,
  chartTitleClass,
  chartLegendClass,
  chartLegendItemClass,
  chartFooterClass,
  defaultColors,
} from "./chartUtils";

const RevenueChart = React.memo(
  ({
    data = [],
    title = "Doanh thu theo tháng",
    isLoading = false,
    error = null,
    height = 320,
    options = {},
    onDetailClick = null,
  }) => {
    // Normalize and validate data
    const chartData = useMemo(
      () => normalizeChartData(data, "revenue"),
      [data]
    );

    // Custom tooltip component
    const CustomTooltip = useMemo(
      () =>
        ({ active, payload, label }) => {
          if (active && payload && payload.length) {
            return (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{`Tháng ${label}`}</p>
                <p className="text-blue-600">
                  {`Doanh thu: ${formatCurrency(payload[0].value)}`}
                </p>
              </div>
            );
          }
          return null;
        },
      []
    );

    // Chart options
    const chartOptions = useMemo(
      () => ({
        xKey: "month",
        yKey: "value",
        color: defaultColors.revenue,
        yAxisFormatter: formatLargeNumber,
        customTooltip: CustomTooltip,
        ...options,
      }),
      [options, CustomTooltip]
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
          <h3 className={chartTitleClass}>{title}</h3>
          <div className="flex items-center space-x-4">
            <div className={chartLegendClass}>
              <div className={chartLegendItemClass}>
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Doanh thu (VNĐ)</span>
              </div>
            </div>
            {onDetailClick && (
              <button
                onClick={onDetailClick}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Chi tiết
              </button>
            )}
          </div>
        </div>

        <ChartWrapper
          type="bar"
          data={chartData}
          options={chartOptions}
          height={height}
          title={title}
          isLoading={isLoading}
          formatters={{ formatCurrency, formatLargeNumber }}
        />

        <div className={chartFooterClass}>
          <span>Bar Chart</span>
          <span>Dữ liệu thời gian thực</span>
        </div>
      </div>
    );
  }
);

RevenueChart.displayName = "RevenueChart";

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    })
  ),
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  options: PropTypes.object,
  onDetailClick: PropTypes.func,
};

export default RevenueChart;
