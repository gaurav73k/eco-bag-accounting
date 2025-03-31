
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
  File, 
  Clock, 
  Search, 
  Filter,
  FileText,
  Printer,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Truck,
  Edit,
  Trash2,
  Download,
  CheckSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import PurchaseOrderForm from '@/components/forms/PurchaseOrderForm';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Purchases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('orders');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const { toast: hookToast } = useToast();
  const { hasPermission } = useAuth();
  
  // Replace dummy data with state
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [deliveries, setDeliveries] = useState<any[]>([]);
  
  // Bulk operations state
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  const canEdit = hasPermission('edit_entry');
  const canDelete = hasPermission('delete_entry');
  const canBulkEdit = hasPermission('bulk_edit');
  const canBulkDelete = hasPermission('bulk_delete');

  const filteredData = currentTab === 'orders' 
    ? purchaseOrders.filter(po => {
        const matchesSearch = 
          po.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          po.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && po.status === statusFilter;
      })
    : deliveries.filter(delivery => {
        const matchesSearch = 
          delivery.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          delivery.poId?.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (statusFilter === 'all') return matchesSearch;
        return matchesSearch && delivery.status === statusFilter;
      });

  // Count purchase orders by status
  const countByStatus = {
    pending: purchaseOrders.filter(po => po.status === 'pending').length,
    approved: purchaseOrders.filter(po => po.status === 'approved').length,
    received: purchaseOrders.filter(po => po.status === 'received').length
  };
  
  const totalPurchaseOrdersAmount = purchaseOrders.reduce((sum, po) => sum + (po.total || 0), 0);

  const handleCreatePO = (poData: any) => {
    const newPO = {
      ...poData,
      id: `PO-${String(purchaseOrders.length + 1).padStart(5, '0')}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    
    setPurchaseOrders(prev => [...prev, newPO]);
    setIsAddDialogOpen(false);
    toast.success("Purchase Order Created", {
      description: `Purchase order ${newPO.id} has been created successfully.`
    });
  };

  const handleApprovePO = (id: string) => {
    setPurchaseOrders(prev => 
      prev.map(po => 
        po.id === id 
          ? { ...po, status: 'approved', approvedAt: new Date().toISOString() } 
          : po
      )
    );
    
    toast.success("Purchase Order Approved", {
      description: `Purchase order ${id} has been approved successfully.`
    });
  };

  const handleReceivePO = (id: string) => {
    setPurchaseOrders(prev => 
      prev.map(po => 
        po.id === id 
          ? { ...po, status: 'received', receivedAt: new Date().toISOString() } 
          : po
      )
    );
    
    const po = purchaseOrders.find(po => po.id === id);
    
    if (po) {
      const newDelivery = {
        id: `GRN-${String(deliveries.length + 1).padStart(5, '0')}`,
        poId: id,
        vendorName: po.vendorName,
        receivedDate: new Date().toISOString(),
        items: po.items,
        status: 'completed',
        notes: `Received against ${id}`
      };
      
      setDeliveries(prev => [...prev, newDelivery]);
    }
    
    toast.success("Purchase Order Received", {
      description: `Purchase order ${id} has been marked as received.`
    });
  };

  const handleCancelPO = (id: string) => {
    setPurchaseOrders(prev => 
      prev.map(po => 
        po.id === id 
          ? { ...po, status: 'cancelled', cancelledAt: new Date().toISOString() } 
          : po
      )
    );
    
    toast.success("Purchase Order Cancelled", {
      description: `Purchase order ${id} has been cancelled.`
    });
  };

  const handleDeletePO = (id: string) => {
    setPurchaseOrders(prev => prev.filter(po => po.id !== id));
    
    toast.success("Purchase Order Deleted", {
      description: `Purchase order ${id} has been deleted.`
    });
  };

  const handleExport = (format: string) => {
    try {
      let filename = '';
      let data: any[] = [];
      
      if (currentTab === 'orders') {
        filename = `purchase-orders-${getFormattedDate()}`;
        data = filteredData.map(po => ({
          'PO Number': po.id,
          'Vendor': po.vendorName,
          'Date': new Date(po.createdAt).toLocaleDateString(),
          'Expected Delivery': po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString() : 'N/A',
          'Total': po.total?.toLocaleString() || '0',
          'Status': po.status
        }));
      } else {
        filename = `deliveries-${getFormattedDate()}`;
        data = filteredData.map(delivery => ({
          'GRN Number': delivery.id,
          'PO Reference': delivery.poId,
          'Vendor': delivery.vendorName,
          'Received Date': new Date(delivery.receivedDate).toLocaleDateString(),
          'Status': delivery.status
        }));
      }
      
      exportToCSV(data, filename);
      
      toast.success("Export Successful", {
        description: `Data exported as ${format.toUpperCase()} file.`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export Failed", {
        description: "There was an error exporting the data."
      });
    }
  };

  const handleViewPO = (po: any) => {
    setSelectedPO(po);
    setIsViewDialogOpen(true);
  };

  // Bulk operations handlers
  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    if (isBulkMode) {
      setSelectedItems([]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredData.map(item => item.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    if (currentTab === 'orders') {
      setPurchaseOrders(prev => prev.filter(po => !selectedItems.includes(po.id)));
    } else {
      setDeliveries(prev => prev.filter(delivery => !selectedItems.includes(delivery.id)));
    }

    setSelectedItems([]);
    setIsBulkDeleteDialogOpen(false);
    toast.success(`${selectedItems.length} ${currentTab === 'orders' ? 'purchase orders' : 'delivery entries'} deleted successfully`);
  };

  const formatCurrency = (amount: number) => {
    return `Rs. ${amount.toLocaleString()}`;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'received':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Purchase Management" 
          description="Manage purchase orders and deliveries"
          icon={<ShoppingCart className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Purchase Order
            </Button>
            
            {(canBulkEdit || canBulkDelete) && (
              <Button 
                size="sm" 
                variant={isBulkMode ? "default" : "outline"}
                onClick={toggleBulkMode}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                {isBulkMode ? "Exit Bulk Mode" : "Bulk Mode"}
              </Button>
            )}
            
            {isBulkMode && selectedItems.length > 0 && canBulkDelete && (
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setIsBulkDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            )}
            
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
              <CardTitle className="text-lg font-medium">Open Orders</CardTitle>
              <CardDescription>Pending and approved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {countByStatus.pending + countByStatus.approved}
              </div>
              <div className="flex gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  {countByStatus.pending} pending
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {countByStatus.approved} approved
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Orders</CardTitle>
              <CardDescription>Current period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {purchaseOrders.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatCurrency(totalPurchaseOrdersAmount)} value in purchases
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Recent Deliveries</CardTitle>
              <CardDescription>Completed receipts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {deliveries.length}
              </div>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Truck className="h-3 w-3" />
                <span>{countByStatus.received} orders received</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Purchase Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="orders" className="mb-6" onValueChange={setCurrentTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
                  <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-[200px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {currentTab === 'orders' ? (
                        <>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="received">Received</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="partial">Partial</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="orders" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isBulkMode && (
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredData.length > 0 && selectedItems.length === filteredData.length} 
                              onCheckedChange={handleToggleSelectAll}
                            />
                          </TableHead>
                        )}
                        <TableHead>PO Number</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Expected Delivery</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isBulkMode ? 8 : 7} className="text-center py-8">
                            No purchase orders found. Try adjusting your search or create a new purchase order.
                          </TableCell>
                        </TableRow>
                      )}

                      {filteredData.map((po: any) => (
                        <TableRow key={po.id}>
                          {isBulkMode && (
                            <TableCell>
                              <Checkbox 
                                checked={selectedItems.includes(po.id)} 
                                onCheckedChange={() => handleToggleSelect(po.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{po.id}</TableCell>
                          <TableCell>{po.vendorName}</TableCell>
                          <TableCell>{formatDate(po.createdAt)}</TableCell>
                          <TableCell>{formatDate(po.expectedDelivery)}</TableCell>
                          <TableCell className="text-right font-medium">{formatCurrency(po.total || 0)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(po.status)}`}>
                              {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {!isBulkMode ? (
                              <div className="flex justify-end space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleViewPO(po)} 
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {po.status === 'pending' && (
                                      <DropdownMenuItem onClick={() => handleApprovePO(po.id)}>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                        Approve PO
                                      </DropdownMenuItem>
                                    )}
                                    
                                    {po.status === 'approved' && (
                                      <DropdownMenuItem onClick={() => handleReceivePO(po.id)}>
                                        <Truck className="mr-2 h-4 w-4 text-blue-600" />
                                        Mark Received
                                      </DropdownMenuItem>
                                    )}
                                    
                                    {(po.status === 'pending' || po.status === 'approved') && (
                                      <DropdownMenuItem onClick={() => handleCancelPO(po.id)}>
                                        <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                        Cancel PO
                                      </DropdownMenuItem>
                                    )}
                                    
                                    <DropdownMenuItem onClick={() => window.print()}>
                                      <Printer className="mr-2 h-4 w-4" />
                                      Print PO
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    {canDelete && (
                                      <DropdownMenuItem 
                                        onClick={() => handleDeletePO(po.id)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            ) : (
                              <span className="text-center block text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="deliveries" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isBulkMode && (
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredData.length > 0 && selectedItems.length === filteredData.length} 
                              onCheckedChange={handleToggleSelectAll}
                            />
                          </TableHead>
                        )}
                        <TableHead>GRN Number</TableHead>
                        <TableHead>PO Reference</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Received Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isBulkMode ? 7 : 6} className="text-center py-8">
                            No deliveries found. Try adjusting your search or receive new purchase orders.
                          </TableCell>
                        </TableRow>
                      )}

                      {filteredData.map((delivery: any) => (
                        <TableRow key={delivery.id}>
                          {isBulkMode && (
                            <TableCell>
                              <Checkbox 
                                checked={selectedItems.includes(delivery.id)} 
                                onCheckedChange={() => handleToggleSelect(delivery.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{delivery.id}</TableCell>
                          <TableCell>{delivery.poId}</TableCell>
                          <TableCell>{delivery.vendorName}</TableCell>
                          <TableCell>{formatDate(delivery.receivedDate)}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(delivery.status)}`}>
                              {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {!isBulkMode ? (
                              <div className="flex justify-end">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => {}} 
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => {}} 
                                  className="h-8 w-8"
                                >
                                  <Printer className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-center block text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Create Purchase Order Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create New Purchase Order</DialogTitle>
          </DialogHeader>
          <PurchaseOrderForm 
            onSubmit={handleCreatePO}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* View Purchase Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Purchase Order Details: {selectedPO?.id}</DialogTitle>
          </DialogHeader>
          {selectedPO && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1">Purchase Order Information</h3>
                  <div className="text-sm space-y-1">
                    <div><span className="text-muted-foreground">PO Number:</span> {selectedPO.id}</div>
                    <div><span className="text-muted-foreground">Date Created:</span> {formatDate(selectedPO.createdAt)}</div>
                    <div><span className="text-muted-foreground">Expected Delivery:</span> {formatDate(selectedPO.expectedDelivery)}</div>
                    <div><span className="text-muted-foreground">Status:</span> 
                      <span className={`inline-block ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedPO.status)}`}>
                        {selectedPO.status.charAt(0).toUpperCase() + selectedPO.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Vendor Information</h3>
                  <div className="text-sm space-y-1">
                    <div><span className="text-muted-foreground">Name:</span> {selectedPO.vendorName}</div>
                    <div><span className="text-muted-foreground">Email:</span> {selectedPO.vendorEmail || 'Not specified'}</div>
                    <div><span className="text-muted-foreground">Payment Terms:</span> {selectedPO.terms || 'Not specified'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
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
                      {selectedPO.items?.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-right">{item.quantity} {item.unit}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  {selectedPO.notes && (
                    <div>
                      <h3 className="font-medium mb-1">Notes</h3>
                      <p className="text-sm text-muted-foreground">{selectedPO.notes}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground mr-8">Subtotal:</span>
                    <span>{formatCurrency(selectedPO.total || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground mr-8">Tax (18%):</span>
                    <span>{formatCurrency((selectedPO.total || 0) * 0.18)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="mr-8">Total:</span>
                    <span>{formatCurrency((selectedPO.total || 0) * 1.18)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => window.print()}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                
                {selectedPO.status === 'pending' && (
                  <Button 
                    variant="default" 
                    onClick={() => {
                      handleApprovePO(selectedPO.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                
                {selectedPO.status === 'approved' && (
                  <Button 
                    variant="default" 
                    onClick={() => {
                      handleReceivePO(selectedPO.id);
                      setIsViewDialogOpen(false);
                    }}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Receive
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete multiple items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} {currentTab === 'orders' ? 'purchase orders' : 'delivery records'}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700">
              Delete {selectedItems.length} items
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Purchases;
