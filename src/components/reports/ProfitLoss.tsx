
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { FileText, Download, Printer, LineChart } from 'lucide-react';
import { getProfitLossData } from '@/utils/reportData';
import { printReport, downloadReport } from '@/utils/reportUtils';

const ProfitLoss = () => {
  const { fiscalYear } = useFiscalYear();
  const [viewType, setViewType] = useState<'table' | 'chart'>('table');
  
  // Get data from central store
  const profitLossData = getProfitLossData();
  
  // Calculate totals
  const totalRevenue = profitLossData.revenue.reduce((total, item) => total + item.amount, 0);
  const totalExpenses = profitLossData.expenses.reduce((total, item) => total + item.amount, 0);
  const netIncome = totalRevenue - totalExpenses;

  // Check if we have any data
  const hasData = profitLossData.revenue.length > 0 || profitLossData.expenses.length > 0;

  // Prepare chart data
  const chartData = [
    { name: 'Revenue', value: totalRevenue },
    { name: 'Expenses', value: totalExpenses },
    { name: 'Net Income', value: netIncome },
  ];

  // Handle print and download
  const handlePrint = () => {
    printReport({
      title: "Profit & Loss Statement",
      data: profitLossData,
      fiscalYear
    });
  };

  const handleDownload = () => {
    downloadReport({
      title: "Profit & Loss Statement",
      data: profitLossData,
      fiscalYear
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Profit & Loss Statement</h2>
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
            <LineChart className="mr-1 h-4 w-4" /> Chart View
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      
      {!hasData ? (
        <div className="p-8 text-center bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No profit & loss data available. Please record revenue and expense transactions first.</p>
        </div>
      ) : viewType === 'table' ? (
        <>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
              <CardDescription>Total income generated during the fiscal year</CardDescription>
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
                  {profitLossData.revenue.length > 0 ? (
                    profitLossData.revenue.map((item, idx) => (
                      <TableRow key={`revenue-${idx}`}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No revenue entries recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <h4 className="font-bold">Total Revenue</h4>
              <p className="font-bold font-mono">{totalRevenue.toLocaleString()} NPR</p>
            </CardFooter>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Expenses</CardTitle>
              <CardDescription>Total costs incurred during the fiscal year</CardDescription>
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
                  {profitLossData.expenses.length > 0 ? (
                    profitLossData.expenses.map((item, idx) => (
                      <TableRow key={`expense-${idx}`}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right font-mono">
                          {item.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground">
                        No expense entries recorded
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <h4 className="font-bold">Total Expenses</h4>
              <p className="font-bold font-mono">{totalExpenses.toLocaleString()} NPR</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Net Income</h3>
                <p className={`text-xl font-bold font-mono ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {netIncome.toLocaleString()} NPR
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="p-4">
          <ChartContainer
            config={{
              revenue: { 
                label: "Revenue",
                theme: {
                  light: "#10B981",
                  dark: "#34D399"
                }
              },
              expenses: {
                label: "Expenses",
                theme: {
                  light: "#EF4444",
                  dark: "#F87171"
                }
              },
              netIncome: {
                label: "Net Income",
                theme: {
                  light: "#4F46E5",
                  dark: "#818CF8"
                }
              }
            }}
            className="w-full h-[400px]"
          >
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Amount (NPR)" />
            </BarChart>
          </ChartContainer>
        </Card>
      )}
    </div>
  );
};

export default ProfitLoss;
