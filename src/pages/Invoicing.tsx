
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  FileText, 
  Search, 
  Filter, 
  Printer, 
  Download, 
  Send,
  Eye,
  Download as DownloadIcon,
  RefreshCw,
  BookOpen
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogForm } from '@/components/ui/dialog-form';
import InvoiceForm from '@/components/forms/InvoiceForm';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

// Mock data for invoices - expanded with more realistic data
const invoicesData = [
  { id: 'INV-001', date: '2023-06-15', customer: 'Kathmandu Retail Store', customerInfo: { id: '1', name: 'Kathmandu Retail Store', address: 'Thamel, Kathmandu', phone: '01-4567890', email: 'info@kathmanduretail.com' }, items: [{id: '1', name: 'W-Cut Bags (Small)', quantity: 500, price: 40, total: 20000}], subtotal: 20000, vat: 2600, amount: 22600, status: 'paid', paymentMethod: 'Cash', paymentDate: '2023-06-15', accountingStatus: 'posted' },
  { id: 'INV-002', date: '2023-06-14', customer: 'Pokhara Gift Shop', customerInfo: { id: '2', name: 'Pokhara Gift Shop', address: 'Lakeside, Pokhara', phone: '061-456789', email: 'pokharagift@example.com' }, items: [{id: '2', name: 'W-Cut Bags (Medium)', quantity: 700, price: 50, total: 35000}], subtotal: 35000, vat: 4550, amount: 39550, status: 'paid', paymentMethod: 'Bank Transfer', paymentDate: '2023-06-14', accountingStatus: 'posted' },
  { id: 'INV-003', date: '2023-06-13', customer: 'Lalitpur Boutique', customerInfo: { id: '3', name: 'Lalitpur Boutique', address: 'Jawalakhel, Lalitpur', phone: '01-5567890', email: 'boutique@example.com' }, items: [{id: '3', name: 'W-Cut Bags (Large)', quantity: 300, price: 60, total: 18000}], subtotal: 18000, vat: 2340, amount: 20340, status: 'pending', paymentMethod: 'Credit', dueDate: '2023-06-28', accountingStatus: 'posted' },
  { id: 'INV-004', date: '2023-06-12', customer: 'Bhaktapur Fashion', customerInfo: { id: '4', name: 'Bhaktapur Fashion', address: 'Durbar Square, Bhaktapur', phone: '01-6612345', email: 'bhaktapurfashion@example.com' }, items: [{id: '4', name: 'U-Cut Bags (Medium)', quantity: 500, price: 44, total: 22000}], subtotal: 22000, vat: 2860, amount: 24860, status: 'paid', paymentMethod: 'Cash', paymentDate: '2023-06-12', accountingStatus: 'posted' },
  { id: 'INV-005', date: '2023-06-10', customer: 'Thamel Souvenirs', customerInfo: { id: '5', name: 'Thamel Souvenirs', address: 'Thamel, Kathmandu', phone: '01-4555555', email: 'souvenirs@example.com' }, items: [{id: '2', name: 'W-Cut Bags (Medium)', quantity: 300, price: 50, total: 15000}], subtotal: 15000, vat: 1950, amount: 16950, status: 'pending', paymentMethod: 'Credit', dueDate: '2023-06-25', accountingStatus: 'posted' },
  { id: 'INV-006', date: '2023-06-08', customer: 'Chitwan Market', customerInfo: { id: '6', name: 'Chitwan Market', address: 'Bharatpur, Chitwan', phone: '056-123456', email: 'chitwanmarket@example.com' }, items: [{id: '4', name: 'U-Cut Bags (Medium)', quantity: 800, price: 40, total: 32000}], subtotal: 32000, vat: 4160, amount: 36160, status: 'draft', paymentMethod: 'Unpaid', accountingStatus: 'pending' },
  { id: 'INV-007', date: '2023-06-05', customer: 'Biratnagar Store', customerInfo: { id: '7', name: 'Biratnagar Store', address: 'Main Road, Biratnagar', phone: '021-987654', email: 'biratnagarsrore@example.com' }, items: [{id: '5', name: 'Custom Printed Bags', quantity: 640, price: 75, total: 48000}], subtotal: 48000, vat: 6240, amount: 54240, status: 'draft', paymentMethod: 'Unpaid', accountingStatus: 'pending' },
  { id: 'INV-008', date: '2023-06-03', customer: 'Dharan Retailer', customerInfo: { id: '8', name: 'Dharan Retailer', address: 'Putali Line, Dharan', phone: '025-123789', email: 'dharanretail@example.com' }, items: [{id: '3', name: 'W-Cut Bags (Large)', quantity: 350, price: 40, total: 14000}], subtotal: 14000, vat: 1820, amount: 15820, status: 'cancelled', paymentMethod: 'Cancelled', accountingStatus: 'cancelled' },
];

const Invoicing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isViewInvoiceOpen, setIsViewInvoiceOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isProcessPaymentOpen, setIsProcessPaymentOpen] = useState(false);
  const { toast: toastNotification } = useToast();

  // Filter invoices based on search term and current tab
  const filteredInvoices = invoicesData.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && invoice.status === currentTab;
  });

  const handleCreateInvoice = (data: any) => {
    console.log('Invoice created:', data);
    setIsCreateInvoiceOpen(false);
    
    // Add automatic journal entry
    toast({
      title: "Invoice Created",
      description: `Invoice ${data.invoiceNumber} has been created and recorded in the accounting system.`,
    });
    
    // Redirect to daybook to see the entry (this would be automatic in a real system)
    setTimeout(() => {
      toast({
        title: "Accounting Entry Created",
        description: "Journal entry was automatically created in the daybook.",
      });
    }, 1000);
  };

  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsViewInvoiceOpen(true);
  };

  const handlePrintInvoice = (invoiceId: string) => {
    toastNotification({
      title: "Printing Invoice",
      description: `Printing invoice ${invoiceId}`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toastNotification({
      title: "Download Invoice",
      description: `Downloading invoice ${invoiceId}`,
    });
  };

  const handleSendInvoice = (invoiceId: string) => {
    toastNotification({
      title: "Send Invoice",
      description: `Sending invoice ${invoiceId} via email`,
    });
  };

  const handleProcessPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setIsProcessPaymentOpen(true);
  };

  const completePayment = (data: any) => {
    console.log('Payment processed:', data);
    setIsProcessPaymentOpen(false);
    
    toast({
      title: "Payment Processed",
      description: `Payment for invoice ${selectedInvoice.id} has been processed and recorded.`,
    });
    
    // Automatically create journal entry
    setTimeout(() => {
      toast({
        title: "Accounting Entry Created",
        description: "Payment journal entry was automatically created in the daybook.",
      });
    }, 1000);
  };

  const recordInDaybook = (invoice: any) => {
    toast({
      title: "Journal Entry Created",
      description: `Invoice ${invoice.id} has been recorded in the daybook.`,
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Sales & Invoicing" 
          description="Create invoices and manage sales transactions"
          icon={<FileText className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button onClick={() => setIsCreateInvoiceOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
            <Link to="/daybook">
              <Button variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                View Daybook
              </Button>
            </Link>
          </div>
        </PageTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {invoicesData.length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {invoicesData.filter(invoice => invoice.status === 'paid').length}
              </div>
              <p className="text-sm text-muted-foreground">
                Rs. {invoicesData.filter(invoice => invoice.status === 'paid')
                  .reduce((sum, invoice) => sum + invoice.amount, 0)
                  .toLocaleString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {invoicesData.filter(invoice => invoice.status === 'pending').length}
              </div>
              <p className="text-sm text-muted-foreground">
                Rs. {invoicesData.filter(invoice => invoice.status === 'pending')
                  .reduce((sum, invoice) => sum + invoice.amount, 0)
                  .toLocaleString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {invoicesData.filter(invoice => invoice.status === 'draft').length}
              </div>
              <p className="text-sm text-muted-foreground">
                Rs. {invoicesData.filter(invoice => invoice.status === 'draft')
                  .reduce((sum, invoice) => sum + invoice.amount, 0)
                  .toLocaleString()}
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
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="paid">Paid</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="draft">Draft</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search invoices..."
                      className="w-[250px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-new">Date (Newest First)</SelectItem>
                      <SelectItem value="date-old">Date (Oldest First)</SelectItem>
                      <SelectItem value="amount-high">Amount (Highest First)</SelectItem>
                      <SelectItem value="amount-low">Amount (Lowest First)</SelectItem>
                      <SelectItem value="customer">Customer Name</SelectItem>
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
                      <TableHead>Accounting</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length > 0 ? (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.date}</TableCell>
                          <TableCell>{invoice.customer}</TableCell>
                          <TableCell>{invoice.items.map(item => item.name).join(', ')}</TableCell>
                          <TableCell className="text-right">Rs. {invoice.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' 
                                ? 'bg-green-100 text-green-800' 
                                : invoice.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : invoice.status === 'draft'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              invoice.accountingStatus === 'posted' 
                                ? 'bg-green-100 text-green-800' 
                                : invoice.accountingStatus === 'pending'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {invoice.accountingStatus.charAt(0).toUpperCase() + invoice.accountingStatus.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewInvoice(invoice)}
                                title="View Invoice"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handlePrintInvoice(invoice.id)}
                                title="Print Invoice"
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownloadInvoice(invoice.id)}
                                title="Download Invoice"
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                              {invoice.status !== 'cancelled' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleSendInvoice(invoice.id)}
                                    title="Send Invoice"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                  {invoice.status === 'pending' && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => handleProcessPayment(invoice)}
                                      title="Process Payment"
                                      className="text-green-600"
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                    </Button>
                                  )}
                                  {invoice.accountingStatus === 'pending' && (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => recordInDaybook(invoice)}
                                      title="Record in Daybook"
                                      className="text-blue-600"
                                    >
                                      <BookOpen className="h-4 w-4" />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          No invoices found matching your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <DialogForm
        title="Create New Invoice"
        description="Fill in the details to create a new invoice. This will automatically generate the appropriate accounting entries."
        isOpen={isCreateInvoiceOpen}
        onClose={() => setIsCreateInvoiceOpen(false)}
        size="xl"
      >
        <InvoiceForm 
          onSubmit={handleCreateInvoice} 
          onCancel={() => setIsCreateInvoiceOpen(false)}
          onPreview={(data) => console.log('Preview invoice:', data)}
          onSendEmail={(data) => console.log('Send invoice via email:', data)}
        />
      </DialogForm>

      {selectedInvoice && (
        <>
          <DialogForm
            title={`Invoice ${selectedInvoice.id}`}
            description="View invoice details"
            isOpen={isViewInvoiceOpen}
            onClose={() => setIsViewInvoiceOpen(false)}
            size="lg"
          >
            <div className="space-y-6">
              <div className="border-b pb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Customer Information</h3>
                    <p className="text-sm">{selectedInvoice.customer}</p>
                    <p className="text-sm">{selectedInvoice.customerInfo?.address}</p>
                    <p className="text-sm">{selectedInvoice.customerInfo?.phone}</p>
                    <p className="text-sm">{selectedInvoice.customerInfo?.email}</p>
                  </div>
                  <div className="text-right">
                    <h3 className="font-semibold mb-2">Invoice Details</h3>
                    <p className="text-sm">Invoice Number: {selectedInvoice.id}</p>
                    <p className="text-sm">Date: {selectedInvoice.date}</p>
                    <p className="text-sm">Due Date: {selectedInvoice.dueDate || 'N/A'}</p>
                    <p className="text-sm">Payment Method: {selectedInvoice.paymentMethod}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Invoice Items</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">Rs. {item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-right">Rs. {item.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <div className="w-[300px] space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>Rs. {selectedInvoice.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (13%):</span>
                      <span>Rs. {selectedInvoice.vat.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>Rs. {selectedInvoice.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => setIsViewInvoiceOpen(false)}>
                    Close
                  </Button>
                </div>
                <div className="space-x-2">
                  <Button variant="outline" onClick={() => handlePrintInvoice(selectedInvoice.id)}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button onClick={() => handleSendInvoice(selectedInvoice.id)}>
                    <Send className="h-4 w-4 mr-2" />
                    Send to Customer
                  </Button>
                </div>
              </div>
            </div>
          </DialogForm>
          
          <DialogForm
            title="Process Payment"
            description={`Record payment for invoice ${selectedInvoice.id}`}
            isOpen={isProcessPaymentOpen}
            onClose={() => setIsProcessPaymentOpen(false)}
            size="md"
          >
            <div className="space-y-6">
              <div className="rounded-md bg-muted/50 p-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Invoice Number:</span>
                  <span>{selectedInvoice.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Customer:</span>
                  <span>{selectedInvoice.customer}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">Rs. {selectedInvoice.amount.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Date</label>
                    <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Payment Method</label>
                    <Select defaultValue="cash">
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="online">Online Payment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Reference Number</label>
                  <Input placeholder="Enter reference number (if applicable)" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input placeholder="Any additional notes about this payment" />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsProcessPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => completePayment({
                  invoiceId: selectedInvoice.id,
                  amount: selectedInvoice.amount,
                  date: new Date().toISOString().split('T')[0],
                  method: 'cash'
                })}>
                  Process Payment
                </Button>
              </div>
            </div>
          </DialogForm>
        </>
      )}
    </Layout>
  );
};

export default Invoicing;
