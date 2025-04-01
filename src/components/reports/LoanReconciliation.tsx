
import React from 'react';
import ReportTemplate from './ReportTemplate';

const LoanReconciliation = () => {
  return (
    <ReportTemplate 
      title="Loan Reconciliation" 
      description="Verification of loan balances with lender statements"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Loan Reconciliation Report Module</h3>
        <p>This module will display detailed loan reconciliation information.</p>
        <p className="text-muted-foreground">Coming soon with complete loan balance verification tools.</p>
      </div>
    </ReportTemplate>
  );
};

export default LoanReconciliation;
