
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
  ShoppingCart, 
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

// Mock data for purchases
const purchasesData = [
  { id: 'PO-001', date: '2023-06-15', supplier: 'Birgunj Textiles', items: 'Non-woven PP Fabric (White) - 250kg', amount: 62500, status: 'received', paymentStatus: 'paid' },
  { id: 'PO-002', date: '2023-06-14', supplier: 'Kathmandu Thread Supplies', items: 'Thread Spools (White) - 100 units', amount: 15000, status: 'received', paymentStatus: 'paid' },
  { id: 'PO-003', date: '2023-06-13', supplier: 'Nepal Printing Inks', items: 'Printing Ink (Black) - 20L', amount: 18000, status: 'pending', paymentStatus: 'advance' },
  { id: 'PO-004', date: '2023-06-12', supplier: 'Birgunj Textiles', items: 'Non-woven PP Fabric (Green) - 100kg', amount: 27000, status: 'received', paymentStatus: 'paid' },
  { id: 'PO-005', date: '2023-06-10', supplier: 'Biratnagar Packaging', items: 'Packaging Materials - Bulk', amount: 9500, status: 'received', paymentStatus: 'paid' },
  { id: 'PO-006', date: '2023-06-08', supplier: 'Pokhara Tools & Machinery', items: 'Machine Parts - Assorted', amount: 32000, status: 'pending', paymentStatus: 'unpaid' },
  { id: 'PO-007', date: '2023-06-05', supplier: 'Kathmandu Thread Supplies', items: 'Thread Spools (Multi-color) - 50 units', amount: 8500, status: 'received', paymentStatus: 'paid' },
  { id: 'PO-008', date: '2023-06-02', supplier: 'Nepal Printing Inks', items: 'Printing Ink (Assorted) - 15L', amount: 14500, status: 'received', paymentStatus: 'paid' },
];

// Pending orders
const pendingOrders = purchasesData.filter(purchase => purchase.status === 'pending');
const unpaidOrders = purchasesData.filter(purchase => purchase.paymentStatus !== 'paid');

const Purchases: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');
  const { toast } = useToast();

  // Filter purchases based on search term and current tab
  const filteredPurchases = purchasesData.filter(purchase => {
    const matchesSearch = 
      purchase.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.items.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === 'all') return matchesSearch;
    if (currentTab === 'pending') return matchesSearch && purchase.status === 'pending';
    if (currentTab === 'received') return matchesSearch && purchase.status === 'received';
    if (currentTab === 'unpaid') return matchesSearch && purchase.paymentStatus !== 'paid';
    return matchesSearch;
  });

  const handleExport = (format: string) => {
    try {
      exportToCSV(
        filteredPurchases.map(purchase => ({
          'PO #': purchase.id,
          Date: purchase.date,
          Supplier: purchase.supplier,
          Items: purchase.items,
          Amount: purchase.amount,
          Status: purchase.status,
          'Payment Status': purchase.paymentStatus
        })),
        `purchases-data-${getFormattedDate()}`
      );
      
      toast({
        title: "Export Successful",
        description: `Purchases data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the purchases data.",
        variant: "destructive"
      });
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Purchases Management" 
          description="Track and manage all your purchase transactions"
          icon={<ShoppingCart className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              New Purchase Order
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
              <CardTitle className="text-lg font-medium">Total Purchases</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                Rs. {purchasesData.reduce((sum, purchase) => sum + purchase.amount, 0).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                From {purchasesData.length} purchase orders
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Pending Deliveries</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">
                {pendingOrders.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Worth Rs. {pendingOrders.reduce((sum, purchase) => sum + purchase.amount, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Unpaid Orders</CardTitle>
              <CardDescription>Current month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {unpaidOrders.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Worth Rs. {unpaidOrders.reduce((sum, purchase) => sum + purchase.amount, 0).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Purchase Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="mb-6" onValueChange={setCurrentTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="all">All Orders</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="received">Received</TabsTrigger>
                  <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search orders..."
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
                      <SelectItem value="supplier">Supplier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="all" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchases.map((purchase) => (
                        <TableRow key={purchase.id}>
                          <TableCell>{purchase.id}</TableCell>
                          <TableCell>{purchase.date}</TableCell>
                          <TableCell>{purchase.supplier}</TableCell>
                          <TableCell>{purchase.items}</TableCell>
                          <TableCell className="text-right">Rs. {purchase.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              purchase.status === 'received' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {purchase.status === 'received' ? 'Received' : 'Pending'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              purchase.paymentStatus === 'paid' 
                                ? 'bg-blue-100 text-blue-800' 
                                : purchase.paymentStatus === 'advance'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {purchase.paymentStatus === 'paid' ? 'Paid' : 
                               purchase.paymentStatus === 'advance' ? 'Advance' : 'Unpaid'}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredPurchases.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No purchase orders found. Try adjusting your search.
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
                        <TableHead>PO #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchases
                        .filter(purchase => purchase.status === 'pending')
                        .map((purchase) => (
                          <TableRow key={purchase.id}>
                            <TableCell>{purchase.id}</TableCell>
                            <TableCell>{purchase.date}</TableCell>
                            <TableCell>{purchase.supplier}</TableCell>
                            <TableCell>{purchase.items}</TableCell>
                            <TableCell className="text-right">Rs. {purchase.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                purchase.paymentStatus === 'paid' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : purchase.paymentStatus === 'advance'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {purchase.paymentStatus === 'paid' ? 'Paid' : 
                                 purchase.paymentStatus === 'advance' ? 'Advance' : 'Unpaid'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      {filteredPurchases.filter(purchase => purchase.status === 'pending').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No pending orders found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="received" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchases
                        .filter(purchase => purchase.status === 'received')
                        .map((purchase) => (
                          <TableRow key={purchase.id}>
                            <TableCell>{purchase.id}</TableCell>
                            <TableCell>{purchase.date}</TableCell>
                            <TableCell>{purchase.supplier}</TableCell>
                            <TableCell>{purchase.items}</TableCell>
                            <TableCell className="text-right">Rs. {purchase.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                purchase.paymentStatus === 'paid' 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : purchase.paymentStatus === 'advance'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {purchase.paymentStatus === 'paid' ? 'Paid' : 
                                 purchase.paymentStatus === 'advance' ? 'Advance' : 'Unpaid'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      {filteredPurchases.filter(purchase => purchase.status === 'received').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No received orders found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="unpaid" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO #</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPurchases
                        .filter(purchase => purchase.paymentStatus !== 'paid')
                        .map((purchase) => (
                          <TableRow key={purchase.id}>
                            <TableCell>{purchase.id}</TableCell>
                            <TableCell>{purchase.date}</TableCell>
                            <TableCell>{purchase.supplier}</TableCell>
                            <TableCell>{purchase.items}</TableCell>
                            <TableCell className="text-right">Rs. {purchase.amount.toLocaleString()}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                purchase.status === 'received' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {purchase.status === 'received' ? 'Received' : 'Pending'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      {filteredPurchases.filter(purchase => purchase.paymentStatus !== 'paid').length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No unpaid orders found.
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

export default Purchases;
