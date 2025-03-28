
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  FileText,
  ChevronRight,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { DialogForm } from '@/components/ui/dialog-form';

// Expanded mock data for sales (same as invoices)
const salesData = [
  { id: 'INV-001', date: '2023-06-15', customer: 'Kathmandu Retail Store', customerInfo: { id: '1', name: 'Kathmandu Retail Store', address: 'Thamel, Kathmandu', phone: '01-4567890', email: 'info@kathmanduretail.com' }, items: [{id: '1', name: 'W-Cut Bags (Small)', quantity: 500, price: 40, total: 20000}], subtotal: 20000, vat: 2600, amount: 22600, status: 'paid', paymentMethod: 'Cash', paymentDate: '2023-06-15', accountingStatus: 'posted' },
  { id: 'INV-002', date: '2023-06-14', customer: 'Pokhara Gift Shop', customerInfo: { id: '2', name: 'Pokhara Gift Shop', address: 'Lakeside, Pokhara', phone: '061-456789', email: 'pokharagift@example.com' }, items: [{id: '2', name: 'W-Cut Bags (Medium)', quantity: 700, price: 50, total: 35000}], subtotal: 35000, vat: 4550, amount: 39550, status: 'paid', paymentMethod: 'Bank Transfer', paymentDate: '2023-06-14', accountingStatus: 'posted' },
  { id: 'INV-003', date: '2023-06-13', customer: 'Lalitpur Boutique', customerInfo: { id: '3', name: 'Lalitpur Boutique', address: 'Jawalakhel, Lalitpur', phone: '01-5567890', email: 'boutique@example.com' }, items: [{id: '3', name: 'W-Cut Bags (Large)', quantity: 300, price: 60, total: 18000}], subtotal: 18000, vat: 2340, amount: 20340, status: 'pending', paymentMethod: 'Credit', dueDate: '2023-06-28', accountingStatus: 'posted' },
  { id: 'INV-004', date: '2023-06-12', customer: 'Bhaktapur Fashion', customerInfo: { id: '4', name: 'Bhaktapur Fashion', address: 'Durbar Square, Bhaktapur', phone: '01-6612345', email: 'bhaktapurfashion@example.com' }, items: [{id: '4', name: 'U-Cut Bags (Medium)', quantity: 500, price: 44, total: 22000}], subtotal: 22000, vat: 2860, amount: 24860, status: 'paid', paymentMethod: 'Cash', paymentDate: '2023-06-12', accountingStatus: 'posted' },
  { id: 'INV-005', date: '2023-06-10', customer: 'Thamel Souvenirs', customerInfo: { id: '5', name: 'Thamel Souvenirs', address: 'Thamel, Kathmandu', phone: '01-4555555', email: 'souvenirs@example.com' }, items: [{id: '2', name: 'W-Cut Bags (Medium)', quantity: 300, price: 50, total: 15000}], subtotal: 15000, vat: 1950, amount: 16950, status: 'pending', paymentMethod: 'Credit', dueDate: '2023-06-25', accountingStatus: 'posted' },
  { id: 'INV-006', date: '2023-06-08', customer: 'Chitwan Market', customerInfo: { id: '6', name: 'Chitwan Market', address: 'Bharatpur, Chitwan', phone: '056-123456', email: 'chitwanmarket@example.com' }, items: [{id: '4', name: 'U-Cut Bags (Medium)', quantity: 800, price: 40, total: 32000}], subtotal: 32000, vat: 4160, amount: 36160, status: 'draft', paymentMethod: 'Unpaid', accountingStatus: 'pending' },
  { id: 'INV-007', date: '2023-06-05', customer: 'Biratnagar Store', customerInfo: { id: '7', name: 'Biratnagar Store', address: 'Main Road, Biratnagar', phone: '021-987654', email: 'biratnagarsrore@example.com' }, items: [{id: '5', name: 'Custom Printed Bags', quantity: 640, price: 75, total: 48000}], subtotal: 48000, vat: 6240, amount: 54240, status: 'draft', paymentMethod: 'Unpaid', accountingStatus: 'pending' },
  { id: 'INV-008', date: '2023-06-03', customer: 'Dharan Retailer', customerInfo: { id: '8', name: 'Dharan Retailer', address: 'Putali Line, Dharan', phone: '025-123789', email: 'dharanretail@example.com' }, items: [{id: '3', name: 'W-Cut Bags (Large)', quantity: 350, price: 40, total: 14000}], subtotal: 14000, vat: 1820, amount: 15820, status: 'cancelled', paymentMethod: 'Cancelled', accountingStatus: 'cancelled' },
];

// Payment pending invoices
const pendingInvoices = salesData.filter(sale => sale.status === 'pending');

// Top customers by sales volume
const topCustomers = [
  { name: 'Pokhara Gift Shop', sales: 39550, purchases: 15 },
  { name: 'Kathmandu Retail Store', sales: 22600, purchases: 10 },
  { name: 'Bhaktapur Fashion', sales: 24860, purchases: 8 },
  { name: 'Chitwan Market', sales: 36160, purchases: 5 },
  { name: 'Lalitpur Boutique', sales: 20340, purchases: 4 }
];

// Monthly sales data for charts
const monthlySalesData = [
  { month: 'Jan', sales: 150000 },
  { month: 'Feb', sales: 180000 },
  { month: 'Mar', sales: 210000 },
  { month: 'Apr', sales: 240000 },
  { month: 'May', sales: 270000 },
  { month: 'Jun', sales: 300000 }
];

// Product performance data
const productPerformance = [
  { product: 'W-Cut Bags (Small)', sales: 90000, units: 2250 },
  { product: 'W-Cut Bags (Medium)', sales: 120000, units: 2400 },
  { product: 'W-Cut Bags (Large)', sales: 75000, units: 1250 },
  { product: 'U-Cut Bags (Medium)', sales: 60000, units: 1500 },
  { product: 'Custom Printed Bags', sales: 150000, units: 2000 }
];

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const { toast: toastNotification } = useToast();
  const navigate = useNavigate();

  // Filter sales based on search term and current tab
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = 
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
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
          Items: sale.items.map(item => item.name).join(', '),
          Amount: sale.amount,
          Status: sale.status,
          'Payment Method': sale.paymentMethod
        })),
        `sales-data-${getFormattedDate()}`
      );
      
      toastNotification({
        title: "Export Successful",
        description: `Sales data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toastNotification({
        title: "Export Failed",
        description: "There was an error exporting the sales data.",
        variant: "destructive"
      });
    }
  };

  const handleQuickSale = (data: any) => {
    console.log('Quick sale processed:', data);
    setIsQuickSaleOpen(false);
    
    toast({
      title: "Sale Processed",
      description: "Quick sale has been processed and recorded in the system.",
    });
    
    // Automatically create invoice and journal entry
    setTimeout(() => {
      toast({
        title: "Invoice Created",
        description: "Invoice has been automatically generated for this sale.",
      });
    }, 1000);
  };

  const handleGenerateReport = (data: any) => {
    console.log('Sales report generated:', data);
    setIsSalesReportOpen(false);
    
    toast({
      title: "Report Generated",
      description: "Sales report has been generated successfully.",
    });
  };

  const handleInvoiceClick = (sale: any) => {
    navigate(`/invoicing`);
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
            <Button onClick={() => navigate('/invoicing')}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
            <Button variant="outline" onClick={() => setIsQuickSaleOpen(true)}>
              <Receipt className="h-4 w-4 mr-2" />
              Quick Sale
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
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
              <CardTitle className="text-lg font-medium">Paid</CardTitle>
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
              <CardTitle className="text-lg font-medium">Pending</CardTitle>
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
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Sales Growth</CardTitle>
              <CardDescription>vs. last month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                +12.5%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Increased from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] flex items-end gap-2">
                {monthlySalesData.map((item, index) => (
                  <div key={index} className="relative h-full flex-1 flex flex-col justify-end group">
                    <div
                      className="bg-primary rounded-t w-full transition-all duration-300 group-hover:bg-primary/80"
                      style={{ height: `${(item.sales / 300000) * 100}%` }}
                    ></div>
                    <div className="text-xs text-center mt-2">{item.month}</div>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Rs. {item.sales.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productPerformance.slice(0, 4).map((product, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{product.product}</span>
                      <span className="font-medium">Rs. {product.sales.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${(product.sales / 150000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product.units} units sold
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="link" className="mt-2 p-0 h-auto text-sm">
                View all products <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>Your recent sales transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsSalesReportOpen(true)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="mb-6" onValueChange={setCurrentTab}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="all">All Sales</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search sales..."
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
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.slice(0, 5).map((sale) => (
                        <TableRow key={sale.id} className="cursor-pointer" onClick={() => handleInvoiceClick(sale)}>
                          <TableCell>{sale.id}</TableCell>
                          <TableCell>{sale.date}</TableCell>
                          <TableCell>{sale.customer}</TableCell>
                          <TableCell>{sale.items.map(item => item.name).join(', ')}</TableCell>
                          <TableCell className="text-right">Rs. {sale.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              sale.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : sale.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {sale.status.charAt(0).toUpperCase() + sale.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              View <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </TableCell>
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
                
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={() => navigate('/invoicing')}>
                    View All Sales <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium truncate">{customer.name}</h4>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <span>{customer.purchases} purchases</span>
                        <span className="mx-2">•</span>
                        <span>Rs. {customer.sales.toLocaleString()}</span>
                      </div>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                ))}
              </div>
              
              <Button variant="link" className="mt-4 p-0 h-auto text-sm">
                View customer list <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <DialogForm
        title="Quick Sale"
        description="Record a quick sales transaction"
        isOpen={isQuickSaleOpen}
        onClose={() => setIsQuickSaleOpen(false)}
        size="md"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Kathmandu Retail Store</SelectItem>
                  <SelectItem value="2">Pokhara Gift Shop</SelectItem>
                  <SelectItem value="3">Lalitpur Boutique</SelectItem>
                  <SelectItem value="4">Bhaktapur Fashion</SelectItem>
                  <SelectItem value="5">Thamel Souvenirs</SelectItem>
                  <SelectItem value="walk-in">Walk-in Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Product</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">W-Cut Bags (Small)</SelectItem>
                <SelectItem value="2">W-Cut Bags (Medium)</SelectItem>
                <SelectItem value="3">W-Cut Bags (Large)</SelectItem>
                <SelectItem value="4">U-Cut Bags (Medium)</SelectItem>
                <SelectItem value="5">Custom Printed Bags</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input type="number" min="1" defaultValue="1" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <Input type="number" min="0" defaultValue="50" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Payment Method</label>
              <Select defaultValue="cash">
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card Payment</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Total Amount</label>
              <Input type="number" min="0" defaultValue="50" readOnly />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Input placeholder="Any additional information" />
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsQuickSaleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleQuickSale({
              customer: 'Walk-in Customer',
              product: 'W-Cut Bags (Small)',
              quantity: 1,
              amount: 50,
              paymentMethod: 'cash',
              date: new Date().toISOString().split('T')[0]
            })}>
              Complete Sale
            </Button>
          </div>
        </div>
      </DialogForm>
      
      <DialogForm
        title="Generate Sales Report"
        description="Create a custom sales report"
        isOpen={isSalesReportOpen}
        onClose={() => setIsSalesReportOpen(false)}
        size="md"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select defaultValue="summary">
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="summary">Sales Summary</SelectItem>
                <SelectItem value="customer">Sales by Customer</SelectItem>
                <SelectItem value="product">Sales by Product</SelectItem>
                <SelectItem value="payment">Sales by Payment Method</SelectItem>
                <SelectItem value="detailed">Detailed Sales Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Date From</label>
              <Input 
                type="date" 
                value={dateRange.start} 
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date To</label>
              <Input 
                type="date" 
                value={dateRange.end} 
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer (Optional)</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Customers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Customers</SelectItem>
                <SelectItem value="1">Kathmandu Retail Store</SelectItem>
                <SelectItem value="2">Pokhara Gift Shop</SelectItem>
                <SelectItem value="3">Lalitpur Boutique</SelectItem>
                <SelectItem value="4">Bhaktapur Fashion</SelectItem>
                <SelectItem value="5">Thamel Souvenirs</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Include</label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-paid" className="rounded border-gray-300" checked />
                <label htmlFor="include-paid" className="text-sm">Paid Invoices</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-pending" className="rounded border-gray-300" checked />
                <label htmlFor="include-pending" className="text-sm">Pending Invoices</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-draft" className="rounded border-gray-300" />
                <label htmlFor="include-draft" className="text-sm">Draft Invoices</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="include-cancelled" className="rounded border-gray-300" />
                <label htmlFor="include-cancelled" className="text-sm">Cancelled Invoices</label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Format</label>
            <Select defaultValue="pdf">
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF Document</SelectItem>
                <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                <SelectItem value="csv">CSV File</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsSalesReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => handleGenerateReport({
              type: 'summary',
              dateRange,
              format: 'pdf'
            })}>
              Generate Report
            </Button>
          </div>
        </div>
      </DialogForm>
    </Layout>
  );
};

export default Sales;
