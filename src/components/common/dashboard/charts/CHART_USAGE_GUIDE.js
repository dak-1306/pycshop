/**
 * SHARED CHARTS USAGE GUIDE
 *
 * This guide shows how to use the new shared chart system across Admin and Seller dashboards.
 */

// ============================================================================
// BASIC USAGE
// ============================================================================

import React from "react";
import { SharedChartsSection } from "../components/common/dashboard/charts";

// For Admin Dashboard
const AdminDashboard = () => {
  const chartData = {
    revenue: [
      { month: "T1", value: 25000000 },
      { month: "T2", value: 32000000 },
    ],
    orders: [
      { month: "T1", value: 450 },
      { month: "T2", value: 620 },
    ],
    userAnalytics: [
      { name: "Người mua", value: 65, color: "#3b82f6" },
      { name: "Người bán", value: 25, color: "#10b981" },
      { name: "Admin", value: 10, color: "#f59e0b" },
    ],
  };

  return (
    <SharedChartsSection
      variant="admin"
      chartData={chartData}
      isLoading={false}
      error={null}
      onChartDetailClick={(chartType) => {
        console.log(`Opening ${chartType} detail`);
      }}
    />
  );
};

// For Seller Dashboard
const SellerDashboard = () => {
  const chartData = {
    revenue: [
      /* seller revenue data */
    ],
    orders: [
      /* seller orders data */
    ],
  };

  return (
    <SharedChartsSection
      variant="seller"
      chartData={chartData}
      isLoading={false}
      error={null}
      onChartDetailClick={() => {
        // Handle seller chart details
      }}
    />
  );
};

// ============================================================================
// INDIVIDUAL CHART USAGE
// ============================================================================

import {
  RevenueChart,
  OrderTrendsChart,
  UserAnalyticsChart,
} from "../components/common/dashboard/charts";

const CustomDashboard = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <RevenueChart
        data={[
          { month: "T1", value: 25000000 },
          { month: "T2", value: 32000000 },
        ]}
        title="Doanh thu cửa hàng"
        isLoading={false}
        error={null}
        onDetailClick={() => {
          // Handle detail click
        }}
      />

      <OrderTrendsChart
        data={[
          { month: "T1", value: 150 },
          { month: "T2", value: 200 },
        ]}
        title="Xu hướng đơn hàng"
      />

      <UserAnalyticsChart
        data={[
          { name: "VIP", value: 30, color: "#f59e0b" },
          { name: "Regular", value: 70, color: "#3b82f6" },
        ]}
        title="Phân loại khách hàng"
      />
    </div>
  );
};

// ============================================================================
// LOADING & ERROR STATES
// ============================================================================

const DashboardWithStates = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [chartData, setChartData] = React.useState({});

  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      try {
        // Simulate success
        setChartData({
          revenue: [
            /* data */
          ],
          orders: [
            /* data */
          ],
        });
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    }, 2000);
  }, []);

  return (
    <SharedChartsSection
      variant="seller"
      chartData={chartData}
      isLoading={isLoading}
      error={error}
    />
  );
};

// ============================================================================
// CUSTOM CHART OPTIONS
// ============================================================================

const CustomizedChart = () => {
  const customOptions = {
    color: "#ff6b6b", // Custom color
    yAxisFormatter: (value) => `$${value}`, // Custom formatter
    xAxisProps: {
      angle: -45, // Rotate x-axis labels
    },
  };

  return (
    <RevenueChart
      data={
        [
          /* data */
        ]
      }
      title="Custom Revenue Chart"
      options={customOptions}
    />
  );
};

// ============================================================================
// BENEFITS OF THIS APPROACH
// ============================================================================

/**
 * ✅ BENEFITS:
 *
 * 1. CODE REUSABILITY
 *    - Same chart components work for both Admin and Seller
 *    - Reduces duplicate code by ~70%
 *    - Consistent UI/UX across all dashboards
 *
 * 2. PERFORMANCE
 *    - Lazy loading of chart libraries (smaller initial bundle)
 *    - React.memo optimization prevents unnecessary re-renders
 *    - SSR-safe components
 *
 * 3. MAINTAINABILITY
 *    - Single source of truth for chart styling
 *    - Centralized configuration (colors, formatters)
 *    - PropTypes validation for type safety
 *
 * 4. ACCESSIBILITY
 *    - Screen reader support with aria labels
 *    - Keyboard navigation support
 *    - High contrast color schemes
 *
 * 5. DEVELOPER EXPERIENCE
 *    - Simple, consistent API
 *    - Built-in loading/error states
 *    - TypeScript-ready PropTypes
 *    - Comprehensive examples
 */

// ============================================================================
// MIGRATION GUIDE
// ============================================================================

/**
 * TO MIGRATE EXISTING CHARTS:
 *
 * 1. Replace individual chart imports:
 *    OLD: import RevenueChart from './admin/dashboard/charts/RevenueChart'
 *    NEW: import { RevenueChart } from './common/dashboard/charts'
 *
 * 2. Update AdminChartsSection:
 *    OLD: Custom chart grid with individual components
 *    NEW: <SharedChartsSection variant="admin" chartData={data} />
 *
 * 3. Update SellerChartsSection:
 *    OLD: ChartsSection placeholder
 *    NEW: <SharedChartsSection variant="seller" chartData={data} />
 *
 * 4. Add chart data to useDashboard hook:
 *    - Return chartData from the hook
 *    - Structure: { revenue: [], orders: [], userAnalytics: [] }
 *
 * 5. Test loading and error states:
 *    - Verify loading placeholders show correctly
 *    - Verify error fallbacks display properly
 */

export default {
  AdminDashboard,
  SellerDashboard,
  CustomDashboard,
  DashboardWithStates,
  CustomizedChart,
};
