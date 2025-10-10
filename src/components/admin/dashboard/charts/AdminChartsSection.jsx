import React from "react";
import RevenueChart from "./RevenueChart";
import OrderTrendsChart from "./OrderTrendsChart";
import UserAnalyticsChart from "./UserAnalyticsChart";
import UserActivityChart from "./UserActivityChart";
import CategoryPerformanceChart from "./CategoryPerformanceChart";
import ChartLoadingPlaceholder from "../../../common/dashboard/ChartLoadingPlaceholder";

const AdminChartsSection = ({ chartData = {}, isLoading = false, error = null }) => {  // Extract data for each chart type
  const {
    revenue = [],
    orders = [],
    userAnalytics = [],
    userActivity = [],
    categoryPerformance = [],
  } = chartData;
  // Show loading state
  if (isLoading) {
    return (
      <div className="space-y-8 mb-8">
        {/* Main charts grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartLoadingPlaceholder title="Doanh thu hệ thống theo tháng" type="bar" />
          <ChartLoadingPlaceholder title="Phân tích người dùng" type="pie" />
          <ChartLoadingPlaceholder title="Xu hướng đơn hàng" type="line" />
          <ChartLoadingPlaceholder title="Hiệu suất danh mục" type="bar" />
        </div>
        
        {/* User activity chart */}
        <div className="grid grid-cols-1 gap-6">
          <ChartLoadingPlaceholder title="Hoạt động người dùng" type="line" />
        </div>
      </div>
    );
  }

  // Show error state with fallback data
  if (error) {
    return (
      <div className="mb-8">
        <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-orange-600">⚠️</span>
            <h3 className="text-orange-800 font-semibold">Dữ liệu biểu đồ không khả dụng</h3>
          </div>
          <p className="text-orange-700 text-sm mt-1">
            Hiển thị dữ liệu mẫu. Kết nối lại để xem dữ liệu thực.
          </p>
        </div>
          <div className="space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RevenueChart 
              data={revenue}
              title="Doanh thu hệ thống theo tháng"
            />
            <UserAnalyticsChart 
              data={userAnalytics}
              title="Phân tích người dùng"
            />
            <OrderTrendsChart 
              data={orders}
              title="Xu hướng đơn hàng"
            />
            <CategoryPerformanceChart 
              data={categoryPerformance}
              title="Hiệu suất danh mục"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <UserActivityChart 
              data={userActivity}
              title="Hoạt động người dùng theo thời gian"
            />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8 mb-8">
      {/* Main charts grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* System Revenue Chart */}
        <RevenueChart 
          data={revenue}
          title="Doanh thu hệ thống theo tháng"
        />

        {/* User Analytics Pie Chart */}
        <UserAnalyticsChart 
          data={userAnalytics}
          title="Phân tích người dùng"
        />

        {/* Order Trends Line Chart */}
        <OrderTrendsChart 
          data={orders}
          title="Xu hướng đơn hàng"
        />

        {/* Category Performance Chart */}
        <CategoryPerformanceChart 
          data={categoryPerformance}
          title="Hiệu suất danh mục"
        />
      </div>

      {/* User Activity Chart - Full width */}
      <div className="grid grid-cols-1 gap-6">
        <UserActivityChart 
          data={userActivity}
          title="Hoạt động người dùng theo thời gian"
        />
      </div>
    </div>
  );
};

export default AdminChartsSection;
