
import React from 'react';
import ReportTemplate from './ReportTemplate';

const InvoiceAnalysis = () => {
  return (
    <ReportTemplate 
      title="Invoice Analysis" 
      description="Performance metrics and analysis for invoices"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Invoice Analysis Report Module</h3>
        <p>This module will display detailed analysis of invoice performance and metrics.</p>
        <p className="text-muted-foreground">Coming soon with complete invoice analytics functionality.</p>
      </div>
    </ReportTemplate>
  );
};

export default InvoiceAnalysis;
