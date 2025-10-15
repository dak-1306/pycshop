import React from "react";
import { Link } from "react-router-dom";
import SellerLayout from "../../components/layout/SellerLayout";
import StatsCards from "../../components/common/dashboard/StatsCards";
import ChartsSection from "../../components/common/dashboard/ChartsSection";
import RecentOrdersTable from "../../components/common/dashboard/RecentOrdersTable";
import { useDashboard } from "../../hooks/common/useDashboard";

const Dashboard = () => {
  const { stats, orderData, getStatusColor } = useDashboard("seller");

  return (
    <SellerLayout title="Dashboard">
      <div className="p-6">
        {/* Stats Cards */}
        <StatsCards variant="seller" stats={stats} />

        {/* Charts Section */}
        <ChartsSection variant="seller" />

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
