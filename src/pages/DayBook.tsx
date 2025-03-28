import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { DialogForm } from '@/components/ui/dialog-form';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  BookOpen, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  FileText,
  ShoppingBag,
  Users,
  Wallet
} from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Helper function to generate a unique transaction ID
const generateTxnId = () => {
  return `TXN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

// Mock data for journal entries
const journalEntriesData = [
  {
    id: 'JE-0001',
    date: '2023-06-15',
    description: 'Sales Invoice INV-001 to Kathmandu Retail Store',
    entryType: 'invoice',
    reference: 'INV-001',
    debitAccounts: [
      { account: 'Accounts Receivable', amount: 22600 }
    ],
    creditAccounts: [
      { account: 'Sales Revenue', amount: 20000 },
      { account: 'VAT Output', amount: 2600 }
    ],
    status: 'posted',
    createdBy: 'System'
  },
  {
    id: 'JE-0002',
    date: '2023-06-15',
    description: 'Payment received for Invoice INV-001',
    entryType: 'payment',
    reference: 'INV-001',
    debitAccounts: [
      { account: 'Cash', amount: 22600 }
    ],
    creditAccounts: [
      { account: 'Accounts Receivable', amount: 22600 }
    ],
    status: 'posted',
    createdBy: 'System'
  },
  {
    id: 'JE-0003',
    date: '2023-06-14',
    description: 'Sales Invoice INV-002 to Pokhara Gift Shop',
    entryType: 'invoice',
    reference: 'INV-002',
    debitAccounts: [
      { account: 'Accounts Receivable', amount: 39550 }
    ],
    creditAccounts: [
      { account: 'Sales Revenue', amount: 35000 },
      { account: 'VAT Output', amount: 4550 }
    ],
    status: 'posted',
    createdBy: 'System'
  },
  {
    id: 'JE-0004',
    date: '2023-06-14',
    description: 'Payment received for Invoice INV-002',
    entryType: 'payment',
    reference: 'INV-002',
    debitAccounts: [
      { account: 'Bank', amount: 39550 }
    ],
    creditAccounts: [
      { account: 'Accounts Receivable', amount: 39550 }
    ],
    status: 'posted',
    createdBy: 'System'
  },
  {
    id: 'JE-0005',
    date: '2023-06-13',
    description: 'Sales Invoice INV-003 to Lalitpur Boutique',
    entryType: 'invoice',
    reference: 'INV-003',
    debitAccounts: [
      { account: 'Accounts Receivable', amount: 20340 }
    ],
    creditAccounts: [
      { account: 'Sales Revenue', amount: 18000 },
      { account: 'VAT Output', amount: 2340 }
    ],
    status: 'posted',
    createdBy: 'System'
  },
  {
    id: 'JE-0006',
    date: '2023-06-10',
    description: 'Purchase of raw materials from Supplier XYZ',
    entryType: 'purchase',
    reference: 'PO-001',
    debitAccounts: [
      { account: 'Raw Materials Inventory', amount: 50000 },
      { account: 'VAT Input', amount: 6500 }
    ],
    creditAccounts: [
      { account: 'Accounts Payable', amount: 56500 }
    ],
    status: 'posted',
    createdBy: 'Admin'
  },
  {
    id: 'JE-0007',
    date: '2023-06-08',
    description: 'Payment to Supplier XYZ for PO-001',
    entryType: 'payment',
    reference: 'PO-001',
    debitAccounts: [
      { account: 'Accounts Payable', amount: 56500 }
    ],
    creditAccounts: [
      { account: 'Bank', amount: 56500 }
    ],
    status: 'posted',
    createdBy: 'Admin'
  },
  {
    id: 'JE-0008',
    date: '2023-06-05',
    description: 'Staff salary payment for May 2023',
    entryType: 'expense',
    reference: 'PAY-2023-05',
    debitAccounts: [
      { account: 'Salary Expense', amount: 85000 }
    ],
    creditAccounts: [
      { account: 'Bank', amount: 85000 }
    ],
    status: 'posted',
    createdBy: 'Admin'
  },
  {
    id: 'JE-0009',
    date: '2023-06-03',
    description: 'Electricity bill payment',
    entryType: 'expense',
    reference: 'UTIL-2023-06',
    debitAccounts: [
      { account: 'Utilities Expense', amount: 12000 },
      { account: 'VAT Input', amount: 1560 }
    ],
    creditAccounts: [
      { account: 'Bank', amount: 13560 }
    ],
    status: 'posted',
    createdBy: 'Admin'
  },
  {
    id: 'JE-0010',
    date: '2023-06-01',
    description: 'Rent payment for June 2023',
    entryType: 'expense',
    reference: 'RENT-2023-06',
    debitAccounts: [
      { account: 'Rent Expense', amount: 35000 }
    ],
    creditAccounts: [
      { account: 'Bank', amount: 35000 }
    ],
    status: 'posted',
    createdBy: 'Admin'
  }
];

const DayBook: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isViewEntryOpen, setIsViewEntryOpen] = useState(false);

  // Filter entries based on search, tab, and date range
  const filteredEntries = journalEntriesData.filter(entry => {
    // Search filter
    const matchesSearch = 
      entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Tab filter
    const matchesTab = currentTab === 'all' || entry.entryType === currentTab;
    
    // Date range filter
    const entryDate = new Date(entry.date);
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;
    
    const matchesDateRange = 
      (!startDate || entryDate >= startDate) && 
      (!endDate || entryDate <= endDate);
    
    return matchesSearch && matchesTab && matchesDateRange;
  });

  const handleCreateEntry = (data: any) => {
    toast.success("Journal Entry Created", {
      description: `Entry ${data.id} has been posted to the general ledger.`,
    });
    setIsNewEntryOpen(false);
  };

  const handleViewEntry = (entry: any) => {
    setSelectedEntry(entry);
    setIsViewEntryOpen(true);
  };

  // Chart of Accounts for reference
  const chartOfAccounts = [
    { id: '1000', name: 'Assets', type: 'header' },
    { id: '1010', name: 'Cash', type: 'account', balance: 150000 },
    { id: '1020', name: 'Bank', type: 'account', balance: 500000 },
    { id: '1030', name: 'Accounts Receivable', type: 'account', balance: 156000 },
    { id: '1040', name: 'Inventory', type: 'account', balance: 350000 },
    { id: '1050', name: 'Raw Materials Inventory', type: 'account', balance: 200000 },
    { id: '1060', name: 'VAT Input', type: 'account', balance: 45000 },
    
    { id: '2000', name: 'Liabilities', type: 'header' },
    { id: '2010', name: 'Accounts Payable', type: 'account', balance: 120000 },
    { id: '2020', name: 'VAT Output', type: 'account', balance: 65000 },
    { id: '2030', name: 'Loans Payable', type: 'account', balance: 300000 },
    
    { id: '3000', name: 'Equity', type: 'header' },
    { id: '3010', name: 'Owner\'s Capital', type: 'account', balance: 500000 },
    { id: '3020', name: 'Retained Earnings', type: 'account', balance: 250000 },
    
    { id: '4000', name: 'Revenue', type: 'header' },
    { id: '4010', name: 'Sales Revenue', type: 'account', balance: 850000 },
    { id: '4020', name: 'Service Revenue', type: 'account', balance: 0 },
    
    { id: '5000', name: 'Expenses', type: 'header' },
    { id: '5010', name: 'Cost of Goods Sold', type: 'account', balance: 425000 },
    { id: '5020', name: 'Salary Expense', type: 'account', balance: 350000 },
    { id: '5030', name: 'Rent Expense', type: 'account', balance: 210000 },
    { id: '5040', name: 'Utilities Expense', type: 'account', balance: 65000 },
    { id: '5050', name: 'Depreciation Expense', type: 'account', balance: 120000 }
  ];

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Day Book" 
          description="Journal entries and daily transactions"
          icon={<BookOpen className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button onClick={() => setIsNewEntryOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              New Journal Entry
            </Button>
          </div>
        </PageTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link to="/invoicing">
                  <Button variant="outline" className="w-full h-full p-3 flex flex-col items-center justify-center gap-2 min-h-24">
                    <FileText className="h-6 w-6 text-blue-500" />
                    <span className="text-sm text-center">Sales & Invoicing</span>
                  </Button>
                </Link>
                <Link to="/purchases">
                  <Button variant="outline" className="w-full h-full p-3 flex flex-col items-center justify-center gap-2 min-h-24">
                    <ShoppingBag className="h-6 w-6 text-green-500" />
                    <span className="text-sm text-center">Purchases</span>
                  </Button>
                </Link>
                <Link to="/expenses">
                  <Button variant="outline" className="w-full h-full p-3 flex flex-col items-center justify-center gap-2 min-h-24">
                    <Wallet className="h-6 w-6 text-red-500" />
                    <span className="text-sm text-center">Expenses</span>
                  </Button>
                </Link>
                <Link to="/payroll">
                  <Button variant="outline" className="w-full h-full p-3 flex flex-col items-center justify-center gap-2 min-h-24">
                    <Users className="h-6 w-6 text-purple-500" />
                    <span className="text-sm text-center">Payroll</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Today's Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {journalEntriesData.filter(entry => {
                  const today = format(new Date(), 'yyyy-MM-dd');
                  return entry.date === today;
                }).length}
              </div>
              <p className="text-sm text-muted-foreground">
                Journal entries recorded today
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Monthly Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {journalEntriesData.filter(entry => {
                  const currentMonth = format(new Date(), 'yyyy-MM');
                  return entry.date.startsWith(currentMonth);
                }).length}
              </div>
              <p className="text-sm text-muted-foreground">
                Journal entries this month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Journal Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setCurrentTab}>
                  <TabsList className="w-full md:w-auto grid grid-cols-3 md:flex">
                    <TabsTrigger value="all">All Entries</TabsTrigger>
                    <TabsTrigger value="invoice">Sales</TabsTrigger>
                    <TabsTrigger value="purchase">Purchases</TabsTrigger>
                    <TabsTrigger value="payment">Payments</TabsTrigger>
                    <TabsTrigger value="expense">Expenses</TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="flex items-center gap-2 w-full">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search entries..."
                        className="w-full md:w-[200px] pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Input
                      type="date"
                      placeholder="From"
                      className="w-full md:w-[150px]"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                    <Input
                      type="date"
                      placeholder="To"
                      className="w-full md:w-[150px]"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Entry #</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Debit</TableHead>
                      <TableHead className="text-right">Credit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length > 0 ? (
                      filteredEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">{entry.id}</TableCell>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell>{entry.reference}</TableCell>
                          <TableCell>
                            <Badge className={
                              entry.entryType === 'invoice' ? 'bg-blue-100 text-blue-800' :
                              entry.entryType === 'purchase' ? 'bg-green-100 text-green-800' :
                              entry.entryType === 'payment' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {entry.entryType.charAt(0).toUpperCase() + entry.entryType.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            Rs. {entry.debitAccounts.reduce((sum, account) => sum + account.amount, 0).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            Rs. {entry.creditAccounts.reduce((sum, account) => sum + account.amount, 0).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleViewEntry(entry)}
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No journal entries found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <DialogForm
        title="Create New Journal Entry"
        description="Record a new transaction in the daybook"
        isOpen={isNewEntryOpen}
        onClose={() => setIsNewEntryOpen(false)}
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Entry Number</label>
              <Input value={`JE-${(journalEntriesData.length + 1).toString().padStart(4, '0')}`} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Entry Type</label>
              <Select defaultValue="manual">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual Entry</SelectItem>
                  <SelectItem value="invoice">Sales Invoice</SelectItem>
                  <SelectItem value="purchase">Purchase</SelectItem>
                  <SelectItem value="payment">Payment</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input placeholder="Enter a description for this journal entry" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reference</label>
            <Input placeholder="Invoice number, PO number, etc." />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Entry Details</h3>
              <Button type="button" variant="outline" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Line
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Debit</TableHead>
                    <TableHead className="text-right">Credit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartOfAccounts
                            .filter(account => account.type === 'account')
                            .map(account => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Line description" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="0.00" type="number" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="0.00" type="number" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartOfAccounts
                            .filter(account => account.type === 'account')
                            .map(account => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input placeholder="Line description" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="0.00" type="number" />
                    </TableCell>
                    <TableCell>
                      <Input placeholder="0.00" type="number" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <div className="flex justify-end">
              <div className="w-[250px] space-y-2">
                <div className="flex justify-between">
                  <span>Total Debits:</span>
                  <span>Rs. 0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Credits:</span>
                  <span>Rs. 0.00</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Difference:</span>
                  <span>Rs. 0.00</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsNewEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleCreateEntry({
              id: `JE-${(journalEntriesData.length + 1).toString().padStart(4, '0')}`,
              description: 'Manual journal entry',
              date: new Date().toISOString().split('T')[0]
            })}>
              Post Journal Entry
            </Button>
          </div>
        </div>
      </DialogForm>
      
      {selectedEntry && (
        <DialogForm
          title={`Journal Entry ${selectedEntry.id}`}
          description="View entry details"
          isOpen={isViewEntryOpen}
          onClose={() => setIsViewEntryOpen(false)}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Entry Number</h3>
                <div className="font-semibold">{selectedEntry.id}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Date</h3>
                <div>{selectedEntry.date}</div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Entry Type</h3>
                <div>
                  <Badge className={
                    selectedEntry.entryType === 'invoice' ? 'bg-blue-100 text-blue-800' :
                    selectedEntry.entryType === 'purchase' ? 'bg-green-100 text-green-800' :
                    selectedEntry.entryType === 'payment' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {selectedEntry.entryType.charAt(0).toUpperCase() + selectedEntry.entryType.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <div>{selectedEntry.description}</div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-1">Reference</h3>
              <div>{selectedEntry.reference}</div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Debit Entries</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEntry.debitAccounts.map((account: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{account.account}</TableCell>
                        <TableCell className="text-right">Rs. {account.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <h3 className="text-lg font-medium">Credit Entries</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedEntry.creditAccounts.map((account: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{account.account}</TableCell>
                        <TableCell className="text-right">Rs. {account.amount.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-end">
                <div className="w-[250px] space-y-2">
                  <div className="flex justify-between">
                    <span>Total Debits:</span>
                    <span>Rs. {selectedEntry.debitAccounts.reduce((sum: number, account: any) => sum + account.amount, 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Credits:</span>
                    <span>Rs. {selectedEntry.creditAccounts.reduce((sum: number, account: any) => sum + account.amount, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between pt-4 border-t">
              <div>
                <span className="text-sm text-muted-foreground">Created by {selectedEntry.createdBy}</span>
              </div>
              <Button onClick={() => setIsViewEntryOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogForm>
      )}
    </Layout>
  );
};

export default DayBook;
