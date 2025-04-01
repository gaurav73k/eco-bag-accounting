
import React from 'react';
import ReportTemplate from './ReportTemplate';

const AnalyticItems = () => {
  return (
    <ReportTemplate 
      title="Analytic Items" 
      description="Business performance analytics and insights"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Analytic Items Report Module</h3>
        <p>This module will display detailed business performance analytics and insights.</p>
        <p className="text-muted-foreground">Coming soon with comprehensive business intelligence tools.</p>
      </div>
    </ReportTemplate>
  );
};

export default AnalyticItems;
