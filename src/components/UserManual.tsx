
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, HelpCircle } from 'lucide-react';

const UserManual = () => {
  const [tab, setTab] = useState('getting-started');

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-4 right-4 gap-2">
          <BookOpen className="h-4 w-4" />
          <span>User Manual</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            User Manual
          </DrawerTitle>
          <DrawerDescription>
            Learn how to use the accounting system effectively
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 overflow-auto">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="getting-started" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Welcome to the Accounting System</h3>
                <p>This accounting system is designed to help you manage your business finances efficiently. Here's how to get started:</p>
                
                <h4 className="font-medium mt-4">Navigation</h4>
                <p>Use the sidebar menu to navigate between different modules:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Dashboard:</strong> Overview of your financial status</li>
                  <li><strong>Day Book:</strong> Record daily transactions</li>
                  <li><strong>Sales:</strong> Manage sales and invoices</li>
                  <li><strong>Purchases:</strong> Track purchases and vendors</li>
                  <li><strong>Inventory:</strong> Manage products and stock</li>
                  <li><strong>Ledger:</strong> View accounts and balances</li>
                  <li><strong>Payroll:</strong> Manage employee payroll</li>
                  <li><strong>Expenses:</strong> Track business expenses</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Managing Transactions</h3>
                <p>Learn how to record different types of transactions:</p>
                
                <h4 className="font-medium mt-4">Sales Transactions</h4>
                <p>To create a new sale or invoice:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Navigate to the Sales page</li>
                  <li>Click on "New Invoice" button</li>
                  <li>Fill in customer details and add products</li>
                  <li>Save the invoice to record the transaction</li>
                </ol>
                
                <h4 className="font-medium mt-4">Purchase Transactions</h4>
                <p>To record a new purchase:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Go to the Purchases page</li>
                  <li>Click "New Purchase" button</li>
                  <li>Select the vendor and add items</li>
                  <li>Save to update inventory and accounts</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Inventory Management</h3>
                <p>Learn how to manage your inventory:</p>
                
                <h4 className="font-medium mt-4">Adding Products</h4>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Go to the Inventory page</li>
                  <li>Click "Add Item" button</li>
                  <li>Fill in product details including SKU, price, and stock levels</li>
                  <li>Save to add to your inventory</li>
                </ol>
                
                <h4 className="font-medium mt-4">Stock Adjustments</h4>
                <p>To adjust stock levels:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1">
                  <li>Navigate to the Stock Management page</li>
                  <li>Find the item you want to adjust</li>
                  <li>Click "Add Stock" to adjust inventory levels</li>
                  <li>Provide a reason for adjustment for audit purposes</li>
                </ol>
              </div>
            </TabsContent>
            
            <TabsContent value="reports" className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Reports and Analysis</h3>
                <p>Generate various reports to analyze your business performance:</p>
                
                <h4 className="font-medium mt-4">Financial Reports</h4>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Balance Sheet:</strong> View assets, liabilities, and equity</li>
                  <li><strong>Profit & Loss:</strong> Analyze income and expenses</li>
                  <li><strong>Cash Flow:</strong> Track cash movement in your business</li>
                </ul>
                
                <h4 className="font-medium mt-4">Exporting Data</h4>
                <p>Most reports can be exported to CSV format by clicking the Export button on their respective pages.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default UserManual;
