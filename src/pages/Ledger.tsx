
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen, FileText, Download, Upload, Filter } from 'lucide-react';
import EntryDialog from '@/components/ui/entry-dialog';
import TallyEntryForm from '@/components/forms/TallyEntryForm';
import { toast } from 'sonner';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { entryTypes } from '@/utils/tallyOperations';

const Ledger: React.FC = () => {
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [selectedEntryType, setSelectedEntryType] = useState('journal');
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  
  // Show entry dialog with a specific entry type
  const handleShowEntryDialog = (entryType: string) => {
    setSelectedEntryType(entryType);
    setShowNewEntryDialog(true);
  };
  
  const handleAddNewEntry = (data: any) => {
    console.log('New ledger entry:', data);
    // Add the new entry to the state
    setLedgerEntries(prev => [data, ...prev]);
    toast.success('Ledger entry added successfully');
    setShowNewEntryDialog(false);
  };
  
  // Filter entries based on current filters
  const filteredEntries = ledgerEntries.filter(entry => {
    // Filter by entry type if not "all"
    if (filterType !== 'all' && entry.entryType !== filterType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !entry.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.partyName?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !entry.transactionId.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date range if provided
    const entryDate = new Date(entry.date);
    const fromDate = new Date(dateRange.from);
    const toDate = new Date(dateRange.to);
    toDate.setHours(23, 59, 59, 999); // Include the entire end day
    
    if (entryDate < fromDate || entryDate > toDate) {
      return false;
    }
    
    return true;
  });

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="General Ledger" 
          description="Manage accounting entries and financial records"
          icon={<BookOpen className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button onClick={() => setShowNewEntryDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Entry
            </Button>
            <Button variant="outline" onClick={() => toast.info('Export functionality will be implemented soon')}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => toast.info('Import functionality will be implemented soon')}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </div>
        </PageTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
          {/* Quick Entry Cards */}
          {['receipt', 'payment', 'contra', 'journal', 'sales', 'purchase'].map((type, index) => {
            const entryType = entryTypes.find(e => e.id === type);
            if (!entryType) return null;
            
            return (
              <Card key={type} className="cursor-pointer hover:border-primary transition-all" onClick={() => handleShowEntryDialog(type)}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    {type === 'receipt' && <Tally1 className="h-4 w-4" />}
                    {type === 'payment' && <Tally2 className="h-4 w-4" />}
                    {type === 'contra' && <Tally3 className="h-4 w-4" />}
                    {type === 'journal' && <Tally4 className="h-4 w-4" />}
                    {type === 'sales' && <Tally5 className="h-4 w-4" />}
                    {type === 'purchase' && <Tally1 className="h-4 w-4" />}
                    {entryType.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {type === 'receipt' && 'Record money received from customers'}
                    {type === 'payment' && 'Record payments to suppliers or expenses'}
                    {type === 'contra' && 'Transfer between cash and bank accounts'}
                    {type === 'journal' && 'Record adjustments and non-cash entries'}
                    {type === 'sales' && 'Record sales transactions'}
                    {type === 'purchase' && 'Record purchase transactions'}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Ledger Entries List */}
        <div className="p-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">Ledger Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div>
                    <label htmlFor="filter-type" className="text-sm font-medium mb-1 block">
                      Entry Type
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger id="filter-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Entries</SelectItem>
                        {entryTypes.map(type => (
                          <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="date-from" className="text-sm font-medium mb-1 block">
                      From Date
                    </label>
                    <Input 
                      id="date-from"
                      type="date"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date-to" className="text-sm font-medium mb-1 block">
                      To Date
                    </label>
                    <Input 
                      id="date-to"
                      type="date"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="flex-1">
                  <label htmlFor="search" className="text-sm font-medium mb-1 block">
                    Search
                  </label>
                  <div className="relative">
                    <Input 
                      id="search"
                      placeholder="Search by description, party or transaction ID"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                    <Filter className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Entries Table */}
              {filteredEntries.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEntries.map((entry, index) => {
                        // Calculate total amount from all entries
                        const amount = entry.entries.reduce((sum: number, e: any) => sum + (e.type === 'debit' ? e.amount : 0), 0);
                        
                        // Find the entry type name
                        const entryTypeName = entryTypes.find(t => t.id === entry.entryType)?.name || entry.entryType;
                        
                        return (
                          <TableRow key={entry.transactionId || index}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell className="font-medium">{entry.transactionId}</TableCell>
                            <TableCell>
                              {entry.description}
                              {entry.partyName && <div className="text-xs text-muted-foreground mt-1">{entry.partyName}</div>}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{entryTypeName}</Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono">{formatCurrency(amount)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => toast.info('View functionality will be implemented soon')}>
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <h3 className="text-xl font-medium mb-2">No Entries Found</h3>
                  <p>
                    {ledgerEntries.length === 0 
                      ? "Your general ledger transactions will appear here. Use the 'New Entry' button to add journal entries."
                      : "No entries match your current filter criteria. Try changing your filters."
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add New Ledger Entry Dialog */}
        <EntryDialog
          title={`Add ${entryTypes.find(e => e.id === selectedEntryType)?.name || 'Journal'} Entry`}
          description="Record a new transaction in the general ledger"
          isOpen={showNewEntryDialog}
          onClose={() => setShowNewEntryDialog(false)}
          size="lg"
          entityType="journal_entry"
          isCreate={true}
          hideFooter={true}
        >
          <TallyEntryForm 
            onSubmit={handleAddNewEntry}
            onCancel={() => setShowNewEntryDialog(false)}
            initialType={selectedEntryType}
          />
        </EntryDialog>
      </div>
    </Layout>
  );
};

export default Ledger;
