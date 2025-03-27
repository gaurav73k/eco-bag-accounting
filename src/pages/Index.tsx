
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard';
import FinancialOverviewChart from '@/components/dashboard/FinancialOverviewChart';
import InventorySummaryCard from '@/components/dashboard/InventorySummaryCard';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, DollarSign, ShoppingCart, Package, PlusCircle } from 'lucide-react';

// Mock data
const transactions = [
  { id: '1', date: 'Today, 2:00 PM', description: 'Sale of W-Cut Bags', amount: 25000, type: 'income' as const },
  { id: '2', date: 'Today, 11:30 AM', description: 'Purchase of Raw Materials', amount: 15000, type: 'expense' as const },
  { id: '3', date: 'Yesterday', description: 'Sale of Custom Printed Bags', amount: 35000, type: 'income' as const },
  { id: '4', date: '2 days ago', description: 'Electricity Bill', amount: 5000, type: 'expense' as const },
  { id: '5', date: '3 days ago', description: 'Sale of U-Cut Bags', amount: 18000, type: 'income' as const },
];

const chartData = [
  { name: 'Jan', income: 120000, expenses: 65000 },
  { name: 'Feb', income: 90000, expenses: 63000 },
  { name: 'Mar', income: 170000, expenses: 85000 },
  { name: 'Apr', income: 130000, expenses: 55000 },
  { name: 'May', income: 160000, expenses: 80000 },
  { name: 'Jun', income: 140000, expenses: 90000 },
];

const inventoryItems = [
  { id: '1', name: 'Non-woven PP Fabric (White)', stock: 250, maxStock: 500, status: 'medium' as const },
  { id: '2', name: 'Non-woven PP Fabric (Green)', stock: 50, maxStock: 300, status: 'low' as const },
  { id: '3', name: 'Thread Spools', stock: 180, maxStock: 200, status: 'good' as const },
  { id: '4', name: 'Printing Ink (Black)', stock: 60, maxStock: 100, status: 'medium' as const },
];

const Index: React.FC = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <PageTitle 
          title="Financial Dashboard" 
          description="Overview of your business finances and operations"
        >
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </PageTitle>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            title="Total Sales (MTD)" 
            value="Rs. 425,000" 
            icon={DollarSign}
            trend="up"
            trendValue="+15% from last month"
            className="animate-slide-in"
          />
          <StatCard 
            title="Total Expenses (MTD)" 
            value="Rs. 210,000" 
            icon={ArrowDownUp}
            trend="down"
            trendValue="-8% from last month"
            className="animate-slide-in [animation-delay:100ms]"
          />
          <StatCard 
            title="Recent Orders" 
            value="24" 
            description="12 pending delivery"
            icon={ShoppingCart}
            className="animate-slide-in [animation-delay:200ms]"
          />
          <StatCard 
            title="Inventory Items" 
            value="15" 
            description="3 low stock alerts"
            icon={Package}
            className="animate-slide-in [animation-delay:300ms]"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FinancialOverviewChart 
            data={chartData} 
            className="lg:col-span-2 animate-slide-in"
          />
          <div className="space-y-6">
            <RecentTransactionsCard 
              transactions={transactions} 
              className="animate-slide-in [animation-delay:100ms]"
            />
            <InventorySummaryCard 
              items={inventoryItems} 
              className="animate-slide-in [animation-delay:200ms]"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
