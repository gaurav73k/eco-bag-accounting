
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  PlusCircle, 
  BookOpen, 
  Download, 
  Search, 
  Filter,
  FileText,
  Users,
  ShoppingCart
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

// Mock data for customer ledger
const customerLedger = [
  { id: '1', date: '2023-06-15', customer: 'Kathmandu Retail Store', transactionType: 'Invoice', description: 'INV-001', debit: 25000, credit: 0, balance: 25000 },
  { id: '2', date: '2023-06-15', customer: 'Kathmandu Retail Store', transactionType: 'Payment', description: 'Receipt #101', debit: 0, credit: 25000, balance: 0 },
  { id: '3', date: '2023-06-14', customer: 'Pokhara Gift Shop', transactionType: 'Invoice', description: 'INV-002', debit: 35000, credit: 0, balance: 35000 },
  { id: '4', date: '2023-06-14', customer: 'Pokhara Gift Shop', transactionType: 'Payment', description: 'Bank Transfer #202', debit: 0, credit: 35000, balance: 0 },
  { id: '5', date: '2023-06-13', customer: 'Lalitpur Boutique', transactionType: 'Invoice', description: 'INV-003', debit: 18000, credit: 0, balance: 18000 },
  { id: '6', date: '2023-06-13', customer: 'Lalitpur Boutique', transactionType: 'Payment', description: 'Partial Payment #303', debit: 0, credit: 5000, balance: 13000 },
  { id: '7', date: '2023-06-12', customer: 'Bhaktapur Fashion', transactionType: 'Invoice', description: 'INV-004', debit: 22000, credit: 0, balance: 22000 },
  { id: '8', date: '2023-06-12', customer: 'Bhaktapur Fashion', transactionType: 'Payment', description: 'Receipt #404', debit: 0, credit: 22000, balance: 0 },
];

// Mock data for supplier ledger
const supplierLedger = [
  { id: '1', date: '2023-06-15', supplier: 'Birgunj Textiles', transactionType: 'Purchase', description: 'PO-001', debit: 0, credit: 62500, balance: -62500 },
  { id: '2', date: '2023-06-15', supplier: 'Birgunj Textiles', transactionType: 'Payment', description: 'Payment #501', debit: 62500, credit: 0, balance: 0 },
  { id: '3', date: '2023-06-14', supplier: 'Kathmandu Thread Supplies', transactionType: 'Purchase', description: 'PO-002', debit: 0, credit: 15000, balance: -15000 },
  { id: '4', date: '2023-06-14', supplier: 'Kathmandu Thread Supplies', transactionType: 'Payment', description: 'Payment #502', debit: 15000, credit: 0, balance: 0 },
  { id: '5', date: '2023-06-13', supplier: 'Nepal Printing Inks', transactionType: 'Purchase', description: 'PO-003', debit: 0, credit: 18000, balance: -18000 },
  { id: '6', date: '2023-06-13', supplier: 'Nepal Printing Inks', transactionType: 'Payment', description: 'Advance Payment #503', debit: 8000, credit: 0, balance: -10000 },
  { id: '7', date: '2023-06-12', supplier: 'Birgunj Textiles', transactionType: 'Purchase', description: 'PO-004', debit: 0, credit: 27000, balance: -27000 },
  { id: '8', date: '2023-06-12', supplier: 'Birgunj Textiles', transactionType: 'Payment', description: 'Payment #504', debit: 27000, credit: 0, balance: 0 },
];

// Get unique customers and suppliers for filtering
const uniqueCustomers = [...new Set(customerLedger.map(entry => entry.customer))];
const uniqueSuppliers = [...new Set(supplierLedger.map(entry => entry.supplier))];

const Ledger: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('customer');
  const [selectedEntity, setSelectedEntity] = useState('all');
  const { toast } = useToast();

  // Filter ledger entries based on search term, current tab, and selected entity
  const filteredLedger = currentTab === 'customer' 
    ? customerLedger.filter(entry => {
        const matchesSearch = 
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.transactionType.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedEntity === 'all') return matchesSearch;
        return matchesSearch && entry.customer === selectedEntity;
      })
    : supplierLedger.filter(entry => {
        const matchesSearch = 
          entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.transactionType.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (selectedEntity === 'all') return matchesSearch;
        return matchesSearch && entry.supplier === selectedEntity;
      });

  const handleExport = (format: string) => {
    try {
      if (currentTab === 'customer') {
        exportToCSV(
          filteredLedger.map(entry => ({
            Date: entry.date,
            Customer: entry.customer,
            'Transaction Type': entry.transactionType,
            Description: entry.description,
            Debit: entry.debit,
            Credit: entry.credit,
            Balance: entry.balance
          })),
          `customer-ledger-${getFormattedDate()}`
        );
      } else {
        exportToCSV(
          filteredLedger.map(entry => ({
            Date: entry.date,
            Supplier: entry.supplier,
            'Transaction Type': entry.transactionType,
            Description: entry.description,
            Debit: entry.debit,
            Credit: entry.credit,
            Balance: entry.balance
          })),
          `supplier-ledger-${getFormattedDate()}`
        );
      }
      
      toast({
        title: "Export Successful",
        description: `Ledger data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the ledger data.",
        variant: "destructive"
      });
    }
  };

  // Calculate total receivables and payables
  const totalReceivables = customerLedger.reduce((total, entry) => {
    if (entry.balance > 0) return total + entry.balance;
    return total;
  }, 0);

  const totalPayables = supplierLedger.reduce((total, entry) => {
    if (entry.balance < 0) return total - entry.balance;
    return total;
  }, 0);

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Ledger" 
          description="Track and manage your financial records"
          icon={<BookOpen className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Entry
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  <FileText className="h-4 w-4 mr-2" />
                  Export as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </PageTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <CardTitle className="text-lg font-medium">Total Receivables</CardTitle>
                  <CardDescription>Outstanding customer balances</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                Rs. {totalReceivables.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {uniqueCustomers.filter(customer => 
                  customerLedger.some(entry => entry.customer === customer && entry.balance > 0)
                ).length} customers
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-red-500" />
                <div>
                  <CardTitle className="text-lg font-medium">Total Payables</CardTitle>
                  <CardDescription>Outstanding supplier balances</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                Rs. {totalPayables.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                To {uniqueSuppliers.filter(supplier => 
                  supplierLedger.some(entry => entry.supplier === supplier && entry.balance < 0)
                ).length} suppliers
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Ledger Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="customer" className="mb-6" onValueChange={(value) => {
              setCurrentTab(value);
              setSelectedEntity('all');
            }}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="customer">Customer Ledger</TabsTrigger>
                  <TabsTrigger value="supplier">Supplier Ledger</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search entries..."
                      className="w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder={currentTab === 'customer' ? "Select Customer" : "Select Supplier"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All {currentTab === 'customer' ? 'Customers' : 'Suppliers'}</SelectItem>
                      {currentTab === 'customer' 
                        ? uniqueCustomers.map(customer => (
                            <SelectItem key={customer} value={customer}>{customer}</SelectItem>
                          ))
                        : uniqueSuppliers.map(supplier => (
                            <SelectItem key={supplier} value={supplier}>{supplier}</SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="customer" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit (Rs.)</TableHead>
                        <TableHead className="text-right">Credit (Rs.)</TableHead>
                        <TableHead className="text-right">Balance (Rs.)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLedger.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{entry.customer}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              entry.transactionType === 'Invoice' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {entry.transactionType}
                            </span>
                          </TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell className="text-right font-medium">{entry.debit > 0 ? entry.debit.toLocaleString() : '-'}</TableCell>
                          <TableCell className="text-right font-medium">{entry.credit > 0 ? entry.credit.toLocaleString() : '-'}</TableCell>
                          <TableCell className={`text-right font-bold ${
                            entry.balance > 0 ? 'text-red-600' : ''
                          }`}>
                            {entry.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredLedger.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No ledger entries found. Try adjusting your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="supplier" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Transaction</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit (Rs.)</TableHead>
                        <TableHead className="text-right">Credit (Rs.)</TableHead>
                        <TableHead className="text-right">Balance (Rs.)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLedger.map((entry: any) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.date}</TableCell>
                          <TableCell>{entry.supplier}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              entry.transactionType === 'Purchase' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {entry.transactionType}
                            </span>
                          </TableCell>
                          <TableCell>{entry.description}</TableCell>
                          <TableCell className="text-right font-medium">{entry.debit > 0 ? entry.debit.toLocaleString() : '-'}</TableCell>
                          <TableCell className="text-right font-medium">{entry.credit > 0 ? entry.credit.toLocaleString() : '-'}</TableCell>
                          <TableCell className={`text-right font-bold ${
                            entry.balance < 0 ? 'text-red-600' : ''
                          }`}>
                            {entry.balance.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredLedger.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No ledger entries found. Try adjusting your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Ledger;
