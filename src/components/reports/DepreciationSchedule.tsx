
import React from 'react';
import ReportTemplate from './ReportTemplate';

const DepreciationSchedule = () => {
  return (
    <ReportTemplate 
      title="Depreciation Schedule" 
      description="Detailed depreciation schedule for fixed assets"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Depreciation Schedule Report Module</h3>
        <p>This module will display detailed depreciation schedules for all fixed assets.</p>
        <p className="text-muted-foreground">Coming soon with complete asset depreciation tracking.</p>
      </div>
    </ReportTemplate>
  );
};

export default DepreciationSchedule;
