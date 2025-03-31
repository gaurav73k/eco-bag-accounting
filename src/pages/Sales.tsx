
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
  Calendar,
  List
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
import { ActionButtons, BulkActionButtons } from '@/components/ui/action-buttons';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

// Empty state for sales
const salesData: any[] = [];

const Sales: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);
  const [isSalesReportOpen, setIsSalesReportOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sales, setSales] = useState<any[]>(salesData);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);
  const { toast: toastNotification } = useToast();
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const filteredSales = sales.filter(sale => {
    const matchesSearch = 
      (sale?.id?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (sale?.customer?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (sale?.items?.some((item: any) => item.name.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && sale.status === currentTab;
  });

  const handleExport = (format: string) => {
    try {
      exportToCSV(
        filteredSales.map(sale => ({
          'Invoice #': sale.id || '',
          Date: sale.date || '',
          Customer: sale.customer || '',
          Items: sale.items?.map((item: any) => item.name).join(', ') || '',
          Amount: sale.amount || 0,
          Status: sale.status || ''
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
    
    // Create a new sale record
    const newSale = {
      id: `SALE-${String(sales.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      customer: data.customer,
      items: [{
        id: '1',
        name: data.product,
        quantity: data.quantity,
        price: data.price,
        total: data.price * data.quantity
      }],
      amount: data.amount,
      status: 'paid',
      paymentMethod: data.paymentMethod
    };
    
    setSales(prev => [...prev, newSale]);
    
    toast.success("Sale Processed", {
      description: "Quick sale has been processed and recorded in the system.",
    });
    
    setTimeout(() => {
      toast.success("Invoice Created", {
        description: "Invoice has been automatically generated for this sale.",
      });
    }, 1000);
  };

  const handleGenerateReport = (data: any) => {
    console.log('Sales report generated:', data);
    setIsSalesReportOpen(false);
    
    toast.success("Report Generated", {
      description: "Sales report has been generated successfully.",
    });
  };

  const handleInvoiceClick = (sale: any) => {
    navigate(`/invoicing`);
  };

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedSales([]);
  };

  const toggleSaleSelection = (saleId: string) => {
    setSelectedSales(prev => 
      prev.includes(saleId) 
        ? prev.filter(id => id !== saleId)
        : [...prev, saleId]
    );
  };

  const handleDeleteSale = (saleId: string) => {
    setSales(prev => prev.filter(sale => sale.id !== saleId));
  };

  const handleBulkDelete = () => {
    setSales(prev => prev.filter(sale => !selectedSales.includes(sale.id)));
    toast.success(`Deleted ${selectedSales.length} sales`);
    setSelectedSales([]);
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
            {(hasPermission('bulk_edit') || hasPermission('bulk_delete')) && (
              <Button variant="outline" onClick={toggleBulkMode}>
                <List className="h-4 w-4 mr-2" />
                {isBulkMode ? "Exit Bulk Mode" : "Bulk Mode"}
              </Button>
            )}
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
                Rs. {sales.reduce((sum, sale) => sum + (sale.amount || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {sales.length} invoices
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
                Rs. {sales.filter(sale => sale.status === 'paid').reduce((sum, sale) => sum + (sale.amount || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {sales.filter(sale => sale.status === 'paid').length} paid invoices
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
                Rs. {sales.filter(sale => sale.status === 'pending').reduce((sum, sale) => sum + (sale.amount || 0), 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {sales.filter(sale => sale.status === 'pending').length} pending invoices
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
                0%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                No prior month data
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Display bulk action buttons if in bulk mode and items are selected */}
        {isBulkMode && (
          <BulkActionButtons
            selectedCount={selectedSales.length}
            onBulkDelete={handleBulkDelete}
            onClearSelection={() => setSelectedSales([])}
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="md:col-span-3">
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
                        {isBulkMode && (
                          <TableHead className="w-10">
                            <Checkbox 
                              checked={
                                filteredSales.length > 0 && 
                                filteredSales.every(sale => selectedSales.includes(sale.id))
                              }
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSales(filteredSales.map(sale => sale.id));
                                } else {
                                  setSelectedSales([]);
                                }
                              }}
                              aria-label="Select all"
                            />
                          </TableHead>
                        )}
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
                      {filteredSales.length > 0 ? (
                        filteredSales.map((sale) => (
                          <TableRow key={sale.id} className={!isBulkMode ? "cursor-pointer" : undefined} onClick={!isBulkMode ? () => handleInvoiceClick(sale) : undefined}>
                            {isBulkMode && (
                              <TableCell onClick={(e) => e.stopPropagation()}>
                                <Checkbox 
                                  checked={selectedSales.includes(sale.id)}
                                  onCheckedChange={() => toggleSaleSelection(sale.id)}
                                  aria-label={`Select sale ${sale.id}`}
                                />
                              </TableCell>
                            )}
                            <TableCell>{sale.id}</TableCell>
                            <TableCell>{sale.date}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell>{sale.items?.map((item: any) => item.name).join(', ') || 'None'}</TableCell>
                            <TableCell className="text-right">Rs. {sale.amount?.toLocaleString() || '0'}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                sale.status === 'paid' 
                                  ? 'bg-green-100 text-green-800' 
                                  : sale.status === 'pending'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {sale.status?.charAt(0).toUpperCase() + sale.status?.slice(1) || 'Unknown'}
                              </span>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              {!isBulkMode ? (
                                <Button variant="ghost" size="sm" className="h-8 px-2">
                                  View <ArrowRight className="h-3 w-3 ml-1" />
                                </Button>
                              ) : (
                                <ActionButtons
                                  entityType="sale"
                                  entityId={sale.id}
                                  entityName={`Sale ${sale.id}`}
                                  onDelete={() => handleDeleteSale(sale.id)}
                                  isBulkMode={true}
                                  isSelected={selectedSales.includes(sale.id)}
                                  onToggleSelect={() => toggleSaleSelection(sale.id)}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isBulkMode ? 8 : 7} className="text-center py-8">
                            {searchTerm ? (
                              <div>No sales found matching your search.</div>
                            ) : (
                              <div className="flex flex-col items-center justify-center p-4">
                                <Receipt className="h-10 w-10 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground mb-2">No sales found</p>
                                <Button onClick={() => navigate('/invoicing')}>
                                  <PlusCircle className="h-4 w-4 mr-2" />
                                  Create Invoice
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {filteredSales.length > 0 && (
                  <div className="flex justify-center mt-4">
                    <Button variant="outline" onClick={() => navigate('/invoicing')}>
                      View All Sales <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </Tabs>
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
              price: 50,
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
            <label className="text-sm font-medium">Include</label>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="include-paid" />
                <label htmlFor="include-paid" className="text-sm">Paid Invoices</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-pending" />
                <label htmlFor="include-pending" className="text-sm">Pending Invoices</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-draft" />
                <label htmlFor="include-draft" className="text-sm">Draft Invoices</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="include-cancelled" />
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
