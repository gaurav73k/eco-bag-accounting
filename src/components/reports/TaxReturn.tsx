
import React from 'react';
import ReportTemplate from './ReportTemplate';

const TaxReturn = () => {
  return (
    <ReportTemplate 
      title="Tax Return" 
      description="Annual tax filing summary and tax calculation"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Tax Return Report Module</h3>
        <p>This module will display detailed tax return information.</p>
        <p className="text-muted-foreground">Coming soon with complete tax calculation functionality.</p>
      </div>
    </ReportTemplate>
  );
};

export default TaxReturn;
