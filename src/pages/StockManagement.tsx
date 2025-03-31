
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DialogForm } from '@/components/ui/dialog-form';
import StockForm from '@/components/forms/StockForm';
import { TooltipGuidance } from '@/components/ui/tooltip-guidance';
import { cn } from '@/lib/utils';
import { PlusCircle, Download, AlertTriangle, Search, Package, FileText, List } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { ActionButtons, BulkActionButtons } from '@/components/ui/action-buttons';
import { useAuth } from '@/contexts/AuthContext';
import { Checkbox } from '@/components/ui/checkbox';

// Empty state for inventory
const initialRawMaterials: any[] = [];
const initialFinishedGoods: any[] = [];

const StockManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('rawMaterials');
  const [rawMaterials, setRawMaterials] = useState(initialRawMaterials);
  const [finishedGoods, setFinishedGoods] = useState(initialFinishedGoods);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const { toast: hookToast } = useToast();
  const { hasPermission } = useAuth();

  // Get current data based on the active tab
  const currentData = currentTab === 'rawMaterials' ?
    rawMaterials.filter(item => item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) :
    finishedGoods.filter(item => item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

  const handleAddStock = (newItem: any) => {
    // Add id to the new item
    const itemWithId = {
      ...newItem,
      id: `${currentTab === 'rawMaterials' ? 'RAW' : 'FIN'}-${String(currentTab === 'rawMaterials' ? rawMaterials.length + 1 : finishedGoods.length + 1).padStart(3, '0')}`
    };
    
    if (currentTab === 'rawMaterials') {
      setRawMaterials(prev => [...prev, itemWithId]);
    } else {
      setFinishedGoods(prev => [...prev, itemWithId]);
    }
    
    setIsAddDialogOpen(false);
    toast.success(`Added new ${currentTab === 'rawMaterials' ? 'raw material' : 'finished good'} to inventory`);
  };

  const handleExport = (format: string) => {
    try {
      exportToCSV(
        currentData.map(item => ({
          Name: item.name || '',
          Stock: item.stock || 0,
          Unit: item.unit || '',
          'Reorder Level': item.reorderLevel || 0,
          Status: item.status || ''
        })),
        `${currentTab}-stock-${getFormattedDate()}`
      );
      
      hookToast({
        title: "Export Successful",
        description: `Stock data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      hookToast({
        title: "Export Failed",
        description: "There was an error exporting the stock data.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'good':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    setSelectedItems([]);
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDeleteItem = (itemId: string) => {
    if (currentTab === 'rawMaterials') {
      setRawMaterials(prev => prev.filter(item => item.id !== itemId));
    } else {
      setFinishedGoods(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const handleBulkDelete = () => {
    if (currentTab === 'rawMaterials') {
      setRawMaterials(prev => prev.filter(item => !selectedItems.includes(item.id)));
    } else {
      setFinishedGoods(prev => prev.filter(item => !selectedItems.includes(item.id)));
    }
    
    toast.success(`Deleted ${selectedItems.length} items`);
    setSelectedItems([]);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Stock Management" 
          description="Track raw materials and finished goods inventory"
          icon={<Package className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Stock
              <TooltipGuidance 
                content="Add new raw materials or finished goods to your inventory"
                side="bottom"
              />
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
            {(hasPermission('bulk_edit') || hasPermission('bulk_delete')) && (
              <Button variant="outline" size="sm" onClick={toggleBulkMode}>
                <List className="h-4 w-4 mr-2" />
                {isBulkMode ? "Exit Bulk Mode" : "Bulk Mode"}
              </Button>
            )}
          </div>
        </PageTitle>

        <div className="space-y-6">
          {/* Display bulk action buttons if in bulk mode and items are selected */}
          {isBulkMode && (
            <BulkActionButtons
              selectedCount={selectedItems.length}
              onBulkDelete={handleBulkDelete}
              onClearSelection={() => setSelectedItems([])}
            />
          )}
          
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Inventory Status</CardTitle>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  {currentTab === 'rawMaterials' ? 'Raw Materials' : 'Finished Goods'}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="rawMaterials" className="mb-6" onValueChange={setCurrentTab}>
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="rawMaterials">Raw Materials</TabsTrigger>
                    <TabsTrigger value="finishedGoods">Finished Goods</TabsTrigger>
                  </TabsList>
                  <InputWithIcon 
                    placeholder="Search inventory..." 
                    className="max-w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    leftIcon={<Search className="h-4 w-4" />}
                  />
                </div>

                <TabsContent value="rawMaterials" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {isBulkMode && (
                            <TableHead className="w-10">
                              <Checkbox 
                                checked={
                                  currentData.length > 0 && 
                                  currentData.every(item => selectedItems.includes(item.id))
                                }
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedItems(currentData.map(item => item.id));
                                  } else {
                                    setSelectedItems([]);
                                  }
                                }}
                                aria-label="Select all"
                              />
                            </TableHead>
                          )}
                          <TableHead>Item Name</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Reorder Level</TableHead>
                          <TableHead>Status</TableHead>
                          {isBulkMode && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.length > 0 ? currentData.map((item) => (
                          <TableRow key={item.id}>
                            {isBulkMode && (
                              <TableCell>
                                <Checkbox 
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={() => toggleItemSelection(item.id)}
                                  aria-label={`Select item ${item.name}`}
                                />
                              </TableCell>
                            )}
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.reorderLevel}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown'}
                              </Badge>
                            </TableCell>
                            {isBulkMode && (
                              <TableCell>
                                <ActionButtons
                                  entityType={currentTab === 'rawMaterials' ? 'raw material' : 'finished good'}
                                  entityId={item.id}
                                  entityName={item.name}
                                  onDelete={() => handleDeleteItem(item.id)}
                                  isBulkMode={true}
                                  isSelected={selectedItems.includes(item.id)}
                                  onToggleSelect={() => toggleItemSelection(item.id)}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={isBulkMode ? 7 : 5} className="text-center py-8">
                              {searchTerm ? (
                                <div>No items found matching your search.</div>
                              ) : (
                                <div className="flex flex-col items-center justify-center p-4">
                                  <Package className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-muted-foreground mb-2">No raw materials found</p>
                                  <Button onClick={() => setIsAddDialogOpen(true)}>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Raw Material
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="finishedGoods" className="mt-0">
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {isBulkMode && (
                            <TableHead className="w-10">
                              <Checkbox 
                                checked={
                                  currentData.length > 0 && 
                                  currentData.every(item => selectedItems.includes(item.id))
                                }
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedItems(currentData.map(item => item.id));
                                  } else {
                                    setSelectedItems([]);
                                  }
                                }}
                                aria-label="Select all"
                              />
                            </TableHead>
                          )}
                          <TableHead>Item Name</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Reorder Level</TableHead>
                          <TableHead>Status</TableHead>
                          {isBulkMode && <TableHead>Actions</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.length > 0 ? currentData.map((item) => (
                          <TableRow key={item.id}>
                            {isBulkMode && (
                              <TableCell>
                                <Checkbox 
                                  checked={selectedItems.includes(item.id)}
                                  onCheckedChange={() => toggleItemSelection(item.id)}
                                  aria-label={`Select item ${item.name}`}
                                />
                              </TableCell>
                            )}
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.reorderLevel}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Unknown'}
                              </Badge>
                            </TableCell>
                            {isBulkMode && (
                              <TableCell>
                                <ActionButtons
                                  entityType={currentTab === 'rawMaterials' ? 'raw material' : 'finished good'}
                                  entityId={item.id}
                                  entityName={item.name}
                                  onDelete={() => handleDeleteItem(item.id)}
                                  isBulkMode={true}
                                  isSelected={selectedItems.includes(item.id)}
                                  onToggleSelect={() => toggleItemSelection(item.id)}
                                />
                              </TableCell>
                            )}
                          </TableRow>
                        )) : (
                          <TableRow>
                            <TableCell colSpan={isBulkMode ? 7 : 5} className="text-center py-8">
                              {searchTerm ? (
                                <div>No items found matching your search.</div>
                              ) : (
                                <div className="flex flex-col items-center justify-center p-4">
                                  <Package className="h-10 w-10 text-muted-foreground mb-2" />
                                  <p className="text-muted-foreground mb-2">No finished goods found</p>
                                  <Button onClick={() => setIsAddDialogOpen(true)}>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add Finished Good
                                  </Button>
                                </div>
                              )}
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
      </div>

      <DialogForm 
        title={`Add New ${currentTab === 'rawMaterials' ? 'Raw Material' : 'Finished Good'}`}
        description="Add a new item to your inventory"
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      >
        <StockForm 
          type={currentTab as 'rawMaterials' | 'finishedGoods'} 
          onSubmit={handleAddStock}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </DialogForm>
    </Layout>
  );
};

export default StockManagement;
