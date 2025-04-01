
import React from 'react';
import ReportTemplate from './ReportTemplate';

const PartnerLedger = () => {
  return (
    <ReportTemplate 
      title="Partner Ledger" 
      description="Detailed account activity for partners"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Partner Ledger Report Module</h3>
        <p>This module will display detailed account activity for business partners.</p>
        <p className="text-muted-foreground">Coming soon with complete partner transaction history.</p>
      </div>
    </ReportTemplate>
  );
};

export default PartnerLedger;
