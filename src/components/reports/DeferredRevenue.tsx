
import React from 'react';
import ReportTemplate from './ReportTemplate';

const DeferredRevenue = () => {
  return (
    <ReportTemplate 
      title="Deferred Revenue" 
      description="Revenue recognition schedule for deferred revenue"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Deferred Revenue Report Module</h3>
        <p>This module will display detailed revenue recognition schedules.</p>
        <p className="text-muted-foreground">Coming soon with complete deferred revenue tracking.</p>
      </div>
    </ReportTemplate>
  );
};

export default DeferredRevenue;
