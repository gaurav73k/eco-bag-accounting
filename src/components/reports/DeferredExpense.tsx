
import React from 'react';
import ReportTemplate from './ReportTemplate';

const DeferredExpense = () => {
  return (
    <ReportTemplate 
      title="Deferred Expense" 
      description="Expense recognition schedule for deferred expenses"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Deferred Expense Report Module</h3>
        <p>This module will display detailed expense recognition schedules.</p>
        <p className="text-muted-foreground">Coming soon with complete deferred expense tracking.</p>
      </div>
    </ReportTemplate>
  );
};

export default DeferredExpense;
