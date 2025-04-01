
import React from 'react';
import ReportTemplate from './ReportTemplate';

const DisallowedExpenses = () => {
  return (
    <ReportTemplate 
      title="Disallowed Expenses" 
      description="Summary of non-deductible expenses"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Disallowed Expenses Report Module</h3>
        <p>This module will display detailed tracking of non-deductible expenses.</p>
        <p className="text-muted-foreground">Coming soon with complete tax compliance tracking.</p>
      </div>
    </ReportTemplate>
  );
};

export default DisallowedExpenses;
