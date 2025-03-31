
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import StatCard from '@/components/dashboard/StatCard';
import RecentTransactionsCard from '@/components/dashboard/RecentTransactionsCard';
import FinancialOverviewChart from '@/components/dashboard/FinancialOverviewChart';
import InventorySummaryCard from '@/components/dashboard/InventorySummaryCard';
import { Button } from '@/components/ui/button';
import { ArrowDownUp, DollarSign, ShoppingCart, Package, PlusCircle } from 'lucide-react';

// Empty initial data
const transactions = [];
const chartData = [
  { name: 'Jan', income: 0, expenses: 0 },
  { name: 'Feb', income: 0, expenses: 0 },
  { name: 'Mar', income: 0, expenses: 0 },
  { name: 'Apr', income: 0, expenses: 0 },
  { name: 'May', income: 0, expenses: 0 },
  { name: 'Jun', income: 0, expenses: 0 },
];

const inventoryItems = [];

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
            value="Rs. 0" 
            icon={DollarSign}
            className="animate-slide-in"
          />
          <StatCard 
            title="Total Expenses (MTD)" 
            value="Rs. 0" 
            icon={ArrowDownUp}
            className="animate-slide-in [animation-delay:100ms]"
          />
          <StatCard 
            title="Recent Orders" 
            value="0" 
            description="0 pending delivery"
            icon={ShoppingCart}
            className="animate-slide-in [animation-delay:200ms]"
          />
          <StatCard 
            title="Inventory Items" 
            value="0" 
            description="0 low stock alerts"
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
