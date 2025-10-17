import React, { Suspense, useMemo } from "react";
import PropTypes from "prop-types";
import ChartLoadingPlaceholder from "../ChartLoadingPlaceholder";

// Client-side check for SSR safety
const isBrowser = typeof window !== "undefined";

// Lazy load chart components to reduce bundle size
const LazyBarChart = React.lazy(() =>
  import("recharts").then((module) => ({
    default: ({ data, options = {}, formatters = {} }) => {
      const {
        BarChart,
        Bar,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
      } = module;
      const { formatLargeNumber = (v) => v } = formatters;

      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={options.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={options.xKey || "month"}
              tick={{ fontSize: 12 }}
              stroke="#666"
              {...options.xAxisProps}
            />
            <YAxis
              tickFormatter={options.yAxisFormatter || formatLargeNumber}
              tick={{ fontSize: 12 }}
              stroke="#666"
              {...options.yAxisProps}
            />
            <Tooltip content={options.customTooltip} />
            <Bar
              dataKey={options.yKey || "value"}
              fill={options.color || "#3b82f6"}
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      );
    },
  }))
);

const LazyLineChart = React.lazy(() =>
  import("recharts").then((module) => ({
    default: ({ data, options = {} }) => {
      const {
        LineChart,
        Line,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
      } = module;

      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={options.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={options.xKey || "month"}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <Tooltip content={options.customTooltip} />
            <Line
              type="monotone"
              dataKey={options.yKey || "value"}
              stroke={options.color || "#10b981"}
              strokeWidth={3}
              dot={{ fill: options.color || "#10b981", strokeWidth: 2, r: 4 }}
              activeDot={{
                r: 6,
                stroke: options.color || "#10b981",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    },
  }))
);

const LazyPieChart = React.lazy(() =>
  import("recharts").then((module) => ({
    default: ({ data, options = {} }) => {
      const { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } =
        module;

      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={options.customLabel}
              outerRadius={options.radius || 80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={options.customTooltip} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry.color }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      );
    },
  }))
);

const LazyAreaChart = React.lazy(() =>
  import("recharts").then((module) => ({
    default: ({ data, options = {} }) => {
      const {
        AreaChart,
        Area,
        XAxis,
        YAxis,
        CartesianGrid,
        Tooltip,
        ResponsiveContainer,
      } = module;

      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={options.margin}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey={options.xKey || "time"}
              tick={{ fontSize: 12 }}
              stroke="#666"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
            <Tooltip content={options.customTooltip} />
            {options.areas &&
              options.areas.map((area, index) => (
                <Area
                  key={index}
                  type="monotone"
                  dataKey={area.dataKey}
                  stackId={area.stackId}
                  stroke={area.stroke}
                  fill={area.fill}
                  fillOpacity={area.fillOpacity || 0.6}
                />
              ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    },
  }))
);

const ChartWrapper = ({
  type = "bar",
  data = [],
  options = {},
  height = 320,
  title = "",
  isLoading = false,
  formatters = {},
}) => {
  // Memoize chart options to prevent re-creation (must be before early returns)
  const chartOptions = useMemo(
    () => ({
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      ...options,
    }),
    [options]
  );

  // SSR safety - return placeholder on server
  if (!isBrowser) {
    return (
      <div
        style={{ height }}
        className="bg-gray-50 rounded-lg flex items-center justify-center"
        aria-hidden
      >
        <span className="text-gray-400 text-sm">Loading chart...</span>
      </div>
    );
  }

  // Show loading placeholder
  if (isLoading) {
    return <ChartLoadingPlaceholder title={title} type={type} />;
  }

  // Select appropriate chart component
  const renderChart = () => {
    const commonProps = { data, options: chartOptions, formatters };

    switch (type) {
      case "bar":
        return <LazyBarChart {...commonProps} />;
      case "line":
        return <LazyLineChart {...commonProps} />;
      case "pie":
        return <LazyPieChart {...commonProps} />;
      case "area":
        return <LazyAreaChart {...commonProps} />;
      default:
        return <LazyBarChart {...commonProps} />;
    }
  };

  return (
    <div style={{ height }} className="chart-wrapper">
      {title && <h3 className="sr-only">{title}</h3>}
      <Suspense
        fallback={
          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <span className="text-gray-500 text-sm">Loading chart...</span>
            </div>
          </div>
        }
      >
        {renderChart()}
      </Suspense>
    </div>
  );
};

ChartWrapper.propTypes = {
  type: PropTypes.oneOf(["bar", "line", "pie", "area"]).isRequired,
  data: PropTypes.array.isRequired,
  options: PropTypes.object,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  isLoading: PropTypes.bool,
  formatters: PropTypes.shape({
    formatCurrency: PropTypes.func,
    formatLargeNumber: PropTypes.func,
  }),
};

export default React.memo(ChartWrapper);
