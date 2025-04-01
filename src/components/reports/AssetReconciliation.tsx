
import React from 'react';
import ReportTemplate from './ReportTemplate';

const AssetReconciliation = () => {
  return (
    <ReportTemplate 
      title="Asset Reconciliation" 
      description="Verification of physical assets with accounting records"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Asset Reconciliation Report Module</h3>
        <p>This module will display detailed asset reconciliation information.</p>
        <p className="text-muted-foreground">Coming soon with complete asset verification tools.</p>
      </div>
    </ReportTemplate>
  );
};

export default AssetReconciliation;
