import React from "react";
import SharedChartsSection from "../../../common/dashboard/charts/SharedChartsSection";

const AdminChartsSection = ({
  chartData = {},
  isLoading = false,
  error = null,
}) => {
  const handleChartDetailClick = (chartType) => {
    console.log(`Opening detail for ${chartType} chart`);
    // TODO: Implement chart detail modal or navigation
  };

  return (
    <SharedChartsSection
      chartData={chartData}
      isLoading={isLoading}
      error={error}
      variant="admin"
      onChartDetailClick={handleChartDetailClick}
    />
  );
};

export default AdminChartsSection;
