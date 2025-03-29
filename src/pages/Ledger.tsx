
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen } from 'lucide-react';
import EntryDialog from '@/components/ui/entry-dialog';
import LedgerEntryForm from '@/components/forms/LedgerEntryForm';
import { toast } from 'sonner';

const Ledger: React.FC = () => {
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  
  const handleAddNewEntry = (data: any) => {
    console.log('New ledger entry:', data);
    toast.success('Ledger entry added successfully');
    setShowNewEntryDialog(false);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="General Ledger" 
          description="Manage accounting entries and financial records"
          icon={<BookOpen className="h-6 w-6" />}
        >
          <Button onClick={() => setShowNewEntryDialog(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </PageTitle>

        <div className="p-8 text-center text-muted-foreground">
          <h3 className="text-xl font-medium mb-2">Ledger Content Will Appear Here</h3>
          <p>
            Your general ledger transactions and account entries will be displayed in this area.
            Use the "New Entry" button to add journal entries.
          </p>
        </div>

        {/* Add New Ledger Entry Dialog */}
        <EntryDialog
          title="Add Journal Entry"
          description="Record a new transaction in the general ledger"
          isOpen={showNewEntryDialog}
          onClose={() => setShowNewEntryDialog(false)}
          size="lg"
          entityType="journal_entry"
          isCreate={true}
          hideFooter={true}
        >
          <LedgerEntryForm 
            onSubmit={handleAddNewEntry}
            onCancel={() => setShowNewEntryDialog(false)}
          />
        </EntryDialog>
      </div>
    </Layout>
  );
};

export default Ledger;
