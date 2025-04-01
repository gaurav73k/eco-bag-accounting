
import React from 'react';
import ReportTemplate from './ReportTemplate';
import { useFiscalYear } from '@/contexts/FiscalYearContext';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { ChartContainer } from '@/components/ui/chart';

const ExecutiveSummary = () => {
  const { fiscalYear } = useFiscalYear();
  
  const financialMetrics = [
    { name: 'Revenue', value: 1025000 },
    { name: 'Expenses', value: 776000 },
    { name: 'Net Income', value: 249000 },
    { name: 'Total Assets', value: 682500 },
    { name: 'Total Liabilities', value: 327500 },
    { name: 'Equity', value: 355000 },
  ];
  
  const monthlyRevenue = [
    { month: 'Jan', revenue: 75000, expenses: 60000, profit: 15000 },
    { month: 'Feb', revenue: 78000, expenses: 62000, profit: 16000 },
    { month: 'Mar', revenue: 82000, expenses: 64000, profit: 18000 },
    { month: 'Apr', revenue: 85000, expenses: 65000, profit: 20000 },
    { month: 'May', revenue: 88000, expenses: 66000, profit: 22000 },
    { month: 'Jun', revenue: 90000, expenses: 67000, profit: 23000 },
    { month: 'Jul', revenue: 91000, expenses: 68000, profit: 23000 },
    { month: 'Aug', revenue: 89000, expenses: 67000, profit: 22000 },
    { month: 'Sep', revenue: 87000, expenses: 66000, profit: 21000 },
    { month: 'Oct', revenue: 85000, expenses: 65000, profit: 20000 },
    { month: 'Nov', revenue: 86000, expenses: 64000, profit: 22000 },
    { month: 'Dec', revenue: 89000, expenses: 62000, profit: 27000 },
  ];
  
  const revenueByCategory = [
    { name: 'Product Sales', value: 650000 },
    { name: 'Services', value: 250000 },
    { name: 'Subscriptions', value: 125000 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const keyRatios = [
    { name: 'Gross Margin', value: '38.5%' },
    { name: 'Net Profit Margin', value: '24.3%' },
    { name: 'Return on Assets', value: '36.5%' },
    { name: 'Return on Equity', value: '70.1%' },
    { name: 'Current Ratio', value: '1.8' },
    { name: 'Debt-to-Equity', value: '0.92' },
  ];

  return (
    <ReportTemplate 
      title="Executive Summary" 
      description="Key financial metrics and performance indicators"
    >
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
              <LineChart data={monthlyRevenue}>
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
    </ReportTemplate>
  );
};

export default ExecutiveSummary;
