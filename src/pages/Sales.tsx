
import React from 'react';
import Layout from '@/components/Layout';
import PageTitle from '@/components/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from 'lucide-react';

const Sales: React.FC = () => {
  return (
    <Layout>
      <PageTitle 
        title="Sales Management" 
        description="Track and manage all your sales transactions"
        icon={<Receipt className="h-6 w-6" />}
      />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground text-center max-w-md">
                This module is under development. Soon you'll be able to manage all your sales,
                create invoices, and track your revenue here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Sales;
