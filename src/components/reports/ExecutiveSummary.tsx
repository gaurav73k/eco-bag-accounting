
import React from 'react';
import ReportTemplate from './ReportTemplate';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import { monthlyData } from '@/utils/reportData';
import { printReport, downloadReport } from '@/utils/reportUtils';

const ExecutiveSummary = () => {
  const { fiscalYear } = useFiscalYear();
  
  const financialMetrics = [
    { name: 'Revenue', value: 0 },
    { name: 'Expenses', value: 0 },
    { name: 'Net Income', value: 0 },
    { name: 'Total Assets', value: 0 },
    { name: 'Total Liabilities', value: 0 },
    { name: 'Equity', value: 0 },
  ];
  
  const revenueByCategory = [
    { name: 'Product Sales', value: 0 },
    { name: 'Services', value: 0 },
    { name: 'Subscriptions', value: 0 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const keyRatios = [
    { name: 'Gross Margin', value: '0.0%' },
    { name: 'Net Profit Margin', value: '0.0%' },
    { name: 'Return on Assets', value: '0.0%' },
    { name: 'Return on Equity', value: '0.0%' },
    { name: 'Current Ratio', value: '0.0' },
    { name: 'Debt-to-Equity', value: '0.0' },
  ];

  // Prepare summary data
  const summaryData = {
    metrics: financialMetrics,
    monthlyPerformance: monthlyData,
    revenueBreakdown: revenueByCategory,
    keyRatios: keyRatios
  };

  // Check if there's any actual data
  const hasData = financialMetrics.some(metric => metric.value > 0);

  // Handle print and download
  const handlePrint = () => {
    printReport({
      title: "Executive Summary",
      data: summaryData,
      fiscalYear
    });
  };

  const handleDownload = () => {
    downloadReport({
      title: "Executive Summary",
      data: summaryData,
      fiscalYear
    });
  };

  return (
    <ReportTemplate 
      title="Executive Summary" 
      description="Key financial metrics and performance indicators"
      actions={
        <>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-1 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        </>
      }
    >
      {!hasData ? (
        <div className="p-8 text-center bg-muted/30 rounded-md">
          <p className="text-muted-foreground">No financial data available. Please record transactions and accounting entries first.</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {financialMetrics.map((metric, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <h3 className="text-muted-foreground">{metric.name}</h3>
                  <p className="text-2xl font-bold">{metric.value.toLocaleString()} NPR</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Monthly Performance</h3>
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
                  profit: {
                    label: "Profit",
                    theme: {
                      light: "#4F46E5",
                      dark: "#818CF8"
                    }
                  }
                }}
                className="w-full h-[300px]"
              >
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" name="Revenue" />
                  <Line type="monotone" dataKey="expenses" stroke="var(--color-expenses)" name="Expenses" />
                  <Line type="monotone" dataKey="profit" stroke="var(--color-profit)" name="Profit" />
                </LineChart>
              </ChartContainer>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Revenue Breakdown</h3>
              <ChartContainer
                config={{
                  revenue: { 
                    label: "Revenue",
                    theme: {
                      light: "#10B981",
                      dark: "#34D399"
                    }
                  }
                }}
                className="w-full h-[300px]"
              >
                <PieChart>
                  <Pie
                    data={revenueByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {revenueByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toLocaleString()} NPR`} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Key Financial Ratios</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {keyRatios.map((ratio, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <h4 className="text-sm text-muted-foreground">{ratio.name}</h4>
                    <p className="text-xl font-bold">{ratio.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </ReportTemplate>
  );
};

export default ExecutiveSummary;
