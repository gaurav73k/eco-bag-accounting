
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Printer } from 'lucide-react';

const BalanceSheet = () => {
  const { fiscalYear } = useFiscalYear();
  const [viewType, setViewType] = useState<'table' | 'chart'>('table');
  
  // Sample data - replace with actual data from your API or database
  const balanceSheetData = {
    assets: [
      { category: 'Current Assets', items: [
        { name: 'Cash and Cash Equivalents', amount: 125000 },
        { name: 'Accounts Receivable', amount: 75000 },
        { name: 'Inventory', amount: 95000 },
        { name: 'Prepaid Expenses', amount: 15000 },
      ]},
      { category: 'Fixed Assets', items: [
        { name: 'Property and Equipment', amount: 350000 },
        { name: 'Less: Accumulated Depreciation', amount: -87500 },
      ]},
      { category: 'Other Assets', items: [
        { name: 'Intangible Assets', amount: 45000 },
        { name: 'Long-term Investments', amount: 65000 },
      ]},
    ],
    liabilitiesAndEquity: [
      { category: 'Current Liabilities', items: [
        { name: 'Accounts Payable', amount: 65000 },
        { name: 'Short-term Loans', amount: 35000 },
        { name: 'Accrued Expenses', amount: 25000 },
      ]},
      { category: 'Long-term Liabilities', items: [
        { name: 'Long-term Debt', amount: 180000 },
        { name: 'Deferred Tax Liabilities', amount: 22500 },
      ]},
      { category: 'Equity', items: [
        { name: 'Common Stock', amount: 100000 },
        { name: 'Retained Earnings', amount: 230000 },
      ]},
    ]
  };
  
  // Calculate totals
  const calculateTotal = (categories: any[]) => {
    return categories.reduce((total, category) => {
      const categoryTotal = category.items.reduce((catTotal: number, item: any) => catTotal + item.amount, 0);
      return total + categoryTotal;
    }, 0);
  };
  
  const totalAssets = calculateTotal(balanceSheetData.assets);
  const totalLiabilitiesAndEquity = calculateTotal(balanceSheetData.liabilitiesAndEquity);

  // Prepare chart data
  const chartData = [
    { name: 'Assets', value: totalAssets },
    { name: 'Liabilities & Equity', value: totalLiabilitiesAndEquity },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Balance Sheet</h2>
          <p className="text-muted-foreground">As of Fiscal Year {fiscalYear}</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={viewType === 'table' ? "default" : "outline"} 
            onClick={() => setViewType('table')}
            size="sm"
          >
            <FileText className="mr-1 h-4 w-4" /> Table View
          </Button>
          <Button 
            variant={viewType === 'chart' ? "default" : "outline"} 
            onClick={() => setViewType('chart')}
            size="sm"
          >
            <BarChart4 className="mr-1 h-4 w-4" /> Chart View
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      {viewType === 'table' ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Assets</CardTitle>
              <CardDescription>Current, Fixed, and Other Assets</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Description</TableHead>
                    <TableHead className="text-right">Amount (NPR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheetData.assets.map((category, idx) => (
                    <React.Fragment key={`asset-category-${idx}`}>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {category.items.map((item, itemIdx) => (
                        <TableRow key={`asset-item-${idx}-${itemIdx}`}>
                          <TableCell className="pl-8">{item.name}</TableCell>
                          <TableCell className="text-right font-mono">
                            {item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <h4 className="font-bold">Total Assets</h4>
              <p className="font-bold font-mono">{totalAssets.toLocaleString()} NPR</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Liabilities & Equity</CardTitle>
              <CardDescription>Current Liabilities, Long-term Liabilities, and Equity</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60%]">Description</TableHead>
                    <TableHead className="text-right">Amount (NPR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {balanceSheetData.liabilitiesAndEquity.map((category, idx) => (
                    <React.Fragment key={`liability-category-${idx}`}>
                      <TableRow className="bg-muted/50">
                        <TableCell className="font-medium">{category.category}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      {category.items.map((item, itemIdx) => (
                        <TableRow key={`liability-item-${idx}-${itemIdx}`}>
                          <TableCell className="pl-8">{item.name}</TableCell>
                          <TableCell className="text-right font-mono">
                            {item.amount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <h4 className="font-bold">Total Liabilities & Equity</h4>
              <p className="font-bold font-mono">{totalLiabilitiesAndEquity.toLocaleString()} NPR</p>
            </CardFooter>
          </Card>
        </>
      ) : (
        <Card className="p-4">
          <ChartContainer
            config={{
              assets: { 
                label: "Assets",
                theme: {
                  light: "#4F46E5",
                  dark: "#818CF8"
                }
              },
              liabilities: {
                label: "Liabilities & Equity",
                theme: {
                  light: "#10B981",
                  dark: "#34D399"
                }
              }
            }}
            className="w-full h-[400px]"
          >
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="var(--color-assets)" name="Value (NPR)" />
            </BarChart>
          </ChartContainer>
        </Card>
      )}
    </div>
  );
};

export default BalanceSheet;
