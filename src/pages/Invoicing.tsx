
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
  Download as DownloadIcon
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DialogForm from '@/components/ui/dialog-form';
import InvoiceForm from '@/components/forms/InvoiceForm';
import { useToast } from '@/hooks/use-toast';

// Mock data for invoices
const invoicesData = [
  { id: 'INV-001', date: '2023-06-15', customer: 'Kathmandu Retail Store', items: 'W-Cut Bags (500pcs)', amount: 25000, status: 'paid', paymentMethod: 'Cash' },
  { id: 'INV-002', date: '2023-06-14', customer: 'Pokhara Gift Shop', items: 'Custom Printed Bags (1000pcs)', amount: 35000, status: 'paid', paymentMethod: 'Bank Transfer' },
  { id: 'INV-003', date: '2023-06-13', customer: 'Lalitpur Boutique', items: 'U-Cut Bags (400pcs)', amount: 18000, status: 'pending', paymentMethod: 'Credit' },
  { id: 'INV-004', date: '2023-06-12', customer: 'Bhaktapur Fashion', items: 'Coat Covers (600pcs)', amount: 22000, status: 'paid', paymentMethod: 'Cash' },
  { id: 'INV-005', date: '2023-06-10', customer: 'Thamel Souvenirs', items: 'W-Cut Bags (300pcs)', amount: 15000, status: 'pending', paymentMethod: 'Credit' },
  { id: 'INV-006', date: '2023-06-08', customer: 'Chitwan Market', items: 'U-Cut Bags (800pcs)', amount: 32000, status: 'draft', paymentMethod: 'Unpaid' },
  { id: 'INV-007', date: '2023-06-05', customer: 'Biratnagar Store', items: 'Custom Printed Bags (1200pcs)', amount: 48000, status: 'draft', paymentMethod: 'Unpaid' },
  { id: 'INV-008', date: '2023-06-03', customer: 'Dharan Retailer', items: 'Coat Covers (350pcs)', amount: 14000, status: 'cancelled', paymentMethod: 'Cancelled' },
];

const Invoicing: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const { toast } = useToast();

  // Filter invoices based on search term and current tab
  const filteredInvoices = invoicesData.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.items.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    return matchesSearch && invoice.status === currentTab;
  });

  const handleCreateInvoice = (data: any) => {
    console.log('Invoice created:', data);
    setIsCreateInvoiceOpen(false);
    toast({
      title: "Invoice Created",
      description: `Invoice ${data.invoiceNumber} has been created successfully.`,
    });
  };

  const handleViewInvoice = (invoiceId: string) => {
    toast({
      title: "View Invoice",
      description: `Viewing invoice ${invoiceId}`,
    });
  };

  const handlePrintInvoice = (invoiceId: string) => {
    toast({
      title: "Print Invoice",
      description: `Printing invoice ${invoiceId}`,
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Invoice",
      description: `Downloading invoice ${invoiceId}`,
    });
  };

  const handleSendInvoice = (invoiceId: string) => {
    toast({
      title: "Send Invoice",
      description: `Sending invoice ${invoiceId} via email`,
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Invoicing" 
          description="Create and manage invoices for your customers"
          icon={<FileText className="h-6 w-6" />}
        >
          <Button onClick={() => setIsCreateInvoiceOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Invoice
          </Button>
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
            <CardTitle>All Invoices</CardTitle>
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
                          <TableCell>{invoice.items}</TableCell>
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
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewInvoice(invoice.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handlePrintInvoice(invoice.id)}
                              >
                                <Printer className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownloadInvoice(invoice.id)}
                              >
                                <DownloadIcon className="h-4 w-4" />
                              </Button>
                              {invoice.status !== 'cancelled' && (
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleSendInvoice(invoice.id)}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
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
        description="Fill in the details to create a new invoice"
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
    </Layout>
  );
};

export default Invoicing;
