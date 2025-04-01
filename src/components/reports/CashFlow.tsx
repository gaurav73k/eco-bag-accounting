import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, Printer, BarChart as BarChart4 } from 'lucide-react';

const CashFlow = () => {
  const { fiscalYear } = useFiscalYear();
  const [viewType, setViewType] = useState<'table' | 'chart'>('table');
  
  // Sample data - replace with actual data from your API or database
  const cashFlowData = {
    operating: [
      { name: 'Net Income', amount: 249000, isSubtotal: false },
      { name: 'Depreciation and Amortization', amount: 35000, isSubtotal: false },
      { name: 'Decrease in Accounts Receivable', amount: 18000, isSubtotal: false },
      { name: 'Increase in Inventory', amount: -25000, isSubtotal: false },
      { name: 'Increase in Accounts Payable', amount: 12000, isSubtotal: false },
    ],
    investing: [
      { name: 'Purchase of Property and Equipment', amount: -120000, isSubtotal: false },
      { name: 'Sale of Investments', amount: 35000, isSubtotal: false },
    ],
    financing: [
      { name: 'Proceeds from Long-term Debt', amount: 75000, isSubtotal: false },
      { name: 'Dividend Payments', amount: -45000, isSubtotal: false },
    ]
  };
  
  // Calculate totals
  const operatingTotal = cashFlowData.operating.reduce((total, item) => total + item.amount, 0);
  const investingTotal = cashFlowData.investing.reduce((total, item) => total + item.amount, 0);
  const financingTotal = cashFlowData.financing.reduce((total, item) => total + item.amount, 0);
  const netCashFlow = operatingTotal + investingTotal + financingTotal;

  // Prepare chart data for monthly trend
  const monthlyData = [
    { name: 'Jan', operating: 22500, investing: -8000, financing: 5000, net: 19500 },
    { name: 'Feb', operating: 24000, investing: -10000, financing: 0, net: 14000 },
    { name: 'Mar', operating: 26500, investing: -12000, financing: 0, net: 14500 },
    { name: 'Apr', operating: 25000, investing: -15000, financing: 10000, net: 20000 },
    { name: 'May', operating: 28000, investing: -20000, financing: 0, net: 8000 },
    { name: 'Jun', operating: 30000, investing: -5000, financing: 0, net: 25000 },
    { name: 'Jul', operating: 32000, investing: -10000, financing: 0, net: 22000 },
    { name: 'Aug', operating: 30000, investing: -15000, financing: 15000, net: 30000 },
    { name: 'Sep', operating: 28000, investing: -5000, financing: 0, net: 23000 },
    { name: 'Oct', operating: 26000, investing: -10000, financing: 0, net: 16000 },
    { name: 'Nov', operating: 24000, investing: -5000, financing: 0, net: 19000 },
    { name: 'Dec', operating: 31500, investing: -5000, financing: 45000, net: 71500 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Cash Flow Statement</h2>
          <p className="text-muted-foreground">For Fiscal Year {fiscalYear}</p>
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
              <CardTitle>Operating Activities</CardTitle>
              <CardDescription>Cash flows from day-to-day business operations</CardDescription>
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
                  {cashFlowData.operating.map((item, idx) => (
                    <TableRow key={`operating-${idx}`} className={item.isSubtotal ? "font-medium" : ""}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <h4 className="font-bold">Net Cash from Operating Activities</h4>
              <p className="font-bold font-mono">{operatingTotal.toLocaleString()} NPR</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Investing Activities</CardTitle>
              <CardDescription>Cash flows from buying and selling long-term assets</CardDescription>
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
                  {cashFlowData.investing.map((item, idx) => (
                    <TableRow key={`investing-${idx}`} className={item.isSubtotal ? "font-medium" : ""}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <h4 className="font-bold">Net Cash from Investing Activities</h4>
              <p className="font-bold font-mono">{investingTotal.toLocaleString()} NPR</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Financing Activities</CardTitle>
              <CardDescription>Cash flows from debt and equity financing</CardDescription>
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
                  {cashFlowData.financing.map((item, idx) => (
                    <TableRow key={`financing-${idx}`} className={item.isSubtotal ? "font-medium" : ""}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right font-mono">
                        {item.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <h4 className="font-bold">Net Cash from Financing Activities</h4>
              <p className="font-bold font-mono">{financingTotal.toLocaleString()} NPR</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Net Change in Cash</h3>
                <p className={`text-xl font-bold font-mono ${netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netCashFlow.toLocaleString()} NPR
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Monthly Cash Flow Trends</CardTitle>
            <CardDescription>Cash flow analysis throughout the year</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                operating: { 
                  label: "Operating",
                  theme: {
                    light: "#10B981", 
                    dark: "#34D399"
                  }
                },
                investing: {
                  label: "Investing",
                  theme: {
                    light: "#EF4444",
                    dark: "#F87171"
                  }
                },
                financing: {
                  label: "Financing",
                  theme: {
                    light: "#F59E0B",
                    dark: "#FBBF24"
                  }
                },
                net: {
                  label: "Net Cash Flow",
                  theme: {
                    light: "#4F46E5",
                    dark: "#818CF8"
                  }
                }
              }}
              className="w-full h-[400px]"
            >
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="operating" 
                  stroke="var(--color-operating)" 
                  strokeWidth={2}
                  name="Operating Activities"
                />
                <Line 
                  type="monotone" 
                  dataKey="investing" 
                  stroke="var(--color-investing)" 
                  strokeWidth={2}
                  name="Investing Activities"
                />
                <Line 
                  type="monotone" 
                  dataKey="financing" 
                  stroke="var(--color-financing)" 
                  strokeWidth={2}
                  name="Financing Activities"
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="var(--color-net)" 
                  strokeWidth={3}
                  name="Net Cash Flow"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CashFlow;
