
import React from 'react';
import ReportTemplate from './ReportTemplate';

const JournalAudit = () => {
  return (
    <ReportTemplate 
      title="Journal Audit" 
      description="Audit trail of all journal entries"
    >
      <div className="space-y-4 text-center py-12">
        <h3 className="text-xl">Journal Audit Report Module</h3>
        <p>This module will display an audit trail of all journal entries with change history.</p>
        <p className="text-muted-foreground">Coming soon with complete audit trail functionality.</p>
      </div>
    </ReportTemplate>
  );
};

export default JournalAudit;
