import React from "react";
import { Link } from "react-router-dom";
import SellerLayout from "../../components/layout/SellerLayout";
import StatsCards from "../../components/dashboard/StatsCards";
import ChartsSection from "../../components/dashboard/ChartsSection";
import RecentOrdersTable from "../../components/dashboard/RecentOrdersTable";
import { useDashboard } from "../../hooks/useDashboard";

const Dashboard = () => {
  const { stats, orderData, getStatusColor } = useDashboard();

  return (
    <SellerLayout title="Dashboard">
      <div className="p-8">
        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts Section */}
        <ChartsSection />

        {/* Recent Orders Table */}
        <RecentOrdersTable
          orderData={orderData}
          getStatusColor={getStatusColor}
        />
      </div>
    </SellerLayout>
  );
};

export default Dashboard;
