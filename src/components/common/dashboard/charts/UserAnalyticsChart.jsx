import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ChartWrapper from "./ChartWrapper";
import {
  normalizeChartData,
  chartContainerClass,
  chartHeaderClass,
  chartTitleClass,
  chartFooterClass,
} from "../../../../lib/utils";
import { CHART_COLORS } from "../../../../lib/constants";

const UserAnalyticsChart = React.memo(
  ({
    data = [],
    title = "Phân tích người dùng",
    subtitle,
    chartOptions = {},
    variant = "admin", // UserAnalytics is mainly for admin
    isLoading = false,
    error = null,
    height = 320,
    options = {}, // Legacy support
    onDetailClick = null,
    onChartClick,
  }) => {
    // Normalize and validate data
    const chartData = useMemo(
      () => normalizeChartData(data, "userAnalytics"),
      [data]
    );

    // Custom tooltip component
    const CustomTooltip = useMemo(
      () =>
        ({ active, payload }) => {
          if (active && payload && payload.length) {
            const data = payload[0];
            return (
              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                <p className="font-medium text-gray-900">{data.name}</p>
                <p style={{ color: data.payload.color }}>
                  {`Tỉ lệ: ${data.value}%`}
                </p>
              </div>
            );
          }
          return null;
        },
      []
    );

    // Custom label function for pie chart
    const renderCustomizedLabel = useMemo(
      () =>
        ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill="white"
              textAnchor={x > cx ? "start" : "end"}
              dominantBaseline="central"
              fontSize={12}
              fontWeight="bold"
            >
              {`${(percent * 100).toFixed(0)}%`}
            </text>
          );
        },
      []
    );

    // Merge chart options
    const finalChartOptions = useMemo(
      () => ({
        customTooltip: CustomTooltip,
        customLabel: renderCustomizedLabel,
        radius: chartOptions.radius || 80,
        colors: chartOptions.colors || [
          CHART_COLORS.users,
          CHART_COLORS.secondary,
          CHART_COLORS.accent,
        ],
        height: chartOptions.height || height,
        ...options, // Legacy support
        ...chartOptions, // New config system
      }),
      [options, chartOptions, CustomTooltip, renderCustomizedLabel, height]
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
            <div className="text-sm text-gray-600">Phân loại theo vai trò</div>
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
          type="pie"
          data={chartData}
          options={finalChartOptions}
          height={finalChartOptions.height}
          title={title}
          isLoading={isLoading}
        />

        <div className={chartFooterClass}>
          <span>Pie Chart</span>
          <span>Dữ liệu thời gian thực</span>
        </div>
      </div>
    );
  }
);

UserAnalyticsChart.displayName = "UserAnalyticsChart";

UserAnalyticsChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      color: PropTypes.string,
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

export default UserAnalyticsChart;
