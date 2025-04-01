
import React from 'react';
import ReportTemplate from './ReportTemplate';

const GeneralLedger = () => {
  return (
    <ReportTemplate 
      title="General Ledger" 
      description="Complete transaction history for all accounts"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">General Ledger Report Module</h3>
        <p>This module will display the complete general ledger with detailed transaction history.</p>
        <p className="text-muted-foreground">Coming soon with complete account activity tracking.</p>
      </div>
    </ReportTemplate>
  );
};

export default GeneralLedger;
