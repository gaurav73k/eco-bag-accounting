
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { PlusCircle, Download, AlertTriangle, Search, Package, FileText } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { exportToCSV, getFormattedDate } from '@/utils/exportUtils';
import { useToast } from '@/hooks/use-toast';

// Mock data for raw materials
const rawMaterials = [
  { id: '1', name: 'Non-woven PP Fabric (White)', stock: 250, unit: 'Rolls', reorderLevel: 100, status: 'medium' },
  { id: '2', name: 'Non-woven PP Fabric (Green)', stock: 50, unit: 'Rolls', reorderLevel: 100, status: 'low' },
  { id: '3', name: 'Thread Spools', stock: 180, unit: 'Spools', reorderLevel: 50, status: 'good' },
  { id: '4', name: 'Printing Ink (Black)', stock: 60, unit: 'Liters', reorderLevel: 30, status: 'medium' },
  { id: '5', name: 'Printing Ink (Red)', stock: 25, unit: 'Liters', reorderLevel: 30, status: 'low' },
  { id: '6', name: 'Printing Ink (Blue)', stock: 80, unit: 'Liters', reorderLevel: 30, status: 'good' },
];

// Mock data for finished goods
const finishedGoods = [
  { id: '1', name: 'W-Cut Bags (White)', stock: 3500, unit: 'Pieces', reorderLevel: 1000, status: 'good' },
  { id: '2', name: 'W-Cut Bags (Green)', stock: 1200, unit: 'Pieces', reorderLevel: 1000, status: 'medium' },
  { id: '3', name: 'U-Cut Bags (White)', stock: 500, unit: 'Pieces', reorderLevel: 1000, status: 'low' },
  { id: '4', name: 'U-Cut Bags (Green)', stock: 2800, unit: 'Pieces', reorderLevel: 1000, status: 'good' },
  { id: '5', name: 'Coat Covers', stock: 850, unit: 'Pieces', reorderLevel: 500, status: 'medium' },
  { id: '6', name: 'Custom-Printed Bags', stock: 300, unit: 'Pieces', reorderLevel: 200, status: 'medium' },
];

const StockManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('rawMaterials');
  const { toast } = useToast();

  // Get current data based on the active tab
  const currentData = currentTab === 'rawMaterials' ?
    rawMaterials.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())) :
    finishedGoods.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleExport = (format: string) => {
    try {
      exportToCSV(
        currentData.map(item => ({
          Name: item.name,
          Stock: item.stock,
          Unit: item.unit,
          'Reorder Level': item.reorderLevel,
          Status: item.status
        })),
        `${currentTab}-stock-${getFormattedDate()}`
      );
      
      toast({
        title: "Export Successful",
        description: `Stock data exported as ${format.toUpperCase()} file.`,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
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

  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Stock Management" 
          description="Track raw materials and finished goods inventory"
        >
          <div className="flex gap-2">
            <Button size="sm">
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Stock
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

        <div className="space-y-6">
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
                          <TableHead>Item Name</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Reorder Level</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.reorderLevel}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {currentData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
                              No items found. Try adjusting your search.
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
                          <TableHead>Item Name</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead>Reorder Level</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.stock}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.reorderLevel}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {currentData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8">
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
      </div>
    </Layout>
  );
};

export default StockManagement;
