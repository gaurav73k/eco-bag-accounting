
import React from 'react';
import ReportTemplate from './ReportTemplate';

const LoanAnalysis = () => {
  return (
    <ReportTemplate 
      title="Loan Analysis" 
      description="Detailed analysis of loan payments and balances"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Loan Analysis Report Module</h3>
        <p>This module will display detailed analysis of loan payments, interest, and balances.</p>
        <p className="text-muted-foreground">Coming soon with complete loan tracking functionality.</p>
      </div>
    </ReportTemplate>
  );
};

export default LoanAnalysis;
