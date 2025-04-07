
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, Filter, Download, Upload, Search, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DialogEntry from '@/components/ui/entry-dialog';
import TallyEntryForm from '@/components/forms/TallyEntryForm';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const DayBook: React.FC = () => {
  const [showNewEntryDialog, setShowNewEntryDialog] = useState(false);
  const [entries, setEntries] = useState<any[]>([]);
  const isMobile = useIsMobile();
  
  // Filter states
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [entryTypeFilter, setEntryTypeFilter] = useState('all');
  
  // Function to handle new entry submission
  const handleAddEntry = (data: any) => {
    setEntries((prev) => [data, ...prev]);
    setShowNewEntryDialog(false);
    toast.success('Day book entry added successfully');
  };
  
  // Function to get the appropriate badge color based on entry type
  const getBadgeVariant = (entryType: string) => {
    switch (entryType) {
      case 'receipt': return 'default';
      case 'payment': return 'destructive';
      case 'journal': return 'outline';
      case 'contra': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Day Book" 
          description="Record and view daily transactions"
          icon={<BookOpen className="h-6 w-6" />}
        >
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setShowNewEntryDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Entry
            </Button>
            <Button variant="outline" onClick={() => toast.info('Export functionality will be implemented soon')}>
              <Download className="h-4 w-4 mr-2" />
              {!isMobile && "Export"}
            </Button>
            <Button variant="outline" onClick={() => toast.info('Import functionality will be implemented soon')}>
              <Upload className="h-4 w-4 mr-2" />
              {!isMobile && "Import"}
            </Button>
          </div>
        </PageTitle>
        
        <div className="p-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="text-xl font-medium">Transaction Log</CardTitle>
                  <CardDescription>
                    View all transactions in chronological order
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date().toLocaleDateString()}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium mb-1 block">Entry Type</label>
                  <Select value={entryTypeFilter} onValueChange={setEntryTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="journal">Journal</SelectItem>
                      <SelectItem value="contra">Contra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Date Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input 
                      type="date" 
                      value={dateRange.from} 
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                    />
                    <Input 
                      type="date" 
                      value={dateRange.to} 
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Search</label>
                  <div className="relative">
                    <Input 
                      placeholder="Search transactions..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-8"
                    />
                    <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Entries Table */}
              {entries.length > 0 ? (
                <div className="border rounded-md overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Voucher No</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {entries.map((entry, index) => {
                        // Calculate total debit amount
                        const totalAmount = entry.entries?.reduce(
                          (sum: number, item: any) => sum + (item.type === 'debit' ? item.amount : 0), 
                          0
                        ) || 0;
                        
                        return (
                          <TableRow key={index}>
                            <TableCell>{entry.date}</TableCell>
                            <TableCell>{entry.voucherNo || `VCH-${index + 1}`}</TableCell>
                            <TableCell>
                              <Badge variant={getBadgeVariant(entry.entryType)}>
                                {entry.entryType}
                              </Badge>
                            </TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell className="text-right font-mono">
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'NPR'
                              }).format(totalAmount)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center p-8 border rounded-md">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Entries Yet</h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Start recording your daily transactions by clicking the "New Entry" button above.
                  </p>
                  <Button onClick={() => setShowNewEntryDialog(true)}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add First Entry
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter className={cn("flex justify-between", entries.length === 0 && "hidden")}>
              <div className="text-sm text-muted-foreground">
                Showing {entries.length} entries
              </div>
              
              <Button variant="outline" size="sm" onClick={() => toast.info('Filter functionality will be implemented soon')}>
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <EntryDialog
          title="Add Day Book Entry"
          description="Record a new transaction in your day book"
          isOpen={showNewEntryDialog}
          onClose={() => setShowNewEntryDialog(false)}
          size="lg"
          entityType="daybook_entry"
          isCreate={true}
          hideFooter={true}
        >
          <TallyEntryForm
            onSubmit={handleAddEntry}
            onCancel={() => setShowNewEntryDialog(false)}
          />
        </EntryDialog>
      </div>
    </Layout>
  );
};

// Helper function to conditionally join classnames
const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export default DayBook;
