
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import InventoryForm from '@/components/forms/InventoryForm';
import HistoryTracker from '@/components/HistoryTracker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  PlusCircle, 
  ClipboardList, 
  Download, 
  Search, 
  Filter,
  FileText,
  AlertTriangle,
  Edit,
  Trash2,
  MoreHorizontal,
  CheckSquare
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
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
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('raw');
  const [rawMaterials, setRawMaterials] = useState([]);
  const [finishedGoods, setFinishedGoods] = useState([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const { toast: hookToast } = useToast();
  const { hasPermission } = useAuth();

  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);

  const canEdit = hasPermission('edit_entry');
  const canDelete = hasPermission('delete_entry');
  const canBulkEdit = hasPermission('bulk_edit');
  const canBulkDelete = hasPermission('bulk_delete');

  // Filter inventory based on search term and current tab
  const filteredInventory = currentTab === 'raw' 
    ? rawMaterials.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : finishedGoods.filter(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );

  // Identify low-stock items
  const lowStockRawMaterials = rawMaterials.filter(item => item.status === 'low');
  const lowStockFinishedGoods = finishedGoods.filter(item => item.status === 'low');

  const handleAddItem = (newItem: any) => {
    if (currentTab === 'raw') {
      const newId = `RM-${String(rawMaterials.length + 1).padStart(3, '0')}`;
      setRawMaterials(prev => [...prev, { ...newItem, id: newId }]);
    } else {
      const newId = `FG-${String(finishedGoods.length + 1).padStart(3, '0')}`;
      setFinishedGoods(prev => [...prev, { ...newItem, id: newId }]);
    }
    
    setIsAddDialogOpen(false);
    toast.success(`New ${currentTab === 'raw' ? 'raw material' : 'finished good'} added successfully`);
  };

  const handleEditItem = (updatedItem: any) => {
    if (currentTab === 'raw') {
      setRawMaterials(prev => 
        prev.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    } else {
      setFinishedGoods(prev => 
        prev.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
    }
    
    setIsEditDialogOpen(false);
    setCurrentItem(null);
    toast.success("Item updated successfully");
  };

  const handleDeleteItem = () => {
    if (!currentItem) return;
    
    if (currentTab === 'raw') {
      setRawMaterials(prev => prev.filter(item => item.id !== currentItem.id));
    } else {
      setFinishedGoods(prev => prev.filter(item => item.id !== currentItem.id));
    }
    
    setIsDeleteDialogOpen(false);
    setCurrentItem(null);
    toast.success("Item deleted successfully");
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;

    if (currentTab === 'raw') {
      setRawMaterials(prev => prev.filter(item => !selectedItems.includes(item.id)));
    } else {
      setFinishedGoods(prev => prev.filter(item => !selectedItems.includes(item.id)));
    }

    setSelectedItems([]);
    setIsBulkDeleteDialogOpen(false);
    toast.success(`${selectedItems.length} items deleted successfully`);
  };

  const toggleBulkMode = () => {
    setIsBulkMode(!isBulkMode);
    if (isBulkMode) {
      setSelectedItems([]);
    }
  };

  const handleToggleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  const handleExport = (format: string) => {
    try {
      if (currentTab === 'raw') {
        exportToCSV(
          filteredInventory.map(item => ({
            'Item ID': item.id,
            'Name': item.name,
            'Stock': item.stock,
            'Unit': item.unit,
            'Min Stock': item.minStock,
            'Max Stock': item.maxStock,
            'Status': item.status,
            'Location': item.location
          })),
          `raw-materials-inventory-${getFormattedDate()}`
        );
      } else {
        exportToCSV(
          filteredInventory.map(item => ({
            'Item ID': item.id,
            'Name': item.name,
            'Stock': item.stock,
            'Unit': item.unit,
            'Reorder Level': item.reorderLevel,
            'Status': item.status,
            'Location': item.location
          })),
          `finished-goods-inventory-${getFormattedDate()}`
        );
      }
      
      toast.success("Export Successful", {
        description: `Inventory data exported as ${format.toUpperCase()} file.`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export Failed", {
        description: "There was an error exporting the inventory data."
      });
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Inventory Management" 
          description="Track and manage your inventory"
          icon={<ClipboardList className="h-6 w-6" />}
        >
          <div className="flex gap-2">
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
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
            <HistoryTracker />
          </div>
        </PageTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Raw Materials</CardTitle>
              <CardDescription>Total inventory count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {rawMaterials.length} types
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {rawMaterials.filter(item => item.status === 'low').length} items low on stock
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Finished Goods</CardTitle>
              <CardDescription>Total inventory count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {finishedGoods.length} types
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {finishedGoods.filter(item => item.status === 'low').length} items low on stock
              </p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Low Stock Alert</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              {(lowStockRawMaterials.length + lowStockFinishedGoods.length) > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-medium">
                      {lowStockRawMaterials.length + lowStockFinishedGoods.length} items below minimum stock level
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Critical items: </span>
                    {[...lowStockRawMaterials, ...lowStockFinishedGoods].slice(0, 3).map((item, idx) => (
                      <span key={item.id} className="text-muted-foreground">
                        {item.name}{idx < Math.min(3, lowStockRawMaterials.length + lowStockFinishedGoods.length) - 1 ? ', ' : ''}
                      </span>
                    ))}
                    {(lowStockRawMaterials.length + lowStockFinishedGoods.length) > 3 && 
                      <span className="text-muted-foreground"> and {lowStockRawMaterials.length + lowStockFinishedGoods.length - 3} more</span>
                    }
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">No items currently low on stock</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="raw" className="mb-6" onValueChange={setCurrentTab}>
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="raw">Raw Materials</TabsTrigger>
                  <TabsTrigger value="finished">Finished Goods</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search inventory..."
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
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="stock">Stock Level</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <TabsContent value="raw" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isBulkMode && (
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredInventory.length > 0 && selectedItems.length === filteredInventory.length} 
                              onCheckedChange={handleToggleSelectAll}
                            />
                          </TableHead>
                        )}
                        <TableHead>Item ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Min Stock</TableHead>
                        <TableHead className="text-center">Max Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item: any) => (
                        <TableRow key={item.id}>
                          {isBulkMode && (
                            <TableCell>
                              <Checkbox 
                                checked={selectedItems.includes(item.id)} 
                                onCheckedChange={() => handleToggleSelect(item.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.stock} {item.unit}</TableCell>
                          <TableCell className="text-center">{item.minStock} {item.unit}</TableCell>
                          <TableCell className="text-center">{item.maxStock} {item.unit}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'normal' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status === 'normal' ? 'Normal' : 'Low Stock'}
                            </span>
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            {!isBulkMode ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {canEdit && (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setCurrentItem(item);
                                        setIsEditDialogOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  {canEdit && canDelete && <DropdownMenuSeparator />}
                                  {canDelete && (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setCurrentItem(item);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <span className="text-center block text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredInventory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isBulkMode ? 9 : 8} className="text-center py-8">
                            No items found. Try adjusting your search or add new items.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="finished" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {isBulkMode && (
                          <TableHead className="w-[50px]">
                            <Checkbox 
                              checked={filteredInventory.length > 0 && selectedItems.length === filteredInventory.length} 
                              onCheckedChange={handleToggleSelectAll}
                            />
                          </TableHead>
                        )}
                        <TableHead>Item ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Reorder Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item: any) => (
                        <TableRow key={item.id}>
                          {isBulkMode && (
                            <TableCell>
                              <Checkbox 
                                checked={selectedItems.includes(item.id)} 
                                onCheckedChange={() => handleToggleSelect(item.id)}
                              />
                            </TableCell>
                          )}
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell className="text-center">{item.stock} {item.unit}</TableCell>
                          <TableCell className="text-center">{item.reorderLevel} {item.unit}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === 'normal' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.status === 'normal' ? 'Normal' : 'Low Stock'}
                            </span>
                          </TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>
                            {!isBulkMode ? (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {canEdit && (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setCurrentItem(item);
                                        setIsEditDialogOpen(true);
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </DropdownMenuItem>
                                  )}
                                  {canEdit && canDelete && <DropdownMenuSeparator />}
                                  {canDelete && (
                                    <DropdownMenuItem 
                                      onClick={() => {
                                        setCurrentItem(item);
                                        setIsDeleteDialogOpen(true);
                                      }}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            ) : (
                              <span className="text-center block text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredInventory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={isBulkMode ? 8 : 7} className="text-center py-8">
                            No items found. Try adjusting your search or add new items.
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

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New {currentTab === 'raw' ? 'Raw Material' : 'Finished Good'}</DialogTitle>
          </DialogHeader>
          <InventoryForm 
            type={currentTab === 'raw' ? 'raw' : 'finished'} 
            onSubmit={handleAddItem} 
            onCancel={() => setIsAddDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit {currentTab === 'raw' ? 'Raw Material' : 'Finished Good'}</DialogTitle>
          </DialogHeader>
          {currentItem && (
            <InventoryForm 
              type={currentTab === 'raw' ? 'raw' : 'finished'} 
              onSubmit={handleEditItem} 
              onCancel={() => {
                setIsEditDialogOpen(false);
                setCurrentItem(null);
              }} 
              initialData={currentItem}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item
              {currentItem && ` "${currentItem.name}"`} from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCurrentItem(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={isBulkDeleteDialogOpen} onOpenChange={setIsBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete multiple items</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedItems.length} items? This action cannot be undone.
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

export default Inventory;
