
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

const Expenses: React.FC = () => {
  return (
    <Layout>
      <PageTitle 
        title="Expenses Management" 
        description="Track and categorize all your business expenses"
        icon={<Wallet className="h-6 w-6" />}
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expenses Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center max-w-md">
                This module is under development. Soon you'll be able to track and categorize expenses,
                generate expense reports, and analyze spending patterns.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Expenses;
