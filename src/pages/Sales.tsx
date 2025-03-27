
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
  Receipt, 
  Download, 
  Search, 
  Filter,
  FileText 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

// Mock data for sales
const salesData = [
  { id: 'INV-001', date: '2023-06-15', customer: 'Kathmandu Retail Store', items: 'W-Cut Bags (500pcs)', amount: 25000, status: 'paid', paymentMethod: 'Cash' },
  { id: 'INV-002', date: '2023-06-14', customer: 'Pokhara Gift Shop', items: 'Custom Printed Bags (1000pcs)', amount: 35000, status: 'paid', paymentMethod: 'Bank Transfer' },
  { id: 'INV-003', date: '2023-06-13', customer: 'Lalitpur Boutique', items: 'U-Cut Bags (400pcs)', amount: 18000, status: 'pending', paymentMethod: 'Credit' },
  { id: 'INV-004', date: '2023-06-12', customer: 'Bhaktapur Fashion', items: 'Coat Covers (600pcs)', amount: 22000, status: 'paid', paymentMethod: 'Cash' },
  { id: 'INV-005', date: '2023-06-10', customer: 'Thamel Souvenirs', items: 'W-Cut Bags (300pcs)', amount: 15000, status: 'pending', paymentMethod: 'Credit' },
  { id: 'INV-006', date: '2023-06-08', customer: 'Chitwan Market', items: 'U-Cut Bags (800pcs)', amount: 32000, status: 'paid', paymentMethod: 'Bank Transfer' },
  { id: 'INV-007', date: '2023-06-05', customer: 'Biratnagar Store', items: 'Custom Printed Bags (1200pcs)', amount: 48000, status: 'pending', paymentMethod: 'Credit' },
  { id: 'INV-008', date: '2023-06-03', customer: 'Dharan Retailer', items: 'Coat Covers (350pcs)', amount: 14000, status: 'paid', paymentMethod: 'Cash' },
];

// Payment pending invoices
const pendingInvoices = salesData.filter(sale => sale.status === 'pending');

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const { toast } = useToast();

  // Filter sales based on search term and current tab
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = 
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.items.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && sale.status === currentTab;
  });

  const handleExport = (format: string) => {
    try {
      exportToCSV(
        filteredSales.map(sale => ({
          'Invoice #': sale.id,
          Date: sale.date,
          Customer: sale.customer,
          Items: sale.items,
          Amount: sale.amount,
          Status: sale.status,
          'Payment Method': sale.paymentMethod
        })),
        `sales-data-${getFormattedDate()}`
      );
      
      toast({
        title: "Export Successful",
        description: `Sales data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the sales data.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Sales Management" 
          description="Track and manage all your sales transactions"
          icon={<Receipt className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Invoice
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Sales</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rs. {salesData.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {salesData.length} invoices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Paid Invoices</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                Rs. {salesData.filter(sale => sale.status === 'paid').reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {salesData.filter(sale => sale.status === 'paid').length} paid invoices
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Pending Payments</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                Rs. {pendingInvoices.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingInvoices.length} pending invoices
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="mb-6" onValueChange={setCurrentTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Invoices</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search invoices..."
                      className="w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="amount">Amount</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{sale.id}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.items}</TableCell>
                          <TableCell className="text-right">Rs. {sale.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sale.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {sale.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell>{sale.paymentMethod}</TableCell>
                        </TableRow>
                      ))}
                      {filteredSales.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No sales found. Try adjusting your search.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="paid" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales
                        .filter(sale => sale.status === 'paid')
                        .map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>{sale.id}</TableCell>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell>{sale.items}</TableCell>
                            <TableCell className="text-right">Rs. {sale.amount.toLocaleString()}</TableCell>
                            <TableCell>{sale.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      {filteredSales.filter(sale => sale.status === 'paid').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No paid invoices found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales
                        .filter(sale => sale.status === 'pending')
                        .map((sale) => (
                          <TableRow key={sale.id}>
                            <TableCell>{sale.id}</TableCell>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell>{sale.items}</TableCell>
                            <TableCell className="text-right">Rs. {sale.amount.toLocaleString()}</TableCell>
                            <TableCell>{sale.paymentMethod}</TableCell>
                          </TableRow>
                        ))}
                      {filteredSales.filter(sale => sale.status === 'pending').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No pending invoices found.
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

export default Sales;
