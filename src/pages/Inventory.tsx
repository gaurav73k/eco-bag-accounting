
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
  ClipboardList, 
  Download, 
  Search, 
  Filter,
  FileText,
  AlertTriangle
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

// Mock data for inventory
const rawMaterials = [
  { id: 'RM-001', name: 'Non-woven PP Fabric (White)', stock: 250, unit: 'kg', maxStock: 500, minStock: 100, status: 'normal', location: 'Warehouse A' },
  { id: 'RM-002', name: 'Non-woven PP Fabric (Green)', stock: 50, unit: 'kg', maxStock: 300, minStock: 75, status: 'low', location: 'Warehouse A' },
  { id: 'RM-003', name: 'Thread Spools (White)', stock: 180, unit: 'pcs', maxStock: 200, minStock: 50, status: 'normal', location: 'Storage B2' },
  { id: 'RM-004', name: 'Thread Spools (Multi-color)', stock: 35, unit: 'pcs', maxStock: 100, minStock: 30, status: 'low', location: 'Storage B2' },
  { id: 'RM-005', name: 'Printing Ink (Black)', stock: 60, unit: 'L', maxStock: 100, minStock: 25, status: 'normal', location: 'Chemical Storage' },
  { id: 'RM-006', name: 'Printing Ink (Assorted)', stock: 45, unit: 'L', maxStock: 80, minStock: 20, status: 'normal', location: 'Chemical Storage' },
  { id: 'RM-007', name: 'Zippers', stock: 1200, unit: 'pcs', maxStock: 2000, minStock: 500, status: 'normal', location: 'Storage C1' },
  { id: 'RM-008', name: 'Packaging Materials', stock: 600, unit: 'sets', maxStock: 1000, minStock: 300, status: 'normal', location: 'Packaging Area' },
];

const finishedGoods = [
  { id: 'FG-001', name: 'W-Cut Bags (Small)', stock: 2500, unit: 'pcs', reorderLevel: 1000, status: 'normal', location: 'Finished Goods A1' },
  { id: 'FG-002', name: 'W-Cut Bags (Medium)', stock: 1800, unit: 'pcs', reorderLevel: 1000, status: 'normal', location: 'Finished Goods A1' },
  { id: 'FG-003', name: 'W-Cut Bags (Large)', stock: 650, unit: 'pcs', reorderLevel: 800, status: 'low', location: 'Finished Goods A2' },
  { id: 'FG-004', name: 'U-Cut Bags (Small)', stock: 3200, unit: 'pcs', reorderLevel: 1200, status: 'normal', location: 'Finished Goods B1' },
  { id: 'FG-005', name: 'U-Cut Bags (Medium)', stock: 2100, unit: 'pcs', reorderLevel: 1000, status: 'normal', location: 'Finished Goods B1' },
  { id: 'FG-006', name: 'U-Cut Bags (Large)', stock: 450, unit: 'pcs', reorderLevel: 750, status: 'low', location: 'Finished Goods B2' },
  { id: 'FG-007', name: 'Coat Covers', stock: 1750, unit: 'pcs', reorderLevel: 800, status: 'normal', location: 'Finished Goods C1' },
  { id: 'FG-008', name: 'Custom Printed Bags (Assorted)', stock: 850, unit: 'pcs', reorderLevel: 600, status: 'normal', location: 'Finished Goods D1' },
];

// Identify low-stock items
const lowStockRawMaterials = rawMaterials.filter(item => item.status === 'low');
const lowStockFinishedGoods = finishedGoods.filter(item => item.status === 'low');

const Inventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('raw');
  const { toast } = useToast();

  // Filter inventory based on search term and current tab
  const filteredInventory = currentTab === 'raw' 
    ? rawMaterials.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : finishedGoods.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      );

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
      
      toast({
        title: "Export Successful",
        description: `Inventory data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the inventory data.",
        variant: "destructive"
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
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Item
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
                {lowStockRawMaterials.length} items low on stock
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
                {lowStockFinishedGoods.length} items low on stock
              </p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Low Stock Alert</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
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
                {lowStockRawMaterials.length + lowStockFinishedGoods.length > 3 && 
                  <span className="text-muted-foreground"> and {lowStockRawMaterials.length + lowStockFinishedGoods.length - 3} more</span>
                }
              </div>
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
                        <TableHead>Item ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Min Stock</TableHead>
                        <TableHead className="text-center">Max Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item: any) => (
                        <TableRow key={item.id}>
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
                        </TableRow>
                      ))}
                      {filteredInventory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No items found. Try adjusting your search.
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
                        <TableHead>Item ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Reorder Level</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInventory.map((item: any) => (
                        <TableRow key={item.id}>
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
                        </TableRow>
                      ))}
                      {filteredInventory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No items found. Try adjusting your search.
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

export default Inventory;
