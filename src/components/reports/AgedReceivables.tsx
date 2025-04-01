
import React from 'react';
import ReportTemplate from './ReportTemplate';

const AgedReceivables = () => {
  return (
    <ReportTemplate 
      title="Aged Receivables" 
      description="Analysis of outstanding customer payments by age"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Aged Receivables Report Module</h3>
        <p>This module will display detailed analysis of outstanding customer payments.</p>
        <p className="text-muted-foreground">Coming soon with complete aging schedule functionality.</p>
      </div>
    </ReportTemplate>
  );
};

export default AgedReceivables;
