
import React from 'react';
import ReportTemplate from './ReportTemplate';

const AgedPayables = () => {
  return (
    <ReportTemplate 
      title="Aged Payables" 
      description="Analysis of outstanding vendor payments by age"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Aged Payables Report Module</h3>
        <p>This module will display detailed analysis of outstanding vendor payments.</p>
        <p className="text-muted-foreground">Coming soon with complete aging schedule functionality.</p>
      </div>
    </ReportTemplate>
  );
};

export default AgedPayables;
