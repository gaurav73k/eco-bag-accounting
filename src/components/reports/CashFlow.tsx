import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FileText, Download, Printer, BarChart as BarChart4 } from 'lucide-react';
import { getCashFlowData, monthlyData } from '@/utils/reportData';
import { printReport, downloadReport } from '@/utils/reportUtils';

const CashFlow = () => {
  const { fiscalYear } = useFiscalYear();
  const [viewType, setViewType] = useState<'table' | 'chart'>('table');
  
  // Get data from central store
  const cashFlowData = getCashFlowData();
  
  // Calculate totals
  const operatingTotal = cashFlowData.operating.reduce((total, item) => total + item.amount, 0);
  const investingTotal = cashFlowData.investing.reduce((total, item) => total + item.amount, 0);
  const financingTotal = cashFlowData.financing.reduce((total, item) => total + item.amount, 0);
  const netCashFlow = operatingTotal + investingTotal + financingTotal;

  // Check if we have any data
  const hasData = cashFlowData.operating.length > 0 || 
                  cashFlowData.investing.length > 0 || 
                  cashFlowData.financing.length > 0;

  // Check if monthly data has any activity
  const hasMonthlyData = monthlyData.some(month => 
    month.operating !== 0 || month.investing !== 0 || month.financing !== 0 || month.net !== 0
  );

  // Handle print and download - wrap object in an array to match expected type
  const handlePrint = () => {
    printReport({
      title: "Cash Flow Statement",
      data: [cashFlowData], // Wrap in array to match expected type
      fiscalYear: Number(fiscalYear) // Convert to number
    });
  };

  const handleDownload = () => {
    downloadReport({
      title: "Cash Flow Statement",
      data: [cashFlowData], // Wrap in array to match expected type
      fiscalYear: Number(fiscalYear) // Convert to number
    });
  };

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
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      {!hasData && !hasMonthlyData ? (
        <div className="p-8 text-center bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No cash flow data available. Please record cash transactions first.</p>
        </div>
      ) : viewType === 'table' && !hasData ? (
        <div className="p-8 text-center bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No cash flow statement data available. Please record cash transactions first.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setViewType('chart')} 
            className="mt-4"
          >
            View Monthly Chart Instead
          </Button>
        </div>
      ) : viewType === 'table' ? (
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
                  {cashFlowData.operating.length > 0 ? (
                    cashFlowData.operating.map((item, idx) => (
                      <TableRow key={`operating-${idx}`} className={item.isSubtotal ? "font-medium" : ""}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No operating activities recorded
                      </TableCell>
                    </TableRow>
                  )}
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
                  {cashFlowData.investing.length > 0 ? (
                    cashFlowData.investing.map((item, idx) => (
                      <TableRow key={`investing-${idx}`} className={item.isSubtotal ? "font-medium" : ""}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No investing activities recorded
                      </TableCell>
                    </TableRow>
                  )}
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
                  {cashFlowData.financing.length > 0 ? (
                    cashFlowData.financing.map((item, idx) => (
                      <TableRow key={`financing-${idx}`} className={item.isSubtotal ? "font-medium" : ""}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No financing activities recorded
                      </TableCell>
                    </TableRow>
                  )}
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
          {hasMonthlyData ? (
            <>
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
                    <XAxis dataKey="month" />
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
            </>
          ) : (
            <div className="p-8 text-center bg-muted/30 rounded-md">
              <p className="text-muted-foreground">No cash flow data available. Please record cash transactions first.</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CashFlow;
