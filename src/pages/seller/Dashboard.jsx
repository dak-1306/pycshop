import React from "react";
import SellerLayout from "../../components/layout/seller/SellerLayout";
import StatsCards from "../../components/common/dashboard/StatsCards";
import SharedChartsSection from "../../components/common/dashboard/charts/SharedChartsSection";
import RecentOrdersTable from "../../components/common/dashboard/RecentOrdersTable";
import { useDashboard } from "../../hooks/common/useDashboard";

const Dashboard = () => {
  const { stats, orderData, chartData, getStatusColor, isLoading, error } =
    useDashboard("seller");

  const handleChartDetailClick = (chartType) => {
    console.log(`Opening ${chartType} chart detail for seller`);
    // TODO: Navigate to detailed chart view or open modal
  };

  return (
    <SellerLayout title="Dashboard">
      <div className="p-6">
        {/* Stats Cards */}
        <StatsCards variant="seller" stats={stats} />

        {/* Charts Section */}
        <SharedChartsSection
          variant="seller"
          chartData={chartData}
          isLoading={isLoading}
          error={error}
          onChartDetailClick={handleChartDetailClick}
        />

        {/* Recent Orders Table */}
        <RecentOrdersTable
          variant="seller"
          orderData={orderData}
          getStatusColor={getStatusColor}
        />
      </div>
    </SellerLayout>
  );
};

export default Dashboard;
